import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'userId требуется' }, { status: 400 });
    }

    const now = Date.now();
    let query = 'SELECT * FROM Notification WHERE userId = ? AND (expiresAt IS NULL OR expiresAt > ?)';
    const params: any[] = [userId, new Date(now).toISOString()];

    if (unreadOnly) {
      query += ' AND read = 0';
    }

    query += ' ORDER BY createdAt DESC LIMIT ?';
    params.push(limit);

    const notifications = db.prepare(query).all(...params) as any[];

    let countQuery = 'SELECT COUNT(*) as count FROM Notification WHERE userId = ? AND (expiresAt IS NULL OR expiresAt > ?)';
    let countParams: any[] = [userId, new Date(now).toISOString()];
    if (unreadOnly) {
      countQuery += ' AND read = 0';
    }
    const unreadCount = db.prepare(countQuery).get(...countParams) as any;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: unreadCount.count,
      total: notifications.length
    });
  } catch (error: any) {
    console.error('[API] Error fetching notifications:', error);
    return NextResponse.json({ error: 'Не удалось получить уведомления' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, userId, markAll } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId требуется' }, { status: 400 });
    }

    const now = new Date().toISOString();

    if (markAll) {
      db.prepare('UPDATE Notification SET read = 1, readAt = ? WHERE userId = ? AND read = 0')
        .run(now, userId);
      return NextResponse.json({ success: true, message: 'Все уведомления отмечены как прочитанные' });
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId требуется' }, { status: 400 });
    }

    db.prepare('UPDATE Notification SET read = 1, readAt = ? WHERE id = ? AND userId = ?')
      .run(now, notificationId, userId);

    return NextResponse.json({ success: true, message: 'Уведомление отмечено как прочитанное' });
  } catch (error: any) {
    console.error('[API] Error marking notification as read:', error);
    return NextResponse.json({ error: 'Не удалось отметить уведомление' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!notificationId || !userId) {
      return NextResponse.json({ error: 'id и userId требуются' }, { status: 400 });
    }

    const notification = db.prepare('SELECT * FROM Notification WHERE id = ?').get(notificationId) as any;

    if (!notification) {
      return NextResponse.json({ error: 'Уведомление не найдено' }, { status: 404 });
    }

    if (notification.userId !== userId) {
      return NextResponse.json({ error: 'Нет прав на удаление этого уведомления' }, { status: 403 });
    }

    db.prepare('DELETE FROM Notification WHERE id = ?').run(notificationId);

    return NextResponse.json({ success: true, message: 'Уведомление удалено' });
  } catch (error: any) {
    console.error('[API] Error deleting notification:', error);
    return NextResponse.json({ error: 'Не удалось удалить уведомление' }, { status: 500 });
  }
}
