import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currentPassword, newPassword } = body;

    // Валидация
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Все поля обязательны' 
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Пароль должен содержать минимум 8 символов' 
        },
        { status: 400 }
      );
    }

    // Получаем токен из cookies
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Необходима авторизация' 
        },
        { status: 401 }
      );
    }

    // Вызов backend API
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.error?.message || 'Ошибка при смене пароля' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Пароль успешно изменен' },
    });
  } catch (error: any) {
    console.error('[Change Password API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    );
  }
}
