import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

/**
 * POST /api/statuses - Создание статуса
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, content, mediaUrl, thumbnailUrl, duration = 24 } = body;

    if (!userId || !content) {
      return NextResponse.json(
        { error: 'Необходимо указать userId и content' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const statusesCollection = db.statuses || await createStatusesCollection(db);

    const statusId = `status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const expiresAt = now + (duration * 60 * 60 * 1000); // часов в миллисекундах

    await statusesCollection.insert({
      id: statusId,
      userId,
      type: type || 'text', // text, image, video
      content,
      mediaUrl: mediaUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      views: [],
      isActive: true,
      createdAt: now,
      expiresAt
    });

    return NextResponse.json({
      success: true,
      statusId,
      expiresAt,
      message: 'Статус успешно создан'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error creating status:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при создании статуса' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/statuses - Получение статусов
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'Необходимо указать userId' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const statusesCollection = db.statuses || await createStatusesCollection(db);

    let query: any = {
      selector: {
        userId
      },
      sort: [{ createdAt: 'desc' }]
    };

    if (activeOnly) {
      query.selector.isActive = true;
      query.selector.expiresAt = { $gt: Date.now() };
    }

    const statuses = await statusesCollection.find(query).exec();

    return NextResponse.json({
      success: true,
      statuses: statuses.map((s: any) => s.toJSON())
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error getting statuses:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении статусов' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/statuses - Удаление статуса
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { statusId } = body;

    if (!statusId) {
      return NextResponse.json(
        { error: 'Необходимо указать statusId' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const statusesCollection = db.statuses || await createStatusesCollection(db);

    const status = await statusesCollection.findOne({
      selector: { id: statusId }
    }).exec();

    if (!status) {
      return NextResponse.json(
        { error: 'Статус не найден' },
        { status: 404 }
      );
    }

    await status.remove();

    return NextResponse.json({
      success: true,
      message: 'Статус успешно удалён'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting status:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при удалении статуса' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/statuses/view - Отметка о просмотре статуса
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { statusId, viewerId } = body;

    if (!statusId || !viewerId) {
      return NextResponse.json(
        { error: 'Необходимо указать statusId и viewerId' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const statusesCollection = db.statuses || await createStatusesCollection(db);

    const status = await statusesCollection.findOne({
      selector: { id: statusId }
    }).exec();

    if (!status) {
      return NextResponse.json(
        { error: 'Статус не найден' },
        { status: 404 }
      );
    }

    const statusData = status.toJSON();
    
    // Добавляем просмотр если ещё не смотрели
    if (!statusData.views.includes(viewerId)) {
      const updatedViews = [...statusData.views, viewerId];
      
      await status.atomicUpdate(() => ({
        ...statusData,
        views: updatedViews
      }));
    }

    return NextResponse.json({
      success: true,
      viewsCount: statusData.views.length + (statusData.views.includes(viewerId) ? 0 : 1),
      message: 'Просмотр записан'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error recording status view:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при записи просмотра' },
      { status: 500 }
    );
  }
}

// Вспомогательная функция для создания коллекции statuses
async function createStatusesCollection(db: any) {
  const schema = {
    title: 'Status Schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string' },
      type: { type: 'string', enum: ['text', 'image', 'video'] },
      content: { type: 'string' },
      mediaUrl: { type: ['string', 'null'] },
      thumbnailUrl: { type: ['string', 'null'] },
      views: { type: 'array', items: { type: 'string' } },
      isActive: { type: 'boolean' },
      createdAt: { type: 'number' },
      expiresAt: { type: 'number' }
    },
    required: ['id', 'userId', 'content', 'views', 'isActive', 'createdAt', 'expiresAt']
  };

  await db.addCollections({
    statuses: { schema: schema as any }
  });

  return db.statuses;
}
