import { apiRequest } from './api';
import type {
  DashboardResponse,
  OcrPreview,
  UploadedReceipt,
} from '../types/api';
import type { PaymentFormState } from '../types/forms';

export function getStudentDashboard(token: string) {
  return apiRequest<DashboardResponse>('/api/students/me', undefined, token);
}

export function uploadStudentReceipt(token: string, file: File) {
  const formData = new FormData();
  formData.append('receipt', file);

  return apiRequest<UploadedReceipt>(
    '/api/payments/upload',
    {
      method: 'POST',
      body: formData,
    },
    token,
  );
}

export function previewStudentReceipt(token: string, rawText: string) {
  return apiRequest<OcrPreview>(
    '/api/payments/ocr-preview',
    {
      method: 'POST',
      body: JSON.stringify({ rawText }),
    },
    token,
  );
}

export function scanStudentReceipt(token: string, fileName: string) {
  return apiRequest<OcrPreview>(
    '/api/payments/scan',
    {
      method: 'POST',
      body: JSON.stringify({ fileName }),
    },
    token,
  );
}

export function submitStudentPayment(
  token: string,
  payload: PaymentFormState & {
    ocrText?: string;
    ocrAmount?: number;
    ocrReference?: string;
  },
) {
  return apiRequest(
    '/api/payments',
    {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        amount: Number(payload.amount),
      }),
    },
    token,
  );
}
