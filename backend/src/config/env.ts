import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
    PORT: z.coerce.number().int().positive().default(5000),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    CORS_ORIGINS: z.string().optional(),
    GROQ_API_KEY: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Environment validation failed');
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGINS
    ? env.CORS_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];
