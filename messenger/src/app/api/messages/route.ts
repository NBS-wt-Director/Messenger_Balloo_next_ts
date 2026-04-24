import { NextRequest, NextResponse } from 'next/server';
import { getMessagesCollection, getChatsCollection, getUsersCollection } from '@/lib/database';

/**
 * Создание уведомления через API
 */
async function createNotification(data: {
  userId: string;
  type: 'message' | 'invitation' | 'system' | 'call';
  title: string;
  body: string;
  url?: string;
  data?: Record<string, any>;
}) {
  try {
    const response = await fetch(new URL('/api/notifications/create', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      // Логирование только в development
      if (process.env.NODE_ENV === 'development') {
        console.error('[Notifications] API error:', error);
      }
    }

    return response.ok;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Notifications] Failed to create notification:', error);
    }
    return false;
  }
}

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

    const messagesCollection = await getMessagesCollection();
    
    let query = messagesCollection.find({
      selector: { chatId },
      sort: [{ createdAt: 'desc' }]
    });

    if (before) {
      query = messagesCollection.find({
        selector: { 
          chatId,
          createdAt: { $lt: parseInt(before) }
        },
        sort: [{ createdAt: 'desc' }]
      });
    }

    const messages = await query.limit(limit).exec();

    return NextResponse.json({
      success: true,
      messages: messages.map(m => m.toJSON()),
      hasMore: messages.length === limit
    });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[API] Error fetching messages:', error);
      }
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, senderId, type, content, mediaUrl, replyToId } = body;

    // Валидация
    if (!chatId || !senderId || !type || !content) {
      return NextResponse.json(
        { error: 'chatId, senderId, type и content являются обязательными' },
        { status: 400 }
      );
    }

    const messagesCollection = await getMessagesCollection();
    const chatsCollection = await getChatsCollection();

    // Проверка существования чата
    const chat = await chatsCollection.findOne({ selector: { id: chatId } }).exec();
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Проверка участия в чате
    const member = chat.members[senderId];
    if (!member) {
      return NextResponse.json(
        { error: 'You are not a member of this chat' },
        { status: 403 }
      );
    }

    // Проверка прав на отправку сообщений
    if (type !== 'system' && member.role === 'reader') {
      return NextResponse.json(
        { error: 'You do not have permission to send messages' },
        { status: 403 }
      );
    }

    // Получение replyToMessage если есть
    let replyToMessage = null;
    if (replyToId) {
      const messagesCollection = await getMessagesCollection();
      const replyTo = await messagesCollection.findOne({ selector: { id: replyToId } }).exec();
      if (replyTo) {
        const usersCollection = await getUsersCollection();
        const sender = await usersCollection.findOne({ selector: { id: replyTo.senderId } }).exec();
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
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const newMessage = await messagesCollection.insert({
      id: messageId,
      chatId,
      senderId,
      type,
      content,
      mediaUrl: mediaUrl || null,
      replyToId: replyToId || null,
      replyToMessage,
      reactions: {},
      readBy: [senderId],
      status: 'sent',
      edited: false,
      createdAt: now,
      updatedAt: now
    });

    // Обновление последнего сообщения в чате
    const chatDoc = await chatsCollection.findOne({ selector: { id: chatId } }).exec();
    if (chatDoc) {
      await chatDoc.patch({
        lastMessage: {
          id: messageId,
          content,
          type,
          createdAt: now,
          senderId
        },
        updatedAt: now
      });
    }

    // Отправка уведомлений участникам чата
    const participants = Object.keys(chat.members).filter(id => id !== senderId);
    for (const participantId of participants) {
      await createNotification({
        userId: participantId,
        type: 'message',
        title: senderId === 'system' ? 'Balloo' : 'Новое сообщение',
        body: content.substring(0, 100),
        url: `/chats/${chatId}`,
        data: { chatId, messageId, senderId }
      });

      // Увеличение счетчика непрочитанных
      const chatDoc = await chatsCollection.findOne({ selector: { id: chatId } }).exec();
      if (chatDoc) {
        const currentUnread = chatDoc.unreadCount?.[participantId] || 0;
        await chatDoc.patch({
          unreadCount: {
            ...chatDoc.unreadCount,
            [participantId]: currentUnread + 1
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: newMessage.toJSON(),
      createdAt: now
    });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[API] Error creating message:', error);
      }
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      );
    }
}

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

    const messagesCollection = await getMessagesCollection();
    const message = await messagesCollection.findOne({ selector: { id: messageId } }).exec();

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    await message.patch({
      content,
      edited: true,
      editedAt: Date.now(),
      updatedAt: Date.now()
    });

    return NextResponse.json({
      success: true,
      message: {
        id: messageId,
        content,
        edited: true,
        editedAt: Date.now()
      }
    });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[API] Error updating message:', error);
      }
      return NextResponse.json(
        { error: 'Failed to update message' },
        { status: 500 }
      );
    }
}

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

    const messagesCollection = await getMessagesCollection();
    const message = await messagesCollection.findOne({ selector: { id: messageId } }).exec();

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    await message.remove();

    return NextResponse.json({
      success: true,
      message: 'Message deleted'
    });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[API] Error deleting message:', error);
      }
      return NextResponse.json(
        { error: 'Failed to delete message' },
        { status: 500 }
      );
    }
}
