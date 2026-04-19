import { UserRole } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import path from 'path';

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { createToken } from '../utils/auth';
import {
    assertLoginAllowed,
    clearLoginAttempts,
    recordFailedLoginAttempt,
} from '../utils/login-attempts';
import { writeAuditLog, readAuditLogs } from '../utils/audit-log';
import { recalculateStudentBalance } from '../utils/balance';

// [SECTION: MEMORY STORAGE] - For temporary reset codes (when SMTP is not configured)
const resetCodes = new Map<string, { code: string; expires: number }>();

/**
 * Retrieve the current authenticated user's profile from their JWT payload.
 * Used by GET /auth/me for session restoration on page reload.
 */
export const getCurrentUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { student: true },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (user.status !== 'ACTIVE') {
        throw new AppError('Account is not active', 403);
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
            profilePictureUrl: normalizeProfilePictureUrl(user.profilePictureUrl),
            student: user.student,
        },
    };
};

// Normalize profilePictureUrl to valid URL format
function normalizeProfilePictureUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    // If it's already in URL format, return as-is
    if (url.startsWith('/uploads/')) {
        return url;
    }

    // If it's a filesystem path, extract the filename and convert to URL
    if (url.includes('/') || url.includes('\\')) {
        const filename = path.basename(url);
        return `/uploads/${filename}`;
    }

    // If it's just a filename, prepend /uploads/
    return `/uploads/${url}`;
}

const registerStudentSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    studentCode: z.string().min(3),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    schoolLevel: z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY']).optional(),
    program: z.string().min(2).optional(),
    classLevel: z.string().min(1).optional(),
    academicYear: z.string().min(1).optional(),
    phone: z.string().min(5).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
});

export const registerStudent = async (input: unknown, ipAddress?: string) => {
    const data = registerStudentSchema.parse(input);

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email: data.email }, { student: { studentCode: data.studentCode } }],
        },
    });

    if (existingUser) {
        throw new AppError('A user with that email or student code already exists', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            role: UserRole.STUDENT,
            student: {
                create: {
                    studentCode: data.studentCode,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    schoolLevel: data.schoolLevel || 'TERTIARY',
                    program: data.program || 'N/A',
                    classLevel: data.classLevel,
                    academicYear: data.academicYear,
                    phone: data.phone,
                },
            },
        },
        include: {
            student: true,
        },
    });

    const updatedStudent = await recalculateStudentBalance(user.student!.id);
    user.student = updatedStudent;

    writeAuditLog({
        action: 'student.registered',
        actor: {
            userId: user.id,
            email: user.email,
            role: user.role,
            ipAddress,
        },
        targetType: 'student',
        targetId: user.student?.id,
        details: {
            studentCode: user.student?.studentCode,
            program: user.student?.program,
        },
    });

    return {
        token: createToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            studentId: user.student?.id,
        }),
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profilePictureUrl: normalizeProfilePictureUrl(user.profilePictureUrl),
            student: user.student,
        },
    };
};

export const loginUser = async (input: unknown, ipAddress?: string) => {
    const data = loginSchema.parse(input);

    assertLoginAllowed(data.email, ipAddress);

    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
        include: {
            student: true,
        },
    });

    if (!user) {
        recordFailedLoginAttempt(data.email, ipAddress);
        writeAuditLog({
            action: 'auth.login_failed',
            status: 'FAILED',
            reason: 'user_not_found',
            actor: {
                email: data.email,
                ipAddress,
            },
            details: {
                attempt_reason: 'User email not found in system',
            },
        });
        throw new AppError('Invalid email or password', 401);
    }

    const validPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!validPassword) {
        recordFailedLoginAttempt(data.email, ipAddress);
        writeAuditLog({
            action: 'auth.login_failed',
            status: 'FAILED',
            reason: 'invalid_credentials',
            actor: {
                userId: user.id,
                email: user.email,
                role: user.role,
                ipAddress,
            },
            details: {
                attempt_reason: 'Incorrect password provided',
            },
        });
        throw new AppError('Invalid email or password', 401);
    }

    // --- NEW CHECKS ---
    // 1. Check account status
    if (user.status !== 'ACTIVE') {
        const statusReason = user.status === 'SUSPENDED' ? 'Account Suspended' : 'Account Deactivated';
        writeAuditLog({
            action: 'auth.login_blocked',
            status: 'FAILED',
            reason: 'account_inactive',
            actor: { userId: user.id, email: user.email, role: user.role, ipAddress },
            details: { current_status: user.status }
        });
        throw new AppError(`Access Denied: ${statusReason}. Please contact administration.`, 403);
    }

    // 2. High-Integrity Session Check (DB Level)
    const now = new Date();
    if (user.currentSessionId && user.sessionExpires && user.sessionExpires > now) {
         writeAuditLog({
            action: 'auth.active_session_conflict',
            status: 'FAILED',
            reason: 'duplicate_session',
            actor: { userId: user.id, email: user.email, role: user.role, ipAddress },
            details: { conflict_detected_at: now.toISOString() }
        });
        throw new AppError('ACTIVE_SESSION_EXISTS', 409);
    }

    // ------------------

    const newSessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const sessionExpires = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12h expiry

    await prisma.user.update({
        where: { id: user.id },
        data: { 
            currentSessionId: newSessionId,
            sessionExpires,
            lastLoginAt: now,
        }
    });

    clearLoginAttempts(data.email, ipAddress);
    writeAuditLog({
        action: 'session.start',
        status: 'SUCCESS',
        actor: {
            userId: user.id,
            email: user.email,
            role: user.role,
            ipAddress,
        },
        details: {
            login_timestamp: new Date().toISOString(),
        },
    });

    return {
        token: createToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            studentId: user.student?.id,
        }),
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profilePictureUrl: normalizeProfilePictureUrl(user.profilePictureUrl),
            student: user.student,
        },
    };
};

