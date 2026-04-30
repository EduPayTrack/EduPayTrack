import type { Response } from 'express';
import { UserRole } from '../generated/prisma';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export const AUTH_COOKIE_NAME = 'edupaytrack_session';

export type AuthTokenPayload = {
    userId: string;
    email: string;
    role: UserRole;
    studentId?: string;
    sessionId: string;
};

export const createToken = (payload: AuthTokenPayload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: '12h',
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
};

export const parseCookies = (cookieHeader?: string) => {
    const parsed = new Map<string, string>();

    if (!cookieHeader) {
        return parsed;
    }

    for (const segment of cookieHeader.split(';')) {
        const [rawName, ...valueParts] = segment.trim().split('=');
        if (!rawName || valueParts.length === 0) {
            continue;
        }

        parsed.set(rawName, decodeURIComponent(valueParts.join('=')));
    }

    return parsed;
};

export const extractTokenFromCookies = (cookieHeader?: string) => {
    const cookies = parseCookies(cookieHeader);
    return cookies.get(AUTH_COOKIE_NAME) ?? null;
};

const buildCookieOptions = () => ({
    httpOnly: true,
    sameSite: env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: 12 * 60 * 60 * 1000,
});

export const attachAuthCookie = (res: Response, token: string) => {
    res.cookie(AUTH_COOKIE_NAME, token, buildCookieOptions());
};

export const clearAuthCookie = (res: Response) => {
    res.clearCookie(AUTH_COOKIE_NAME, {
        httpOnly: true,
        sameSite: env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
        secure: env.NODE_ENV === 'production',
        path: '/',
    });
};
