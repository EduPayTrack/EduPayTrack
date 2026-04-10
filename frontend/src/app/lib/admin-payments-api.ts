import { apiFetch } from './api';

export type PaymentReviewStudent = {
  id: string;
  firstName?: string;
  lastName?: string;
  studentCode?: string;
};

export type PaymentReviewItem = {
  id: string;
  amount?: number | string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  submittedAt?: string;
  externalReference?: string;
  receiptNumber?: string;
  proofUrl?: string;
  duplicateFlag?: boolean;
  verificationStatus?: 'UNVERIFIED' | 'VERIFIED' | 'FLAGGED' | string;
  verificationNotes?: string;
  reviewNotes?: string;
  reconciliationStatus?: 'MATCHED' | 'UNMATCHED' | string;
  reconciliationNote?: string;
  student?: PaymentReviewStudent;
};

export type StatementSuggestion = {
  id: string;
  score: number;
  reasons?: string[];
  canAutoApprove?: boolean;
  reference?: string;
  student?: {
    studentCode?: string;
    firstName?: string;
    lastName?: string;
  };
};

export type StatementImportRow = {
  id: string;
  rowNumber: number;
  reference?: string;
  payerName?: string;
  description?: string;
  amount?: number | string;
  transactionDate?: string;
  matchState?: 'STRONG_MATCH' | 'POSSIBLE_MATCH' | 'NO_MATCH';
  resolvedPaymentId?: string | null;
  autoApprovedPaymentId?: string | null;
  suggestions?: StatementSuggestion[];
};

export type StatementImportSummary = {
  totalRows?: number;
  strongMatches?: number;
  possibleMatches?: number;
  noMatches?: number;
  totalAmount?: number | string;
};

export type StatementImportRecord = {
  id: string;
  fileName: string;
  uploadedAt: string;
  rowCount?: number;
  totalRows?: number;
  totalAmount?: number | string;
  headers?: string[];
  columnMapping?: Record<string, string>;
  summary?: StatementImportSummary;
  rows?: StatementImportRow[];
};

export type ReconciliationExceptionItem = {
  id: string;
  importId: string;
  importFileName?: string;
  importedAt?: string;
  exceptionType: 'NO_MATCH' | 'MULTIPLE_MATCHES' | 'NEAR_AUTO_APPROVE';
  rowNumber: number;
  reference?: string;
  payerName?: string;
  amount?: number | string;
  transactionDate?: string;
  reason?: string;
  topSuggestion?: StatementSuggestion;
};

export type ReconciliationExceptionsResponse = {
  summary?: {
    total?: number;
    noMatch?: number;
    multipleMatches?: number;
    nearAutoApprove?: number;
  };
  items?: ReconciliationExceptionItem[];
};

export async function listPaymentsForReview() {
  return apiFetch<PaymentReviewItem[]>('/admin/payments');
}

export async function reviewPayment(paymentId: string, payload: { status: 'APPROVED' | 'REJECTED'; reviewNotes?: string }) {
  return apiFetch(`/admin/payments/${paymentId}/review`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function verifyPaymentAdmin(paymentId: string, payload: { verificationStatus: 'VERIFIED' | 'FLAGGED'; verificationNotes: string }) {
  return apiFetch(`/admin/payments/${paymentId}/verify`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function reconcilePaymentAdmin(paymentId: string, payload: { reconciliationStatus: 'MATCHED' | 'UNMATCHED'; reconciliationNote: string }) {
  return apiFetch(`/admin/payments/${paymentId}/reconcile`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function listStatementImports() {
  return apiFetch<StatementImportRecord[]>('/admin/reconciliation/imports');
}

export async function importStatement(file: File) {
  const formData = new FormData();
  formData.append('statement', file);
  return apiFetch<StatementImportRecord>('/admin/reconciliation/import-statement', {
    method: 'POST',
    body: formData,
  });
}

export async function getStatementImport(importId: string) {
  return apiFetch<StatementImportRecord>(`/admin/reconciliation/imports/${importId}`);
}

export async function updateStatementMapping(importId: string, payload: Record<string, string>) {
  return apiFetch<StatementImportRecord>(`/admin/reconciliation/imports/${importId}/mapping`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function resolveStatementRow(importId: string, rowId: string, paymentId: string) {
  return apiFetch<StatementImportRecord>(`/admin/reconciliation/imports/${importId}/rows/${rowId}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentId }),
  });
}

export async function assistApproveStatementRow(importId: string, rowId: string, paymentId: string) {
  return apiFetch<StatementImportRecord>(`/admin/reconciliation/imports/${importId}/rows/${rowId}/assist-approve`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentId }),
  });
}

export async function listReconciliationExceptions() {
  return apiFetch<ReconciliationExceptionsResponse>('/admin/reconciliation/exceptions');
}
