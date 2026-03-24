import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { createToken } from '../utils/auth';
import {
    assertLoginAllowed,
    clearLoginAttempts,
    recordFailedLoginAttempt,
} from '../utils/login-attempts';
import { writeAuditLog } from '../utils/audit-log';
import { recalculateStudentBalance } from '../utils/balance';

const registerStudentSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    studentCode: z.string().min(3),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    program: z.string().min(2),
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
            role: UserRole.STUDENT,
            student: {
                create: {
                    studentCode: data.studentCode,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    program: data.program,
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

    await recalculateStudentBalance(user.student!.id);

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
            role: user.role,
            studentId: user.student?.id,
        }),
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
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
            actor: {
                email: data.email,
                ipAddress,
            },
            details: {
                reason: 'user_not_found',
            },
        });
        throw new AppError('Invalid email or password', 401);
    }

    const validPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!validPassword) {
        recordFailedLoginAttempt(data.email, ipAddress);
        writeAuditLog({
            action: 'auth.login_failed',
            actor: {
                userId: user.id,
                email: user.email,
                role: user.role,
                ipAddress,
            },
            details: {
                reason: 'invalid_password',
            },
        });
        throw new AppError('Invalid email or password', 401);
    }

    clearLoginAttempts(data.email, ipAddress);
    writeAuditLog({
        action: 'auth.login_succeeded',
        actor: {
            userId: user.id,
            email: user.email,
            role: user.role,
            ipAddress,
        },
    });

    return {
        token: createToken({
            userId: user.id,
            role: user.role,
            studentId: user.student?.id,
        }),
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            student: user.student,
        },
    };
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
