import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/database';
import webpush from 'web-push';
import { getVapidKeys } from '@/lib/config';

/**
 * Конфигурация VAPID из config.json
 */
const vapidKeys = getVapidKeys();

// Настройка VAPID
webpush.setVapidDetails(
  vapidKeys.subject,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      title,
      body: messageBody,
      url = '/chats',
      icon = '/icons/icon-192x192.png',
      badge = '/icons/badge-72x72.png',
      tag = 'balloo-notification',
      requireInteraction = false,
      vibrate = [200, 100, 200]
    } = body;

    // Валидация
    if (!userId || !title || !messageBody) {
      return NextResponse.json(
        { error: 'userId, title и body обязательны' },
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

    // Фильтруем активные токены
    const activeTokens = pushTokens.filter((t: any) => 
      !t.expiresAt || t.expiresAt > now
    );
    
    if (activeTokens.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Нет активных подписок',
        sentAt: now,
        recipients: 0,
        subscribed: false
      });
    }

    const notificationPayload = JSON.stringify({
      title,
      body: messageBody,
      icon,
      badge,
      url,
      tag,
      requireInteraction,
      vibrate,
      userId,
      timestamp: now
    });

    let sentCount = 0;
    let failedCount = 0;
    const expiredTokens: string[] = [];

    // Отправка всем активным токенам
    const sendPromises = activeTokens.map(async (tokenData: any) => {
      const subscription = {
        endpoint: tokenData.token,
        keys: tokenData.keys
      };

      try {
        await webpush.sendNotification(subscription, notificationPayload);
        sentCount++;
        tokenData.lastUsedAt = now;
        return { success: true, token: tokenData.token };
      } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Push] Error sending to token:', error);
        }
        failedCount++;
        
        // Если 410 (Gone) или 404 (Not Found) - токен недействителен
        if (error.statusCode === 410 || error.statusCode === 404) {
          expiredTokens.push(tokenData.token);
        }
        
        return { success: false, token: tokenData.token, error: error.message };
      }
    });

    await Promise.all(sendPromises);

    // Удаляем недействительные токены
    if (expiredTokens.length > 0) {
      const updatedTokens = pushTokens.filter((t: any) => 
        !expiredTokens.includes(t.token)
      );

      await user.update({
        $set: {
          pushTokens: updatedTokens,
          updatedAt: now
        }
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Notification sent: ${sentCount} success, ${failedCount} failed, ${expiredTokens.length} expired`);
    }

    return NextResponse.json({
      success: true,
      message: 'Уведомление отправлено',
      sentAt: now,
      recipients: sentCount,
      failed: failedCount,
      expiredRemoved: expiredTokens.length
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error sending notification:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось отправить уведомление: ' + error.message },
      { status: 500 }
    );
  }
}