export const logoutUser = async (userId: string, email: string, role: string, ipAddress?: string) => {
    // Find the last session.start for this user to calculate duration
    const logs = readAuditLogs(200);
    const lastStart = logs.find(l => l.action === 'session.start' && l.actor?.userId === userId);
    
    let duration = 'Unknown';
    if (lastStart) {
        const start = new Date(lastStart.timestamp);
        const end = new Date();
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        
        if (diffHrs > 0) {
            duration = `${diffHrs}h ${diffMins % 60}m`;
        } else {
            duration = `${diffMins}m ${Math.floor((diffMs % 60000) / 1000)}s`;
        }
    }

    await prisma.user.update({
        where: { id: userId },
        data: { currentSessionId: null, sessionExpires: null }
    });

    writeAuditLog({
        action: 'session.end',
        status: 'SUCCESS',
        actor: {
            userId,
            email,
            role,
            ipAddress,
        },
        details: {
            logout_timestamp: new Date().toISOString(),
            duration,
            session_start: lastStart?.timestamp,
        },
    });

    return { message: 'Session ended successfully' };
};

export const terminateActiveSession = async (input: unknown, ipAddress?: string) => {
    const data = loginSchema.parse(input);
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) throw new AppError('Invalid credentials', 401);
    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new AppError('Invalid credentials', 401);

    await prisma.user.update({
        where: { id: user.id },
        data: { currentSessionId: null, sessionExpires: null }
    });

    writeAuditLog({
        action: 'session.end',
        status: 'SUCCESS',
        actor: {
            userId: user.id,
            email: user.email,
            role: user.role,
            ipAddress,
        },
        details: {
            note: 'Session terminated remotely via Conflict Gateway',
            terminated_at: new Date().toISOString()
        }
    });

    return { message: 'Active session terminated. You may now log in.' };
};

export const forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        // Always return success to prevent email enumeration
        return { message: 'If that email exists, a reset code has been generated.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes.set(email, {
        code,
        expires: Date.now() + 10 * 60 * 1000, // 10 mins
    });

    // Log the code to the audit log so the user can "receive" it in this environment
    writeAuditLog({
        action: 'auth.reset_code_generated',
        targetType: 'user',
        targetId: user.id,
        details: {
            email,
            code,
            note: 'SECURITY ALERT: Reset code logged for environment without SMTP'
        }
    });

    console.log(`[PASS_RESET] Code for ${email}: ${code}`);

    return { message: 'Reset code generated. Check audit logs or console.' };
};

export const resetPassword = async (input: any) => {
    const { email, code, newPassword } = input;
    const stored = resetCodes.get(email);

    if (!stored || stored.code !== code || Date.now() > stored.expires) {
        throw new AppError('Invalid or expired reset code', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { email },
        data: { passwordHash },
    });

    resetCodes.delete(email);

    writeAuditLog({
        action: 'auth.password_reset_completed',
        details: { email }
    });

    return { message: 'Password has been reset successfully.' };
};

export const changePassword = async (
    userId: string,
    input: unknown,
    ipAddress?: string
) => {
    const data = changePasswordSchema.parse(input);

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const validPassword = await bcrypt.compare(data.currentPassword, user.passwordHash);

    if (!validPassword) {
        writeAuditLog({
            action: 'auth.password_change_failed',
            actor: {
                userId: user.id,
                email: user.email,
                role: user.role,
                ipAddress,
            },
            details: {
                reason: 'invalid_current_password',
            },
        });
        throw new AppError('Current password is incorrect', 401);
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
        },
    });

    writeAuditLog({
        action: 'auth.password_changed',
        actor: {
            userId: user.id,
            email: user.email,
            role: user.role,
            ipAddress,
        },
        targetType: 'user',
        targetId: user.id,
    });

    return {
        message: 'Password changed successfully',
    };
};

export const updateProfilePicture = async (userId: string, file?: Express.Multer.File | null) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Convert file path to URL format: /uploads/filename
    const profilePictureUrl = file ? `/uploads/${file.filename}` : null;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            profilePictureUrl,
        },
        include: {
            student: true,
        },
    });

    writeAuditLog({
        action: profilePictureUrl ? 'user.profile_picture_updated' : 'user.profile_picture_deleted',
        actor: {
            userId: user.id,
            email: user.email,
            role: user.role,
        },
        targetType: 'user',
        targetId: user.id,
    });

    return {
        message: profilePictureUrl ? 'Profile picture updated successfully' : 'Profile picture deleted successfully',
        user: {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePictureUrl: normalizeProfilePictureUrl(updatedUser.profilePictureUrl),
            student: updatedUser.student,
        },
    };
};
