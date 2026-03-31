import { UserRole } from '../generated/prisma';
import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import { requireAuth, requireRole } from '../middleware/auth';
import { uploadReceipt } from '../middleware/upload';
import { listStudentPayments, submitPayment } from '../services/payment.service';
import {
    buildUploadedReceiptResponse,
    previewReceiptOcr,
    scanReceiptWithPython,
} from '../services/upload.service';
import { parseReceiptText } from '../utils/receipt-parser';
import path from 'path';

export const paymentRouter = Router();

paymentRouter.use(requireAuth);

paymentRouter.get(
    '/mine',
    requireRole(UserRole.STUDENT),
    asyncHandler(async (req, res) => {
        const payments = await listStudentPayments(req.user!.userId);
        res.status(200).json(payments);
    })
);

paymentRouter.post(
    '/upload',
    requireRole(UserRole.STUDENT),
    uploadReceipt.single('receipt'),
    asyncHandler(async (req, res) => {
        const uploadResult = buildUploadedReceiptResponse(req.file!);
        res.status(201).json(uploadResult);
    })
);

paymentRouter.post(
    '/scan',
    requireRole(UserRole.STUDENT, UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const { fileName } = req.body;
        if (!fileName) return res.status(400).json({ error: 'File name is required' });
        
        // Construct full path to file inside project's uploads folder
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const filePath = path.join(uploadsDir, fileName);
        
        const rawText = await scanReceiptWithPython(filePath);
        const parsed = parseReceiptText(rawText);
        
        res.status(200).json({
            message: 'OCR successful via Python Engine',
            ...parsed,
        });
    })
);

paymentRouter.post(
    '/ocr-preview',
    requireRole(UserRole.STUDENT, UserRole.ADMIN, UserRole.ACCOUNTS),
    asyncHandler(async (req, res) => {
        const preview = previewReceiptOcr(req.body);
        res.status(200).json(preview);
    })
);

paymentRouter.post(
    '/',
    requireRole(UserRole.STUDENT),
    asyncHandler(async (req, res) => {
        const payment = await submitPayment(req.user!.userId, req.body);
        res.status(201).json(payment);
    })
);
