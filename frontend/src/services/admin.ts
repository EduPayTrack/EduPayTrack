import { apiRequest } from './api';
import type {
  AdminStudentRecord,
  AuditLogEntry,
  FeeStructure,
  PaymentStatus,
  ReportOverview,
  ReviewQueueResponse,
  SystemUser,
} from '../types/api';

export function getReviewQueue(token: string, status?: PaymentStatus) {
  const suffix = status ? `?status=${status}` : '';
  return apiRequest<ReviewQueueResponse>(`/api/admin/payments${suffix}`, undefined, token);
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

export function getOverviewReport(token: string) {
  return apiRequest<ReportOverview>('/api/reports/overview', undefined, token);
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
