import { PaymentStatus } from '../generated/prisma';

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';

export const recalculateStudentBalance = async (studentId: string) => {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            payments: {
                where: {
                    status: PaymentStatus.APPROVED,
                },
            },
        },
    });

    if (!student) {
        throw new AppError('Student not found', 404);
    }

    const normalizedProgram = student.program?.trim() || null;
    const normalizedClassLevel = student.classLevel?.trim() || null;
    const normalizedAcademicYear = student.academicYear?.trim() || null;
    const normalizedSchoolLevel = student.schoolLevel;

    console.log(`[Balance Calc] Student ${studentId}:`, {
        program: normalizedProgram,
        classLevel: normalizedClassLevel,
        academicYear: normalizedAcademicYear,
        schoolLevel: normalizedSchoolLevel,
    });

    const applicableFeeStructures = await prisma.feeStructure.findMany({
        where: {
            active: true,
            AND: [
                {
                    OR: [
                        { program: null },
                        { program: '' },
                        { program: normalizedProgram },
                    ],
                },
                {
                    OR: [
                        { classLevel: null },
                        { classLevel: '' },
                        { classLevel: normalizedClassLevel },
                    ],
                },
                {
                    OR: [
                        { academicYear: null },
                        { academicYear: '' },
                        { academicYear: normalizedAcademicYear },
                    ],
                },
                {
                    schoolLevel: normalizedSchoolLevel,
                },
            ],
        },
    });

    console.log(`[Balance Calc] Found ${applicableFeeStructures.length} fee structures for student ${studentId}:`,
        applicableFeeStructures.map(f => ({ id: f.id, title: f.title, amount: f.amount, program: f.program, classLevel: f.classLevel, academicYear: f.academicYear }))
    );

    const expectedTotal = applicableFeeStructures.reduce((sum, fee) => sum + Number(fee.amount), 0);
    const paidTotal = student.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

    console.log(`[Balance Calc] Student ${studentId}: expectedTotal=${expectedTotal}, paidTotal=${paidTotal}, newBalance=${expectedTotal - paidTotal}`);

    return prisma.student.update({
        where: { id: studentId },
        data: {
            currentBalance: expectedTotal - paidTotal,
        },
    });
};
