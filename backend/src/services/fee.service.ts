import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { writeAuditLog } from '../utils/audit-log';
import { recalculateStudentBalance } from '../utils/balance';

const feeStructureSchema = z.object({
    title: z.string().min(3),
    description: z.string().max(500).optional(),
    amount: z.coerce.number().positive(),
    program: z.string().min(2).optional(),
    classLevel: z.string().min(1).optional(),
    term: z.string().min(1).optional(),
    semester: z.string().min(1).optional(),
    academicYear: z.string().min(1).optional(),
    active: z.boolean().default(true),
});

const feeStructureUpdateSchema = feeStructureSchema.partial();

export const createFeeStructure = async (input: unknown) => {
    const data = feeStructureSchema.parse(input);
    const feeStructure = await prisma.feeStructure.create({ data });

    const affectedStudents = await prisma.student.findMany({
        where: {
            AND: [
                data.program ? { program: data.program } : {},
                data.classLevel ? { classLevel: data.classLevel } : {},
                data.academicYear ? { academicYear: data.academicYear } : {},
            ],
        },
        select: {
            id: true,
        },
    });

    await Promise.all(
        affectedStudents.map(async (student) => recalculateStudentBalance(student.id))
    );

    writeAuditLog({
        action: 'fee_structure.created',
        targetType: 'fee_structure',
        targetId: feeStructure.id,
        details: {
            title: feeStructure.title,
            amount: Number(feeStructure.amount),
            program: feeStructure.program,
            classLevel: feeStructure.classLevel,
            academicYear: feeStructure.academicYear,
            active: feeStructure.active,
        },
    });

    return feeStructure;
};

export const listFeeStructures = async () => {
    return prisma.feeStructure.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const updateFeeStructure = async (feeStructureId: string, input: unknown) => {
    const data = feeStructureUpdateSchema.parse(input);

    const existingFeeStructure = await prisma.feeStructure.findUnique({
        where: { id: feeStructureId },
    });

    if (!existingFeeStructure) {
        throw new AppError('Fee structure not found', 404);
    }

    const feeStructure = await prisma.feeStructure.update({
        where: { id: feeStructureId },
        data,
    });

    const students = await prisma.student.findMany({
        select: {
            id: true,
        },
    });

    await Promise.all(students.map(async (student) => recalculateStudentBalance(student.id)));

    writeAuditLog({
        action: 'fee_structure.updated',
        targetType: 'fee_structure',
        targetId: feeStructure.id,
        details: {
            ...data,
            amount: feeStructure.amount ? Number(feeStructure.amount) : undefined,
            active: feeStructure.active,
        },
    });

    return feeStructure;
};

export const listStudentsWithBalances = async () => {
    return prisma.student.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
            payments: {
                orderBy: {
                    submittedAt: 'desc',
                },
                take: 5,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const deleteFeeStructure = async (feeStructureId: string) => {
    const feeStructure = await prisma.feeStructure.findUnique({
        where: { id: feeStructureId },
    });

    if (!feeStructure) {
        throw new AppError('Fee structure not found', 404);
    }

    await prisma.feeStructure.delete({
        where: { id: feeStructureId },
    });

    // Recalculate all balances since a structure was removed
    const students = await prisma.student.findMany({
        select: { id: true },
    });

    await Promise.all(students.map(async (student) => recalculateStudentBalance(student.id)));

    writeAuditLog({
        action: 'fee_structure.deleted',
        targetType: 'fee_structure',
        targetId: feeStructureId,
        details: {
            title: feeStructure.title,
            amount: Number(feeStructure.amount),
        },
    });

    return { id: feeStructureId };
};
