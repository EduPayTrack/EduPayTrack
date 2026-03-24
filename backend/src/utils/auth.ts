import { UserRole } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export type AuthTokenPayload = {
    userId: string;
    role: UserRole;
    studentId?: string;
};

export const createToken = (payload: AuthTokenPayload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
};
