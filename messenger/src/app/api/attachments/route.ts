import { NextRequest, NextResponse } from 'next/server';
import { getAttachmentsCollection, getMessagesCollection, getChatsCollection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const chatId = searchParams.get('chatId');

    const attachmentsCollection = await getAttachmentsCollection();
    
    let query;
    if (messageId) {
      query = attachmentsCollection.find({
        selector: { messageId },
        sort: [{ createdAt: 'desc' }]
      });
    } else if (chatId) {
      query = attachmentsCollection.find({
        selector: { chatId },
        sort: [{ createdAt: 'desc' }]
      });
    } else {
      return NextResponse.json(
        { error: 'messageId или chatId требуется' },
        { status: 400 }
      );
    }

    const attachments = await query.exec();

    return NextResponse.json({
      success: true,
      attachments: attachments.map(a => a.toJSON())
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching attachments:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить вложения' },
      { status: 500 }
    );
  }
}

// Загрузка вложения (имитация)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const messageId = formData.get('messageId') as string;
    const chatId = formData.get('chatId') as string;
    const uploaderId = formData.get('uploaderId') as string;

    if (!file || !messageId || !chatId || !uploaderId) {
      return NextResponse.json(
        { error: 'file, messageId, chatId и uploaderId обязательны' },
        { status: 400 }
      );
    }

    // Проверка существования сообщения
    const messagesCollection = await getMessagesCollection();
    const message = await messagesCollection.findOne(messageId).exec();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Сообщение не найдено' },
        { status: 404 }
      );
    }

    // Проверка чата
    const chatsCollection = await getChatsCollection();
    const chat = await chatsCollection.findOne(chatId).exec();
    
    if (!chat || !chat.participants.includes(uploaderId)) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    // Генерация ID вложения
    const attachmentId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const fileExt = file.name.split('.').pop() || 'file';
    
    // Имитация загрузки на Яндекс.Диск
    const fileUrl = `/uploads/${uploaderId}/${attachmentId}.${fileExt}`;
    const thumbnailUrl = file.type.startsWith('image/') ? `${fileUrl}?thumb` : null;

    // Получение размеров для изображений
    let width: number | null = null;
    let height: number | null = null;

    if (file.type.startsWith('image/')) {
      try {
        const img = await createImageBitmap(file);
        width = img.width;
        height = img.height;
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error getting image dimensions:', e);
        }
      }
    }

    // Создание записи о вложении
    const attachmentsCollection = await getAttachmentsCollection();
    const attachment = await attachmentsCollection.insert({
      id: attachmentId,
      messageId,
      chatId,
      uploaderId,
      fileName: file.name,
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      url: fileUrl,
      thumbnailUrl,
      width,
      height,
      duration: null,
      status: 'ready',
      yandexDiskId: null,
      createdAt: now,
      updatedAt: now
    });

    // Обновление сообщения
    const msgDoc = await messagesCollection.findOne({ selector: { id: messageId } }).exec();
    if (msgDoc) {
      await msgDoc.patch({
        mediaUrl: fileUrl,
        thumbnailUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        type: file.type.startsWith('image/') ? 'image' :
              file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'audio' : 'document',
        updatedAt: now
      });
    }

    return NextResponse.json({
      success: true,
      attachment: attachment.toJSON(),
      uploadTime: now
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error uploading attachment:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось загрузить вложение' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get('attachmentId');

    if (!attachmentId) {
      return NextResponse.json(
        { error: 'attachmentId требуется' },
        { status: 400 }
      );
    }

    const attachmentsCollection = await getAttachmentsCollection();
    const attachment = await attachmentsCollection.findOne({ selector: { id: attachmentId } }).exec();

    if (!attachment) {
      return NextResponse.json(
        { error: 'Вложение не найдено' },
        { status: 404 }
      );
    }

    // Удаление вложения
    await attachment.remove();

    return NextResponse.json({
      success: true,
      message: 'Вложение удалено'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting attachment:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось удалить вложение' },
      { status: 500 }
    );
  }
}
