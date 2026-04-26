import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Конфигурация rate limiting
const RATE_LIMIT_CONFIG = {
  // Критические операции (много запросов = атака)
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 минут
  },
  passwordReset: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 час
  },
  // Обычные операции
  default: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 минута
  },
  // Чтение данных (больше запросов)
  read: {
    maxRequests: 300,
    windowMs: 60 * 1000, // 1 минута
  },
};

// Критические пути для rate limiting
const CRITICAL_PATHS = {
  auth: ['/api/auth/login', '/api/auth/register', '/api/auth/yandex'],
  passwordReset: ['/api/auth/password/recovery', '/api/auth/password/reset'],
};

// Хранилище для rate limiting (в production использовать Redis)
const requestStore = new Map<string, { count: number; resetTime: number }>();

// Получить ключ для rate limiting
function getRateLimitKey(request: NextRequest, path: string): string {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  return `${ip}:${path}`;
}

// Проверить rate limit
function checkRateLimit(key: string, config: { maxRequests: number; windowMs: number }): boolean {
  const now = Date.now();
  const record = requestStore.get(key);

  if (!record || now > record.resetTime) {
    // Новая запись или окно истекло
    requestStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return true;
  }

  if (record.count >= config.maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Очистка старых записей (запускать раз в минуту)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestStore.entries()) {
    if (now > record.resetTime) {
      requestStore.delete(key);
    }
  }
}, 60000);

// Получить категорию для пути
function getPathCategory(path: string): keyof typeof RATE_LIMIT_CONFIG {
  if (CRITICAL_PATHS.auth.some(p => path.startsWith(p))) {
    return 'auth';
  }
  if (CRITICAL_PATHS.passwordReset.some(p => path.startsWith(p))) {
    return 'passwordReset';
  }
  if (path.startsWith('/api/')) {
    return 'default';
  }
  return 'read';
}

// CSRF токены (в production использовать cookies с httpOnly)
const csrfTokens = new Map<string, number>();

export function generateCSRFToken(): string {
  const token = crypto.randomUUID();
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 часа
  csrfTokens.set(token, expiry);
  return token;
}

export function validateCSRFToken(token: string): boolean {
  if (!token) return false;
  
  const expiry = csrfTokens.get(token);
  if (!expiry || Date.now() > expiry) {
    csrfTokens.delete(token);
    return false;
  }
  
  return true;
}

// Очистка истёкших CSRF токенов
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of csrfTokens.entries()) {
    if (now > expiry) {
      csrfTokens.delete(token);
    }
  }
}, 3600000); // Раз в час

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем только API маршруты
  if (pathname.startsWith('/api/')) {
    const category = getPathCategory(pathname);
    const config = RATE_LIMIT_CONFIG[category];
    const key = getRateLimitKey(request, pathname);

    // Проверка rate limiting
    if (!checkRateLimit(key, config)) {
      return NextResponse.json(
        { 
          error: 'Слишком много запросов',
          retryAfter: Math.ceil(config.windowMs / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(config.windowMs / 1000)),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Date.now() + config.windowMs),
          }
        }
      );
    }

    // Проверка CSRF для критических операций (POST, PUT, DELETE)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const csrfToken = request.headers.get('x-csrf-token');
      
      // Игнорируем GET запросы и некоторые пути
      if (!['/api/auth/yandex/callback', '/api/invitations'].some(p => pathname.startsWith(p))) {
        if (!csrfToken || !validateCSRFToken(csrfToken)) {
          return NextResponse.json(
            { error: 'Неверный CSRF токен' },
            { status: 403 }
          );
        }
      }
    }

    // Добавляем заголовки rate limiting в ответ
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
    response.headers.set('X-RateLimit-Remaining', 'unknown'); // Не раскрываем точное количество
    
    return response;
  }

  // Генерация CSRF токена для страниц
  if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/profile')) {
    const token = generateCSRFToken();
    const response = NextResponse.next();
    // В production использовать httpOnly cookie
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 часа
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/login',
    '/register',
    '/profile/:path*',
  ],
};
