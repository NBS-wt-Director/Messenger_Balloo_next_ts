import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email и код обязательны' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error?.message || 'Ошибка проверки' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Email подтвержден' },
    });
  } catch (error: any) {
    console.error('[Verify Email API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Внутренняя ошибка' },
      { status: 500 }
    );
  }
}
