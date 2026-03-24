import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import { requireAuth } from '../middleware/auth';
import { changePassword, loginUser, registerStudent } from '../services/auth.service';

export const authRouter = Router();

authRouter.post(
    '/register/student',
    asyncHandler(async (req, res) => {
        const result = await registerStudent(req.body, req.ip);
        res.status(201).json(result);
    })
);

authRouter.post(
    '/login',
    asyncHandler(async (req, res) => {
        const result = await loginUser(req.body, req.ip);
        res.status(200).json(result);
    })
);

authRouter.post(
    '/change-password',
    requireAuth,
    asyncHandler(async (req, res) => {
        const result = await changePassword(req.user!.userId, req.body, req.ip);
        res.status(200).json(result);
    })
);
