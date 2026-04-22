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
    debug?: {
        textSource: 'TABSCANNER_FLATTENED' | 'PYTHON_RAW';
        textPreview: string;
    };
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
    /transaction.?id/i,
    /transaction.?ref/i,
    /txn.?id/i,
    /txn.?ref/i,
    /trx.?id/i,
    /trx.?ref/i,
    /trace/i,
    /rrn/i,
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const flattenTabScannerPayload = (value: unknown, depth = 0): string[] => {
    if (value === null || value === undefined || depth > 8) {
        return [];
    }

    if (typeof value === 'string') {
        const normalized = value.replace(/\s+/g, ' ').trim();
        return normalized ? [normalized] : [];
    }

    if (typeof value === 'number') {
        return [String(value)];
    }

    if (typeof value === 'boolean') {
        return value ? ['true'] : ['false'];
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => flattenTabScannerPayload(item, depth + 1));
    }

    if (typeof value === 'object') {
        const objectValue = value as Record<string, unknown>;
        const lines: string[] = [];

        for (const [key, nestedValue] of Object.entries(objectValue)) {
            if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
                const normalizedValue = String(nestedValue).replace(/\s+/g, ' ').trim();
                if (normalizedValue) {
                    lines.push(`${key}: ${normalizedValue}`);
                }
                continue;
            }

            const nestedLines = flattenTabScannerPayload(nestedValue, depth + 1);
            if (nestedLines.length > 0) {
                lines.push(...nestedLines.map((line) => `${key}: ${line}`));
            }
        }

        return lines;
    }

    return [];
};

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

    const normalizedText = value.replace(/\s+/g, ' ').trim();
    if (!normalizedText) return null;

    const explicitPattern =
        /(?:reference(?:\s*(?:number|no|#))?|ref(?:erence)?(?:\s*(?:number|no|#))?|transaction(?:\s*(?:id|reference|ref|no|number))?|txn(?:\s*(?:id|reference|ref|no|number))?|trx(?:\s*(?:id|reference|ref|no|number))?|trace(?:\s*no)?|rrn|my\s*reference|their\s*reference)\s*[:#\-]?\s*([A-Za-z0-9][A-Za-z0-9/-]{4,39})/i;
    const explicitMatch = normalizedText.match(explicitPattern);
    if (explicitMatch?.[1]) {
        return explicitMatch[1];
    }

    const allowNumeric = /transaction\s*id|txn\s*id|trx\s*id/i.test(normalizedText);
    const tokenPattern = /\b([A-Za-z0-9][A-Za-z0-9/-]{4,39})\b/g;
    let tokenMatch: RegExpExecArray | null = tokenPattern.exec(normalizedText);
    while (tokenMatch) {
        const token = tokenMatch[1];
        if (/^(?:19|20)\d{2}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(token) || /^\d{1,2}[-/.]\d{1,2}[-/.](?:19|20)\d{2}$/.test(token)) {
            tokenMatch = tokenPattern.exec(normalizedText);
            continue;
        }
        const hasLetter = /[A-Za-z]/.test(token);
        const hasNumber = /\d/.test(token);
        if ((hasLetter && hasNumber) || (allowNumeric && /^\d{6,14}$/.test(token))) {
            return token;
        }
        tokenMatch = tokenPattern.exec(normalizedText);
    }

    return null;
};

const parseReferenceFromUnknown = (value: unknown, depth = 0): string | null => {
    if (depth > 6 || value === null || value === undefined) {
        return null;
    }

    if (typeof value === 'string') {
        return parseReferenceCandidate(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return null;
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            const parsed = parseReferenceFromUnknown(item, depth + 1);
            if (parsed) return parsed;
        }
        return null;
    }

    if (typeof value === 'object') {
        const objectValue = value as Record<string, unknown>;
        for (const innerValue of Object.values(objectValue)) {
            const parsed = parseReferenceFromUnknown(innerValue, depth + 1);
            if (parsed) return parsed;
        }
    }

    return null;
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
        const parsed = parseReferenceFromUnknown(candidate);
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
    const flattenedTextLines = flattenTabScannerPayload(resultObject);
    const resultAsText = flattenedTextLines.join('\n');
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
        debug: {
            textSource: 'TABSCANNER_FLATTENED',
            textPreview: resultAsText.slice(0, 500),
        },
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

export const scanUploadedReceipt = async (filePath: string): Promise<ReceiptScanResult> => {
    let tabScannerFailure: unknown = null;

    try {
        return await scanReceiptWithTabScanner(filePath);
    } catch (tabScannerError) {
        tabScannerFailure = tabScannerError;
    }

    try {
        const rawText = await scanReceiptWithPython(filePath);
        const parsed = parseReceiptText(rawText);

        return {
            ...parsed,
            message: 'OCR successful via Python fallback',
            provider: 'PYTHON',
            debug: {
                textSource: 'PYTHON_RAW',
                textPreview: rawText.slice(0, 500),
            },
        };
    } catch (pythonError) {
        const tabScannerMessage =
            tabScannerFailure instanceof Error ? tabScannerFailure.message : 'Unknown TabScanner error';
        const pythonMessage = pythonError instanceof Error ? pythonError.message : 'Unknown Python OCR error';

        throw new AppError(
            'Receipt OCR failed. TabScanner failed and Python fallback is unavailable.',
            502,
            'OCR_ALL_ENGINES_FAILED',
            {
                tabScanner: tabScannerMessage,
                python: pythonMessage,
                hint: 'Set TABSCANNER_API_KEY and install Python easyocr dependencies for fallback.',
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
