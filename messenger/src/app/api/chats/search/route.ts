import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * GET /api/chats/search?q=...&userId=...&limit=20
 * Поиск по чатам пользователя
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
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

    // Получаем все чаты пользователя
    const userChats = db.prepare('SELECT chatId FROM ChatMember WHERE userId = ?').all(userId) as any[];
    const userChatIds = userChats.map((m: any) => m.chatId);

    if (userChatIds.length === 0) {
      return NextResponse.json({
        success: true,
        chats: [],
        total: 0
      });
    }

    // Поиск по чатам
    const chatIdsStr = userChatIds.map(() => '?').join(',');
    const chats = db.prepare(`
      SELECT c.*, 
             (SELECT userId FROM ChatMember WHERE chatId = c.id AND userId != ? LIMIT 1) as otherUserId
      FROM Chat c
      WHERE c.id IN (${chatIdsStr})
      AND (c.name LIKE ? OR c.description LIKE ?)
      LIMIT ?
    `).all(userId, ...userChatIds, `%${query}%`, `%${query}%`, limit) as any[];

    // Форматирование результатов
    const formattedChats = chats.map((chat: any) => {
      const lastMessage = db.prepare(`
        SELECT m.*, u.displayName as senderName
        FROM Message m
        JOIN User u ON m.userId = u.id
        WHERE m.chatId = ?
        ORDER BY m.createdAt DESC
        LIMIT 1
      `).get(chat.id);

      let chatName = chat.name;
      if (chat.type === 'private' && !chatName) {
        const otherMember = db.prepare('SELECT u.displayName FROM ChatMember cm JOIN User u ON cm.userId = u.id WHERE cm.chatId = ? AND cm.userId != ?').get(chat.id, userId);
        chatName = otherMember?.displayName || 'Пользователь';
      }

      return {
        id: chat.id,
        type: chat.type,
        name: chatName,
        avatar: chat.avatar,
        description: chat.description,
        participants: [],
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.text,
          type: lastMessage.type,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.userId,
          senderName: lastMessage.senderName,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      chats: formattedChats,
      total: formattedChats.length,
      hasMore: false
    });
  } catch (error) {
    console.error('[Chats Search] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске чатов' },
      { status: 500 }
    );
  }
}
