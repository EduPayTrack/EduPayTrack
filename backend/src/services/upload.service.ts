import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { z } from 'zod';

import { env } from '../config/env';
import { AppError } from '../middleware/error-handler';
import { parseReceiptText } from '../utils/receipt-parser';
import { isCloudinaryEnabled, uploadReceiptToCloudinary } from './cloudinary.service';

type StoredFile = Express.Multer.File;

type ReceiptScanResult = ReturnType<typeof parseReceiptText> & {
    message: string;
    provider: 'GROQ' | 'PYTHON';
    debug?: {
        textSource: 'GROQ_JSON' | 'PYTHON_RAW';
        textPreview: string;
    };
};

type GroqChatResponse = {
    choices?: Array<{
        message?: {
            content?: string | null;
        };
    }>;
    error?: {
        message?: string;
    };
};

const groqResponseSchema = z.object({
    reference_number: z.string().nullable().optional(),
    amount: z.number().nullable().optional(),
    payment_date: z.string().nullable().optional(),
    bank_type: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    raw_text_preview: z.string().nullable().optional(),
});

const ocrPreviewSchema = z.object({
    rawText: z.string().min(10),
});

const groqSupportedMimeTypes = new Map<string, string>([
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.png', 'image/png'],
    ['.webp', 'image/webp'],
]);

const parseGroqResponse = async (response: Response): Promise<GroqChatResponse> => {
    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch {
        throw new AppError('Groq returned an invalid response', 502, 'OCR_INVALID_RESPONSE', {
            status: response.status,
            body: text,
        });
    }
};

const scanReceiptWithGroq = async (filePath: string): Promise<ReceiptScanResult> => {
    if (!env.GROQ_API_KEY) {
        throw new AppError('Groq API key is not configured', 503, 'OCR_UNAVAILABLE');
    }

    const extension = path.extname(filePath).toLowerCase();
    const mimeType = groqSupportedMimeTypes.get(extension);

    if (!mimeType) {
        throw new AppError('Groq vision currently accepts JPG, PNG, and WebP receipt images', 400, 'OCR_UNSUPPORTED_FILE');
    }

    const fileBuffer = await fs.promises.readFile(filePath);
    const base64Image = fileBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            temperature: 0.1,
            max_tokens: 500,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content:
                        'You extract payment data from school fee receipts. Return only valid JSON. ' +
                        'Find the true receipt reference number or transaction id shown on the receipt. ' +
                        'Never use dates, account numbers, phone numbers, depositor numbers, or names as the reference number. ' +
                        'If there is no visible reference number, return null. ' +
                        'If there is a visible numeric transaction id, it may be the reference number. ' +
                        'Return keys exactly as: reference_number, amount, payment_date, bank_type, notes, raw_text_preview.',
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text:
                                'Extract the receipt information from this image. ' +
                                'For amount, return a number only. ' +
                                'For payment_date, return the visible date or datetime string. ' +
                                'For raw_text_preview, include the most relevant OCR-like text lines around the reference and amount if visible.',
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: dataUrl,
                            },
                        },
                    ],
                },
            ],
        }),
    });

    const payload = await parseGroqResponse(response);
    const content = payload.choices?.[0]?.message?.content;

    if (!response.ok || !content) {
        throw new AppError('Groq could not process this receipt image', 502, 'OCR_PROCESS_FAILED', {
            status: response.status,
            message: payload.error?.message,
        });
    }

    let parsedContent: z.infer<typeof groqResponseSchema>;
    try {
        parsedContent = groqResponseSchema.parse(JSON.parse(content));
    } catch {
        throw new AppError('Groq returned malformed extraction JSON', 502, 'OCR_INVALID_RESPONSE', {
            content,
        });
    }

    const rawText = (parsedContent.raw_text_preview || '').trim();
    const parserFallback = rawText ? parseReceiptText(rawText) : parseReceiptText('');
    const reference = parsedContent.reference_number?.trim() || parserFallback.reference;
    const amount = parsedContent.amount ?? parserFallback.amount;
    const paymentDate = parsedContent.payment_date?.trim() || parserFallback.paymentDate;
    const extraNotes = [parsedContent.bank_type, parsedContent.notes].filter(Boolean).join(' | ');

    return {
        ...parserFallback,
        amount,
        reference,
        paymentDate,
        rawText: rawText || JSON.stringify(parsedContent),
        confidence: Number(((Number(Boolean(amount)) + Number(Boolean(reference))) / 2).toFixed(2)),
        message: 'OCR successful via Groq vision',
        provider: 'GROQ',
        debug: {
            textSource: 'GROQ_JSON',
            textPreview: JSON.stringify(
                {
                    reference_number: parsedContent.reference_number ?? null,
                    amount: parsedContent.amount ?? null,
                    payment_date: parsedContent.payment_date ?? null,
                    bank_type: parsedContent.bank_type ?? null,
                    notes: extraNotes || null,
                    raw_text_preview: parsedContent.raw_text_preview ?? null,
                },
                null,
                2
            ),
        },
    };
};

