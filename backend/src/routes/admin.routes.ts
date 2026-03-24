import { UserRole } from '@prisma/client';
import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import { requireAuth, requireRole } from '../middleware/auth';
import {
    createFeeStructure,
    listFeeStructures,
    listStudentsWithBalances,
    updateFeeStructure,
} from '../services/fee.service';
import { addVerificationNotes, listPaymentsForReview, reviewPayment } from '../services/payment.service';
import { createStaffUser, listSystemUsers, resetUserPassword } from '../services/user.service';
import { readAuditLogs } from '../utils/audit-log';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(UserRole.ADMIN, UserRole.ACCOUNTS));

adminRouter.get(
    '/payments',
    asyncHandler(async (req, res) => {
        const payments = await listPaymentsForReview(req.query.status as string | undefined);
        res.status(200).json(payments);
    })
);

adminRouter.patch(
    '/payments/:paymentId/review',
    requireRole(UserRole.ADMIN),
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
    '/payments/:paymentId/verify',
    asyncHandler(async (req, res) => {
        const payment = await addVerificationNotes(
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

adminRouter.get(
    '/students',
    asyncHandler(async (_req, res) => {
        const students = await listStudentsWithBalances();
        res.status(200).json(students);
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
