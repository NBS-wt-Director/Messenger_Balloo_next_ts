
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

interface BanData {
  id: string;
  userId: string;
  chatId: string | null;
  bannedBy: string;
  reason: string;
  expiresAt: string | null;
  createdAt: string;
}

// Получение списка банов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const userId = searchParams.get('userId');
    const chatId = searchParams.get('chatId');

    if (!adminId) {
      return NextResponse.json(
        { error: 'adminId требуется' },
        { status: 400 }
      );
    }

    let query = 'SELECT * FROM Ban WHERE 1=1';
    const params: any[] = [];

    if (userId) {
      query += ' AND userId = ?';
      params.push(userId);
    }

    if (chatId) {
      query += ' AND chatId = ?';
      params.push(chatId);
    }

    const bans = db.prepare(query).all(...params) as BanData[];

    return NextResponse.json({
      success: true,
      bans
    });
  } catch (error) {
    console.error('[API] Error fetching bans:', error);
    return NextResponse.json(
      { error: 'Не удалось получить список банов' },
      { status: 500 }
    );
  }
}

// Создание бана
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, userId, chatId, reason, expiresDays } = body;

    if (!adminId || !userId || !reason) {
      return NextResponse.json(
        { error: 'adminId, userId и reason обязательны' },
        { status: 400 }
      );
    }

    // Проверка прав администратора
    const admin = db.prepare('SELECT * FROM User WHERE id = ?').get(adminId) as any;

    if (!admin || !JSON.parse(admin.adminRoles || '[]').includes('admin')) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const banId = `ban_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const expiresAt = expiresDays ? new Date(Date.now() + (expiresDays * 24 * 60 * 60 * 1000)).toISOString() : null;

    db.prepare(`
      INSERT INTO Ban (id, userId, chatId, bannedBy, reason, expiresAt, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(banId, userId, chatId || null, adminId, reason, expiresAt, now);

    // Обновление статуса пользователя
    db.prepare('UPDATE User SET status = ?, updatedAt = ? WHERE id = ?').run('banned', now, userId);

    // Если бан в чате - удаление из участников
    if (chatId) {
      const chat = db.prepare('SELECT * FROM Chat WHERE id = ?').get(chatId) as any;
      if (chat) {
        const members = db.prepare('SELECT * FROM ChatMember WHERE chatId = ?').all(chatId) as any[];
        const newMembers = members.filter((m: any) => m.userId !== userId);
        
        db.prepare('DELETE FROM ChatMember WHERE chatId = ? AND userId = ?').run(chatId, userId);
      }
    }

    return NextResponse.json({
      success: true,
      ban: {
        id: banId,
        userId,
        chatId: chatId || null,
        bannedBy: adminId,
        reason,
        expiresAt,
        createdAt: now
      },
      message: 'Пользователь заблокирован'
    });
  } catch (error) {
    console.error('[API] Error creating ban:', error);
    return NextResponse.json(
      { error: 'Не удалось создать бан' },
      { status: 500 }
    );
  }
}

// Разблокировка
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, banId } = body;

    if (!adminId || !banId) {
      return NextResponse.json(
        { error: 'adminId и banId обязательны' },
        { status: 400 }
      );
    }

    const ban = db.prepare('SELECT * FROM Ban WHERE id = ?').get(banId) as any;
    if (!ban) {
      return NextResponse.json(
        { error: 'Бан не найден' },
        { status: 404 }
      );
    }

    db.prepare('DELETE FROM Ban WHERE id = ?').run(banId);

    // Восстановление статуса пользователя
    db.prepare('UPDATE User SET status = ?, updatedAt = ? WHERE id = ?').run('offline', new Date().toISOString(), ban.userId);

    return NextResponse.json({
      success: true,
      message: 'Пользователь разблокирован'
    });
  } catch (error) {
    console.error('[API] Error removing ban:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить бан' },
      { status: 500 }
    );
  }
}
