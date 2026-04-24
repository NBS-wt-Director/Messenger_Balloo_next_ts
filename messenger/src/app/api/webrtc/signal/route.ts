import { NextRequest, NextResponse } from 'next/server';

/**
 * WebRTC Signaling API
 * Обмен SDP offer/answer и ICE candidates между клиентами
 */

interface SignalMessage {
  type: 'offer' | 'answer' | 'candidate';
  from: string;
  to: string;
  chatId: string;
  data?: any;
  timestamp: number;
}

// Временное хранилище сигнальных сообщений (в реальном приложении - WebSocket/Redis)
const signalMessages = new Map<string, SignalMessage[]>();

// POST - Отправка сигнального сообщения
export async function POST(request: NextRequest) {
  try {
    const body: SignalMessage = await request.json();
    const { type, from, to, chatId, data } = body;

    if (!type || !from || !to || !chatId) {
      return NextResponse.json(
        { error: 'type, from, to и chatId обязательны' },
        { status: 400 }
      );
    }

    const message: SignalMessage = {
      type,
      from,
      to,
      chatId,
      data,
      timestamp: Date.now()
    };

    // Сохранение сообщения для получателя
    const key = `signal_${to}_${chatId}`;
    const messages = signalMessages.get(key) || [];
    messages.push(message);
    signalMessages.set(key, messages);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[WebRTC] Signal ${type} from ${from} to ${to}`);
    }

    return NextResponse.json({
      success: true,
      messageId: `${type}_${Date.now()}`,
      timestamp: message.timestamp
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error sending signal:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось отправить сигнальное сообщение' },
      { status: 500 }
    );
  }
}

// GET - Получение сигнальных сообщений
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const chatId = searchParams.get('chatId');

    if (!userId || !chatId) {
      return NextResponse.json(
        { error: 'userId и chatId обязательны' },
        { status: 400 }
      );
    }

    const key = `signal_${userId}_${chatId}`;
    const messages = signalMessages.get(key) || [];

    // Очистка очереди после получения
    signalMessages.delete(key);

    return NextResponse.json({
      success: true,
      messages
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error getting signals:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить сигнальные сообщения' },
      { status: 500 }
    );
  }
}

// DELETE - Очистка сигнальных сообщений
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const chatId = searchParams.get('chatId');

    if (!userId || !chatId) {
      return NextResponse.json(
        { error: 'userId и chatId обязательны' },
        { status: 400 }
      );
    }

    const key = `signal_${userId}_${chatId}`;
    signalMessages.delete(key);

    return NextResponse.json({
      success: true,
      message: 'Сигнальные сообщения очищены'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error clearing signals:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось очистить сигнальные сообщения' },
      { status: 500 }
    );
  }
}
