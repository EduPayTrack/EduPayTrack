import assert from 'node:assert/strict';
import test from 'node:test';
import type { NextFunction, Request, Response } from 'express';

process.env.DATABASE_URL ??= 'postgresql://tester:tester@localhost:5432/edupaytrack_test';
process.env.JWT_SECRET ??= 'test-secret-123';
process.env.NODE_ENV ??= 'test';

type NextError = Error | undefined;

type AuthDeps = {
    requireAuth: typeof import('./auth').requireAuth;
    prismaModule: typeof import('../lib/prisma');
    authUtils: typeof import('../utils/auth');
    originalFindUnique: typeof import('../lib/prisma').prisma.user.findUnique;
    originalVerifyToken: typeof import('../utils/auth').verifyToken;
};

let cachedDeps: AuthDeps | null = null;

const loadDeps = async (): Promise<AuthDeps> => {
    if (cachedDeps) {
        return cachedDeps;
    }

    const authModule = await import('./auth');
    const prismaModule = await import('../lib/prisma');
    const authUtils = await import('../utils/auth');

    cachedDeps = {
        requireAuth: authModule.requireAuth,
        prismaModule,
        authUtils,
        originalFindUnique: prismaModule.prisma.user.findUnique,
        originalVerifyToken: authUtils.verifyToken,
    };

    return cachedDeps;
};

function createRequest(authorization?: string) {
    return {
        headers: authorization ? { authorization } : {},
    } as Request;
}

function createResponse() {
    return {} as Response;
}

function runRequireAuth(
    requireAuth: typeof import('./auth').requireAuth,
    req: Request
) {
    return new Promise<{ error?: Error; nextCalled: boolean }>((resolve) => {
        let nextCalled = false;
        const next: NextFunction = ((error?: NextError) => {
            nextCalled = true;
            resolve({ error, nextCalled });
        }) as NextFunction;

        void requireAuth(req, createResponse(), next);
    });
}

test.afterEach(() => {
    if (!cachedDeps) {
        return;
    }

    cachedDeps.prismaModule.prisma.user.findUnique = cachedDeps.originalFindUnique;
    (cachedDeps.authUtils as { verifyToken: typeof cachedDeps.originalVerifyToken }).verifyToken =
        cachedDeps.originalVerifyToken;
});

test('requireAuth attaches authenticated user when token and active session are valid', async () => {
    const { requireAuth, prismaModule, authUtils, originalVerifyToken, originalFindUnique } = await loadDeps();

    (authUtils as { verifyToken: typeof originalVerifyToken }).verifyToken = (() => ({
        userId: 'user-1',
        email: 'student@example.com',
        role: 'STUDENT',
        studentId: 'student-1',
        sessionId: 'session-123',
    })) as typeof originalVerifyToken;

    prismaModule.prisma.user.findUnique = (async () => ({
        id: 'user-1',
        email: 'student@example.com',
        role: 'STUDENT',
        status: 'ACTIVE',
        currentSessionId: 'session-123',
        sessionExpires: new Date(Date.now() + 60_000),
        student: { id: 'student-1' },
    })) as typeof originalFindUnique;

    const req = createRequest('Bearer valid-token');
    const result = await runRequireAuth(requireAuth, req);

    assert.equal(result.error, undefined);
    assert.deepEqual(req.user, {
        userId: 'user-1',
        email: 'student@example.com',
        role: 'STUDENT',
        studentId: 'student-1',
        sessionId: 'session-123',
    });
});

test('requireAuth rejects revoked sessions with a specific error code', async () => {
    const { requireAuth, prismaModule, authUtils, originalVerifyToken, originalFindUnique } = await loadDeps();

    (authUtils as { verifyToken: typeof originalVerifyToken }).verifyToken = (() => ({
        userId: 'user-1',
        email: 'student@example.com',
        role: 'STUDENT',
        sessionId: 'session-from-token',
    })) as typeof originalVerifyToken;

    prismaModule.prisma.user.findUnique = (async () => ({
        id: 'user-1',
        email: 'student@example.com',
        role: 'STUDENT',
        status: 'ACTIVE',
        currentSessionId: 'different-session',
        sessionExpires: new Date(Date.now() + 60_000),
        student: null,
    })) as typeof originalFindUnique;

    const result = await runRequireAuth(requireAuth, createRequest('Bearer revoked-token'));

    assert.ok(result.error);
    assert.equal(result.error?.message, 'Session is no longer active. Please sign in again.');
    assert.equal((result.error as { code?: string }).code, 'SESSION_REVOKED');
});

test('requireAuth rejects expired sessions even when the token parses', async () => {
    const { requireAuth, prismaModule, authUtils, originalVerifyToken, originalFindUnique } = await loadDeps();

    (authUtils as { verifyToken: typeof originalVerifyToken }).verifyToken = (() => ({
        userId: 'user-1',
        email: 'student@example.com',
        role: 'STUDENT',
        sessionId: 'session-123',
    })) as typeof originalVerifyToken;

    prismaModule.prisma.user.findUnique = (async () => ({
        id: 'user-1',
        email: 'student@example.com',
        role: 'STUDENT',
        status: 'ACTIVE',
        currentSessionId: 'session-123',
        sessionExpires: new Date(Date.now() - 60_000),
        student: null,
    })) as typeof originalFindUnique;

    const result = await runRequireAuth(requireAuth, createRequest('Bearer expired-session-token'));

    assert.ok(result.error);
    assert.equal(result.error?.message, 'Session expired. Please sign in again.');
    assert.equal((result.error as { code?: string }).code, 'SESSION_EXPIRED');
});
