import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { generateUserAvatar, updateAvatarHistory } from '@/lib/avatar';

/**
 * GET /api/auth/yandex
 * Авторизация/регистрация через Яндекс
 * 
 * URL: /api/auth/yandex?code=AUTH_CODE
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Код авторизации не получен' },
        { status: 400 }
      );
    }

    // Обмен кода на токен
    const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.YANDEX_CLIENT_ID!,
        client_secret: process.env.YANDEX_CLIENT_SECRET!,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('[Yandex Auth] Token error:', tokenData);
      return NextResponse.json(
        { error: 'Ошибка получения токена Яндекс' },
        { status: 401 }
      );
    }

    const accessToken = tokenData.access_token;

    // Получаем данные пользователя из Яндекс
    const userResponse = await fetch('https://login.yandex.ru/info', {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });

    const yandexUser = await userResponse.json();

    if (!yandexUser.default_email) {
      return NextResponse.json(
        { error: 'Email не получен от Яндекса' },
        { status: 400 }
      );
    }

    const email = yandexUser.default_email.toLowerCase();
    const displayName = yandexUser.real_name || email.split('@')[0];
    const yandexAvatar = yandexUser.default_avatar_id 
      ? `https://avatars.yandex.net/get-yapic/${yandexUser.default_avatar_id}/islands-200`
      : null;

    // Проверяем количество пользователей для номера и баллов
    const userCount = db.prepare('SELECT COUNT(*) as count FROM User').get();
    const userNumber = (userCount.count || 0) + 1;
    const points = userNumber <= 10000 ? 5000 : -55;

    // Первый пользователь получает супер-админа
    const adminRoles = userNumber === 1 ? '["superadmin"]' : '[]';

    // Проверяем существует ли пользователь
    let user = db.prepare('SELECT * FROM User WHERE email = ?').get(email) as any;

    if (user) {
      // Обновляем существующего пользователя
      const now = new Date().toISOString();
      
      // Обновляем displayName если изменился
      if (user.displayName !== displayName) {
        db.prepare('UPDATE User SET displayName = ?, updatedAt = ? WHERE id = ?')
          .run(displayName, now, user.id);
        user.displayName = displayName;
      }

      // Если нет аватара или он из Яндекса - обновляем
      if (!user.avatar || yandexAvatar) {
        const newAvatar = yandexAvatar || generateUserAvatar(user.id, displayName);
        
        // Если был аватар - сохраняем в историю
        if (user.avatar && !user.avatar.includes('yandex')) {
          const history = updateAvatarHistory(user.avatarHistory || '[]', user.avatar);
          db.prepare('UPDATE User SET avatar = ?, avatarHistory = ?, updatedAt = ? WHERE id = ?')
            .run(newAvatar, history, now, user.id);
        } else {
          db.prepare('UPDATE User SET avatar = ?, updatedAt = ? WHERE id = ?')
            .run(newAvatar, now, user.id);
          user.avatar = newAvatar;
        }
      }

      console.log('[Yandex Auth] Existing user logged in:', email);

    } else {
      // Создаём нового пользователя
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      // Генерируем аватар (сначала пробуем Яндекс, если нет - свой)
      const avatar = yandexAvatar || generateUserAvatar(userId, displayName);

      db.prepare(`
        INSERT INTO User (id, email, displayName, passwordHash, authProvider, fullName, phone, bio, avatar, avatarHistory, settings, adminRoles, online, isOnline, status, userNumber, points, createdAt, updatedAt)
        VALUES (?, ?, ?, NULL, 'yandex', ?, NULL, NULL, ?, '[]', '{}', ?, 0, 0, 'offline', ?, ?, ?, ?)
      `).run(userId, email, displayName, displayName, avatar, adminRoles, userNumber, points, now, now);

      user = db.prepare('SELECT * FROM User WHERE email = ?').get(email) as any;

      console.log('[Yandex Auth] New user registered:', email, 'userNumber:', userNumber);
    }

    // Создаём системные чаты если их нет
    const now = new Date().toISOString();

    // 1. Чат "Избранное"
    const notesChatId = `chat-notes-${user.id}`;
    const notesChatExists = db.prepare('SELECT id FROM Chat WHERE id = ?').get(notesChatId);
    if (!notesChatExists) {
      db.prepare(`
        INSERT INTO Chat (id, type, name, createdBy, isSystemChat, createdAt, updatedAt)
        VALUES (?, 'private', 'Избранное', ?, 1, ?, ?)
      `).run(notesChatId, user.id, now, now);

      db.prepare(`
        INSERT INTO ChatMember (chatId, userId, role, joinedAt)
        VALUES (?, ?, 'creator', ?)
      `).run(notesChatId, user.id, now);
    }

    // 2. Чат с техподдержкой
    const supportChatId = `chat-support-${user.id}`;
    const supportChatExists = db.prepare('SELECT id FROM Chat WHERE id = ?').get(supportChatId);
    if (!supportChatExists) {
      db.prepare(`
        INSERT INTO Chat (id, type, name, createdBy, isSystemChat, createdAt, updatedAt)
        VALUES (?, 'private', 'Техподдержка Balloo', 'system', 1, ?, ?)
      `).run(supportChatId, now, now);

      db.prepare(`
        INSERT INTO ChatMember (chatId, userId, role, joinedAt)
        VALUES (?, ?, 'reader', ?)
      `).run(supportChatId, user.id, now);

      db.prepare(`
        INSERT OR IGNORE INTO ChatMember (chatId, userId, role, joinedAt)
        VALUES (?, 'support', 'creator', ?)
      `).run(supportChatId, now);
    }

    // 3. Чат новостей (добавляем если ещё не в члене)
    const newsChatId = 'balloo-news';
    const newsChatExists = db.prepare('SELECT id FROM Chat WHERE id = ?').get(newsChatId);
    if (!newsChatExists) {
      db.prepare(`
        INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, createdAt, updatedAt)
        VALUES (?, 'channel', 'Balloo - новости, фичи, возможности', 'Официальные новости, фичи и возможности мессенджера', 'system', 1, ?, ?)
      `).run(newsChatId, now, now);
    }

    const alreadyMember = db.prepare('SELECT 1 FROM ChatMember WHERE chatId = ? AND userId = ?').get(newsChatId, user.id);
    if (!alreadyMember) {
      db.prepare(`
        INSERT INTO ChatMember (chatId, userId, role, joinedAt)
        VALUES (?, ?, 'reader', ?)
      `).run(newsChatId, user.id, now);
    }

    // Обновляем статус
    db.prepare('UPDATE User SET status = ?, updatedAt = ? WHERE id = ?')
      .run('online', now, user.id);

    // Генерация токена сессии
    const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        fullName: user.fullName,
        avatar: user.avatar,
        status: user.status,
        isAdmin: user.adminRoles?.includes('admin') || false,
        isSuperAdmin: user.adminRoles?.includes('superadmin') || false,
        userNumber: user.userNumber,
        points: user.points,
      },
      token: sessionToken,
      message: user.id.includes(Date.now().toString().substring(0, 10)) 
        ? 'Регистрация выполнена успешно' 
        : 'Вход выполнен успешно'
    });

  } catch (error) {
    console.error('[Yandex Auth] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при авторизации через Яндекс' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/yandex/callback
 * Callback endpoint для OAuth flow
 */
export async function POST(request: NextRequest) {
  try {
    const { code, redirectUri } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Код авторизации не получен' },
        { status: 400 }
      );
    }

    // Обмен кода на токен
    const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.YANDEX_CLIENT_ID!,
        client_secret: process.env.YANDEX_CLIENT_SECRET!,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: 'Ошибка получения токена Яндекс' },
        { status: 401 }
      );
    }

    const accessToken = tokenData.access_token;

    // Получаем данные пользователя
    const userResponse = await fetch('https://login.yandex.ru/info', {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });

    const yandexUser = await userResponse.json();

    // Перенаправляем на фронтенд с токеном
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Здесь можно вернуть токен и данные пользователя
    // или сделать редирект с токеном в URL
    
    return NextResponse.json({
      success: true,
      redirectUrl: `${frontendUrl}/auth/yandex/success`,
      token: `yandex_token_${Date.now()}`,
      message: 'Авторизация через Яндекс успешна'
    });

  } catch (error) {
    console.error('[Yandex Callback] Error:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке callback' },
      { status: 500 }
    );
  }
}
