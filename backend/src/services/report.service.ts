import { PaymentStatus, PaymentMethod } from '../generated/prisma';

import { prisma } from '../lib/prisma';

export interface ReportFilters {
    startDate?: Date;
    endDate?: Date;
    status?: PaymentStatus;
    method?: PaymentMethod;
    academicYear?: string;
    term?: string;
    semester?: string;
    limit?: number;
    offset?: number;
}

export const getOverviewReport = async (filters?: ReportFilters) => {
    const limit = filters?.limit ?? 25;
    const offset = filters?.offset ?? 0;

    const whereConditions: any = {};
    if (filters?.status) whereConditions.status = filters.status;
    if (filters?.method) whereConditions.method = filters.method;
    if (filters?.startDate || filters?.endDate) {
        whereConditions.submittedAt = {};
        if (filters.startDate) whereConditions.submittedAt.gte = filters.startDate;
        if (filters.endDate) whereConditions.submittedAt.lte = filters.endDate;
    }
    if (filters?.academicYear) whereConditions.academicYear = filters.academicYear;
    if (filters?.term) whereConditions.term = filters.term;
    if (filters?.semester) whereConditions.semester = filters.semester;


    const [
        studentsCount,
        pendingPayments,
        approvedPaymentsCount,
        rejectedPayments,
        totalApproved,
        totalPayments,
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
            prisma.payment.count({ where: whereConditions }),
        ]);

    const recentPayments = await prisma.payment.findMany({
        include: {
            student: true,
        },
        where: whereConditions,
        orderBy: {
            submittedAt: 'desc',
        },
        take: limit,
        skip: offset,
    });

    const approvedPaymentRecords = await prisma.payment.findMany({
        where: {
            status: PaymentStatus.APPROVED,
            ...(filters?.startDate || filters?.endDate ? {
                submittedAt: {
                    ...(filters.startDate && { gte: filters.startDate }),
                    ...(filters.endDate && { lte: filters.endDate }),
                }
            } : {})
        },
        select: {
            id: true,
            amount: true,
            method: true,
            paymentDate: true,
            studentId: true,
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

    // Calculate actual installment vs full payment percentages
    const studentPaymentCounts = approvedPaymentRecords.reduce<Record<string, number>>(
        (acc, payment) => {
            acc[payment.studentId] = (acc[payment.studentId] ?? 0) + 1;
            return acc;
        },
        {}
    );

    let installmentTotal = 0;
    let fullPaymentTotal = 0;
    approvedPaymentRecords.forEach((payment) => {
        const paymentCount = studentPaymentCounts[payment.studentId];
        if (paymentCount > 1) {
            installmentTotal += Number(payment.amount);
        } else {
            fullPaymentTotal += Number(payment.amount);
        }
    });

    const totalApprovedAmount = fullPaymentTotal + installmentTotal;
    const fullPaymentPercentage = totalApprovedAmount > 0 ? (fullPaymentTotal / totalApprovedAmount) * 100 : 50;
    const installmentPercentage = totalApprovedAmount > 0 ? (installmentTotal / totalApprovedAmount) * 100 : 50;

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
        installmentMetrics: {
            fullPaymentPercentage: Math.round(fullPaymentPercentage * 10) / 10,
            installmentPercentage: Math.round(installmentPercentage * 10) / 10,
        },
        recentPayments,
        pagination: {
            total: totalPayments,
            limit,
            offset,
        },
    };
};

export const saveReportToHistory = async (userId: string, input: { title: string, reportType: string, filters: any }) => {
    // 1. Get the current data snapshot for those filters
    const reportData = await getOverviewReport(input.filters);

    // 2. Save it as a point-in-time record
    return prisma.generatedReport.create({
        data: {
            title: input.title,
            reportType: input.reportType,
            filters: input.filters,
            data: reportData as any,
            generatedBy: userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    });
};

export const listReportHistory = async () => {
    return prisma.generatedReport.findMany({
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        }
    });
};

export const getReportById = async (id: string) => {
    return prisma.generatedReport.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            }
        }
    });
};
