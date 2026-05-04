import { NextRequest, NextResponse } from 'next/server';
import { fileLogger } from '@/lib/file-logger';

/**
 * Обёртка для API route handlers с автоматическим логированием ошибок
 * 
 * @example
 * export async function GET(request: NextRequest) {
 *   return withErrorLogging(request, async () => {
 *     // ваш код
 *     return NextResponse.json({ data: 'value' });
 *   }, 'GET /api/users');
 * }
 */
export async function withErrorLogging<T>(
  request: NextRequest,
  handler: () => Promise<T>,
  routeName: string
): Promise<NextResponse<T> | Response> {
  const startTime = Date.now();
  
  try {
    const result = await handler();
    const duration = Date.now() - startTime;
    
    // Успешный ответ
    if (result instanceof NextResponse) {
      fileLogger.info(`[API] ${routeName} completed in ${duration}ms`, {
        status: result.status,
        method: request.method,
        url: request.url,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
    }
    
    return result as NextResponse<T> | Response;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    // Логируем ошибку
    fileLogger.error(`[API] ${routeName} failed in ${duration}ms`, {
      error: error.message,
      stack: error.stack,
      method: request.method,
      url: request.url,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      headers: {
        userAgent: request.headers.get('user-agent'),
        contentType: request.headers.get('content-type'),
      },
    });
    
    // Возвращаем стандартный ответ об ошибке
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * Упрощённая версия для простых handlers
 */
export function createProtectedHandler(routeName: string) {
  return async (request: NextRequest, handler: () => Promise<NextResponse>) => {
    return withErrorLogging(request, handler, routeName);
  };
}
