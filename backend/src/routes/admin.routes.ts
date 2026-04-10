import { PaymentStatus, ReconciliationStatus, UserRole } from '../generated/prisma';
import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth';
import {
    createFeeStructure,
    listFeeStructures,
    listStudentsWithBalances,
    updateFeeStructure,
    deleteFeeStructure,
} from '../services/fee.service';
import { listPaymentsForReview, reviewPayment, verifyPayment, getPaymentDetailsById, reconcilePayment } from '../services/payment.service';
import { createStaffUser, listSystemUsers, resetUserPassword, suspendUser, deactivateUser, deleteUser, activateUser, updateSystemUser } from '../services/user.service';
import { getRegistry, updateRegistry } from '../services/registry.service';
import { readAuditLogs, deleteAuditLogs } from '../utils/audit-log';
import {
    generateStudentClearanceLetterPdf,
    generateStudentStatementPdf,
    getStudentDocumentFilename,
    getStudentDocumentPayloadByStudentId,
} from '../services/document.service';
import { uploadStatement } from '../middleware/upload';
import {
    assistApproveStatementImportRow,
    createStatementImport,
    getStatementImportById,
    listReconciliationExceptions,
    listStatementImports,
    markStatementImportRowResolved,
    updateStatementImportMapping,
} from '../services/reconciliation.service';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(UserRole.ADMIN, UserRole.ACCOUNTS));

// Dashboard statistics — live aggregated data
adminRouter.get(
    '/dashboard-stats',
    asyncHandler(async (_req, res) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [
            studentCount,
            pendingCount,
            approvedTodayCount,
            monthlyRevenue,
            previousMonthRevenue,
            totalRevenue,
            matchedCount,
            unmatchedCount,
            matchedAmount,
            unmatchedAmount,
            overThreeDaysCount,
            overSevenDaysCount,
            recentReconciliations,
            oldestUnmatched,
        ] = await Promise.all([
            prisma.student.count(),
            prisma.payment.count({ where: { status: 'PENDING' } }),
            prisma.payment.count({ where: { status: 'APPROVED', reviewedAt: { gte: startOfDay } } }),
            prisma.payment.aggregate({
                where: { status: 'APPROVED', reviewedAt: { gte: startOfMonth } },
                _sum: { amount: true },
            }),
            prisma.payment.aggregate({
                where: {
                    status: 'APPROVED',
                    reviewedAt: {
                        gte: startOfPreviousMonth,
                        lte: endOfPreviousMonth,
                    },
                },
                _sum: { amount: true },
            }),
            prisma.payment.aggregate({
                where: { status: 'APPROVED' },
                _sum: { amount: true },
            }),
            prisma.payment.count({
                where: {
                    reconciliationStatus: ReconciliationStatus.MATCHED,
                    status: PaymentStatus.PENDING,
                },
            }),
            prisma.payment.count({
                where: {
                    reconciliationStatus: ReconciliationStatus.UNMATCHED,
                    status: PaymentStatus.PENDING,
                },
            }),
            prisma.payment.aggregate({
                where: {
                    reconciliationStatus: ReconciliationStatus.MATCHED,
                    status: PaymentStatus.PENDING,
                },
                _sum: { amount: true },
            }),
            prisma.payment.aggregate({
                where: {
                    reconciliationStatus: ReconciliationStatus.UNMATCHED,
                    status: PaymentStatus.PENDING,
                },
                _sum: { amount: true },
            }),
            prisma.payment.count({
                where: {
                    reconciliationStatus: ReconciliationStatus.UNMATCHED,
                    status: PaymentStatus.PENDING,
                    submittedAt: { lte: threeDaysAgo },
                },
            }),
            prisma.payment.count({
                where: {
                    reconciliationStatus: ReconciliationStatus.UNMATCHED,
                    status: PaymentStatus.PENDING,
                    submittedAt: { lte: sevenDaysAgo },
                },
            }),
            prisma.payment.findMany({
                where: {
                    reconciliationStatus: ReconciliationStatus.MATCHED,
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            studentCode: true,
                        },
                    },
                    reconciler: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    reconciledAt: 'desc',
                },
                take: 5,
            }),
            prisma.payment.findMany({
                where: {
                    reconciliationStatus: ReconciliationStatus.UNMATCHED,
                    status: PaymentStatus.PENDING,
                },
                include: {
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            studentCode: true,
                        },
                    },
                },
                orderBy: {
                    submittedAt: 'asc',
                },
                take: 5,
            }),
        ]);

        const currentMonthValue = Number(monthlyRevenue._sum.amount || 0);
        const previousMonthValue = Number(previousMonthRevenue._sum.amount || 0);
        const revenueChange =
            previousMonthValue > 0
                ? ((currentMonthValue - previousMonthValue) / previousMonthValue) * 100
                : currentMonthValue > 0
                    ? 100
                    : 0;

        res.status(200).json({
            totalStudents: studentCount,
            pendingPayments: pendingCount,
            approvedToday: approvedTodayCount,
            monthlyRevenue: currentMonthValue,
            previousMonthRevenue: previousMonthValue,
            revenueChange,
            totalRevenue: Number(totalRevenue._sum.amount || 0),
            reconciliation: {
                matchedPayments: matchedCount,
                unmatchedPayments: unmatchedCount,
                matchedAmount: Number(matchedAmount._sum.amount || 0),
                unmatchedAmount: Number(unmatchedAmount._sum.amount || 0),
                aging: {
                    overThreeDays: overThreeDaysCount,
                    overSevenDays: overSevenDaysCount,
                },
                recentReconciliations: recentReconciliations.map((payment) => ({
                    id: payment.id,
                    amount: Number(payment.amount),
                    reconciledAt: payment.reconciledAt,
                    reconciliationNote: payment.reconciliationNote,
                    student: payment.student,
                    reconciler: payment.reconciler,
                })),
                oldestUnmatched: oldestUnmatched.map((payment) => ({
                    id: payment.id,
                    amount: Number(payment.amount),
                    submittedAt: payment.submittedAt,
                    externalReference: payment.externalReference,
                    receiptNumber: payment.receiptNumber,
                    student: payment.student,
                    ageDays: Math.max(
                        0,
                        Math.floor((now.getTime() - new Date(payment.submittedAt).getTime()) / (24 * 60 * 60 * 1000))
                    ),
                })),
            },
        });
    })
);

