import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { hash } from 'bcryptjs';

/**
 * POST /api/auth/register
 * Регистрация пользователя с автоматическим созданием системных чатов
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName, fullName, phone } = body;

    // Валидация
    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: 'email, password и displayName обязательны' },
        { status: 400 }
      );
    }

    // Проверка уникальности email
    const existingUser = db.prepare('SELECT id FROM User WHERE email = ?').get(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email уже зарегистрирован' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const passwordHash = await hash(password, 10);

    // Создание пользователя
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO User (id, email, displayName, passwordHash, fullName, phone, bio, settings, adminRoles, online, isOnline, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, '', '{}', '[]', 0, 0, 'offline', ?, ?)
    `).run(userId, email, displayName, passwordHash, fullName || null, phone || null, now, now);

    const user = {
      id: userId,
      email,
      displayName,
      fullName: fullName || null,
      phone: phone || null,
      avatar: null,
      createdAt: now,
    };

    // === СОЗДАНИЕ СИСТЕМНЫХ ЧАТОВ ===

    // 1. Чат "Мои заметки" (чат с самим собой)
    const notesChatId = `chat-notes-${userId}`;
    db.prepare(`
      INSERT INTO Chat (id, type, name, createdBy, isSystemChat, createdAt, updatedAt)
      VALUES (?, 'private', NULL, ?, 1, ?, ?)
    `).run(notesChatId, userId, now, now);

    db.prepare(`
      INSERT INTO ChatMember (chatId, userId, role, joinedAt)
      VALUES (?, ?, 'creator', ?)
    `).run(notesChatId, userId, now);

    // 2. Чат с техподдержкой
    const supportChatId = `chat-support-${userId}`;
    db.prepare(`
      INSERT INTO Chat (id, type, name, createdBy, isSystemChat, createdAt, updatedAt)
      VALUES (?, 'private', 'Техподдержка Balloo', 'system', 1, ?, ?)
    `).run(supportChatId, now, now);

    db.prepare(`
      INSERT INTO ChatMember (chatId, userId, role, joinedAt)
      VALUES (?, ?, 'reader', ?), ('chat-support-system', 'support', 'creator', ?)
    `).run(supportChatId, userId, now, now);

    // 3. Добавить в чат "Balloo - новости и обновления"
    const newsChatId = 'balloo-news';
    const newsChatExists = db.prepare('SELECT id FROM Chat WHERE id = ?').get(newsChatId);

    if (!newsChatExists) {
      db.prepare(`
        INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, createdAt, updatedAt)
        VALUES (?, 'channel', 'Balloo - новости и обновления', 'Официальные новости, фичи и планы проекта', 'system', 1, ?, ?)
      `).run(newsChatId, now, now);
    }

    db.prepare(`
      INSERT OR IGNORE INTO ChatMember (chatId, userId, role, joinedAt)
      VALUES (?, ?, 'reader', ?)
    `).run(newsChatId, userId, now);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
      },
      systemChats: {
        notes: notesChatId,
        support: supportChatId,
        news: newsChatId
      }
    });
  } catch (error) {
    console.error('[Register] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
}

