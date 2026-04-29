import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Получаем сообщения из Prisma
    const messages = await prisma.message.findMany({
      where: { chatId },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          }
        },
        reactions: true,
        replyTo: {
          select: {
            id: true,
            content: true,
            type: true,
            senderId: true,
          }
        }
      },
      take: limit,
      ...(before && {
        cursor: { createdAt: new Date(parseInt(before)) },
        skip: 1,
      }),
      orderBy: { createdAt: 'desc' },
    });

    // Преобразуем в формат, совместимый с клиентом
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      chatId: msg.chatId,
      senderId: msg.senderId,
      sender: msg.sender,
      type: msg.type,
      content: msg.content,
      mediaUrl: msg.mediaUrl,
      thumbnailUrl: msg.thumbnailUrl,
      fileName: msg.fileName,
      fileSize: msg.fileSize,
      mimeType: msg.mimeType,
      replyToId: msg.replyToId,
      replyTo: msg.replyTo,
      readBy: msg.readBy as string[],
      status: msg.status,
      reactions: msg.reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      reactionsCount: msg.reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      edited: msg.edited,
      createdAt: msg.createdAt.getTime(),
      updatedAt: msg.updatedAt.getTime(),
    }));

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
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
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { members: true }
    });

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Проверка участия в чате
    const member = chat.members.find(m => m.userId === senderId);
    if (!member) {
      return NextResponse.json(
        { error: 'You are not a member of this chat' },
        { status: 403 }
      );
    }

    // Получение replyToMessage если есть
    let replyToMessage = null;
    if (replyToId) {
      const replyTo = await prisma.message.findUnique({
        where: { id: replyToId },
        include: {
          sender: {
            select: {
              id: true,
              displayName: true,
            }
          }
        }
      });

      if (replyTo) {
        replyToMessage = {
          id: replyTo.id,
          content: replyTo.content,
          type: replyTo.type,
          senderId: replyTo.senderId,
          senderName: replyTo.sender.displayName || 'Unknown'
        };
      }
    }

    // Создание сообщения через Prisma
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        type,
        content,
        mediaUrl: mediaUrl || null,
        thumbnailUrl: null,
        fileName: fileName || null,
        fileSize: fileSize || null,
        mimeType: mimeType || null,
        replyToId: replyToId || null,
        readBy: [senderId],
        status: 'sent',
        edited: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          }
        },
        reactions: true,
        replyTo: replyToId ? {
          select: {
            id: true,
            content: true,
            type: true,
            senderId: true,
          }
        } : false,
      }
    });

    // Форматируем ответ
    const formattedMessage = {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      sender: message.sender,
      type: message.type,
      content: message.content,
      mediaUrl: message.mediaUrl,
      thumbnailUrl: message.thumbnailUrl,
      fileName: message.fileName,
      fileSize: message.fileSize,
      mimeType: message.mimeType,
      replyToId: message.replyToId,
      replyTo: replyToMessage,
      readBy: message.readBy as string[],
      status: message.status,
      reactions: {},
      reactionsCount: {},
      edited: message.edited,
      createdAt: message.createdAt.getTime(),
      updatedAt: message.updatedAt.getTime(),
    };

    // Обновляем lastMessage в чате
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      message: formattedMessage,
      createdAt: message.createdAt.getTime(),
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
        editedAt: updated.updatedAt.getTime(),
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

