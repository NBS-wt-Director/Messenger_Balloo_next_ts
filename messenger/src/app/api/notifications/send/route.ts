import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import webpush from 'web-push';
import { getVapidKeys } from '@/lib/config';

const vapidKeys = getVapidKeys();
webpush.setVapidDetails(vapidKeys.subject, vapidKeys.publicKey, vapidKeys.privateKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, body: messageBody, url = '/chats', icon = '/icons/icon-192x192.png', badge = '/icons/badge-72x72.png' } = body;

    if (!userId || !title || !messageBody) {
      return NextResponse.json({ error: 'userId, title и body обязательны' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const pushTokens = JSON.parse(user.pushTokens || '[]') as any[];
    const now = Date.now();
    const activeTokens = pushTokens.filter((t: any) => !t.expiresAt || t.expiresAt > now);

    if (activeTokens.length === 0) {
      return NextResponse.json({ success: true, message: 'Нет активных подписок', sentAt: now, recipients: 0 });
    }

    const notificationPayload = JSON.stringify({ title, body: messageBody, icon, badge, url, userId, timestamp: now });

    let sentCount = 0;
    let failedCount = 0;
    const expiredTokens: string[] = [];

    for (const tokenData of activeTokens) {
      const subscription = { endpoint: tokenData.token, keys: tokenData.keys };
      try {
        await webpush.sendNotification(subscription, notificationPayload);
        sentCount++;
      } catch (error: any) {
        failedCount++;
        if (error.statusCode === 410 || error.statusCode === 404) {
          expiredTokens.push(tokenData.token);
        }
      }
    }

    if (expiredTokens.length > 0) {
      const updatedTokens = pushTokens.filter((t: any) => !expiredTokens.includes(t.token));
      db.prepare('UPDATE User SET pushTokens = ?, updatedAt = ? WHERE id = ?')
        .run(JSON.stringify(updatedTokens), new Date().toISOString(), userId);
    }

    return NextResponse.json({ success: true, message: 'Уведомление отправлено', sentAt: now, recipients: sentCount, failed: failedCount });
  } catch (error: any) {
    console.error('[API] Error sending notification:', error);
    return NextResponse.json({ error: 'Не удалось отправить уведомление' }, { status: 500 });
  }
}

