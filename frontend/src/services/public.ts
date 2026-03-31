import { apiRequest } from './api';
import type { SystemRegistry } from '../types/api';

/**
 * Fetches the institutional registry (branding data) without requiring a token.
 * Used for the login page and early dashboard loads.
 */
export async function getPublicRegistry() {
  return apiRequest<SystemRegistry>('/api/registry');
}
