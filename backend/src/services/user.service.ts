import { UserRole } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { writeAuditLog } from '../utils/audit-log';

const createStaffUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    role: z.enum([UserRole.ADMIN, UserRole.ACCOUNTS]),
});

const updateSystemUserSchema = z.object({
    email: z.string().email(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    role: z.nativeEnum(UserRole),
});

const resetUserPasswordSchema = z.object({
    newPassword: z.string().min(8),
});

export const createStaffUser = async (input: unknown) => {
    const data = createStaffUserSchema.parse(input);

    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existingUser) {
        throw new AppError('A user with that email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
        },
    });

    writeAuditLog({
        action: 'staff_user.created',
        actor: {
            email: data.email,
            role: data.role,
        },
        targetType: 'user',
        targetId: user.id,
        details: {
            email: user.email,
            role: user.role,
        },
    });

    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
    };
};

export const listSystemUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            student: {
                select: {
                    id: true,
                    studentCode: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const updateSystemUser = async (userId: string, input: unknown) => {
    const data = updateSystemUserSchema.parse(input);

    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        throw new AppError('User not found', 404);
    }

    const emailOwner = await prisma.user.findFirst({
        where: {
            email: data.email,
            NOT: { id: userId },
        },
        select: { id: true },
    });

    if (emailOwner) {
        throw new AppError('A user with that email already exists', 409);
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            email: data.email,
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            role: data.role,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    writeAuditLog({
        action: 'user.updated',
        targetType: 'user',
        targetId: user.id,
        details: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    });

    return user;
};

export const resetUserPassword = async (userId: string, input: unknown) => {
    const data = resetUserPasswordSchema.parse(input);

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
        },
    });

    writeAuditLog({
        action: 'user.password_reset',
        targetType: 'user',
        targetId: user.id,
        details: {
            email: user.email,
            role: user.role,
        },
    });

    return {
        message: 'Password reset successfully',
    };
};

export const suspendUser = async (userId: string, reason: string) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { status: 'SUSPENDED' },
    });

    writeAuditLog({
        action: 'user.suspended',
        targetType: 'user',
        targetId: user.id,
        reason,
        details: { email: user.email },
    });

    return { message: 'User suspended successfully' };
};

export const deactivateUser = async (userId: string, reason: string) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { status: 'DEACTIVATED' },
    });

    writeAuditLog({
        action: 'user.deactivated',
        targetType: 'user',
        targetId: user.id,
        reason,
        details: { email: user.email },
    });

    return { message: 'User deactivated successfully' };
};

export const activateUser = async (userId: string, reason?: string) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { status: 'ACTIVE' },
    });

    writeAuditLog({
        action: 'user.activated',
        targetType: 'user',
        targetId: user.id,
        reason,
        details: { email: user.email },
    });

    return { message: 'User access restored successfully' };
};

export const deleteUser = async (userId: string, reason: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    await prisma.user.delete({
        where: { id: userId },
    });

    writeAuditLog({
        action: 'user.deleted',
        targetType: 'user',
        targetId: userId,
        reason,
        details: { email: user.email },
    });

    return { message: 'User removed from system' };
};
