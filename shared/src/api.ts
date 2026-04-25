/**
 * Shared API Utilities - Common API request handling
 */

import type { ApiResponse, PaginatedResponse } from './types';

/**
 * API Base Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRIES: 3,
};

/**
 * Create API request headers
 */
export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Generic API request handler
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(
  endpoint: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return apiRequest<T>(`${endpoint}${queryString}`, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost<T = any>(
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(
  endpoint: string
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

/**
 * Paginated API request
 */
export async function apiGetPaginated<T>(
  endpoint: string,
  params: { page?: number; limit?: number } & Record<string, any>
): Promise<ApiResponse<PaginatedResponse<T>>> {
  return apiGet<PaginatedResponse<T>>(endpoint, params);
}
