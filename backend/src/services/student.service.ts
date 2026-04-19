import { PaymentStatus } from '../generated/prisma';

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { recalculateStudentBalance } from '../utils/balance';

/**
 * Fetch the applicable fee structure deadlines for a student.
 * Uses the same matching logic as balance.ts to find fee structures
 * that apply to this student, then filters to those with a dueDate set.
 */
export const getStudentDeadlines = async (studentId: string) => {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            payments: {
                where: { status: PaymentStatus.APPROVED },
            },
        },
    });

    if (!student) {
        throw new AppError('Student not found', 404);
    }

    const normalizedProgram = student.program?.trim() || null;
    const normalizedClassLevel = student.classLevel?.trim() || null;
    const normalizedAcademicYear = student.academicYear?.trim() || null;

    // Same matching logic as balance.ts
    const applicableFeeStructures = await prisma.feeStructure.findMany({
        where: {
            active: true,
            dueDate: { not: null }, // Only those with a deadline set
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
            ],
        },
        orderBy: { dueDate: 'asc' },
    });

    const totalPaid = student.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalFees = applicableFeeStructures.reduce((sum, f) => sum + Number(f.amount), 0);
    const isFullyPaid = totalPaid >= totalFees && totalFees > 0;

    return applicableFeeStructures.map((fee) => {
        const dueDate = fee.dueDate!;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const dueDateNorm = new Date(dueDate);
        dueDateNorm.setHours(0, 0, 0, 0);
        const diffMs = dueDateNorm.getTime() - now.getTime();
        const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        let status: 'upcoming' | 'due' | 'overdue' | 'paid' = 'upcoming';
        if (isFullyPaid) {
            status = 'paid';
        } else if (daysRemaining < 0) {
            status = 'overdue';
        } else if (daysRemaining === 0) {
            status = 'due';
        }

        return {
            id: fee.id,
            title: fee.title,
            description: fee.description || undefined,
            dueDate: dueDate.toISOString().split('T')[0],
            amount: Number(fee.amount),
            type: (fee.feeType || 'other') as 'tuition' | 'hostel' | 'exam' | 'library' | 'other',
            status,
            gracePeriodDays: 7, // Default grace period
        };
    });
};

export const getStudentDashboard = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            student: {
                include: {
                    payments: {
                        orderBy: {
                            submittedAt: 'desc',
                        },
                    },
                },
            },
        },
    });

    if (!user?.student) {
        throw new AppError('Student profile not found', 404);
    }

    // Recalculate balance to ensure it's up-to-date
    const updatedStudent = await recalculateStudentBalance(user.student.id);

    const approvedPayments = user.student.payments.filter(
        (payment) => payment.status === 'APPROVED'
    );
    const pendingPayments = user.student.payments.filter(
        (payment) => payment.status === 'PENDING'
    );
    const rejectedPayments = user.student.payments.filter(
        (payment) => payment.status === 'REJECTED'
    );
    const totalPaid = approvedPayments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
    );
    const installmentCount = approvedPayments.length;

    // Fetch real deadlines from fee structures
    const deadlines = await getStudentDeadlines(user.student.id);

    return {
        student: updatedStudent,
        summary: {
            totalPaid,
            currentBalance: Number(updatedStudent.currentBalance),
            installmentCount,
            pendingVerifications: pendingPayments.length,
            rejectedSubmissions: rejectedPayments.length,
        },
        payments: user.student.payments,
        deadlines,
    };
};
