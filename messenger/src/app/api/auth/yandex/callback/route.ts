import { NextRequest, NextResponse } from 'next/server';

const YANDEX_TOKEN_URL = 'https://oauth.yandex.ru/token';
const YANDEX_USERINFO_URL = 'https://login.yandex.ru/info';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    const clientId = process.env.YANDEX_CLIENT_ID;
    const clientSecret = process.env.YANDEX_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/yandex/callback`;

    if (!clientId || !clientSecret) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Missing Yandex OAuth credentials');
      }
      return NextResponse.redirect(new URL('/login?error=配置错误', request.url));
    }

    // Обмен кода на токен
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Token exchange error:', errorText);
      }
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // Получение информации о пользователе
    const userInfoResponse = await fetch(YANDEX_USERINFO_URL, {
      headers: {
        Authorization: `OAuth ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error('User info error:', await userInfoResponse.text());
      }
      return NextResponse.redirect(new URL('/login?error=user_info_failed', request.url));
    }

    const userInfo = await userInfoResponse.json();

    // Создаём URL для редиректа с данными пользователя
    // В реальном приложении здесь должен быть серверный компонент для безопасной передачи данных
    const params = new URLSearchParams({
      access_token: access_token || '',
      refresh_token: refresh_token || '',
      email: userInfo.default_email || userInfo.emails?.[0] || '',
      id: String(userInfo.id),
      display_name: userInfo.display_name || userInfo.real_name || userInfo.default_email?.split('@')[0] || 'User',
    });

    // Перенаправляем на страницу с данными
    return NextResponse.redirect(new URL(`/login?${params.toString()}`, request.url));

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('OAuth error:', error);
    }
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
  }
}
