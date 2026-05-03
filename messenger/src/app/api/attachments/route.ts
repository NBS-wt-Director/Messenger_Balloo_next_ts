import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const chatId = searchParams.get('chatId');

    let query = 'SELECT * FROM Attachment WHERE 1=1';
    const params: any[] = [];

    if (messageId) {
      query += ' AND messageId = ?';
      params.push(messageId);
    } else if (chatId) {
      query += ' AND chatId = ?';
      params.push(chatId);
    } else {
      return NextResponse.json(
        { error: 'messageId или chatId требуется' },
        { status: 400 }
      );
    }

    query += ' ORDER BY createdAt DESC';
    const attachments = db.prepare(query).all(...params);

    return NextResponse.json({
      success: true,
      attachments
    });
  } catch (error) {
    console.error('[API] Error fetching attachments:', error);
    return NextResponse.json(
      { error: 'Не удалось получить вложения' },
      { status: 500 }
    );
  }
}

// Загрузка вложения
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, chatId, uploaderId, fileName, mimeType, fileSize, url, thumbnailUrl, width, height } = body;

    if (!messageId || !chatId || !uploaderId) {
      return NextResponse.json(
        { error: 'messageId, chatId и uploaderId обязательны' },
        { status: 400 }
      );
    }

    // Проверка существования сообщения
    const message = db.prepare('SELECT * FROM Message WHERE id = ?').get(messageId) as any;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Сообщение не найдено' },
        { status: 404 }
      );
    }

    // Проверка чата
    const chat = db.prepare('SELECT * FROM Chat WHERE id = ?').get(chatId) as any;
    const member = db.prepare('SELECT * FROM ChatMember WHERE chatId = ? AND userId = ?').get(chatId, uploaderId) as any;
    
    if (!chat || !member) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const attachmentId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO Attachment (id, messageId, chatId, uploaderId, fileName, mimeType, fileSize, url, thumbnailUrl, width, height, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ready', ?, ?)
    `).run(
      attachmentId, messageId, chatId, uploaderId, fileName || '', 
      mimeType || '', fileSize || 0, url || '', thumbnailUrl || null, 
      width || null, height || null, now, now
    );

    return NextResponse.json({
      success: true,
      attachment: {
        id: attachmentId,
        messageId,
        chatId,
        uploaderId,
        fileName,
        mimeType,
        fileSize,
        url,
        thumbnailUrl,
        width,
        height,
        status: 'ready',
        createdAt: now,
        updatedAt: now
      }
    });
  } catch (error) {
    console.error('[API] Error uploading attachment:', error);
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

    const attachment = db.prepare('SELECT * FROM Attachment WHERE id = ?').get(attachmentId) as any;

    if (!attachment) {
      return NextResponse.json(
        { error: 'Вложение не найдено' },
        { status: 404 }
      );
    }

    db.prepare('DELETE FROM Attachment WHERE id = ?').run(attachmentId);

    return NextResponse.json({
      success: true,
      message: 'Вложение удалено'
    });
  } catch (error) {
    console.error('[API] Error deleting attachment:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить вложение' },
      { status: 500 }
    );
  }
}
