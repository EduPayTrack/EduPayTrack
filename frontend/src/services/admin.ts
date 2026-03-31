import { apiRequest } from './api';
import type {
  AdminStudentRecord,
  AuditLogEntry,
  FeeStructure,
  PaymentRecord,
  PaymentStatus,
  ReportOverview,
  ReviewQueueResponse,
  SystemUser,
} from '../types/api';

export function getReviewQueue(token: string, status?: PaymentStatus) {
  const suffix = status ? `?status=${status}` : '';
  return apiRequest<ReviewQueueResponse>(`/api/admin/payments${suffix}`, undefined, token);
}

export function getPaymentDetails(token: string, paymentId: string) {
  return apiRequest<PaymentRecord>(`/api/admin/payments/${paymentId}`, undefined, token);
}

export function reviewPayment(
  token: string,
  paymentId: string,
  payload: { status: Extract<PaymentStatus, 'APPROVED' | 'REJECTED'>; reviewNotes?: string },
) {
  return apiRequest(
    `/api/admin/payments/${paymentId}/review`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function addVerificationNotes(
  token: string,
  paymentId: string,
  payload: { reviewNotes: string },
) {
  return apiRequest(
    `/api/admin/payments/${paymentId}/verify`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function verifyPayment(
  token: string,
  paymentId: string,
  payload: { verificationStatus: 'VERIFIED' | 'FLAGGED'; verificationNotes: string },
) {
  return apiRequest(
    `/api/admin/payments/${paymentId}/verify`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function getFeeStructures(token: string) {
  return apiRequest<FeeStructure[]>('/api/admin/fee-structures', undefined, token);
}

export function createFeeStructure(
  token: string,
  payload: {
    title: string;
    description?: string;
    amount: number;
    program?: string;
    classLevel?: string;
    term?: string;
    semester?: string;
    academicYear?: string;
    active?: boolean;
  },
) {
  return apiRequest<FeeStructure>(
    '/api/admin/fee-structures',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function updateFeeStructure(
  token: string,
  feeStructureId: string,
  payload: {
    title?: string;
    description?: string;
    amount?: number;
    program?: string;
    classLevel?: string;
    term?: string;
    semester?: string;
    academicYear?: string;
    active?: boolean;
  },
) {
  return apiRequest<FeeStructure>(
    `/api/admin/fee-structures/${feeStructureId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteFeeStructure(token: string, feeStructureId: string) {
  return apiRequest<{ message: string }>(
    `/api/admin/fee-structures/${feeStructureId}`,
    {
      method: 'DELETE',
    },
    token,
  );
}

export function getOverviewReport(
  token: string,
  filters?: {
    startDate?: Date | string;
    endDate?: Date | string;
    academicYear?: string;
    term?: string;
    semester?: string;
    status?: PaymentStatus;
    method?: string;
    limit?: number;
    offset?: number;
  }
) {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append('startDate', String(filters.startDate));
  if (filters?.endDate) params.append('endDate', String(filters.endDate));
  if (filters?.academicYear) params.append('academicYear', filters.academicYear);
  if (filters?.term) params.append('term', filters.term);
  if (filters?.semester) params.append('semester', filters.semester);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.method) params.append('method', filters.method);
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.offset) params.append('offset', String(filters.offset));

  const suffix = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<ReportOverview>(`/api/reports/overview${suffix}`, undefined, token);
}

export function generateReport(
  token: string,
  payload: { title: string; reportType: string; filters: any }
) {
  return apiRequest<any>(
    '/api/reports/generate',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function getReportHistory(token: string) {
  return apiRequest<any[]>('/api/reports/history', undefined, token);
}

export function getReportDetails(token: string, reportId: string) {
  return apiRequest<any>(`/api/reports/${reportId}`, undefined, token);
}


export function getStudents(token: string) {
  return apiRequest<AdminStudentRecord[]>('/api/admin/students', undefined, token);
}

export function getSystemUsers(token: string) {
  return apiRequest<SystemUser[]>('/api/admin/users', undefined, token);
}

export function createSystemUser(
  token: string,
  payload: {
    email: string;
    password: string;
    role: 'ADMIN' | 'ACCOUNTS';
  },
) {
  return apiRequest<SystemUser>(
    '/api/admin/users',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function getAuditLogs(token: string, limit = 100) {
  return apiRequest<AuditLogEntry[]>(`/api/admin/audit-logs?limit=${limit}`, undefined, token);
}

export function deleteAuditLogs(
  token: string,
  filter: {
    before?: string;
    after?: string;
    action?: string;
    userId?: string;
    ids?: string[];
  },
) {
  return apiRequest<{ deleted: number; message: string }>(
    '/api/admin/audit-logs',
    { method: 'DELETE', body: JSON.stringify(filter) },
    token,
  );
}

export function resetSystemUserPassword(
  token: string,
  userId: string,
  payload: {
    newPassword: string;
  },
) {
  return apiRequest<{ message: string }>(
    `/api/admin/users/${userId}/reset-password`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function suspendSystemUser(
  token: string,
  userId: string,
  payload: { reason: string },
) {
  return apiRequest<{ message: string }>(
    `/api/admin/users/${userId}/suspend`,
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

export function activateSystemUser(
  token: string,
  userId: string,
  payload: { reason: string }
) {
  return apiRequest<{ message: string }>(
    `/api/admin/users/${userId}/activate`,
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

export function deactivateSystemUser(
  token: string,
  userId: string,
  payload: { reason: string },
) {
  return apiRequest<{ message: string }>(
    `/api/admin/users/${userId}/deactivate`,
    { method: 'POST', body: JSON.stringify(payload) },
    token,
  );
}

export function deleteSystemUser(
  token: string,
  userId: string,
  payload: { reason: string },
) {
  return apiRequest<{ message: string }>(
    `/api/admin/users/${userId}`,
    { method: 'DELETE', body: JSON.stringify(payload) },
    token,
  );
}
export function getRegistry(token: string) {
  return apiRequest<any>('/api/admin/registry', undefined, token);
}

export function updateRegistry(
  token: string,
  payload: {
    institutionName?: string;
    institutionType?: string;
    address?: string;
    logoUrl?: string;
    contactEmail?: string;
  },
) {
  return apiRequest<any>(
    '/api/admin/registry',
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    token,
  );
}
