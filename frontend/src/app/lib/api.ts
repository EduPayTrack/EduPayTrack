const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
export const API_BASE_URL = (configuredApiBaseUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
export const API_ORIGIN = new URL(API_BASE_URL).origin;
const TOKEN_KEY = 'edu-pay-track-token';
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;

/**
 * Retrieve the stored JWT token.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store a JWT token.
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the stored JWT token.
 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Structured API error with status code and server data.
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(method: string, error: unknown, attempt: number): boolean {
  if (method !== 'GET' || attempt >= MAX_RETRIES) {
    return false;
  }

  if (error instanceof ApiError) {
    return RETRYABLE_STATUS_CODES.has(error.status);
  }

  return true;
}

/**
 * Low-level API client.
 * - Automatically attaches JWT Bearer token
 * - Handles JSON and FormData payloads
 * - 30-second timeout via AbortController
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 30000
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    // Don't set Content-Type for FormData — browser sets it with boundary
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const rawData = isJson ? await response.json() : null;

      if (!response.ok) {
        // Backend sends { success: false, message?: string, code?: string, ... }
        const errorMessage = rawData?.message || `Request failed (${response.status})`;
        throw new ApiError(errorMessage, response.status, rawData);
      }

      // Unwrap standard { success, data, message } wrapper
      if (rawData && typeof rawData === 'object' && 'success' in rawData) {
        return rawData.data as T;
      }

      return rawData as T;
    } catch (error) {
      const normalizedError =
        error instanceof ApiError
          ? error
          : (error as Error).name === 'AbortError'
            ? new ApiError('Request timed out', 408)
            : new ApiError((error as Error).message || 'Network error', 0);

      if (!shouldRetry(method, normalizedError, attempt)) {
        throw normalizedError;
      }

      await sleep(300 * 2 ** attempt);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new ApiError('Request failed after retries', 0);
}

export async function downloadApiFile(
  endpoint: string,
  fallbackFilename: string
): Promise<void> {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
  });

  if (!response.ok) {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const rawData = isJson ? await response.json() : null;
    throw new ApiError(rawData?.message || `Request failed (${response.status})`, response.status, rawData);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('content-disposition') || '';
  const filenameMatch = contentDisposition.match(/filename="(.+?)"/i);
  const filename = filenameMatch?.[1] || fallbackFilename;
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
