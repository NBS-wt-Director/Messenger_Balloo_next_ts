import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    });

    if (!chat) {
      logger.warn(`[API] Чат не найден: ${chatId}`);
      return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });
    }

    // Удалить все сообщения чата
    const deleted = await prisma.message.deleteMany({
      where: { chatId }
    });

    // Обновить чат
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        updatedAt: new Date()
      }
    });

    logger.info(`[API] Чат очищен: ${chatId}, удалено сообщений: ${deleted.count}`);

    return NextResponse.json({ 
      success: true,
      deletedCount: deleted.count
    });
  } catch (error: any) {
    logger.error('[API] Error clearing chat:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при очистке чата' },
      { status: 500 }
    );
  }
}
