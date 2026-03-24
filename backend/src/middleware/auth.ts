import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { AppError } from './error-handler';
import { verifyToken } from '../utils/auth';

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next(new AppError('Authentication required', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = verifyToken(token);
        next();
    } catch {
        next(new AppError('Invalid or expired token', 401));
    }
};

export const requireRole =
    (...roles: UserRole[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Authentication required', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to access this resource', 403));
        }

        next();
    };
