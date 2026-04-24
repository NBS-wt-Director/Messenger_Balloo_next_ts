import { NextRequest, NextResponse } from 'next/server';

const YANDEX_TOKEN_URL = 'https://oauth.yandex.ru/token';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/profile?disk_error=no_code', request.url));
  }

  try {
    const clientId = process.env.YANDEX_CLIENT_ID;
    const clientSecret = process.env.YANDEX_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/disk/callback`;

    if (!clientId || !clientSecret) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Missing Yandex OAuth credentials');
      }
      return NextResponse.redirect(new URL('/profile?disk_error=配置错误', request.url));
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
      return NextResponse.redirect(new URL('/profile?disk_error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // Перенаправляем на профиль с токенами
    const params = new URLSearchParams({
      disk_access_token: access_token || '',
      disk_refresh_token: refresh_token || '',
      disk_connected: 'true',
    });

    return NextResponse.redirect(new URL(`/profile?${params.toString()}`, request.url));

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Disk OAuth error:', error);
    }
    return NextResponse.redirect(new URL('/profile?disk_error=oauth_failed', request.url));
  }
}
