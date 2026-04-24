import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken } from '@/middleware';

/**
 * GET /api/csrf-token - Получить CSRF токен
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId обязателен' },
        { status: 400 }
      );
    }

    const token = generateCSRFToken(userId);

    return NextResponse.json({
      success: true,
      token
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Ошибка при генерации токена' },
      { status: 500 }
    );
  }
}
