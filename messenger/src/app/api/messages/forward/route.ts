import { NextRequest, NextResponse } from 'next/server';
import { getMessagesCollection } from '@/lib/database';

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

    const messagesCollection = await getMessagesCollection();

    // Находим оригинальное сообщение
    const originalMessage = await messagesCollection.findOne({
      selector: { id: messageId }
    }).exec();

    if (!originalMessage) {
      return NextResponse.json(
        { error: 'Сообщение не найдено' },
        { status: 404 }
      );
    }

    const messageData = originalMessage.toJSON();

    // Проверка доступа к оригинальному сообщению
    // В реальном приложении нужно проверять права доступа
    // Если сообщение зашифровано, нужна расшифровка

    // Создаём пересланное сообщение
    const newMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const forwardedMessage = await messagesCollection.insert({
      id: newMessageId,
      chatId: targetChatId,
      senderId,
      type: messageData.type,
      content: messageData.content,
      mediaUrl: messageData.mediaUrl,
      thumbnailUrl: messageData.thumbnailUrl,
      fileName: messageData.fileName,
      fileSize: messageData.fileSize,
      mimeType: messageData.mimeType,
      replyToId: messageData.replyToId,
      // Индикация пересланного сообщения
      forwardFromId: messageData.id,
      forwardFromChatId: messageData.chatId,
      forwardFrom: {
        senderId: messageData.senderId,
        chatId: messageData.chatId,
        content: messageData.content,
        type: messageData.type
      },
      readBy: [senderId],
      status: 'sent',
      edited: false,
      reactions: {},
      createdAt: now,
      updatedAt: now
    });

    return NextResponse.json({
      success: true,
      message: forwardedMessage.toJSON()
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

