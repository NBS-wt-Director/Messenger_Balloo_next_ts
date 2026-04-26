import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Rate limiting хранилище (в памяти, для production использовать Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// CSRF токены (в памяти, для production использовать Redis)
const csrfTokens = new Map<string, Set<string>>();

// Кэширование частых запросов (в памяти, для production использовать Redis)
const responseCache = new Map<string, { response: any; timestamp: number; ttl: number }>();

// Статистика API для аналитики
const apiStats = new Map<string, { count: number; totalResponseTime: number; errors: number }>();

// Конфигурация rate limiting по категориям
const RATE_LIMIT_CONFIG = {
  // Критические операции (строгий лимит)
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 минут
    paths: ['/api/auth/login', '/api/auth/register', '/api/auth/yandex'],
  },
  passwordReset: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 час
    paths: ['/api/auth/password/recovery', '/api/auth/password/reset'],
  },
  // Чтение данных (больше запросов)
  read: {
    maxRequests: 300,
    windowMs: 60 * 1000, // 1 минута
    paths: [],
  },
  // Критические изменения (строгий лимит)
  critical: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 минута
    paths: ['/api/profile', '/api/admin'],
  },
  // По умолчанию
  default: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 минута
    paths: [],
  },
};

const CSRF_SECRET = process.env.ENCRYPTION_KEY || 'csrf-secret-key';

// Очистка старых записей rate limiting
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

// Очистка кэша
setInterval(() => {
  const now = Date.now();
  for (const [key, cached] of responseCache.entries()) {
    if (now > cached.timestamp + cached.ttl) {
      responseCache.delete(key);
    }
  }
}, 60000);

// Отправка статистики (в production - в отдельный сервис)
setInterval(() => {
  if (apiStats.size > 0) {
    logger.info('[API Stats]', Object.fromEntries(apiStats));
    apiStats.clear();
  }
}, 300000); // Раз в 5 минут

/**
 * Проверка rate limiting
 */
function checkRateLimit(identifier: string, path: string): { allowed: boolean; remaining: number; config: any } {
  // Определяем категорию по пути
  let category = 'default';
  for (const [cat, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (config.paths.some((p: string) => path.startsWith(p))) {
      category = cat;
      break;
    }
  }
  
  const config = RATE_LIMIT_CONFIG[category as keyof typeof RATE_LIMIT_CONFIG];
  const now = Date.now();
  const key = `${identifier}:${category}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return { allowed: true, remaining: config.maxRequests - 1, config };
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, config };
  }

  record.count++;
  return { allowed: true, remaining: config.maxRequests - record.count, config };
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
  const startTime = Date.now();
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

  // Кэширование для GET запросов (оптимизация)
  if (request.method === 'GET' && pathname.startsWith('/api/')) {
    const cacheKey = `${identifier}:${pathname}`;
    const cached = responseCache.get(cacheKey);
    
    if (cached && Date.now() < cached.timestamp + cached.ttl) {
      // Возвращаем из кэша
      logger.debug(`[Cache] Hit for ${pathname}`);
      return NextResponse.json(cached.response);
    }
  }

  // Проверка rate limiting
  const rateLimit = checkRateLimit(identifier, pathname);
  
  if (!rateLimit.allowed) {
    logger.warn(`[Rate Limit] Превышен лимит для ${identifier} на ${pathname}`);
    return NextResponse.json(
      { 
        error: 'Слишком много запросов. Попробуйте позже.',
        retryAfter: Math.ceil(rateLimit.config.windowMs / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.config.windowMs / 1000)),
          'X-RateLimit-Limit': String(rateLimit.config.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + rateLimit.config.windowMs),
        }
      }
    );
  }

  // CSRF защита для mutating запросов
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token');
    const userId = request.headers.get('x-user-id');

    // Для критичных endpoints требуем CSRF токен
    const criticalPaths = ['/api/profile', '/api/auth', '/api/admin', '/api/chats/group'];
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
      // Сохраняем токен в cookie для использования на клиенте
      const response = NextResponse.next();
      response.cookies.set('csrf-token', token, {
        httpOnly: false, // Для доступа из JS
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 600, // 10 минут
      });
      return response;
    }
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(rateLimit.config.maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(Date.now() + rateLimit.config.windowMs));
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Мониторинг API ответов
  if (pathname.startsWith('/api/')) {
    const responseTime = Date.now() - startTime;
    const statsKey = pathname;
    
    if (!apiStats.has(statsKey)) {
      apiStats.set(statsKey, { count: 0, totalResponseTime: 0, errors: 0 });
    }
    
    const stats = apiStats.get(statsKey)!;
    stats.count++;
    stats.totalResponseTime += responseTime;
    
    response.headers.set('X-Response-Time', String(responseTime) + 'ms');
  }

  // Оптимизация изображений
  if (pathname.startsWith('/api/yandex-disk') || pathname.startsWith('/api/attachments')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, immutable');
  }

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
