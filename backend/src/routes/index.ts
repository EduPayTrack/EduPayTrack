import { Router } from 'express';

import { adminRouter } from './admin.routes';
import { authRouter } from './auth.routes';
import { paymentRouter } from './payment.routes';
import { reportRouter } from './report.routes';
import { studentRouter } from './student.routes';
import { registryRouter } from './registry.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'EduPayTrack backend is running',
    });
});

apiRouter.use('/registry', registryRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/students', studentRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/reports', reportRouter);
