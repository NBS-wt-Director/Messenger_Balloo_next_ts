import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * GET /api/chats?userId=xxx
 * Получение списка чатов пользователя
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const favorite = searchParams.get('favorite') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Получаем все чаты где пользователь участник
    let query = `
      SELECT c.*, cm.role
      FROM Chat c
      JOIN ChatMember cm ON c.id = cm.chatId
      WHERE cm.userId = ?
    `;
    const params: any[] = [userId];

    if (type) {
      query += ' AND c.type = ?';
      params.push(type);
    }

    const chatMemberships = db.prepare(query).all(...params);

    // Также добавляем системные чаты где пользователь ещё не член (новости)
    const systemChatsQuery = `
      SELECT c.*, 'reader' as role
      FROM Chat c
      WHERE c.isSystemChat = 1
      AND c.id NOT IN (SELECT chatId FROM ChatMember WHERE userId = ?)
    `;
    const additionalChats = db.prepare(systemChatsQuery).all(userId);

    // Объединяем списки
    const allChats = [...chatMemberships, ...additionalChats];

    // Получаем детали для каждого чата
    const chats = allChats.map((member: any) => {
      const chat = member;
      
      // Получаем участников
      const members = db.prepare('SELECT userId, role FROM ChatMember WHERE chatId = ?').all(chat.id);
      
      // Получаем последнее сообщение
      const lastMessageRaw = db.prepare(`
        SELECT m.*, u.displayName as senderName
        FROM Message m
        JOIN User u ON m.userId = u.id
        WHERE m.chatId = ?
        ORDER BY m.createdAt DESC
        LIMIT 1
      `).get(chat.id);

      let chatName = chat.name;
      if (chat.type === 'private' && !chatName) {
        // Для частного чата - проверить это "Избранное"
        const isNotesChat = chat.isSystemChat && chat.createdBy === userId;
        if (isNotesChat) {
          chatName = 'Избранное';
        } else {
          const otherMember = members.find((m: any) => m.userId !== userId);
          if (otherMember) {
            const user = db.prepare('SELECT displayName FROM User WHERE id = ?').get(otherMember.userId);
            chatName = user?.displayName || 'Пользователь';
          }
        }
      }

      return {
        id: chat.id,
        type: chat.type,
        name: chatName,
        avatar: chat.avatar,
        isSystemChat: !!chat.isSystemChat,
        participants: members.map((m: any) => m.userId),
        members: members.reduce((acc: any, m: any) => {
          acc[m.userId] = m.role;
          return acc;
        }, {}),
        createdBy: chat.createdBy,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        lastMessage: lastMessageRaw ? {
          id: lastMessageRaw.id,
          content: lastMessageRaw.text,
          type: lastMessageRaw.type,
          createdAt: lastMessageRaw.createdAt,
          senderId: lastMessageRaw.userId,
          senderName: lastMessageRaw.senderName,
        } : null,
        isFavorite: false,
        pinned: false,
        unreadCount: 0,
      };
    });

    return NextResponse.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('[API Chats GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chats
 * Создание нового чата
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, participants, name, createdBy } = body;

    // Валидация
    if (!type || !participants || !createdBy) {
      return NextResponse.json(
        { error: 'type, participants и createdBy являются обязательными' },
        { status: 400 }
      );
    }

    if (type === 'group' && !name) {
      return NextResponse.json(
        { error: 'name required for group chats' },
        { status: 400 }
      );
    }

    // Для private чата - проверить существующий
    if (type === 'private' && participants.length === 2) {
      const sortedParticipants = [...participants].sort();
      const existingChat = db.prepare(`
        SELECT c.* FROM Chat c
        JOIN ChatMember cm1 ON c.id = cm1.chatId
        JOIN ChatMember cm2 ON c.id = cm2.chatId
        WHERE c.type = 'private'
        AND cm1.userId = ? AND cm2.userId = ?
        LIMIT 1
      `).get(sortedParticipants[0], sortedParticipants[1]);

      if (existingChat) {
        return NextResponse.json({
          success: true,
          chat: { id: existingChat.id },
          exists: true
        });
      }
    }

    // Создание чата
    const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO Chat (id, type, name, createdBy, isSystemChat, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `).run(chatId, type, name || null, createdBy, now, now);

    // Добавляем участников
    participants.forEach((userId: string, index: number) => {
      db.prepare(`
        INSERT INTO ChatMember (chatId, userId, role, joinedAt)
        VALUES (?, ?, ?, ?)
      `).run(chatId, userId, index === 0 ? 'creator' : 'reader', now);
    });

    return NextResponse.json({
      success: true,
      chat: { id: chatId },
      chatId
    });
  } catch (error) {
    console.error('[API Chats POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}

