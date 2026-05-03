import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

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

    if (!userId || !type || !title || !bodyText) {
      return NextResponse.json(
        { error: 'userId, type, title и body обязательны' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    db.prepare(`
      INSERT INTO Notification (id, userId, type, title, body, url, data, read, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).run(notificationId, userId, type, title, bodyText, url || null, JSON.stringify(data || {}), now);

    const user = db.prepare('SELECT * FROM User WHERE id = ?').get(userId) as any;
    
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
    console.error('[API] Error creating notification:', error);
    return NextResponse.json(
      { error: 'Не удалось создать уведомление' },
      { status: 500 }
    );
  }
}

