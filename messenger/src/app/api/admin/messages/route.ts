import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const chatId = searchParams.get('chatId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!adminId) {
      return NextResponse.json({ error: 'adminId требуется' }, { status: 400 });
    }

    let query = 'SELECT * FROM Message WHERE 1=1';
    const params: any[] = [];

    if (chatId) {
      query += ' AND chatId = ?';
      params.push(chatId);
    }
    
    if (userId) {
      query += ' AND userId = ?';
      params.push(userId);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const messages = db.prepare(query).all(...params) as any[];

    let countQuery = 'SELECT COUNT(*) as count FROM Message WHERE 1=1';
    let countParams: any[] = [];
    if (chatId) {
      countQuery += ' AND chatId = ?';
      countParams.push(chatId);
    }
    if (userId) {
      countQuery += ' AND userId = ?';
      countParams.push(userId);
    }
    const total = db.prepare(countQuery).get(...countParams) as any;

    return NextResponse.json({
      success: true,
      messages: messages.map(m => ({
        id: m.id,
        chatId: m.chatId,
        senderId: m.userId,
        type: m.type,
        content: (m.text || '').substring(0, 200),
        createdAt: m.createdAt
      })),
      pagination: {
        page,
        limit,
        total: total.count,
        totalPages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    console.error('[API] Error fetching messages:', error);
    return NextResponse.json({ error: 'Не удалось получить список сообщений' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, messageId } = body;

    if (!adminId || !messageId) {
      return NextResponse.json({ error: 'adminId и messageId обязательны' }, { status: 400 });
    }

    const message = db.prepare('SELECT * FROM Message WHERE id = ?').get(messageId) as any;

    if (!message) {
      return NextResponse.json({ error: 'Сообщение не найдено' }, { status: 404 });
    }

    db.prepare('DELETE FROM Message WHERE id = ?').run(messageId);

    return NextResponse.json({ success: true, message: 'Сообщение удалено' });
  } catch (error) {
    console.error('[API] Error deleting message:', error);
    return NextResponse.json({ error: 'Не удалось удалить сообщение' }, { status: 500 });
  }
}
