import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Валидация
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email обязателен' 
        },
        { status: 400 }
      );
    }

    // Вызов backend API
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.error?.message || 'Ошибка при отправке инструкции' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Инструкция отправлена на email' },
    });
  } catch (error: any) {
    console.error('[Password Recovery API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    );
  }
}
