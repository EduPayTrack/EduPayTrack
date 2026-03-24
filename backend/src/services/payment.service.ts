import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { writeAuditLog } from '../utils/audit-log';
import { recalculateStudentBalance } from '../utils/balance';

const submitPaymentSchema = z.object({
    amount: z.coerce.number().positive(),
    currency: z.string().default('MWK'),
    method: z.nativeEnum(PaymentMethod),
    externalReference: z.string().min(1).optional().or(z.literal('')),
    receiptNumber: z.string().min(1).optional().or(z.literal('')),
    paymentDate: z.coerce.date(),
    proofUrl: z.string().url(),
    payerName: z.string().min(2).optional().or(z.literal('')),
    notes: z.string().max(500).optional().or(z.literal('')),
    ocrText: z.string().optional().or(z.literal('')),
    ocrAmount: z.coerce.number().positive().optional(),
    ocrReference: z.string().optional().or(z.literal('')),
});

const reviewPaymentSchema = z.object({
    status: z.enum([PaymentStatus.APPROVED, PaymentStatus.REJECTED]),
    reviewNotes: z.string().max(500).optional(),
});

export const submitPayment = async (userId: string, input: unknown) => {
    const data = submitPaymentSchema.parse(input);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { student: true },
    });

    if (!user?.student) {
        throw new AppError('Student profile not found', 404);
    }

    const duplicateFilters = [];

    if (data.externalReference) {
        duplicateFilters.push({ externalReference: data.externalReference });
    }

    if (data.receiptNumber) {
        duplicateFilters.push({
            receiptNumber: data.receiptNumber,
            amount: data.amount,
        });
    }

    const duplicatePayment =
        duplicateFilters.length > 0
            ? await prisma.payment.findFirst({
                  where: {
                      studentId: user.student.id,
                      OR: duplicateFilters,
                  },
              })
            : null;

    const payment = await prisma.payment.create({
        data: {
            studentId: user.student.id,
            amount: data.amount,
            currency: data.currency,
            method: data.method,
            externalReference: data.externalReference,
            receiptNumber: data.receiptNumber,
            paymentDate: data.paymentDate,
            proofUrl: data.proofUrl,
            payerName: data.payerName,
            notes: data.notes,
            ocrText: data.ocrText,
            ocrAmount: data.ocrAmount,
            ocrReference: data.ocrReference,
            duplicateFlag: Boolean(duplicatePayment),
        },
        include: {
            student: true,
        },
    });

    writeAuditLog({
        action: 'payment.submitted',
        actor: {
            userId,
            role: 'STUDENT',
        },
        targetType: 'payment',
        targetId: payment.id,
        details: {
            studentId: payment.studentId,
            amount: Number(payment.amount),
            method: payment.method,
            duplicateFlag: payment.duplicateFlag,
        },
    });

    return payment;
};

export const listStudentPayments = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { student: true },
    });

    if (!user?.student) {
        throw new AppError('Student profile not found', 404);
    }

    return prisma.payment.findMany({
        where: {
            studentId: user.student.id,
        },
        orderBy: {
            submittedAt: 'desc',
        },
    });
};

export const listPaymentsForReview = async (status?: string) => {
    const selectedStatus = Object.values(PaymentStatus).includes(status as PaymentStatus)
        ? (status as PaymentStatus)
        : undefined;

    return prisma.payment.findMany({
        where: {
            status: selectedStatus,
        },
        include: {
            student: true,
            reviewer: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
        },
        orderBy: {
            submittedAt: 'desc',
        },
    });
};

export const reviewPayment = async (
    paymentId: string,
    reviewerId: string,
    input: unknown
) => {
    const data = reviewPaymentSchema.parse(input);

    const existingPayment = await prisma.payment.findUnique({
        where: { id: paymentId },
    });

    if (!existingPayment) {
        throw new AppError('Payment not found', 404);
    }

    if (existingPayment.status !== PaymentStatus.PENDING) {
        throw new AppError('Only pending payments can be reviewed', 409);
    }

    const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
            status: data.status,
            reviewNotes: data.reviewNotes,
            reviewedAt: new Date(),
            reviewerId,
        },
        include: {
            student: true,
            reviewer: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    await recalculateStudentBalance(existingPayment.studentId);

    writeAuditLog({
        action: `payment.${data.status.toLowerCase()}`,
        actor: {
            userId: reviewerId,
        },
        targetType: 'payment',
        targetId: payment.id,
        details: {
            studentId: payment.studentId,
            status: payment.status,
            reviewNotes: payment.reviewNotes,
        },
    });

    return payment;
};

const verificationNotesSchema = z.object({
    reviewNotes: z.string().max(500),
});

export const addVerificationNotes = async (
    paymentId: string,
    reviewerId: string,
    input: unknown
) => {
    const data = verificationNotesSchema.parse(input);

    const existingPayment = await prisma.payment.findUnique({
        where: { id: paymentId },
    });

    if (!existingPayment) {
        throw new AppError('Payment not found', 404);
    }

    if (existingPayment.status !== PaymentStatus.PENDING) {
        throw new AppError('Only pending payments can receive verification notes', 409);
    }

    const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
            reviewNotes: data.reviewNotes,
        },
        include: {
            student: true,
            reviewer: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    writeAuditLog({
        action: 'payment.verified_by_accounts',
        actor: {
            userId: reviewerId,
        },
        targetType: 'payment',
        targetId: payment.id,
        details: {
            studentId: payment.studentId,
            status: payment.status,
            reviewNotes: payment.reviewNotes,
        },
    });

    return payment;
};
