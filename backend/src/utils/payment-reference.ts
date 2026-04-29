export const normalizePaymentReference = (value?: string | null) => {
    if (!value) return '';

    return value
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
};

export const requiresPaymentReference = (method?: string | null) =>
    method === 'BANK_TRANSFER' || method === 'MOBILE_CREDIT_CARD';
