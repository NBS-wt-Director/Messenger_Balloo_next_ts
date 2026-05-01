import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * GET /api/messages?chatId=xxx&limit=50&before=timestamp
 * Получение сообщений чата
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before');

    if (!chatId) {
      return NextResponse.json(
        { error: 'chatId is required' },
        { status: 400 }
      );
    }

    // Получаем сообщения
    let query = `
      SELECT m.*, 
             u.displayName as senderDisplayName, u.avatar as senderAvatar,
             replyTo.content as replyToContent, replyTo.type as replyToType, replyTo.senderId as replyToSenderId
      FROM Message m
      JOIN User u ON m.userId = u.id
      LEFT JOIN Message replyTo ON m.replyToId = replyTo.id
      WHERE m.chatId = ?
    `;
    const params: any[] = [chatId];

    if (before) {
      query += ' AND m.createdAt < datetime(?)';
      params.push(new Date(parseInt(before)).toISOString());
    }

    query += ' ORDER BY m.createdAt DESC LIMIT ?';
    params.push(limit);

    const messagesRaw = db.prepare(query).all(...params);

    // Получаем реакции для каждого сообщения
    const messages = messagesRaw.map((msg: any) => {
      const reactionsRaw = db.prepare('SELECT emoji FROM MessageReaction WHERE messageId = ?').all(msg.id);
      const reactions: Record<string, number> = {};
      reactionsRaw.forEach((r: any) => {
        reactions[r.emoji] = (reactions[r.emoji] || 0) + 1;
      });

      return {
        id: msg.id,
        chatId: msg.chatId,
        senderId: msg.userId,
        sender: {
          id: msg.userId,
          displayName: msg.senderDisplayName,
          avatar: msg.senderAvatar,
        },
        type: msg.type || 'text',
        content: msg.text,
        mediaUrl: msg.attachmentId,
        thumbnailUrl: null,
        fileName: null,
        fileSize: null,
        mimeType: null,
        replyToId: msg.replyToId,
        replyTo: msg.replyToContent ? {
          id: msg.replyToId,
          content: msg.replyToContent,
          type: msg.replyToType,
          senderId: msg.replyToSenderId,
        } : null,
        readBy: [msg.userId],
        status: 'sent',
        reactions,
        reactionsCount: reactions,
        edited: false,
        createdAt: msg.createdAt,
        updatedAt: msg.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        page: 1,
        limit,
        hasMore: messages.length === limit,
      }
    });
  } catch (error) {
    console.error('[API Messages GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 * Создание нового сообщения
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, senderId, type, content, mediaUrl, replyToId, fileName, fileSize, mimeType } = body;

    // Валидация
    if (!chatId || !senderId || !type || !content) {
      return NextResponse.json(
        { error: 'chatId, senderId, type и content являются обязательными' },
        { status: 400 }
      );
    }

    // Проверка существования чата
    const chat = db.prepare('SELECT * FROM Chat WHERE id = ?').get(chatId);

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Проверка участия в чате
    const member = db.prepare('SELECT * FROM ChatMember WHERE chatId = ? AND userId = ?').get(chatId, senderId);
    if (!member) {
      return NextResponse.json(
        { error: 'You are not a member of this chat' },
        { status: 403 }
      );
    }

    // Получение replyToMessage если есть
    let replyToMessage = null;
    if (replyToId) {
      const replyTo = db.prepare('SELECT id, text as content, type, userId as senderId FROM Message WHERE id = ?').get(replyToId);
      if (replyTo) {
        const sender = db.prepare('SELECT displayName FROM User WHERE id = ?').get(replyTo.userId);
        replyToMessage = {
          id: replyTo.id,
          content: replyTo.content,
          type: replyTo.type,
          senderId: replyTo.senderId,
          senderName: sender?.displayName || 'Unknown'
        };
      }
    }

    // Создание сообщения
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO Message (id, chatId, userId, text, replyToId, attachmentId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(messageId, chatId, senderId, content, replyToId || null, mediaUrl || null, createdAt);

    // Получаем созданное сообщение
    const message = db.prepare(`
      SELECT m.*, u.displayName as senderDisplayName, u.avatar as senderAvatar
      FROM Message m
      JOIN User u ON m.userId = u.id
      WHERE m.id = ?
    `).get(messageId);

    // Форматируем ответ
    const formattedMessage = {
      id: message.id,
      chatId: message.chatId,
      senderId: message.userId,
      sender: {
        id: message.userId,
        displayName: message.senderDisplayName,
        avatar: message.senderAvatar,
      },
      type: message.type || 'text',
      content: message.text,
      mediaUrl: message.attachmentId,
      thumbnailUrl: null,
      fileName: null,
      fileSize: null,
      mimeType: null,
      replyToId: message.replyToId,
      replyTo: replyToMessage,
      readBy: [senderId],
      status: 'sent',
      reactions: {},
      reactionsCount: {},
      edited: false,
      createdAt,
      updatedAt: createdAt,
    };

    // Обновляем updatedAt в чате
    db.prepare('UPDATE Chat SET updatedAt = ? WHERE id = ?').run(createdAt, chatId);

    return NextResponse.json({
      success: true,
      message: formattedMessage,
      createdAt,
    });
  } catch (error) {
    console.error('[API Messages POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/messages
 * Редактирование сообщения
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, content } = body;

    if (!messageId || !content) {
      return NextResponse.json(
        { error: 'messageId и content являются обязательными' },
        { status: 400 }
      );
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        edited: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: updated.id,
        content: updated.content,
        edited: true,
        editedAt: Number(updated.updatedAt),
      }
    });
  } catch (error) {
    console.error('[API Messages PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/messages?messageId=xxx
 * Удаление сообщения
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId is required' },
        { status: 400 }
      );
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    await prisma.message.delete({
      where: { id: messageId }
    });

    return NextResponse.json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    console.error('[API Messages DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

