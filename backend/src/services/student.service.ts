import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';

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

    return {
        student: user.student,
        summary: {
            totalPaid,
            currentBalance: Number(user.student.currentBalance),
            installmentCount,
            pendingVerifications: pendingPayments.length,
            rejectedSubmissions: rejectedPayments.length,
        },
        payments: user.student.payments,
    };
};
