import { NextRequest, NextResponse } from 'next/server';
import { getNotificationsCollection, getUsersCollection } from '@/lib/database';

/**
 * API для создания push-уведомлений
 * POST /api/notifications/create
 */

export interface CreateNotificationInput {
  userId: string;
  type: 'message' | 'invitation' | 'system' | 'call';
  title: string;
  body: string;
  url?: string;
  data?: {
    chatId?: string;
    messageId?: string;
    senderId?: string;
    invitationCode?: string;
    [key: string]: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateNotificationInput = await request.json();
    const { userId, type, title, body: bodyText, url, data } = body;

    // Валидация
    if (!userId || !type || !title || !bodyText) {
      return NextResponse.json(
        { error: 'userId, type, title и body обязательны' },
        { status: 400 }
      );
    }

    const notificationsCollection = await getNotificationsCollection();
    const now = Date.now();

    // Создание уведомления в базе
    const notificationId = `notif_${now}_${Math.random().toString(36).substr(2, 9)}`;
    
    await notificationsCollection.insert({
      id: notificationId,
      userId,
      type,
      title,
      body: bodyText,
      url: url || null,
      data: data || null,
      read: false,
      createdAt: now,
      expiresAt: now + (30 * 24 * 60 * 60 * 1000) // 30 дней
    });

    // Получение токенов для push-уведомления
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ selector: { id: userId } }).exec();
    
    if (user && user.pushTokens && user.pushTokens.length > 0) {
      // Отправка push-уведомления через Web Push API
      for (const token of user.pushTokens) {
        try {
          await sendPushNotification(token, {
            title,
            body: bodyText,
            icon: '/icons/icon-192.png',
            badge: '/icons/badge-72.png',
            data: {
              notificationId,
              type,
              url: url || '/',
              ...data
            }
          });
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Notifications] Failed to send push:', error);
          }
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Notifications] Created notification ${notificationId} for user ${userId}`);
    }

    return NextResponse.json({
      success: true,
      notification: {
        id: notificationId,
        userId,
        type,
        title,
        body: bodyText,
        url,
        data,
        read: false,
        createdAt: now
      }
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error creating notification:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось создать уведомление: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * Отправка Web Push уведомления
 */
async function sendPushNotification(token: string, payload: any): Promise<void> {
  try {
    // В реальном приложении здесь используется библиотека web-push
    // Для серверной отправки через VAPID
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: {
          endpoint: token,
          keys: {}
        },
        payload: JSON.stringify(payload)
      })
    });

    if (!response.ok) {
      throw new Error('Push notification failed');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Push] Error sending push:', error);
    }
    throw error;
  }
}

