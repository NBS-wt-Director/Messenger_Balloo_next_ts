import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { logger } from '@/lib/logger';

const YANDEX_TOKEN_URL = 'https://oauth.yandex.ru/token';

/**
 * GET /api/yandex-disk/link - Получить URL авторизации или проверить статус
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  // Если передан userId - проверяем статус
  if (userId) {
    try {
      const db = await getDatabase();
      const usersCollection = db.users;

      const user = await usersCollection.findOne({
        selector: { id: userId }
      }).exec();

      if (!user) {
        return NextResponse.json(
          { error: 'Пользователь не найден' },
          { status: 404 }
        );
      }

      const userData = user.toJSON();

      return NextResponse.json({
        success: true,
        connected: userData.yandexDiskConnected || false,
        hasToken: !!userData.yandexDiskAccessToken
      });
    } catch (error: any) {
      logger.error('[API] Error checking Yandex Disk status:', error);
      return NextResponse.json(
        { error: error.message || 'Ошибка при проверке статуса' },
        { status: 500 }
      );
    }
  }

  // Иначе возвращаем URL авторизации
  const clientId = process.env.YANDEX_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/yandex-disk/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: 'Yandex client ID not configured' },
      { status: 500 }
    );
  }

  const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.json({
    success: true,
    authUrl
  });
}

/**
 * POST /api/yandex-disk/link - Связать аккаунт с Яндекс.Диском
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userId } = body;

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'Необходимо указать code и userId' },
        { status: 400 }
      );
    }

    const clientId = process.env.YANDEX_CLIENT_ID;
    const clientSecret = process.env.YANDEX_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/yandex-disk/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Yandex OAuth not configured' },
        { status: 500 }
      );
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
      const error = await tokenResponse.text();
      logger.error('[Yandex Disk] Token exchange error:', error);
      return NextResponse.json(
        { error: 'Failed to exchange code for token' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // Сохраняем токены в профиле пользователя
    const db = await getDatabase();
    const usersCollection = db.users;

    const user = await usersCollection.findOne({
      selector: { id: userId }
    }).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    await user.patch({
      yandexDiskConnected: true,
      yandexDiskAccessToken: access_token,
      yandexDiskRefreshToken: refresh_token,
      updatedAt: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Яндекс.Диск успешно привязан'
    });

  } catch (error: any) {
    logger.error('[API] Error linking Yandex Disk:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при привязке Яндекс.Диска' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/yandex-disk/unlink - Отвязать Яндекс.Диск
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Необходимо указать userId' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.users;

    const user = await usersCollection.findOne({
      selector: { id: userId }
    }).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    await user.patch({
      yandexDiskConnected: false,
      yandexDiskAccessToken: undefined,
      yandexDiskRefreshToken: undefined,
      updatedAt: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Яндекс.Диск успешно отвязан'
    });

  } catch (error: any) {
    logger.error('[API] Error unlinking Yandex Disk:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при отвязке Яндекс.Диска' },
      { status: 500 }
    );
  }
}

