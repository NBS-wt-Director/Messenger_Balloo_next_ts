/**
 * API Яндекс авторизации
 */

import { AuthTokens, ApiResponse, ApiError } from './types';

const YANDEX_CLIENT_ID = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID || '';
const YANDEX_CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET || '';

const getRedirectUri = (path: string) => {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${path}`;
};

/**
 * Получить URL для авторизации через Яндекс
 */
export function getYandexAuthUrl(): string {
  const redirectUri = getRedirectUri('/api/auth/yandex/callback');
  const scope = 'login:email login:info';
  
  return `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
}

/**
 * Обменять код авторизации на токены
 */
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

/**
 * Получить информацию о пользователе Яндекса
 */
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

/**
 * Обновить токен доступа
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const response = await fetch('https://oauth.yandex.ru/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: YANDEX_CLIENT_ID,
      client_secret: YANDEX_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new ApiError(
      'Failed to refresh token',
      'TOKEN_REFRESH_FAILED',
      response.status
    );
  }

  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresIn: data.expires_in,
  };
}

/**
 * Проверить валидность токена
 */
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
