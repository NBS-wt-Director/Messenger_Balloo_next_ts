import { NextRequest, NextResponse } from 'next/server';
import { fileLogger } from '@/lib/file-logger';

/**
 * POST /api/error
 * Клиентское логирование ошибок
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Логирование ошибки
    fileLogger.error('[Client Error]', {
      message: body.error,
      stack: body.stack,
      url: body.url,
      digest: body.digest,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /error] Error:', error);
    return NextResponse.json(
      { error: 'Failed to log error', details: error.message },
      { status: 500 }
    );
  }
}
