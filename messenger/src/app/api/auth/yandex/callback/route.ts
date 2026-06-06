import { NextRequest, NextResponse } from 'next/server';

const YANDEX_TOKEN_URL = 'https://oauth.yandex.ru/token';
const YANDEX_USERINFO_URL = 'https://login.yandex.ru/info';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/auth?error=no_code', request.url));
  }

  try {
    const clientId = process.env.YANDEX_CLIENT_ID;
    const clientSecret = process.env.YANDEX_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/yandex/callback`;

    if (!clientId || !clientSecret) {
      console.error('[Yandex OAuth] Missing credentials');
      return NextResponse.redirect(new URL('/auth?error=missing_credentials', request.url));
    }

    // 1. Обмен кода на токен
    const tokenResponse = await fetch(YANDEX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[Yandex OAuth] Token exchange error:', errorText);
      return NextResponse.redirect(new URL('/auth?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // 2. Получение информации о пользователе
    const userInfoResponse = await fetch(YANDEX_USERINFO_URL, {
      headers: {
        Authorization: `OAuth ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('[Yandex OAuth] User info error:', await userInfoResponse.text());
      return NextResponse.redirect(new URL('/auth?error=user_info_failed', request.url));
    }

    const userInfo = await userInfoResponse.json();
    const email = userInfo.default_email || userInfo.emails?.[0];

    if (!email) {
      console.error('[Yandex OAuth] No email in user info');
      return NextResponse.redirect(new URL('/auth?error=no_email', request.url));
    }

    // 3. Отправка на backend API для регистрации/логина
    const backendResponse = await fetch(`${API_BASE_URL}/auth/yandex`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        displayName: userInfo.display_name || userInfo.real_name || email.split('@')[0],
        yandexId: String(userInfo.id),
        accessToken: access_token,
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error('[Yandex OAuth] Backend error:', errorData);
      return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(errorData.error?.message || 'backend_error')}`, request.url));
    }

    const backendData = await backendResponse.json();
    
    if (!backendData.success || !backendData.data) {
      console.error('[Yandex OAuth] Invalid backend response');
      return NextResponse.redirect(new URL('/auth?error=invalid_response', request.url));
    }

    const { user, accessToken, refreshToken } = backendData.data;

    // 4. Устанавливаем cookies и перенаправляем
    const response = NextResponse.redirect(new URL('/chats', request.url));
    
    // Устанавливаем httpOnly cookies для токенов
    response.cookies.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    // Сохраняем данные пользователя в localStorage через client-side script
    // Это безопасно т.к. данные уже прошли валидацию на сервере
    response.cookies.set('user', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('[Yandex OAuth] Unexpected error:', error);
    return NextResponse.redirect(new URL('/auth?error=oauth_failed', request.url));
  }
}
