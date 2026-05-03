import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

function getMessageById(id: string): any {
  return db.prepare('SELECT * FROM Message WHERE id = ?').get(id) as any || null;
}

function getChatById(id: string): any {
  return db.prepare('SELECT * FROM Chat WHERE id = ?').get(id) as any || null;
}

/**
 * POST /api/messages/forward - Пересылка сообщения
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, targetChatId, senderId } = body;

    if (!messageId || !targetChatId || !senderId) {
      return NextResponse.json(
        { error: 'Необходимо указать messageId, targetChatId и senderId' },
        { status: 400 }
      );
    }

    // Находим оригинальное сообщение
    const originalMessage = getMessageById(messageId);

    if (!originalMessage) {
      return NextResponse.json(
        { error: 'Сообщение не найдено' },
        { status: 404 }
      );
    }

    // Проверка участия в целевом чате
    const chatMember = db.prepare(`
      SELECT * FROM ChatMember WHERE chatId = ? AND userId = ?
    `).get(targetChatId, senderId);

    if (!chatMember) {
      return NextResponse.json(
        { error: 'Вы не участник этого чата' },
        { status: 403 }
      );
    }

    // Создаём пересланное сообщение
    const forwardedMessage = db.prepare(`
      INSERT INTO Message (id, chatId, userId, text, type, replyToId, attachmentId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      targetChatId,
      senderId,
      originalMessage.text,
      originalMessage.type,
      originalMessage.replyToId,
      originalMessage.attachmentId,
      new Date().toISOString()
    );

    return NextResponse.json({
      success: true,
      message: getMessageById(`msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error forwarding message:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при пересылке сообщения' },
      { status: 500 }
    );
  }
}
