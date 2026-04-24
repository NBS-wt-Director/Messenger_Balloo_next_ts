import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getJwtSecret } from '@/lib/config';

const JWT_SECRET = new TextEncoder().encode(getJwtSecret());

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
      console.error('[Auth] Token verification failed:', error);
    }
    return null;
  }
}

/**
 * Получение токена из заголовков
 */
export function getTokenFromRequest(request: NextRequest): string | null {
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
