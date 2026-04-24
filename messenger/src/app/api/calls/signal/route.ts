import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

/**
 * POST /api/calls/signal - Отправка WebRTC сигнала
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      callId,
      fromUserId, 
      toUserId, 
      type, // 'offer' | 'answer' | 'candidate'
      signal // SDP или ICE candidate
    } = body;

    if (!fromUserId || !toUserId || !type || !signal) {
      return NextResponse.json(
        { error: 'Необходимо указать fromUserId, toUserId, type и signal' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const callsCollection = db.calls || await createCallsCollection(db);

    const callData = {
      id: callId || `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId,
      toUserId,
      type,
      signal,
      status: 'pending',
      createdAt: Date.now()
    };

    await callsCollection.insert(callData);

    // В реальном приложении здесь было бы WebSocket уведомление
    // Для демонстрации возвращаем данные

    return NextResponse.json({
      success: true,
      callId: callData.id,
      message: 'Сигнал отправлен'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error sending WebRTC signal:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при отправке сигнала' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/calls/signal - Получение сигналов для пользователя
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const callId = searchParams.get('callId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Необходимо указать userId' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const callsCollection = db.calls || await createCallsCollection(db);

    let query: any = {
      selector: {
        toUserId: userId
      },
      sort: [{ createdAt: 'desc' }]
    };

    if (callId) {
      query.selector.id = callId;
    }

    const calls = await callsCollection.find(query).exec();

    return NextResponse.json({
      success: true,
      calls: calls.map((c: any) => c.toJSON())
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error getting calls:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении звонков' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/calls/signal - Обновление статуса звонка
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId, status } = body;

    if (!callId || !status) {
      return NextResponse.json(
        { error: 'Необходимо указать callId и status' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'accepted', 'rejected', 'ended', 'missed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Недопустимый статус' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const callsCollection = db.calls || await createCallsCollection(db);

    const call = await callsCollection.findOne({
      selector: { id: callId }
    }).exec();

    if (!call) {
      return NextResponse.json(
        { error: 'Звонок не найден' },
        { status: 404 }
      );
    }

    const callData = call.toJSON();

    await call.atomicUpdate(() => ({
      ...callData,
      status,
      updatedAt: Date.now()
    }));

    return NextResponse.json({
      success: true,
      message: 'Статус звонка обновлён'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error updating call status:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при обновлении статуса' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/calls/signal - Удаление звонка
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId } = body;

    if (!callId) {
      return NextResponse.json(
        { error: 'Необходимо указать callId' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const callsCollection = db.calls || await createCallsCollection(db);

    const call = await callsCollection.findOne({
      selector: { id: callId }
    }).exec();

    if (!call) {
      return NextResponse.json(
        { error: 'Звонок не найден' },
        { status: 404 }
      );
    }

    await call.remove();

    return NextResponse.json({
      success: true,
      message: 'Звонок удалён'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting call:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при удалении звонка' },
      { status: 500 }
    );
  }
}

// Вспомогательная функция для создания коллекции calls
async function createCallsCollection(db: any) {
  const schema = {
    title: 'Call Schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
      id: { type: 'string' },
      fromUserId: { type: 'string' },
      toUserId: { type: 'string' },
      type: { type: 'string', enum: ['offer', 'answer', 'candidate'] },
      signal: { type: 'object' },
      status: { type: 'string', enum: ['pending', 'accepted', 'rejected', 'ended', 'missed'] },
      createdAt: { type: 'number' },
      updatedAt: { type: 'number' }
    },
    required: ['id', 'fromUserId', 'toUserId', 'type', 'signal', 'status', 'createdAt']
  };

  await db.addCollections({
    calls: { schema: schema as any }
  });

  return db.calls;
}
