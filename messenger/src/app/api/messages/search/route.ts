import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * GET /api/messages/search?q=...&chatId=...&userId=...&limit=20
 * Поиск по сообщениям
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const chatId = searchParams.get('chatId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 1) {
      return NextResponse.json(
        { error: 'Поисковый запрос обязателен' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId обязателен' },
        { status: 400 }
      );
    }

    // Проверка участия пользователя в чате (если указан chatId)
    if (chatId) {
      const member = db.prepare('SELECT * FROM ChatMember WHERE chatId = ? AND userId = ?').get(chatId, userId);

      if (!member) {
        return NextResponse.json(
          { error: 'У вас нет доступа к этому чату' },
          { status: 403 }
        );
      }
    }

    // Поиск сообщений
    let params: any[] = [`%${query}%`];
    let whereClause = 'WHERE m.text LIKE ?';

    if (chatId) {
      whereClause += ' AND m.chatId = ?';
      params.push(chatId);
    } else {
      const userChats = db.prepare('SELECT chatId FROM ChatMember WHERE userId = ?').all(userId) as any[];
      const userChatIds = userChats.map((c: any) => c.chatId);
      
      if (userChatIds.length === 0) {
        return NextResponse.json({
          success: true,
          messages: [],
          total: 0,
          hasMore: false
        });
      }
      
      const chatIdsStr = userChatIds.map(() => '?').join(',');
      whereClause += ` AND m.chatId IN (${chatIdsStr})`;
      params.push(...userChatIds);
    }

    const messagesRaw = db.prepare(`
      SELECT m.*, c.type as chatType, c.name as chatName, c.avatar as chatAvatar,
             u.displayName as senderDisplayName, u.avatar as senderAvatar
      FROM Message m
      JOIN Chat c ON m.chatId = c.id
      JOIN User u ON m.userId = u.id
      ${whereClause}
      ORDER BY m.createdAt DESC
      LIMIT ?
    `).run(...params, limit) as any[];

    const messages = messagesRaw.map((msg: any) => ({
      id: msg.id,
      chatId: msg.chatId,
      senderId: msg.userId,
      sender: {
        id: msg.userId,
        displayName: msg.senderDisplayName,
        avatar: msg.senderAvatar,
      },
      type: msg.type,
      content: msg.text,
      mediaUrl: msg.attachmentId,
      createdAt: msg.createdAt,
      chat: {
        id: msg.chatId,
        type: msg.chatType,
        name: msg.chatName,
        avatar: msg.chatAvatar,
      },
    }));

    return NextResponse.json({
      success: true,
      messages,
      total: messages.length,
      hasMore: false
    });
  } catch (error) {
    console.error('[Message Search] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске сообщений' },
      { status: 500 }
    );
  }
}
