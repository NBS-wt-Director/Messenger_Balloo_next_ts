import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { z } from 'zod';

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

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (token) {
      const userAuth = await verifyToken(token);
      if (!userAuth) {
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
      }
    }

    const body = await request.json();
    const { userId, subscription, platform } = subscribeSchema.parse(body);
    
    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const now = Date.now();
    const pushToken = {
      token: subscription.endpoint,
      platform,
      keys: subscription.keys,
      createdAt: now,
      expiresAt: now + (30 * 24 * 60 * 60 * 1000),
      lastUsedAt: now
    };

    const currentTokens = JSON.parse(user.pushTokens || '[]') as any[];
    const existingIndex = currentTokens.findIndex((t: any) => t.token === subscription.endpoint);

    if (existingIndex !== -1) {
      currentTokens[existingIndex] = { ...currentTokens[existingIndex], ...pushToken, lastUsedAt: now };
    } else {
      currentTokens.push(pushToken);
    }

    const tokensToKeep = currentTokens.slice(-5);
    db.prepare('UPDATE User SET pushTokens = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(tokensToKeep), new Date().toISOString(), userId);

    return NextResponse.json({ success: true, message: 'Подписка оформлена', tokenCount: tokensToKeep.length });
  } catch (error: any) {
    console.error('[API] Error subscribing to notifications:', error);
    return NextResponse.json({ error: 'Не удалось оформить подписку' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (token) {
      const userAuth = await verifyToken(token);
      if (!userAuth) {
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
      }
    }

    const body = await request.json();
    const { userId, token: pushToken } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Неверный userId' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    let tokens = JSON.parse(user.pushTokens || '[]') as any[];

    if (pushToken) {
      tokens = tokens.filter((t: any) => t.token !== pushToken);
    } else {
      tokens = [];
    }

    db.prepare('UPDATE User SET pushTokens = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(tokens), new Date().toISOString(), userId);

    return NextResponse.json({ success: true, message: 'Отписка успешна', tokenCount: tokens.length });
  } catch (error: any) {
    console.error('[API] Error unsubscribing from notifications:', error);
    return NextResponse.json({ error: 'Не удалось отписаться' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (token) {
      const userAuth = await verifyToken(token);
      if (!userAuth) {
        return NextResponse.json({ error: 'Неверный токен' }, { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Неверный userId' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const pushTokens = JSON.parse(user.pushTokens || '[]') as any[];
    const now = Date.now();
    const activeTokens = pushTokens.filter((t: any) => !t.expiresAt || t.expiresAt > now);

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
    console.error('[API] Error checking subscription status:', error);
    return NextResponse.json({ error: 'Не удалось проверить статус' }, { status: 500 });
  }
}