adminRouter.get(
    '/payments',
    asyncHandler(async (req, res) => {
        const status = typeof req.query.status === 'string' && req.query.status.trim().length > 0
            ? req.query.status.trim()
            : undefined;
        const payments = await listPaymentsForReview(status);
        res.status(200).json(payments);
    })
);

adminRouter.post(
    '/reconciliation/import-statement',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    uploadStatement.single('statement'),
    asyncHandler(async (req, res) => {
        const statementImport = await createStatementImport(req.user!.userId, req.file);
        res.status(200).json(statementImport);
    })
);

adminRouter.get(
    '/reconciliation/imports',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (_req, res) => {
        const imports = await listStatementImports();
        res.status(200).json(imports);
    })
);

adminRouter.get(
    '/reconciliation/exceptions',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (_req, res) => {
        const exceptions = await listReconciliationExceptions();
        res.status(200).json(exceptions);
    })
);

adminRouter.get(
    '/reconciliation/imports/:importId',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const statementImport = await getStatementImportById(req.params.importId);
        res.status(200).json(statementImport);
    })
);

adminRouter.patch(
    '/reconciliation/imports/:importId/mapping',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const statementImport = await updateStatementImportMapping(req.params.importId, req.body || {});
        res.status(200).json(statementImport);
    })
);

adminRouter.patch(
    '/reconciliation/imports/:importId/rows/:rowId/resolve',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const statementImport = await markStatementImportRowResolved(
            req.params.importId,
            req.params.rowId,
            req.body.paymentId
        );
        res.status(200).json(statementImport);
    })
);

adminRouter.patch(
    '/reconciliation/imports/:importId/rows/:rowId/assist-approve',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const statementImport = await assistApproveStatementImportRow(
            req.params.importId,
            req.params.rowId,
            req.body.paymentId,
            req.user!.userId
        );
        res.status(200).json(statementImport);
    })
);

adminRouter.get(
    '/payments/:paymentId',
    asyncHandler(async (req, res) => {
        const payment = await getPaymentDetailsById(req.params.paymentId);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(payment);
    })
);

adminRouter.patch(
    '/payments/:paymentId/review',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const payment = await reviewPayment(
            req.params.paymentId,
            req.user!.userId,
            req.body
        );

        res.status(200).json(payment);
    })
);

adminRouter.patch(
    '/payments/:paymentId/reconcile',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const payment = await reconcilePayment(
            req.params.paymentId,
            req.user!.userId,
            req.body
        );

        res.status(200).json(payment);
    })
);

adminRouter.patch(
    '/payments/:paymentId/verify',
    requireRole(UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const payment = await verifyPayment(
            req.params.paymentId,
            req.user!.userId,
            req.body
        );

        res.status(200).json(payment);
    })
);

