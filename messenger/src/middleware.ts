import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Rate limiting хранилище (в памяти, для production использовать Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// CSRF токены (в памяти, для production использовать Redis)
const csrfTokens = new Map<string, Set<string>>();

// Конфигурация
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '60', 10) * 1000; // в мс
const CSRF_SECRET = process.env.ENCRYPTION_KEY || 'csrf-secret-key';

/**
 * Проверка rate limiting
 */
function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Новый window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

/**
 * Генерация CSRF токена
 */
export function generateCSRFToken(userId: string): string {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  if (!csrfTokens.has(userId)) {
    csrfTokens.set(userId, new Set());
  }
  csrfTokens.get(userId)!.add(token);

  // Очищаем старые токены (храним максимум 10)
  const userTokens = csrfTokens.get(userId)!;
  if (userTokens.size > 10) {
    const firstToken = userTokens.values().next().value;
    if (firstToken) {
      userTokens.delete(firstToken);
    }
  }

  return token;
}

/**
 * Проверка CSRF токена
 */
export function validateCSRFToken(userId: string, token: string): boolean {
  const userTokens = csrfTokens.get(userId);
  if (!userTokens) return false;
  return userTokens.has(token);
}

/**
 * Middleware для защиты API
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем статические файлы и manifest
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return NextResponse.next();
  }

  // Получаем идентификатор пользователя (IP или userId из токена)
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const identifier = `ip:${ip || 'unknown'}`;

  // Проверка rate limiting
  const rateLimit = checkRateLimit(identifier);
  
  if (!rateLimit.allowed) {
    logger.warn(`[Rate Limit] Превышен лимит для ${identifier}`);
    return NextResponse.json(
      { 
        error: 'Слишком много запросов. Попробуйте позже.',
        retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW / 1000))
        }
      }
    );
  }

  // Добавляем заголовки rate limiting
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(Date.now() + RATE_LIMIT_WINDOW));

  // CSRF защита для mutating запросов
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token');
    const userId = request.headers.get('x-user-id');

    // Для критичных endpoints требуем CSRF токен
    const criticalPaths = ['/api/profile', '/api/auth', '/api/admin'];
    const isCriticalPath = criticalPaths.some(path => pathname.startsWith(path));

    if (isCriticalPath && userId && !csrfToken) {
      logger.warn(`[CSRF] Missing token for ${pathname}`);
      return NextResponse.json(
        { error: 'CSRF токен отсутствует' },
        { status: 403 }
      );
    }

    if (isCriticalPath && userId && csrfToken) {
      const isValid = validateCSRFToken(userId, csrfToken);
      if (!isValid) {
        logger.warn(`[CSRF] Invalid token for ${pathname}`);
        return NextResponse.json(
          { error: 'Неверный CSRF токен' },
          { status: 403 }
        );
      }
    }
  }

  // Добавляем CSRF токен для GET запросов (если есть userId)
  if (request.method === 'GET') {
    const userId = request.headers.get('x-user-id');
    if (userId) {
      const token = generateCSRFToken(userId || '');
      response.headers.set('x-csrf-token', token);
    }
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ]
};
