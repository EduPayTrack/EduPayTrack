import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { z } from 'zod';

import { env } from '../config/env';
import { AppError } from '../middleware/error-handler';
import { parseReceiptText } from '../utils/receipt-parser';

type StoredFile = Express.Multer.File;

type ReceiptScanResult = ReturnType<typeof parseReceiptText> & {
    message: string;
    provider: 'TABSCANNER' | 'PYTHON';
};

type TabScannerResponse = {
    token?: string;
    result?: Record<string, unknown>;
    status?: string;
    status_code?: number;
    code?: number;
    message?: string;
    success?: boolean;
};

const ocrPreviewSchema = z.object({
    rawText: z.string().min(10),
});

const tabScannerImageExtensions = new Set(['.jpg', '.jpeg', '.png']);
const amountKeyMatchers = [/^total$/i, /amount/i, /grand.?total/i];
const referenceKeyMatchers = [
    /reference/i,
    /receipt.?number/i,
    /transaction/i,
    /trace/i,
    /invoice/i,
    /document.?number/i,
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseAmountCandidate = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        return value;
    }

    if (typeof value !== 'string') {
        return null;
    }

    const matched = value.match(/[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?/);
    if (!matched) {
        return null;
    }

    const normalized = Number(matched[0].replace(/,/g, ''));
    return Number.isFinite(normalized) && normalized > 0 ? normalized : null;
};

const parseReferenceCandidate = (value: unknown): string | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.trim();
    if (!normalized || normalized.length < 5) {
        return null;
    }

    return normalized;
};

const collectKeyMatches = (
    payload: unknown,
    keyMatchers: RegExp[],
    depth = 0
): unknown[] => {
    if (!payload || typeof payload !== 'object' || depth > 6) {
        return [];
    }

    if (Array.isArray(payload)) {
        return payload.flatMap((item) => collectKeyMatches(item, keyMatchers, depth + 1));
    }

    const objectPayload = payload as Record<string, unknown>;
    const matches: unknown[] = [];

    for (const [key, value] of Object.entries(objectPayload)) {
        if (keyMatchers.some((matcher) => matcher.test(key))) {
            matches.push(value);
        }

        matches.push(...collectKeyMatches(value, keyMatchers, depth + 1));
    }

    return matches;
};

const pickAmountFromTabScannerPayload = (payload: Record<string, unknown>): number | null => {
    const directCandidates = collectKeyMatches(payload, amountKeyMatchers);
    const parsedCandidates = directCandidates
        .map(parseAmountCandidate)
        .filter((value): value is number => value !== null);

    if (parsedCandidates.length === 0) {
        return null;
    }

    return parsedCandidates.sort((a, b) => b - a)[0];
};

const pickReferenceFromTabScannerPayload = (payload: Record<string, unknown>): string | null => {
    const directCandidates = collectKeyMatches(payload, referenceKeyMatchers);

    for (const candidate of directCandidates) {
        if (Array.isArray(candidate)) {
            for (const item of candidate) {
                const parsed = parseReferenceCandidate(item);
                if (parsed) {
                    return parsed;
                }
            }
            continue;
        }

        const parsed = parseReferenceCandidate(candidate);
        if (parsed) {
            return parsed;
        }
    }

    return null;
};

const parseTabScannerResponse = async (response: Response): Promise<TabScannerResponse> => {
    const text = await response.text();

    try {
        return JSON.parse(text);
    } catch {
        throw new AppError('TabScanner returned an invalid response', 502, 'OCR_INVALID_RESPONSE', {
            status: response.status,
            body: text,
        });
    }
};

const scanReceiptWithTabScanner = async (filePath: string): Promise<ReceiptScanResult> => {
    if (!env.TABSCANNER_API_KEY) {
        throw new AppError('TabScanner API key is not configured', 503, 'OCR_UNAVAILABLE');
    }

    const extension = path.extname(filePath).toLowerCase();
    if (!tabScannerImageExtensions.has(extension)) {
        throw new AppError('TabScanner currently accepts JPG/PNG files for OCR', 400, 'OCR_UNSUPPORTED_FILE');
    }

    const fileBuffer = await fs.promises.readFile(filePath);
    const fileName = path.basename(filePath);
    const formData = new FormData();

    formData.append('file', new Blob([fileBuffer]), fileName);
    formData.append('documentType', 'receipt');

    const processResponse = await fetch('https://api.tabscanner.com/api/2/process', {
        method: 'POST',
        headers: {
            apikey: env.TABSCANNER_API_KEY,
        },
        body: formData,
    });

    const processPayload = await parseTabScannerResponse(processResponse);
    if (!processResponse.ok || !processPayload.token) {
        throw new AppError('TabScanner could not queue this receipt for OCR', 502, 'OCR_PROCESS_FAILED', {
            status: processResponse.status,
            message: processPayload.message,
            code: processPayload.code,
        });
    }

    await sleep(1500);
    let resultPayload: TabScannerResponse | null = null;

    for (let attempt = 0; attempt < 12; attempt += 1) {
        const resultResponse = await fetch(`https://api.tabscanner.com/api/result/${processPayload.token}`, {
            method: 'GET',
            headers: {
                apikey: env.TABSCANNER_API_KEY,
            },
        });

        resultPayload = await parseTabScannerResponse(resultResponse);
        const isPending =
            resultPayload.status === 'pending' ||
            resultPayload.status_code === 301 ||
            resultPayload.code === 301;

        if (isPending) {
            await sleep(1000);
            continue;
        }

        if (!resultResponse.ok || resultPayload.status === 'failed') {
            throw new AppError('TabScanner failed to process the receipt', 502, 'OCR_RESULT_FAILED', {
                status: resultResponse.status,
                message: resultPayload.message,
                code: resultPayload.code,
            });
        }

        break;
    }

    if (!resultPayload?.result) {
        throw new AppError('TabScanner OCR timed out while processing the receipt', 504, 'OCR_TIMEOUT');
    }

    const resultObject = resultPayload.result;
    const resultAsText = JSON.stringify(resultObject);
    const parserFallback = parseReceiptText(resultAsText);
    const amountFromResult = pickAmountFromTabScannerPayload(resultObject);
    const referenceFromResult = pickReferenceFromTabScannerPayload(resultObject);

    const amount = amountFromResult ?? parserFallback.amount;
    const reference = referenceFromResult ?? parserFallback.reference;
    const confidence = Number(((Number(Boolean(amount)) + Number(Boolean(reference))) / 2).toFixed(2));

    return {
        ...parserFallback,
        amount,
        reference,
        rawText: resultAsText,
        confidence,
        message: 'OCR successful via TabScanner',
        provider: 'TABSCANNER',
    };
};

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

        exec(`python "${scriptPath}" "${absoluteFilePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`OCR Execution Error: ${stderr}`);
                return reject(new Error('Failed to run Python OCR engine'));
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

export const scanUploadedReceipt = async (filePath: string): Promise<ReceiptScanResult> => {
    try {
        return await scanReceiptWithTabScanner(filePath);
    } catch (tabScannerError) {
        const rawText = await scanReceiptWithPython(filePath);
        const parsed = parseReceiptText(rawText);

        return {
            ...parsed,
            message: 'OCR successful via Python fallback',
            provider: 'PYTHON',
        };
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
