const amountPatterns = [
    /(?:amount|total|paid|sum|balance|net amount)\s*[:\-]?\s*(?:mwk|mk|k)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)/i,
    /(?:mwk|mk|k)\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)/i,
    /\b([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(?:mwk|mk|k)\b/i,
];

const referencePatterns = [
    /(?:reference|ref|transaction id|txn id|receipt number|receipt no|trx|transaction|trace no)\s*[:\.#\-]?\s*([A-Za-z0-9\-]{5,})/i,
    /\b(?:TRX|REF|TXN)[-\s]*([A-Za-z0-9]{5,})\b/i,
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

export const parseReceiptText = (rawText: string) => {
    const normalizedText = rawText.replace(/\s+/g, ' ').trim();

    const matchedAmount = amountPatterns.map((p) => normalizedText.match(p)).find(Boolean);
    const matchedReference = referencePatterns.map((p) => normalizedText.match(p)).find(Boolean);
    const matchedDate = datePatterns.map((p) => normalizedText.match(p)).find(Boolean);
    const matchedReg = registrationPatterns.map((p) => normalizedText.match(p)).find(Boolean);
    const matchedCode = codePatterns.map((p) => normalizedText.match(p)).find(Boolean);
    const matchedDepositor = depositorPatterns.map((p) => normalizedText.match(p)).find(Boolean);

    const amount = matchedAmount?.[1] ? normalizeAmount(matchedAmount[1]) : null;
    const reference = matchedReference?.[1] ?? null;
    let paymentDate = matchedDate?.[1] ?? null;
    const registrationNumber = matchedReg?.[1] ?? null;
    const codeNumber = matchedCode?.[1] ?? null;
    const depositorName = matchedDepositor?.[1]?.trim() || null;

    // Optional: standardize the payment date format to DD/MM/YYYY or similar if needed. We leave it as extracted.

    const confidenceSignals = [
        amount !== null, 
        reference !== null, 
        paymentDate !== null,
        registrationNumber !== null || codeNumber !== null,
        depositorName !== null
    ].filter(Boolean).length;

    return {
        rawText: normalizedText,
        amount,
        reference,
        paymentDate,
        registrationNumber,
        codeNumber,
        depositorName,
        confidence: Number((confidenceSignals / 5).toFixed(2)),
    };
};
