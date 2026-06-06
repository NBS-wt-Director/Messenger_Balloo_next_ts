/**
 * API Яндекс авторизации и Email/Password авторизации
 */

import { AuthTokens, ApiResponse, ApiError } from './types';
import apiClient from './client';

const YANDEX_CLIENT_ID = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID || '';
const YANDEX_CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET || '';

const getRedirectUri = (path: string) => {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${path}`;
};

// ============================================
// YANDEX AUTH
// ============================================

export function getYandexAuthUrl(): string {
  const redirectUri = getRedirectUri('/api/auth/yandex/callback');
  const scope = 'login:email login:info';
  
  return `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
}

export async function exchangeCodeForTokens(code: string): Promise<AuthTokens> {
  const redirectUri = getRedirectUri('/api/auth/yandex/callback');
  
  const response = await fetch('https://oauth.yandex.ru/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: YANDEX_CLIENT_ID,
      client_secret: YANDEX_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new ApiError(
      'Failed to exchange code for tokens',
      'TOKEN_EXCHANGE_FAILED',
      response.status
    );
  }

  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || '',
    expiresIn: data.expires_in,
  };
}

export async function getYandexUserInfo(accessToken: string): Promise<{
  id: string;
  email: string;
  displayName: string;
}> {
  const response = await fetch('https://login.yandex.ru/info', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      'Failed to get user info',
      'USER_INFO_FAILED',
      response.status
    );
  }

  const data = await response.json();
  
  return {
    id: data.id,
    email: data.default_email || data.emails?.[0],
    displayName: data.real_name || data.display_name || data.login,
  };
}

// ============================================
// EMAIL/PASSWORD AUTH
// ============================================

export interface RegisterParams {
  email: string;
  password: string;
  displayName?: string;
  phone?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    provider?: 'email' | 'yandex';
    [key: string]: any;
  };
  accessToken: string;
  refreshToken: string;
  requiresTwoFA?: boolean;
  userId?: string;
  tempToken?: string;
}

/**
 * Регистрация нового пользователя
 */
export async function register(params: RegisterParams): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', params);
  
  if (!response.data.success) {
    const errorMsg = response.data.error || 'Registration failed';
    throw new ApiError(errorMsg, 'REGISTRATION_FAILED', 400);
  }
  
  return response.data.data!;
}

/**
 * Вход по email/password
 */
export async function login(params: LoginParams): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', params);
  
  if (!response.data.success) {
    const errorMsg = response.data.error || 'Login failed';
    throw new ApiError(errorMsg, 'LOGIN_FAILED', 401);
  }
  
  return response.data.data!;
}

/**
 * Запрос 2FA кода
 */
export async function requestTwoFA(userId: string, method: 'sms' | 'bot' | 'totp'): Promise<void> {
  const response = await apiClient.post<ApiResponse<void>>('/auth/2fa/request', {
    userId,
    method,
  });
  
  if (!response.data.success) {
    const errorMsg = response.data.error || '2FA request failed';
    throw new ApiError(errorMsg, '2FA_REQUEST_FAILED', 400);
  }
}

/**
 * Проверка 2FA кода
 */
export async function verifyTwoFA(
  code: string, 
  method: 'sms' | 'bot' | 'totp',
  userId?: string
): Promise<LoginResponse> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/2fa/verify', {
    code,
    method,
    userId,
  });
  
  if (!response.data.success) {
    const errorMsg = response.data.error || '2FA verification failed';
    throw new ApiError(errorMsg, '2FA_VERIFY_FAILED', 401);
  }
  
  return response.data.data!;
}

/**
 * Выход
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout', {});
  } catch (error) {
    // Ignore errors on logout
  }
}

/**
 * Обновление токена
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    '/auth/refresh',
    { refreshToken }
  );
  
  if (!response.data.success) {
    const errorMsg = response.data.error || 'Token refresh failed';
    throw new ApiError(errorMsg, 'TOKEN_REFRESH_FAILED', 401);
  }
  
  const { accessToken, refreshToken: newRefreshToken } = response.data.data!;
  
  return {
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn: 7 * 24 * 60 * 60, // 7 days
  };
}

/**
 * Получить текущего пользователя
 */
export async function getCurrentUser(): Promise<any> {
  const response = await apiClient.get<ApiResponse<{ user: any }>>('/auth/me');
  
  if (!response.data.success) {
    const errorMsg = response.data.error || 'Failed to get current user';
    throw new ApiError(errorMsg, 'GET_USER_FAILED', 401);
  }
  
  return response.data.data!.user;
}

// ============================================
// YANDEX AUTH (remaining)
// ============================================

export async function validateToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch('https://login.yandex.ru/info', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
