import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { logger } from '@/lib/logger';

function getChatById(id: string): any {
  return db.prepare('SELECT * FROM Chat WHERE id = ?').get(id) as any || null;
}

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

    const chat = getChatById(chatId);

    if (!chat) {
      logger.warn(`[API] Чат не найден: ${chatId}`);
      return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });
    }

    // Удалить все сообщения чата
    const deleted = db.prepare('SELECT COUNT(*) as count FROM Message WHERE chatId = ?').get(chatId) as any;
    db.prepare('DELETE FROM Message WHERE chatId = ?').run(chatId);

    // Обновить чат
    db.prepare('UPDATE Chat SET updatedAt = ? WHERE id = ?').run(new Date().toISOString(), chatId);

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