export const buildUploadedReceiptResponse = async (file: StoredFile) => {
    if (!file) {
        throw new AppError('Receipt file is required', 400);
    }

    let proofUrl = `/uploads/${file.filename}`;
    let storageProvider: 'LOCAL' | 'CLOUDINARY' = 'LOCAL';

    if (isCloudinaryEnabled()) {
        const uploaded = await uploadReceiptToCloudinary(file.path, file.originalname, file.mimetype);
        proofUrl = uploaded.secureUrl;
        storageProvider = 'CLOUDINARY';
    }

    return {
        fileName: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        extension: path.extname(file.originalname).toLowerCase(),
        proofUrl,
        storageProvider,
    };
};

export const scanReceiptWithPython = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../utils/ocr_engine.py');
        const absoluteFilePath = path.resolve(filePath);

        exec(`python "${scriptPath}" "${absoluteFilePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`OCR Execution Error: ${stderr}`);
                const stderrMessage = stderr?.trim();
                const detail = stderrMessage || error.message;
                return reject(new Error(`Failed to run Python OCR engine: ${detail}`));
            }
            try {
                const result = JSON.parse(stdout);
                if (result.error) {
                    return reject(new Error(result.error));
                }
                resolve(result.rawText);
            } catch {
                reject(new Error('Failed to parse OCR output'));
            }
        });
    });
};

const mergeScanResults = (primary: ReceiptScanResult, secondary: ReceiptScanResult): ReceiptScanResult => ({
    ...primary,
    amount: primary.amount ?? secondary.amount,
    reference: primary.reference ?? secondary.reference,
    paymentDate: primary.paymentDate ?? secondary.paymentDate,
    registrationNumber: primary.registrationNumber ?? secondary.registrationNumber,
    codeNumber: primary.codeNumber ?? secondary.codeNumber,
    depositorName: primary.depositorName ?? secondary.depositorName,
    rawText: [primary.rawText, secondary.rawText].filter(Boolean).join('\n'),
    confidence: Math.max(primary.confidence ?? 0, secondary.confidence ?? 0),
    message:
        primary.reference && primary.amount !== null
            ? primary.message
            : 'OCR successful via Groq with Python enrichment',
    debug: {
        textSource: primary.debug?.textSource ?? secondary.debug?.textSource ?? 'GROQ_JSON',
        textPreview: [primary.debug?.textPreview, secondary.debug?.textPreview]
            .filter(Boolean)
            .join('\n---\n')
            .slice(0, 1200),
    },
});

export const scanUploadedReceipt = async (filePath: string): Promise<ReceiptScanResult> => {
    let groqFailure: unknown = null;
    let groqResult: ReceiptScanResult | null = null;

    try {
        groqResult = await scanReceiptWithGroq(filePath);
        if (groqResult.reference && groqResult.amount !== null) {
            return groqResult;
        }
    } catch (groqError) {
        groqFailure = groqError;
    }

    try {
        const rawText = await scanReceiptWithPython(filePath);
        const parsed = parseReceiptText(rawText);
        const pythonResult: ReceiptScanResult = {
            ...parsed,
            message: 'OCR successful via Python fallback',
            provider: 'PYTHON',
            debug: {
                textSource: 'PYTHON_RAW',
                textPreview: rawText.slice(0, 800),
            },
        };

        if (groqResult) {
            return mergeScanResults(groqResult, pythonResult);
        }

        return pythonResult;
    } catch (pythonError) {
        if (groqResult) {
            return groqResult;
        }

        const groqMessage =
            groqFailure instanceof Error ? groqFailure.message : 'Unknown Groq OCR error';
        const pythonMessage = pythonError instanceof Error ? pythonError.message : 'Unknown Python OCR error';

        throw new AppError(
            'Receipt OCR failed. Groq vision failed and Python fallback is unavailable.',
            502,
            'OCR_ALL_ENGINES_FAILED',
            {
                groq: groqMessage,
                python: pythonMessage,
                hint: 'Set GROQ_API_KEY and install Python easyocr dependencies for fallback.',
            }
        );
    }
};

export const previewReceiptOcr = (input: unknown) => {
    const data = ocrPreviewSchema.parse(input);
    const parsed = parseReceiptText(data.rawText);

    return {
        message: 'OCR preview parsed from provided receipt text',
        ...parsed,
    };
};
