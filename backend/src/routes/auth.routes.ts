import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import { requireAuth } from '../middleware/auth';
import { uploadReceipt, uploadProfilePicture } from '../middleware/upload';
import { changePassword, loginUser, logoutUser, registerStudent, updateProfilePicture, forgotPassword, resetPassword, terminateActiveSession } from '../services/auth.service';

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
    '/forgot-password',
    asyncHandler(async (req, res) => {
        const result = await forgotPassword(req.body.email);
        res.status(200).json(result);
    })
);

authRouter.post(
    '/reset-password',
    asyncHandler(async (req, res) => {
        const result = await resetPassword(req.body);
        res.status(200).json(result);
    })
);

authRouter.post(
    '/terminate-session',
    asyncHandler(async (req, res) => {
        const result = await terminateActiveSession(req.body, req.ip);
        res.status(200).json(result);
    })
);
authRouter.post(
    '/logout',
    requireAuth,
    asyncHandler(async (req, res) => {
        const result = await logoutUser(
            req.user!.userId,
            req.user!.email,
            req.user!.role,
            req.ip
        );
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

authRouter.post(
    '/profile-picture',
    requireAuth,
    uploadProfilePicture.single('profilePicture'),
    asyncHandler(async (req, res) => {
        const result = await updateProfilePicture(req.user!.userId, req.file);
        res.status(200).json(result);
    })
);

authRouter.delete(
    '/profile-picture',
    requireAuth,
    asyncHandler(async (req, res) => {
        const result = await updateProfilePicture(req.user!.userId, null);
        res.status(200).json(result);
    })
);
