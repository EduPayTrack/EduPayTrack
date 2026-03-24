import { apiRequest } from './api';
import type { AuthResponse } from '../types/api';
import type { LoginFormState, RegisterFormState } from '../types/forms';

export function loginUser(payload: LoginFormState) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerStudent(payload: RegisterFormState) {
  return apiRequest<AuthResponse>('/api/auth/register/student', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function changePassword(
  token: string,
  payload: {
    currentPassword: string;
    newPassword: string;
  },
) {
  return apiRequest<{ message: string }>(
    '/api/auth/change-password',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}
