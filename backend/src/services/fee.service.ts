import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { writeAuditLog } from '../utils/audit-log';
import { recalculateStudentBalance } from '../utils/balance';
import { createBulkNotifications } from './notification.service';

const feeStructureSchema = z.object({
    title: z.string().min(3),
    description: z.string().max(500).optional(),
    amount: z.coerce.number().positive(),
    program: z.string().min(2).optional(),
    classLevel: z.string().min(1).optional(),
    term: z.string().min(1).optional(),
    semester: z.string().min(1).optional(),
    academicYear: z.string().min(1).optional(),
    dueDate: z.coerce.date().optional().nullable(),
    feeType: z.enum(['tuition', 'hostel', 'exam', 'library', 'other']).optional().nullable(),
    schoolLevel: z.enum(['PRIMARY', 'SECONDARY', 'TERTIARY']).optional(),
    active: z.boolean().default(true),
});

const feeStructureUpdateSchema = feeStructureSchema.partial();

export const createFeeStructure = async (input: unknown) => {
    const data = feeStructureSchema.parse(input);

    // DEACTIVATE older fee structures that match this criteria
    // Only deactivate if at least one criterion is specified
    if (data.program || data.academicYear || data.classLevel || data.schoolLevel) {
        const deactivateWhere: any = { active: true };
        if (data.program !== undefined) deactivateWhere.program = data.program;
        if (data.academicYear !== undefined) deactivateWhere.academicYear = data.academicYear;
        if (data.classLevel !== undefined) deactivateWhere.classLevel = data.classLevel;
        if (data.schoolLevel !== undefined) deactivateWhere.schoolLevel = data.schoolLevel;

        console.log('[FeeService] Deactivating fee structures with criteria:', deactivateWhere);

        await prisma.feeStructure.updateMany({
            where: deactivateWhere,
            data: { active: false },
        });
    }

    const feeStructure = await prisma.feeStructure.create({ data });
    console.log('[FeeService] Created fee structure:', { id: feeStructure.id, title: feeStructure.title, program: feeStructure.program, classLevel: feeStructure.classLevel, academicYear: feeStructure.academicYear });

    // Recalculate balances for ALL students since deactivation may have affected anyone
    const allStudents = await prisma.student.findMany({
        select: { id: true, userId: true, program: true, classLevel: true, academicYear: true, schoolLevel: true },
    });

    console.log(`[FeeService] Recalculating balances for ${allStudents.length} students`);

    await Promise.all(
        allStudents.map(async (student) => recalculateStudentBalance(student.id))
    );

    // Notify students who match this fee structure's criteria
    const matchingStudents = allStudents.filter(s => {
        const schoolLevelMatch = !data.schoolLevel || s.schoolLevel === data.schoolLevel;
        const programMatch = !data.program || s.program === data.program;
        const classLevelMatch = !data.classLevel || s.classLevel === data.classLevel;
        const academicYearMatch = !data.academicYear || s.academicYear === data.academicYear;
        return schoolLevelMatch && programMatch && classLevelMatch && academicYearMatch;
    });

    if (matchingStudents.length > 0) {
        await createBulkNotifications(
            matchingStudents.map((s) => ({
                userId: s.userId,
                title: 'New Fee Structure Assigned',
                message: `A new fee structure "${feeStructure.title}" (MK ${Number(feeStructure.amount).toLocaleString()}) has been assigned to your program.`,
                type: 'FEE_ASSIGNED',
            }))
        );
    }

    writeAuditLog({
        action: 'fee_structure.created',
        targetType: 'fee_structure',
        targetId: feeStructure.id,
        details: {
            title: feeStructure.title,
            amount: Number(feeStructure.amount),
            schoolLevel: feeStructure.schoolLevel,
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
