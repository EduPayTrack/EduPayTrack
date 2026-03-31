import { apiRequest } from './api';
import type { AuthResponse } from '../types/api';
import type { LoginFormState, RegisterFormState } from '../types/forms';

export function loginUser(payload: LoginFormState) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout(token: string) {
  return apiRequest<{ message: string }>('/api/auth/logout', {
    method: 'POST',
  }, token);
}

export function terminateActiveSession(payload: LoginFormState) {
  return apiRequest<{ message: string }>('/api/auth/terminate-session', {
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

export function uploadProfilePicture(token: string, file: File) {
  const formData = new FormData();
  formData.append('profilePicture', file);

  return apiRequest<AuthResponse>('/api/auth/profile-picture', {
    method: 'POST',
    body: formData,
  }, token);
}

export function deleteProfilePicture(token: string) {
  return apiRequest<{ message: string }>(
    '/api/auth/profile-picture',
    {
      method: 'DELETE',
    },
    token,
  );
}
