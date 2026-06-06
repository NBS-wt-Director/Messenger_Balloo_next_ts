import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email обязателен' },
        { status: 400 }
      );
    }

    const authToken = request.cookies.get('auth_token')?.value;

    const response = await fetch(`${API_BASE_URL}/auth/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Ошибка отправки' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Код отправлен на email' },
    });
  } catch (error: any) {
    console.error('[Send Verification API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Внутренняя ошибка' },
      { status: 500 }
    );
  }
}
