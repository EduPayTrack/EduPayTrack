import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { z } from 'zod';

import { AppError } from '../middleware/error-handler';
import { parseReceiptText } from '../utils/receipt-parser';

type StoredFile = Express.Multer.File;

const ocrPreviewSchema = z.object({
    rawText: z.string().min(10),
});

export const buildUploadedReceiptResponse = (file: StoredFile) => {
    if (!file) {
        throw new AppError('Receipt file is required', 400);
    }

    return {
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        extension: path.extname(file.originalname).toLowerCase(),
        proofUrl: `/uploads/${file.filename}`,
    };
};

export const scanReceiptWithPython = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../utils/ocr_engine.py');
        const absoluteFilePath = path.resolve(filePath);
        
        // Execute python script
        exec(`python "${scriptPath}" "${absoluteFilePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`OCR Execution Error: ${stderr}`);
                return reject(new Error('Failed to run Python OCR engine'));
            }
            try {
                const result = JSON.parse(stdout);
                if (result.error) return reject(new Error(result.error));
                resolve(result.rawText);
            } catch (pError) {
                reject(new Error('Failed to parse OCR output'));
            }
        });
    });
};

export const previewReceiptOcr = (input: unknown) => {
    const data = ocrPreviewSchema.parse(input);
    const parsed = parseReceiptText(data.rawText);

    return {
        message: 'OCR preview parsed from provided receipt text',
        ...parsed,
    };
};
