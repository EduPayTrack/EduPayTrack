const amountPatterns = [
    /(?:amount|total|paid|sum|balance|net amount)\s*[:\-]?\s*(?:mwk|mk|k)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)/i,
    /(?:mwk|mk|k)\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)/i,
    /\b([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(?:mwk|mk|k)\b/i,
];

const referenceLabelPattern =
    /(?:reference(?:\s*(?:number|no|#))?|ref(?:erence)?(?:\s*(?:number|no|#))?|transaction(?:\s*(?:id|reference|ref|no|number))?|txn(?:\s*(?:id|reference|ref|no|number))?|trx(?:\s*(?:id|reference|ref|no|number))?|trace(?:\s*no)?|rrn)\s*[:#\-]?\s*/i;

const referenceInlinePatterns = [
    new RegExp(`${referenceLabelPattern.source}([A-Za-z0-9-]{5,})`, 'i'),
    /\b(?:TRX|REF|TXN|RRN)[-\s:]*([A-Za-z0-9-]{5,})\b/i,
];

const datePatterns = [
    /\b((?:19|20)\d{2}[-/.]\d{1,2}[-/.]\d{1,2})\b/,
    /\b(\d{1,2}[-/.]\d{1,2}[-/.](?:19|20)\d{2})\b/,
    /\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(?:19|20)\d{2})\b/i,
    /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+(?:19|20)\d{2})\b/i,
];

const registrationPatterns = [
    /(?:reg\s*number|registration|reg\s*no|student\s*id|reg\s*#|id\s*no)\s*[:\-]?\s*([A-Za-z0-9\-]{4,})/i,
    /\b(REG-[A-Za-z0-9]{4,})\b/i,
];

const codePatterns = [
    /(?:code\s*number|code|verification\s*code|code\s*#)\s*[:\-]?\s*([A-Za-z0-9\-]{4,})/i,
    /\b(CODE-[A-Za-z0-9]{4,})\b/i,
];

const depositorPatterns = [
    /(?:depositor|paid by|received from|name|customer(?:'s)? name)\s*[:\-]?\s*([A-Za-z\s]{3,40})(?=\s*MWK|\s*[0-9]|$)/i,
];

const normalizeAmount = (rawAmount: string) => Number(rawAmount.replace(/,/g, ''));

const cleanupToken = (value: string) => value.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9-]+$/g, '').trim();

const isLikelyReference = (value: string) => {
    const normalized = cleanupToken(value);
    if (normalized.length < 5 || normalized.length > 40) {
        return false;
    }

    const hasLetter = /[A-Za-z]/.test(normalized);
    const hasNumber = /\d/.test(normalized);
    if (!hasLetter || !hasNumber) {
        return false;
    }

    return true;
};

const extractReferenceFromLine = (line: string): string | null => {
    for (const pattern of referenceInlinePatterns) {
        const match = line.match(pattern);
        if (match?.[1]) {
            const token = cleanupToken(match[1]);
            if (isLikelyReference(token)) {
                return token;
            }
        }
    }

    return null;
};

const extractReference = (rawText: string): string | null => {
    const lines = rawText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    for (let i = 0; i < lines.length; i += 1) {
        const currentLine = lines[i];
        const direct = extractReferenceFromLine(currentLine);
        if (direct) {
            return direct;
        }

        if (referenceLabelPattern.test(currentLine) && i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const token = cleanupToken(nextLine.split(/\s+/)[0] || '');
            if (isLikelyReference(token)) {
                return token;
            }
        }
    }

    const compactText = rawText.replace(/\s+/g, ' ').trim();
    for (const pattern of referenceInlinePatterns) {
        const match = compactText.match(pattern);
        if (match?.[1]) {
            const token = cleanupToken(match[1]);
            if (isLikelyReference(token)) {
                return token;
            }
        }
    }

    return null;
};

export const parseReceiptText = (rawText: string) => {
    const normalizedText = rawText.replace(/\r/g, '').trim();
    const singleLineText = normalizedText.replace(/\s+/g, ' ').trim();

    const matchedAmount = amountPatterns.map((p) => singleLineText.match(p)).find(Boolean);
    const matchedDate = datePatterns.map((p) => singleLineText.match(p)).find(Boolean);
    const matchedReg = registrationPatterns.map((p) => singleLineText.match(p)).find(Boolean);
    const matchedCode = codePatterns.map((p) => singleLineText.match(p)).find(Boolean);
    const matchedDepositor = depositorPatterns.map((p) => singleLineText.match(p)).find(Boolean);

    const amount = matchedAmount?.[1] ? normalizeAmount(matchedAmount[1]) : null;
    const reference = extractReference(normalizedText);
    const paymentDate = matchedDate?.[1] ?? null;
    const registrationNumber = matchedReg?.[1] ?? null;
    const codeNumber = matchedCode?.[1] ?? null;
    const depositorName = matchedDepositor?.[1]?.trim() || null;

    const confidenceSignals = [
        amount !== null,
        reference !== null,
        paymentDate !== null,
        registrationNumber !== null || codeNumber !== null,
        depositorName !== null,
    ].filter(Boolean).length;

    return {
        rawText: singleLineText,
        amount,
        reference,
        paymentDate,
        registrationNumber,
        codeNumber,
        depositorName,
        confidence: Number((confidenceSignals / 5).toFixed(2)),
    };
};
