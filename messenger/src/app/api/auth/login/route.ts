import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Валидация
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email и пароль обязательны' 
        },
        { status: 400 }
      );
    }

    // Вызов backend API
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Если требуется 2FA, возвращаем специальные данные
      if (response.status === 401 && data.requiresTwoFA) {
        return NextResponse.json(
          { 
            success: false, 
            error: '2FA required',
            requiresTwoFA: true,
            userId: data.userId,
            tempToken: data.tempToken,
          },
          { status: response.status }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: data.error?.message || 'Ошибка входа' 
        },
        { status: response.status }
      );
    }

    // Устанавливаем токены в cookies
    const { accessToken, refreshToken, user } = data.data || data;
    
    const nextResponse = NextResponse.json({
      success: true,
      data: { user, accessToken, refreshToken },
    });

    nextResponse.cookies.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    nextResponse.cookies.set('refresh_token', refreshToken || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    nextResponse.cookies.set('user', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return nextResponse;
  } catch (error: any) {
    console.error('[Login API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Внутренняя ошибка сервера' 
      },
      { status: 500 }
    );
  }
}
