import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler';
import { getRegistry } from '../services/registry.service';

export const registryRouter = Router();

registryRouter.get(
    '/',
    asyncHandler(async (_req, res) => {
        const registry = await getRegistry();
        res.status(200).json(registry);
    })
);
