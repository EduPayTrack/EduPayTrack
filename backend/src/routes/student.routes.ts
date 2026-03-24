import { UserRole } from '@prisma/client';
import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import { requireAuth, requireRole } from '../middleware/auth';
import { getStudentDashboard } from '../services/student.service';

export const studentRouter = Router();

studentRouter.use(requireAuth);

studentRouter.get(
    '/me',
    requireRole(UserRole.STUDENT),
    asyncHandler(async (req, res) => {
        const dashboard = await getStudentDashboard(req.user!.userId);
        res.status(200).json(dashboard);
    })
);
