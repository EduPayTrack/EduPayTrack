import type { PaymentRecord } from '../types/api';

export type VerificationTemplate = {
    id: string;
    label: string;
    message: string;
    severity: 'info' | 'warning' | 'error'; // for FLAG use case
};

// Pre-defined verification messages for ACCOUNTS officers
export const VERIFICATION_TEMPLATES: VerificationTemplate[] = [
    {
        id: 'verified-clean',
        label: '✓ Receipt Verified - All Clear',
        message: 'Receipt verified. Amount, reference, and depositor details match OCR extraction.',
        severity: 'info',
    },
    {
        id: 'amount-mismatch',
        label: '⚠ Amount Mismatch',
        message: 'OCR extracted amount differs from claimed amount. Manual verification required.',
        severity: 'warning',
    },
    {
        id: 'reference-missing',
        label: '⚠ Reference Unclear',
        message: 'Bank reference not clearly visible or legible on receipt. Requires clarification.',
        severity: 'warning',
    },
    {
        id: 'date-mismatch',
        label: '⚠ Date Discrepancy',
        message: 'Payment date on receipt does not match submission date. Requires verification.',
        severity: 'warning',
    },
    {
        id: 'duplicate-flag',
        label: '⚠ Possible Duplicate',
        message: 'This submission appears to be a duplicate. Similar amount and reference detected.',
        severity: 'warning',
    },
    {
        id: 'image-quality',
        label: '⚠ Image Quality Issue',
        message: 'Receipt image quality is poor. Details are difficult to verify accurately.',
        severity: 'warning',
    },
    {
        id: 'depositor-mismatch',
        label: '⚠ Depositor Name Mismatch',
        message: 'Name on receipt does not match student or payer name provided.',
        severity: 'warning',
    },
    {
        id: 'account-mismatch',
        label: '⚠ Account Mismatch',
        message: 'Bank account number on receipt does not match expected institution account.',
        severity: 'warning',
    },
];

/**
 * Automatically detect and suggest verification messages based on OCR data discrepancies
 */
export function autoDetectVerificationIssues(payment: PaymentRecord): VerificationTemplate[] {
    const issues: VerificationTemplate[] = [];

    // Check for amount mismatch
    const amt = Number(payment.amount);
    const ocrAmt = Number(payment.ocrAmount);
    if (ocrAmt && amt) {
        const difference = Math.abs(ocrAmt - amt);
        const percentDiff = (difference / amt) * 100;
        if (percentDiff > 1) {
            // Allow 1% tolerance for rounding
            issues.push(VERIFICATION_TEMPLATES.find(t => t.id === 'amount-mismatch')!);
        }
    }

    // Check for missing reference
    if (!payment.ocrReference && (!payment.externalReference && !payment.receiptNumber)) {
        issues.push(VERIFICATION_TEMPLATES.find(t => t.id === 'reference-missing')!);
    }

    // Check for duplicate flag
    if (payment.duplicateFlag) {
        issues.push(VERIFICATION_TEMPLATES.find(t => t.id === 'duplicate-flag')!);
    }

    // Check if OCR data is missing or minimal (indicates quality issue)
    if (!payment.ocrText || payment.ocrText.trim().length < 20) {
        issues.push(VERIFICATION_TEMPLATES.find(t => t.id === 'image-quality')!);
    }

    return issues.length > 0 ? issues : [];
}

/**
 * Get suggested template based on detected issues
 */
export function getSuggestedTemplate(payment: PaymentRecord): VerificationTemplate | null {
    const issues = autoDetectVerificationIssues(payment);

    if (issues.length === 0) {
        return VERIFICATION_TEMPLATES.find(t => t.id === 'verified-clean') || null;
    }

    // Return the first/most critical issue
    return issues[0];
}
