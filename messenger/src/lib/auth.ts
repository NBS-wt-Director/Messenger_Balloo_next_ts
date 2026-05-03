import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { logger } from '@/lib/logger';

// Получаем JWT секрет из переменных окружения
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-in-production');

// Конфигурация cookies
const COOKIE_NAME = 'auth_token';
const COOKIE_AGE_DAYS = parseInt(process.env.JWT_EXPIRES_IN_DAYS || '7');

/**
 * Генерация JWT токена
 */
export async function generateToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
    .sign(JWT_SECRET);
}

/**
 * Проверка JWT токена
 */
export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('[Auth] Token verification failed:', error);
    }
    return null;
  }
}

/**
 * Создание httpOnly cookie с токеном
 */
export function createAuthCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return [
    `${COOKIE_NAME}=${token}`,
    `Max-Age=${COOKIE_AGE_DAYS * 86400}`,
    `Path=/`,
    `HttpOnly`,
    `Secure=${isProduction}`,
    `SameSite=Strict`
  ].join('; ');
}

/**
 * Удаление auth cookie
 */
export function deleteAuthCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict`;
}

/**
 * Получение токена из httpOnly cookie
 */
export function getTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value || null;
}

/**
 * Получение токена из заголовков (для API клиентов)
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Сначала проверяем cookie
  const cookieToken = getTokenFromCookie(request);
  if (cookieToken) {
    return cookieToken;
  }
  
  // Затем проверяем Authorization header
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return null;
  }

  // Bearer token
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Middleware для защиты API routes
 * Usage: export const middleware = createAuthMiddleware();
 */
export function createAuthMiddleware() {
  return async function middleware(request: NextRequest) {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Token required' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Добавляем информацию о пользователе в request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-email', user.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  };
}

/**
 * Хелпер для получения userId из request в API handlers
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  return request.headers.get('x-user-id');
}

/**
 * Хелпер для получения email из request в API handlers
 */
export function getEmailFromRequest(request: NextRequest): string | null {
  return request.headers.get('x-user-email');
}
