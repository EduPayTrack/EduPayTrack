import { apiFetch } from './api';

export async function listPaymentsForReview() {
  return apiFetch<any[]>('/admin/payments');
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
  return apiFetch<any[]>('/admin/reconciliation/imports');
}

export async function importStatement(file: File) {
  const formData = new FormData();
  formData.append('statement', file);
  return apiFetch<any>('/admin/reconciliation/import-statement', {
    method: 'POST',
    body: formData,
  });
}

export async function getStatementImport(importId: string) {
  return apiFetch<any>(`/admin/reconciliation/imports/${importId}`);
}

export async function updateStatementMapping(importId: string, payload: Record<string, string>) {
  return apiFetch<any>(`/admin/reconciliation/imports/${importId}/mapping`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function resolveStatementRow(importId: string, rowId: string, paymentId: string) {
  return apiFetch<any>(`/admin/reconciliation/imports/${importId}/rows/${rowId}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentId }),
  });
}

export async function assistApproveStatementRow(importId: string, rowId: string, paymentId: string) {
  return apiFetch<any>(`/admin/reconciliation/imports/${importId}/rows/${rowId}/assist-approve`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentId }),
  });
}

export async function listReconciliationExceptions() {
  return apiFetch<any>('/admin/reconciliation/exceptions');
}
