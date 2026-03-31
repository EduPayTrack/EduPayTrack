import { AppError } from '../middleware/error-handler';

type AttemptRecord = {
    count: number;
    firstAttemptAt: number;
    blockedUntil?: number;
    lockoutMultiplier: number; // Track exponential backoff
};

const attempts = new Map<string, AttemptRecord>();
const WINDOW_MS = 15 * 60 * 1000; // 15-minute window for attempt tracking
const MAX_ATTEMPTS = 5;
const INITIAL_BLOCK_MS = 5 * 60 * 1000; // 5 minutes initial lockout
const BLOCK_MULTIPLIER = 2; // Double lockout time on continued failures

const getAttemptKey = (email: string, ipAddress?: string) =>
    `${email.toLowerCase()}::${ipAddress ?? 'unknown'}`;

export const assertLoginAllowed = (email: string, ipAddress?: string) => {
    const key = getAttemptKey(email, ipAddress);
    const record = attempts.get(key);

    if (!record) {
        return;
    }

    const now = Date.now();

    // Check if currently blocked
    if (record.blockedUntil && record.blockedUntil > now) {
        const remainingMS = record.blockedUntil - now;
        const remainingMinutes = Math.ceil(remainingMS / 1000 / 60);
        throw new AppError(
            `Too many login attempts. Account locked for ${remainingMinutes} minute(s). Please try again later.`,
            429
        );
    }

    // Check if attempt window has expired
    if (now - record.firstAttemptAt > WINDOW_MS) {
        attempts.delete(key);
    }
};

export const recordFailedLoginAttempt = (email: string, ipAddress?: string) => {
    const key = getAttemptKey(email, ipAddress);
    const now = Date.now();
    const existing = attempts.get(key);

    // Initialize new record if doesn't exist or window expired
    if (!existing || now - existing.firstAttemptAt > WINDOW_MS) {
        attempts.set(key, {
            count: 1,
            firstAttemptAt: now,
            lockoutMultiplier: 1,
        });
        return;
    }

    const count = existing.count + 1;
    let blockUntil: number | undefined;

    // Block if reached max attempts
    if (count >= MAX_ATTEMPTS) {
        const blockDuration = INITIAL_BLOCK_MS * existing.lockoutMultiplier;
        blockUntil = now + blockDuration;
    }

    attempts.set(key, {
        count,
        firstAttemptAt: existing.firstAttemptAt,
        blockedUntil: blockUntil,
        lockoutMultiplier: blockUntil ? existing.lockoutMultiplier * BLOCK_MULTIPLIER : existing.lockoutMultiplier,
    });
};

export const clearLoginAttempts = (email: string, ipAddress?: string) => {
    attempts.delete(getAttemptKey(email, ipAddress));
};

// Get remaining lockout time in seconds (0 if not locked)
export const getLoginLockoutRemaining = (email: string, ipAddress?: string): number => {
    const key = getAttemptKey(email, ipAddress);
    const record = attempts.get(key);

    if (!record?.blockedUntil) {
        return 0;
    }

    const now = Date.now();
    if (record.blockedUntil <= now) {
        return 0;
    }

    return Math.ceil((record.blockedUntil - now) / 1000);
};
