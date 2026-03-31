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

    const applicableFeeStructures = await prisma.feeStructure.findMany({
        where: {
            active: true,
            AND: [
                {
                    OR: [{ program: null }, { program: student.program }],
                },
                {
                    OR: [{ classLevel: null }, { classLevel: student.classLevel }],
                },
                {
                    OR: [{ academicYear: null }, { academicYear: student.academicYear }],
                },
            ],
        },
    });

    const expectedTotal = applicableFeeStructures.reduce((sum, fee) => sum + Number(fee.amount), 0);
    const paidTotal = student.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

    return prisma.student.update({
        where: { id: studentId },
        data: {
            currentBalance: expectedTotal - paidTotal,
        },
    });
};
