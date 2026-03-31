declare namespace Express {
    interface Request {
        user?: {
            userId: string;
            email: string;
            role: import('../generated/prisma').UserRole;
            studentId?: string;
        };
    }
}
