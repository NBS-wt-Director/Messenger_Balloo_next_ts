import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Пароль обязателен' },
        { status: 400 }
      );
    }

    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Ошибка удаления' },
        { status: response.status }
      );
    }

    const nextResponse = NextResponse.json({
      success: true,
      data: { message: 'Аккаунт удален' },
    });

    // Очищаем cookies
    nextResponse.cookies.delete('auth_token');
    nextResponse.cookies.delete('refresh_token');
    nextResponse.cookies.delete('user');

    return nextResponse;
  } catch (error: any) {
    console.error('[Delete Account API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Внутренняя ошибка' },
      { status: 500 }
    );
  }
}
