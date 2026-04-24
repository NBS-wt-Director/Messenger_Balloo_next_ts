import { NextRequest, NextResponse } from 'next/server';
import { getNotificationsCollection } from '@/lib/database';

/**
 * API для получения уведомлений пользователя
 * GET /api/notifications?userId=USER_ID
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId требуется' },
        { status: 400 }
      );
    }

    const notificationsCollection = await getNotificationsCollection();
    const now = Date.now();

    // Построение запроса
    let query: any = {
      selector: {
        userId,
        expiresAt: { $gt: now } // Не истёкшие уведомления
      },
      sort: [{ createdAt: 'desc' }]
    };

    if (unreadOnly) {
      query.selector.read = false;
    }

    const notifications = await notificationsCollection
      .find(query)
      .limit(limit)
      .exec();

    const unreadCount = await notificationsCollection
      .count({
        selector: {
          userId,
          read: false,
          expiresAt: { $gt: now }
        }
      })
      .exec();

    return NextResponse.json({
      success: true,
      notifications: notifications.map(n => n.toJSON()),
      unreadCount,
      total: notifications.length
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching notifications:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить уведомления: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * API для отметки уведомления как прочитанного
 * PATCH /api/notifications/read
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, userId, markAll } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId требуется' },
        { status: 400 }
      );
    }

    const notificationsCollection = await getNotificationsCollection();

    if (markAll) {
      // Отметить все как прочитанные
      const unreadNotifications = await notificationsCollection.find({
        selector: {
          userId,
          read: false
        }
      }).exec();
      
      for (const notification of unreadNotifications) {
        await notification.patch({
          read: true,
          readAt: Date.now()
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Все уведомления отмечены как прочитанные'
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: 'notificationId требуется' },
        { status: 400 }
      );
    }

    const notification = await notificationsCollection.findOne({ selector: { id: notificationId } }).exec();

    if (!notification) {
      return NextResponse.json(
        { error: 'Уведомление не найдено' },
        { status: 404 }
      );
    }

    await notification.patch({
      read: true,
      readAt: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Уведомление отмечено как прочитанное'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error marking notification as read:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось отметить уведомление: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * API для удаления уведомления
 * DELETE /api/notifications
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!notificationId || !userId) {
      return NextResponse.json(
        { error: 'id и userId требуются' },
        { status: 400 }
      );
    }

    const notificationsCollection = await getNotificationsCollection();
    const notification = await notificationsCollection.findOne({ selector: { id: notificationId } }).exec();

    if (!notification) {
      return NextResponse.json(
        { error: 'Уведомление не найдено' },
        { status: 404 }
      );
    }

    // Проверка прав пользователя
    if (notification.userId !== userId) {
      return NextResponse.json(
        { error: 'Нет прав на удаление этого уведомления' },
        { status: 403 }
      );
    }

    await notification.remove();

    return NextResponse.json({
      success: true,
      message: 'Уведомление удалено'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting notification:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось удалить уведомление: ' + error.message },
      { status: 500 }
    );
  }
}
