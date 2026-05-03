import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { logger } from '@/lib/logger';
import bcrypt from 'bcryptjs';

/**
 * POST /api/installer/test-accounts - Создать тестовые аккаунты
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminEmail, adminPassword } = body;

    // SQLite db уже доступен
    const usersCollection = db.users;
    const chatsCollection = db.chats;

    const now = Date.now();
    const createdUsers: any[] = [];

    // 1. Создаём администратора
    const adminId = 'admin_' + Date.now();
    const adminHash = await bcrypt.hash(adminPassword || 'Admin123!', 10);
    
    await usersCollection.insert({
      id: adminId,
      email: adminEmail || 'admin@balloo.ru',
      passwordHash: adminHash,
      displayName: 'Администратор',
      avatar: '',
      fullName: 'Иван Оберюхтин',
      birthDate: 631152000000, // 1990-01-01
      familyRelations: [],
      isAdmin: true,
      isSuperAdmin: true,
      adminRoles: ['users', 'chats', 'messages', 'bans', 'settings'],
      adminSince: now,
      publicKey: '',
      createdAt: now,
      lastSeen: now,
      isOnline: false,
      status: 'online',
      updatedAt: now
    });

    createdUsers.push({
      email: adminEmail || 'admin@balloo.ru',
      password: adminPassword || 'Admin123!',
      role: 'SuperAdmin'
    });

    // 2. Создаём тестовых пользователей
    const testUsers = [
      {
        email: 'user1@balloo.ru',
        password: 'User123!',
        displayName: 'Алексей Иванов',
        fullName: 'Алексей Иванов',
        birthDate: 694224000000 // 1992-01-01
      },
      {
        email: 'user2@balloo.ru',
        password: 'User123!',
        displayName: 'Мария Петрова',
        fullName: 'Мария Петрова',
        birthDate: 725846400000 // 1993-01-01
      },
      {
        email: 'user3@balloo.ru',
        password: 'User123!',
        displayName: 'Дмитрий Сидоров',
        fullName: 'Дмитрий Сидоров',
        birthDate: 757382400000 // 1994-01-01
      }
    ];

    for (const userData of testUsers) {
      const userId = 'user_' + Math.random().toString(36).substr(2, 9);
      const hash = await bcrypt.hash(userData.password, 10);

      await usersCollection.insert({
        id: userId,
        email: userData.email,
        passwordHash: hash,
        displayName: userData.displayName,
        avatar: '',
        fullName: userData.fullName,
        birthDate: userData.birthDate,
        familyRelations: [],
        isAdmin: false,
        isSuperAdmin: false,
        adminRoles: [],
        adminSince: null,
        publicKey: '',
        createdAt: now,
        lastSeen: now,
        isOnline: false,
        status: 'online',
        updatedAt: now
      });

      createdUsers.push({
        email: userData.email,
        password: userData.password,
        role: 'User'
      });
    }

    // 3. Создаём тестовые чаты
    const users = await usersCollection.find().exec();
    const userIds = users.map((u: any) => u.id);

    // Общий чат
    await chatsCollection.insert({
      id: 'chat_general_' + now,
      type: 'group',
      name: 'Общий чат',
      avatar: '',
      participants: userIds,
      members: userIds.reduce((acc: any, id: string) => {
        acc[id] = { role: 'member', joinedAt: now, lastReadMessageId: null };
        return acc;
      }, {}),
      adminIds: [adminId],
      createdBy: adminId,
      description: 'Добро пожаловать в Balloo Messenger!',
      isFavorite: {},
      pinned: {},
      unreadCount: {},
      lastMessage: null,
      createdAt: now,
      updatedAt: now,
      isSystemChat: true
    });

    // Чат разработчиков
    await chatsCollection.insert({
      id: 'chat_dev_' + now,
      type: 'group',
      name: 'Разработчики',
      avatar: '',
      participants: userIds.slice(0, 2),
      members: userIds.slice(0, 2).reduce((acc: any, id: string) => {
        acc[id] = { role: 'member', joinedAt: now, lastReadMessageId: null };
        return acc;
      }, {}),
      adminIds: [adminId],
      createdBy: adminId,
      description: 'Чат для обсуждения разработки',
      isFavorite: {},
      pinned: {},
      unreadCount: {},
      lastMessage: null,
      createdAt: now,
      updatedAt: now,
      isSystemChat: false
    });

    logger.info('[Installer] Тестовые аккаунты созданы');

    return NextResponse.json({
      success: true,
      message: 'Тестовые аккаунты созданы',
      users: createdUsers,
      chatsCount: 2
    });
  } catch (error: any) {
    logger.error('[Installer] Error creating test accounts:', error);
    return NextResponse.json(
      { error: 'Не удалось создать тестовые аккаунты: ' + error.message },
      { status: 500 }
    );
  }
}
