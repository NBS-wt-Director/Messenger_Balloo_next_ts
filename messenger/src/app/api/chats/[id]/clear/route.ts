import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { logger } from '@/lib/logger';

/**
 * POST /api/chats/[id]/clear - Очистить чат (удалить все сообщения)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = await request.json();
    const chatId = id;

    if (!userId) {
      return NextResponse.json({ error: 'userId обязателен' }, { status: 400 });
    }

    // SQLite db уже доступен
    const chat = await db.chats.findOne(chatId).exec();

    if (!chat) {
      logger.warn(`[API] Чат не найден: ${chatId}`);
      return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });
    }

    const messagesCollection = db.messages;

    // Найти все сообщения чата
    const messages = await messagesCollection.find({
      selector: { chatId }
    }).exec();

    // Удалить все сообщения
    let deletedCount = 0;
    for (const msg of messages) {
      await msg.remove();
      deletedCount++;
    }

    // Обновить lastMessage в чате
    await chat.patch({
      lastMessage: {
        id: '',
        content: 'Чат очищен',
        type: 'system',
        createdAt: Date.now()
      },
      updatedAt: Date.now()
    });

    logger.info(`[API] Чат очищен: ${chatId}, удалено сообщений: ${deletedCount}`);

    return NextResponse.json({ 
      success: true,
      deletedCount
    });
  } catch (error: any) {
    logger.error('[API] Error clearing chat:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при очистке чата' },
      { status: 500 }
    );
  }
}