adminRouter.get(
    '/fee-structures',
    asyncHandler(async (_req, res) => {
        const feeStructures = await listFeeStructures();
        res.status(200).json(feeStructures);
    })
);

adminRouter.post(
    '/fee-structures',
    asyncHandler(async (req, res) => {
        const feeStructure = await createFeeStructure(req.body);
        res.status(201).json(feeStructure);
    })
);

adminRouter.patch(
    '/fee-structures/:feeStructureId',
    asyncHandler(async (req, res) => {
        const feeStructure = await updateFeeStructure(req.params.feeStructureId, req.body);
        res.status(200).json(feeStructure);
    })
);

adminRouter.delete(
    '/fee-structures/:feeStructureId',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const result = await deleteFeeStructure(req.params.feeStructureId);
        res.status(200).json(result);
    })
);

adminRouter.get(
    '/students',
    asyncHandler(async (_req, res) => {
        const students = await listStudentsWithBalances();
        res.status(200).json(students);
    })
);

// Get payments for a specific student
adminRouter.get(
    '/students/:studentId/payments',
    asyncHandler(async (req, res) => {
        const { studentId } = req.params;

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { id: true },
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const payments = await prisma.payment.findMany({
            where: { studentId },
            orderBy: [
                { submittedAt: 'desc' },
                { paymentDate: 'desc' },
            ],
        });

        res.status(200).json(payments);
    })
);

adminRouter.get(
    '/students/:studentId/statement.pdf',
    asyncHandler(async (req, res) => {
        const payload = await getStudentDocumentPayloadByStudentId(req.params.studentId);
        const pdf = await generateStudentStatementPdf(req.params.studentId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${getStudentDocumentFilename('statement', payload.student)}"`);
        res.status(200).send(pdf);
    })
);

adminRouter.get(
    '/students/:studentId/clearance-letter.pdf',
    asyncHandler(async (req, res) => {
        const payload = await getStudentDocumentPayloadByStudentId(req.params.studentId);
        const pdf = await generateStudentClearanceLetterPdf(req.params.studentId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${getStudentDocumentFilename('clearance-letter', payload.student)}"`);
        res.status(200).send(pdf);
    })
);

adminRouter.get(
    '/users',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (_req, res) => {
        const users = await listSystemUsers();
        res.status(200).json(users);
    })
);

adminRouter.get(
    '/audit-logs',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const limit = Number(req.query.limit ?? 100);
        const logs = readAuditLogs(Number.isNaN(limit) ? 100 : Math.min(limit, 250));
        res.status(200).json(logs);
    })
);

adminRouter.delete(
    '/audit-logs',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const result = deleteAuditLogs(req.body);
        res.status(200).json(result);
    })
);

adminRouter.post(
    '/users',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const user = await createStaffUser(req.body);
        res.status(201).json(user);
    })
);

adminRouter.post(
    '/users/:userId/reset-password',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const result = await resetUserPassword(req.params.userId, req.body);
        res.status(200).json(result);
    })
);

adminRouter.patch(
    '/users/:userId',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const user = await updateSystemUser(req.params.userId, req.body);
        res.status(200).json(user);
    })
);

adminRouter.put(
    '/users/:userId/role',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const { role } = req.body;
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
        res.status(200).json(user);
    })
);

adminRouter.post(
    '/users/:userId/suspend',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const result = await suspendUser(req.params.userId, req.body.reason);
        res.status(200).json(result);
    })
);

adminRouter.post(
    '/users/:userId/activate',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const result = await activateUser(req.params.userId, req.body.reason);
        res.status(200).json(result);
    })
);

adminRouter.post(
    '/users/:userId/deactivate',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const result = await deactivateUser(req.params.userId, req.body.reason);
        res.status(200).json(result);
    })
);

adminRouter.post(
    '/users/:userId/reactivate',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const result = await activateUser(req.params.userId, req.body.reason);
        res.status(200).json(result);
    })
);

adminRouter.delete(
    '/users/:userId',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const result = await deleteUser(req.params.userId, req.body.reason);
        res.status(200).json(result);
    })
);

adminRouter.get(
    '/registry',
    asyncHandler(async (_req, res) => {
        const registry = await getRegistry();
        res.status(200).json(registry);
    })
);

adminRouter.patch(
    '/registry',
    requireRole(UserRole.ADMIN),
    asyncHandler(async (req, res) => {
        const result = await updateRegistry(req.body);
        res.status(200).json(result);
    })
);

