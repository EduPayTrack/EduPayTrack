import { UserRole, PaymentStatus, PaymentMethod } from '../generated/prisma';
import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import { requireAuth, requireRole } from '../middleware/auth';
import { getOverviewReport, saveReportToHistory, listReportHistory, getReportById } from '../services/report.service';

export const reportRouter = Router();

reportRouter.use(requireAuth, requireRole(UserRole.ADMIN, UserRole.ACCOUNTS));

/**
 * LIVE OVERVIEW: For on-the-fly dashboard views
 */
reportRouter.get(
    '/overview',
    asyncHandler(async (req, res) => {
        const filters = {
            startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
            academicYear: req.query.academicYear as string | undefined,
            term: req.query.term as string | undefined,
            semester: req.query.semester as string | undefined,
            status: req.query.status as PaymentStatus | undefined,
            method: req.query.method as PaymentMethod | undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 25,
            offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        };

        const report = await getOverviewReport(filters);
        res.status(200).json(report);
    })
);

/**
 * REPORT HISTORY: List all generated/saved snapshots
 */
reportRouter.get(
    '/history',
    asyncHandler(async (_req, res) => {
        const history = await listReportHistory();
        res.status(200).json(history);
    })
);

/**
 * VIEW/DOWNLOAD SNAPSHOT: Retrieve specific historical record
 */
reportRouter.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const report = await getReportById(req.params.id);
        res.status(200).json(report);
    })
);

/**
 * GENERATE SNAPSHOT: Create a fixed audit record (ACCOUNTS ONLY)
 */
reportRouter.post(
    '/generate',
    requireRole(UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const report = await saveReportToHistory(req.user!.userId, req.body);
        res.status(201).json(report);
    })
);
