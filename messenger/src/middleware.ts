import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Rate limiting - production ready реализация
// Использует в памяти для разработки, Redis для production

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

// In-memory rate limiting storage (для development)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Redis клиент для production (опционально)
let redisClient: any = null;
if (process.env.REDIS_URL) {
  try {
    const { createClient } = require('redis');
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.connect().catch(console.error);
  } catch (e) {
    logger.warn('[RateLimit] Redis not available, using in-memory storage');
  }
}

/**
 * Получение данных из хранилища
 */
async function getRateLimitData(key: string): Promise<{ count: number; resetTime: number }> {
  if (redisClient) {
    try {
      const data = await redisClient.get(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      logger.warn('[RateLimit] Redis read error, falling back to memory');
    }
  }
  
  return rateLimitStore.get(key) || { count: 0, resetTime: Date.now() };
}

/**
 * Сохранение данных в хранилище
 */
async function setRateLimitData(key: string, data: { count: number; resetTime: number }): Promise<void> {
  if (redisClient) {
    try {
      const ttl = Math.ceil((data.resetTime - Date.now()) / 1000);
      if (ttl > 0) {
        await redisClient.setEx(key, ttl, JSON.stringify(data));
      }
    } catch (e) {
      logger.warn('[RateLimit] Redis write error');
    }
  }
  
  rateLimitStore.set(key, data);
}

/**
 * Проверка rate limiting
 */
async function checkRateLimit(identifier: string, path: string): Promise<{ allowed: boolean; remaining: number; config: any; resetTime: number }> {
  // Определяем категорию по пути
  let category = 'default';
  for (const [cat, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (config.paths.some((p: string) => path.startsWith(p))) {
      category = cat;
      break;
    }
  }
  
  const config = RATE_LIMIT_CONFIG[category as keyof typeof RATE_LIMIT_CONFIG];
  const key = `rate_limit:${identifier}:${path}`;
  
  const now = Date.now();
  const data = await getRateLimitData(key);
  
  // Сброс если окно истекло
  if (now >= data.resetTime) {
    data.count = 0;
    data.resetTime = now + config.windowMs;
  }
  
  data.count++;
  await setRateLimitData(key, data);
  
  const allowed = data.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - data.count);
  
  if (!allowed) {
    logger.warn(`[Rate Limit] Rate limit exceeded: ${identifier} -> ${path} (count: ${data.count}, limit: ${config.maxRequests})`);
  }
  
  return { allowed, remaining, config, resetTime: data.resetTime };
}

/**
 * Middleware для защиты API
 */
export async function middleware(request: NextRequest) {
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
  const xff = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const ip = xff.split(',')[0].trim();
  const identifier = `ip:${ip}`;

  // Проверка rate limiting
  const rateLimit = await checkRateLimit(identifier, pathname);
  
  // Если превышен лимит - возвращаем 429
  if (!rateLimit.allowed) {
    const response = NextResponse.json(
      { error: 'Too Many Requests', retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000) },
      { status: 429 }
    );
    response.headers.set('X-RateLimit-Limit', String(rateLimit.config.maxRequests));
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime));
    return response;
  }
  
  // Security headers
  const response = NextResponse.next();
  
  response.headers.set('X-RateLimit-Limit', String(rateLimit.config.maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime));
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

/**
 * Генерация CSRF токена
 */
export function generateCSRFToken(userId: string): string {
  const crypto = require('crypto');
  const random = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();
  return `csrf_${userId}_${timestamp}_${random}`;
}
