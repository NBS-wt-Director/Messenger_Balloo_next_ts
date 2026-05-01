import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { hash } from 'bcryptjs';
import { generateUserAvatar, updateAvatarHistory } from '@/lib/avatar';
import { generateVerificationCode } from '@/lib/verification-code';
import { sendVerificationEmail } from '@/lib/email';

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

    // Создаём пользователя
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Генерация аватара
    const avatar = generateUserAvatar(userId, displayName);

    // Проверяем количество пользователей для номера и баллов
    const userCount = db.prepare('SELECT COUNT(*) as count FROM User').get();
    const userNumber = (userCount.count || 0) + 1;
    const points = userNumber <= 10000 ? 5000 : -55;

    // Первый пользователь получает супер-админа
    const adminRoles = userNumber === 1 ? '["superadmin"]' : '[]';

    db.prepare(`
      INSERT INTO User (id, email, displayName, passwordHash, fullName, phone, bio, avatar, avatarHistory, settings, adminRoles, online, isOnline, status, userNumber, points, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, '', ?, '[]', '{}', ?, 0, 0, 'offline', ?, ?, ?, ?)
    `).run(userId, email, displayName, passwordHash, fullName || null, phone || null, avatar, adminRoles, userNumber, points, now, now);

    const user = {
      id: userId,
      email,
      displayName,
      fullName: fullName || null,
      phone: phone || null,
      avatar,
      createdAt: now,
      userNumber,
      points,
    };

    // === СОЗДАНИЕ СИСТЕМНЫХ ЧАТОВ ===

    // 1. Чат "Избранное" (чат с самим собой)
    const notesChatId = `chat-notes-${userId}`;
    db.prepare(`
      INSERT INTO Chat (id, type, name, createdBy, isSystemChat, createdAt, updatedAt)
      VALUES (?, 'private', 'Избранное', ?, 1, ?, ?)
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

    // Добавить системного пользователя поддержки
    db.prepare(`
      INSERT OR IGNORE INTO ChatMember (chatId, userId, role, joinedAt)
      VALUES (?, 'support', 'creator', ?)
    `).run(supportChatId, now);

    // 3. Чат "Balloo - новости, фичи, возможности" (общий для всех)
    const newsChatId = 'balloo-news';
    const newsChatExists = db.prepare('SELECT id FROM Chat WHERE id = ?').get(newsChatId);

    if (!newsChatExists) {
      db.prepare(`
        INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, createdAt, updatedAt)
        VALUES (?, 'channel', 'Balloo - новости, фичи, возможности', 'Официальные новости, фичи и возможности мессенджера', 'system', 1, ?, ?)
      `).run(newsChatId, now, now);
      console.log('✓ Создан системный чат новостей');
    }

    // Добавляем пользователя в чат новостей
    const alreadyMember = db.prepare('SELECT 1 FROM ChatMember WHERE chatId = ? AND userId = ?').get(newsChatId, userId);
    if (!alreadyMember) {
      db.prepare(`
        INSERT INTO ChatMember (chatId, userId, role, joinedAt)
        VALUES (?, ?, 'reader', ?)
      `).run(newsChatId, userId, now);
    }
    
    // === ОТПРАВКА КОДА ВЕРИФИКАЦИИ ===
    const verificationCode = generateVerificationCode();
    await sendVerificationEmail(email, verificationCode);
    
    // Сохраняем код в БД
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT INTO VerificationCode (id, userId, code, expiresAt, used)
      VALUES (?, ?, ?, ?, 0)
    `).run(`code-${Date.now()}`, userId, verificationCode, codeExpiresAt);
    
    console.log(`[Register] Verification code for ${email}: ${verificationCode}`);
    
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
      },
      requiresVerification: true,
      emailMasked: email.replace(/(.{3}).+(@.+)/, '$1***$2'),
      codeHint: verificationCode.split('-').slice(0, 3).join('-') + '...'
    });
  } catch (error) {
    console.error('[Register] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
}

