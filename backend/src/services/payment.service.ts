import { PaymentMethod, PaymentStatus, VerificationStatus } from '../generated/prisma';
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

const verifyPaymentSchema = z.object({
    verificationStatus: z.enum([VerificationStatus.VERIFIED, VerificationStatus.FLAGGED]),
    verificationNotes: z.string().max(500),
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
            academicYear: user.student.academicYear,
            term: user.student.term,
            semester: user.student.semester,
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

export const getPaymentDetailsById = async (paymentId: string) => {
    return prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            student: true,
            verifier: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                }
            },
            reviewer: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                }
            }
        }
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
            verifier: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
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

export const verifyPayment = async (
    paymentId: string,
    verifierId: string,
    input: unknown
) => {
    const data = verifyPaymentSchema.parse(input);

    const existingPayment = await prisma.payment.findUnique({
        where: { id: paymentId },
    });

    if (!existingPayment) {
        throw new AppError('Payment not found', 404);
    }

    if (existingPayment.status !== PaymentStatus.PENDING) {
        throw new AppError('Only pending payments can be verified', 409);
    }

    const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
            verificationStatus: data.verificationStatus,
            verificationNotes: data.verificationNotes,
            verifiedAt: new Date(),
            verifiedBy: verifierId,
        },
        include: {
            student: true,
            verifier: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    writeAuditLog({
        action: `payment.${data.verificationStatus.toLowerCase()}`,
        actor: {
            userId: verifierId,
            role: 'ACCOUNTS',
        },
        targetType: 'payment',
        targetId: payment.id,
        details: {
            studentId: payment.studentId,
            verificationStatus: payment.verificationStatus,
            verificationNotes: payment.verificationNotes,
        },
    });

    return payment;
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

    // ENFORCE 2-STEP WORKFLOW: Payment must be VERIFIED before ADMIN can approve
    if (existingPayment.verificationStatus === VerificationStatus.UNVERIFIED) {
        throw new AppError('Payment must be verified by ACCOUNTS before approval', 412);
    }

    if (existingPayment.verificationStatus === VerificationStatus.FLAGGED && data.status === PaymentStatus.APPROVED) {
        throw new AppError('Cannot approve payments flagged as suspicious. Review ACCOUNTS verification notes.', 400);
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
            verifier: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            },
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
            role: 'ADMIN',
        },
        targetType: 'payment',
        targetId: payment.id,
        details: {
            studentId: payment.studentId,
            status: payment.status,
            verificationStatus: payment.verificationStatus,
            reviewNotes: payment.reviewNotes,
        },
    });

    return payment;
};

