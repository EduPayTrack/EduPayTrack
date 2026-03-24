import { UserRole } from '@prisma/client';
import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import { requireAuth, requireRole } from '../middleware/auth';
import { getOverviewReport } from '../services/report.service';

export const reportRouter = Router();

reportRouter.use(requireAuth, requireRole(UserRole.ADMIN, UserRole.ACCOUNTS));

reportRouter.get(
    '/overview',
    asyncHandler(async (_req, res) => {
        const report = await getOverviewReport();
        res.status(200).json(report);
    })
);
