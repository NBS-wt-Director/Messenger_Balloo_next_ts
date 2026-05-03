// /api/auth/register/route.ts - Обновлённая версия с системными чатами

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { hash } from 'bcryptjs';

function createUser(data: any): Promise<any> {
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO User (id, email, passwordHash, displayName, fullName, phone, bio, avatar, adminRoles, online, isOnline, status, settings, userNumber, points, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, '', ?, '[]', 0, 0, 'offline', '{}', ?, ?, ?, ?)
  `).run(userId, data.email, data.passwordHash, data.displayName, data.fullName || null, data.phone || null, data.avatar || null, data.userNumber || null, data.points || -55, now, now);
  
  return getUserById(userId);
}

function getUserById(id: string): any {
  return db.prepare('SELECT * FROM User WHERE id = ?').get(id) as any || null;
}

function getUserByEmail(email: string): any {
  return db.prepare('SELECT * FROM User WHERE email = ?').get(email) as any || null;
}

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
    const existingUser = getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email уже зарегистрирован' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const passwordHash = await hash(password, 10);

    // Создаём пользователя
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const userCount = db.prepare('SELECT COUNT(*) as count FROM User').get() as any;
    const userNumber = (userCount.count || 0) + 1;

    db.prepare(`
      INSERT INTO User (id, email, displayName, passwordHash, fullName, phone, bio, avatar, adminRoles, online, isOnline, status, settings, userNumber, points, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, '', NULL, '[]', 0, 0, 'offline', '{}', ?, -55, ?, ?)
    `).run(userId, email, displayName, passwordHash, fullName || null, phone || null, userNumber, now, now);

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
      VALUES (?, ?, 'reader', ?)
    `).run(supportChatId, userId, now);

    // 3. Чат новостей (общий для всех)
    const newsChatId = 'balloo-news';
    const newsChatExists = db.prepare('SELECT id FROM Chat WHERE id = ?').get(newsChatId);

    if (!newsChatExists) {
      db.prepare(`
        INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, createdAt, updatedAt)
        VALUES (?, 'channel', 'Balloo - новости и обновления', 'Официальные новости, фичи и планы проекта', 'system', 1, ?, ?)
      `).run(newsChatId, now, now);
    }

    const alreadyMember = db.prepare('SELECT 1 FROM ChatMember WHERE chatId = ? AND userId = ?').get(newsChatId, userId);
    if (!alreadyMember) {
      db.prepare(`
        INSERT INTO ChatMember (chatId, userId, role, joinedAt)
        VALUES (?, ?, 'reader', ?)
      `).run(newsChatId, userId, now);
    }

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
