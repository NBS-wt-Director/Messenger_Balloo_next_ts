import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const originalMessage = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!originalMessage) {
      return NextResponse.json(
        { error: 'Сообщение не найдено' },
        { status: 404 }
      );
    }

    // Проверка участия в целевом чате
    const chatMember = await prisma.chatMember.findFirst({
      where: {
        chatId: targetChatId,
        userId: senderId
      }
    });

    if (!chatMember) {
      return NextResponse.json(
        { error: 'Вы не участник этого чата' },
        { status: 403 }
      );
    }

    // Создаём пересланное сообщение
    const forwardedMessage = await prisma.message.create({
      data: {
        chatId: targetChatId,
        senderId,
        type: originalMessage.type,
        content: originalMessage.content,
        mediaUrl: originalMessage.mediaUrl,
        thumbnailUrl: originalMessage.thumbnailUrl,
        fileName: originalMessage.fileName,
        fileSize: originalMessage.fileSize,
        mimeType: originalMessage.mimeType,
        replyToId: originalMessage.replyToId,
        readBy: [senderId],
        status: 'sent',
        edited: false,
        forwardFromId: originalMessage.id,
        forwardFromChatId: originalMessage.chatId,
      }
    });

    return NextResponse.json({
      success: true,
      message: {
        id: forwardedMessage.id,
        chatId: forwardedMessage.chatId,
        senderId: forwardedMessage.senderId,
        type: forwardedMessage.type,
        content: forwardedMessage.content,
        mediaUrl: forwardedMessage.mediaUrl,
        createdAt: Number(forwardedMessage.createdAt),
        forwardFromId: forwardedMessage.forwardFromId,
        forwardFromChatId: forwardedMessage.forwardFromChatId,
      }
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
