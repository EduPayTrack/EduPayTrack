import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import { corsOrigins, env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { apiRouter } from './routes';

dotenv.config();

export const app = express();

app.set('trust proxy', 1);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || env.NODE_ENV !== 'production' || corsOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error('Origin not allowed by CORS'));
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
