import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { logger } from '@/lib/logger';

/**
 * POST /api/chats/[id]/pin - Закрепить/открепить чат
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId, pinned } = await request.json();
    const chatId = id;

    if (!userId) {
      return NextResponse.json({ error: 'userId обязателен' }, { status: 400 });
    }

    const db = await getDatabase();
    const chat = await db.chats.findOne(chatId).exec();

    if (!chat) {
      logger.warn(`[API] Чат не найден: ${chatId}`);
      return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });
    }

    const data = chat.toJSON();
    
    // Проверка лимита на 15 закреплённых чатов
    if (pinned) {
      const pinnedCount = Object.values(data.pinned || {}).filter(Boolean).length;
      if (pinnedCount >= 15) {
        return NextResponse.json(
          { error: 'Можно закрепить максимум 15 чатов' },
          { status: 400 }
        );
      }
    }

    await chat.patch({
      pinned: {
        ...data.pinned,
        [userId]: pinned
      },
      updatedAt: Date.now()
    });

    logger.info(`[API] Чат ${pinned ? 'закреплён' : 'откреплён'}: ${chatId}`);

    return NextResponse.json({ 
      success: true,
      pinned,
      chat: chat.toJSON()
    });
  } catch (error: any) {
    logger.error('[API] Error pinning chat:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при закреплении чата' },
      { status: 500 }
    );
  }
}
