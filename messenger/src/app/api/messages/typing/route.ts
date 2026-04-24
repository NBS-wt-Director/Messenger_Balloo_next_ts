import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Хранилище состояния набора текста (в памяти, для production использовать Redis)
const typingState = new Map<string, { userId: string; timestamp: number }>();

/**
 * POST /api/messages/typing - Отправить индикатор набора текста
 */
export async function POST(request: NextRequest) {
  try {
    const { chatId, userId, isTyping } = await request.json();

    if (!chatId || !userId) {
      return NextResponse.json(
        { error: 'chatId и userId обязательны' },
        { status: 400 }
      );
    }

    const key = `typing:${chatId}:${userId}`;

    if (isTyping) {
      // Устанавливаем состояние "печатает"
      typingState.set(key, {
        userId,
        timestamp: Date.now()
      });

      // Очищаем через 5 секунд автоматически
      setTimeout(() => {
        typingState.delete(key);
      }, 5000);

      logger.debug(`[Typing] User ${userId} is typing in chat ${chatId}`);
    } else {
      // Сбрасываем состояние
      typingState.delete(key);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('[API] Error sending typing indicator:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при отправке индикатора' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/messages/typing - Получить состояние набора текста в чате
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json(
        { error: 'chatId обязателен' },
        { status: 400 }
      );
    }

    // Находим всех пользователей, которые печатают в этом чате
    const typingUsers: string[] = [];
    const now = Date.now();

    for (const [key, value] of typingState.entries()) {
      if (key.startsWith(`typing:${chatId}:`)) {
        // Проверяем, не истекло ли время (5 секунд)
        if (now - value.timestamp < 5000) {
          typingUsers.push(value.userId);
        } else {
          // Очищаем устаревшие записи
          typingState.delete(key);
        }
      }
    }

    return NextResponse.json({
      success: true,
      typingUsers,
      count: typingUsers.length
    });
  } catch (error: any) {
    logger.error('[API] Error getting typing state:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении состояния' },
      { status: 500 }
    );
  }
}
