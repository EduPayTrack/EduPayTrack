import { AppError } from '../middleware/error-handler';

type AttemptRecord = {
    count: number;
    firstAttemptAt: number;
    blockedUntil?: number;
};

const attempts = new Map<string, AttemptRecord>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 15 * 60 * 1000;

const getAttemptKey = (email: string, ipAddress?: string) =>
    `${email.toLowerCase()}::${ipAddress ?? 'unknown'}`;

export const assertLoginAllowed = (email: string, ipAddress?: string) => {
    const key = getAttemptKey(email, ipAddress);
    const record = attempts.get(key);

    if (!record) {
        return;
    }

    const now = Date.now();

    if (record.blockedUntil && record.blockedUntil > now) {
        throw new AppError('Too many login attempts. Please try again later.', 429);
    }

    if (now - record.firstAttemptAt > WINDOW_MS) {
        attempts.delete(key);
    }
};

export const recordFailedLoginAttempt = (email: string, ipAddress?: string) => {
    const key = getAttemptKey(email, ipAddress);
    const now = Date.now();
    const existing = attempts.get(key);

    if (!existing || now - existing.firstAttemptAt > WINDOW_MS) {
        attempts.set(key, {
            count: 1,
            firstAttemptAt: now,
        });
        return;
    }

    const count = existing.count + 1;

    attempts.set(key, {
        count,
        firstAttemptAt: existing.firstAttemptAt,
        blockedUntil: count >= MAX_ATTEMPTS ? now + BLOCK_MS : undefined,
    });
};

export const clearLoginAttempts = (email: string, ipAddress?: string) => {
    attempts.delete(getAttemptKey(email, ipAddress));
};
