import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/database';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { z } from 'zod';

/**
 * Валидация схемы для подписки
 */
const subscribeSchema = z.object({
  userId: z.string().min(1).max(100),
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string()
    })
  }),
  platform: z.enum(['web', 'android', 'ios', 'desktop']).optional().default('web')
});

/**
 * API для подписки на push-уведомления
 * POST /api/notifications/subscribe
 */

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const token = getTokenFromRequest(request);
    if (token) {
      const userAuth = await verifyToken(token);
      if (!userAuth) {
        return NextResponse.json(
          { error: 'Неверный токен' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    
    // Валидация входных данных
    const validatedData = subscribeSchema.parse(body);
    const {
      userId,
      subscription,
      platform
    } = validatedData;

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne(userId).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const now = Date.now();
    const pushToken = {
      token: subscription.endpoint,
      platform,
      keys: subscription.keys, // p256dh и auth
      createdAt: now,
      expiresAt: now + (30 * 24 * 60 * 60 * 1000), // 30 дней
      lastUsedAt: now
    };

    // Получаем текущие токены
    const currentTokens = user.pushTokens || [];

    // Проверяем, есть ли уже такой токен
    const existingIndex = currentTokens.findIndex(
      (t: any) => t.token === subscription.endpoint
    );

    if (existingIndex !== -1) {
      // Обновляем существующий
      currentTokens[existingIndex] = {
        ...currentTokens[existingIndex],
        ...pushToken,
        lastUsedAt: now
      };
    } else {
      // Добавляем новый
      currentTokens.push(pushToken);
    }

    // Ограничиваем до 5 токенов на пользователя
    const tokensToKeep = currentTokens.slice(-5);

    // Обновляем пользователя
    await user.update({
      $set: {
        pushTokens: tokensToKeep,
        updatedAt: now
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Подписка оформлена',
      tokenCount: tokensToKeep.length
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error subscribing to notifications:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось оформить подписку: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * API для отписки от push-уведомлений
 * DELETE /api/notifications/subscribe
 */

export async function DELETE(request: NextRequest) {
  try {
    // Проверка авторизации
    const token = getTokenFromRequest(request);
    if (token) {
      const userAuth = await verifyToken(token);
      if (!userAuth) {
        return NextResponse.json(
          { error: 'Неверный токен' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const { userId, token: pushToken } = body;

    // Валидация
    if (!userId || typeof userId !== 'string' || userId.length > 100) {
      return NextResponse.json(
        { error: 'Неверный userId' },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne(userId).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    let pushTokens = user.pushTokens || [];

    if (token) {
      // Удаляем конкретный токен
      pushTokens = pushTokens.filter((t: any) => t.token !== token);
    } else {
      // Удаляем все токены
      pushTokens = [];
    }

    await user.update({
      $set: {
        pushTokens,
        updatedAt: Date.now()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Отписка успешна',
      tokenCount: pushTokens.length
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error unsubscribing from notifications:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось отписаться: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * API для проверки статуса подписки
 * GET /api/notifications/subscribe?userId=USER_ID
 */

export async function GET(request: NextRequest) {
  try {
    // Проверка авторизации
    const token = getTokenFromRequest(request);
    if (token) {
      const userAuth = await verifyToken(token);
      if (!userAuth) {
        return NextResponse.json(
          { error: 'Неверный токен' },
          { status: 401 }
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Валидация
    if (!userId || typeof userId !== 'string' || userId.length > 100) {
      return NextResponse.json(
        { error: 'Неверный userId' },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne(userId).exec();

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const pushTokens = user.pushTokens || [];
    const now = Date.now();

    // Фильтруем активные токены (не истёкшие)
    const activeTokens = pushTokens.filter((t: any) => 
      !t.expiresAt || t.expiresAt > now
    );

    return NextResponse.json({
      success: true,
      subscribed: activeTokens.length > 0,
      tokenCount: activeTokens.length,
      tokens: activeTokens.map((t: any) => ({
        platform: t.platform,
        createdAt: t.createdAt,
        expiresAt: t.expiresAt,
        lastUsedAt: t.lastUsedAt
      }))
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error checking subscription status:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось проверить статус: ' + error.message },
      { status: 500 }
    );
  }
}
