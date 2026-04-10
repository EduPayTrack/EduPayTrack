import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
    statusCode: number;
    code?: string;
    details?: unknown;

    constructor(message: string, statusCode = 400, code?: string, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
};

export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            errors: error.flatten(),
            details: error.flatten(),
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            ...(error.code ? { code: error.code } : {}),
            ...(error.details !== undefined ? { details: error.details } : {}),
        });
    }

    console.error(error);

    return res.status(500).json({
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
    });
};
