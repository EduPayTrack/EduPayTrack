import { PaymentStatus } from '@prisma/client';

import { prisma } from '../lib/prisma';

export const getOverviewReport = async () => {
    const [
        studentsCount,
        pendingPayments,
        approvedPaymentsCount,
        rejectedPayments,
        totalApproved,
    ] =
        await Promise.all([
            prisma.student.count(),
            prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
            prisma.payment.count({ where: { status: PaymentStatus.APPROVED } }),
            prisma.payment.count({ where: { status: PaymentStatus.REJECTED } }),
            prisma.payment.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    status: PaymentStatus.APPROVED,
                },
            }),
        ]);

    const recentPayments = await prisma.payment.findMany({
        include: {
            student: true,
        },
        orderBy: {
            submittedAt: 'desc',
        },
        take: 10,
    });

    const approvedPaymentRecords = await prisma.payment.findMany({
        where: {
            status: PaymentStatus.APPROVED,
        },
        select: {
            amount: true,
            method: true,
            paymentDate: true,
        },
        orderBy: {
            paymentDate: 'asc',
        },
    });

    const paymentMethodBreakdown = approvedPaymentRecords.reduce<Record<string, number>>(
        (accumulator, payment) => {
            const method = payment.method;
            accumulator[method] = (accumulator[method] ?? 0) + Number(payment.amount);
            return accumulator;
        },
        {}
    );

    const monthlyCollections = approvedPaymentRecords.reduce<Record<string, number>>(
        (accumulator, payment) => {
            const date = new Date(payment.paymentDate);
            const monthKey = `${date.getUTCFullYear()}-${`${date.getUTCMonth() + 1}`.padStart(2, '0')}`;
            accumulator[monthKey] = (accumulator[monthKey] ?? 0) + Number(payment.amount);
            return accumulator;
        },
        {}
    );

    return {
        summary: {
            studentsCount,
            pendingPayments,
            approvedPayments: approvedPaymentsCount,
            rejectedPayments,
            totalApprovedAmount: totalApproved._sum.amount ?? 0,
        },
        paymentMethodBreakdown,
        monthlyCollections,
        recentPayments,
    };
};
