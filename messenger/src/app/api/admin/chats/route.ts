import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// Получение списка чатов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId требуется' },
        { status: 400 }
      );
    }

    // Проверка администратора
    const admin = db.prepare('SELECT * FROM User WHERE id = ?').get(adminId) as any;
    if (!admin) {
      return NextResponse.json(
        { error: 'Администратор не найден' },
        { status: 404 }
      );
    }

    let query = 'SELECT * FROM Chat WHERE 1=1';
    const params: any[] = [];

    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const chats = db.prepare(query).all(...params) as any[];

    // Получение общего количества
    let countQuery = 'SELECT COUNT(*) as count FROM Chat WHERE 1=1';
    let countParams: any[] = [];
    if (type && type !== 'all') {
      countQuery += ' AND type = ?';
      countParams.push(type);
    }
    const total = db.prepare(countQuery).get(...countParams) as any;

    return NextResponse.json({
      success: true,
      chats: chats.map(chat => ({
        id: chat.id,
        type: chat.type,
        name: chat.name,
        participants: db.prepare('SELECT COUNT(*) as count FROM ChatMember WHERE chatId = ?').get(chat.id) as any,
        createdBy: chat.createdBy,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      })),
      pagination: {
        page,
        limit,
        total: total.count,
        totalPages: Math.ceil(total.count / limit)
      }
    });
  } catch (error) {
    console.error('[API] Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Не удалось получить список чатов' },
      { status: 500 }
    );
  }
}

// Удаление чата
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, chatId } = body;

    if (!adminId || !chatId) {
      return NextResponse.json(
        { error: 'adminId и chatId обязательны' },
        { status: 400 }
      );
    }

    const chat = db.prepare('SELECT * FROM Chat WHERE id = ?').get(chatId) as any;
    if (!chat) {
      return NextResponse.json(
        { error: 'Чат не найден' },
        { status: 404 }
      );
    }

    // Удаление всех сообщений в чате
    db.prepare('DELETE FROM Message WHERE chatId = ?').run(chatId);

    // Удаление участников чата
    db.prepare('DELETE FROM ChatMember WHERE chatId = ?').run(chatId);

    // Удаление чата
    db.prepare('DELETE FROM Chat WHERE id = ?').run(chatId);

    return NextResponse.json({
      success: true,
      message: 'Чат и все сообщения удалены'
    });
  } catch (error) {
    console.error('[API] Error deleting chat:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить чат' },
      { status: 500 }
    );
  }
}
