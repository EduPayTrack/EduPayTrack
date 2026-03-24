declare namespace Express {
    interface Request {
        user?: {
            userId: string;
            role: import('@prisma/client').UserRole;
            studentId?: string;
        };
    }
}
