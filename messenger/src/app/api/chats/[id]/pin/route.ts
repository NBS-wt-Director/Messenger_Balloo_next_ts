import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database.js';
import { logger } from '@/lib/logger';

function getChatById(id: string): any {
  return db.prepare('SELECT * FROM Chat WHERE id = ?').get(id) as any || null;
}

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

    const chat = getChatById(chatId);

    if (!chat) {
      logger.warn(`[API] Чат не найден: ${chatId}`);
      return NextResponse.json({ error: 'Чат не найден' }, { status: 404 });
    }

    const data = JSON.parse(chat.pinned || '{}');
    
    // Проверка лимита на 15 закреплённых чатов
    if (pinned) {
      const pinnedCount = Object.values(data).filter(Boolean).length;
      if (pinnedCount >= 15) {
        return NextResponse.json(
          { error: 'Можно закрепить максимум 15 чатов' },
          { status: 400 }
        );
      }
    }
    
    data[userId] = pinned;

    db.prepare('UPDATE Chat SET pinned = ?, updatedAt = ? WHERE id = ?')
      .run(JSON.stringify(data), new Date().toISOString(), chatId);

    logger.info(`[API] Чат ${pinned ? 'закреплён' : 'откреплён'}: ${chatId}`);

    return NextResponse.json({ 
      success: true,
      pinned
    });
  } catch (error: any) {
    logger.error('[API] Error pinning chat:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при закреплении чата' },
      { status: 500 }
    );
  }
}
