// /api/auth/register/route.ts - Обновлённая версия с системными чатами

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email уже зарегистрирован' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const passwordHash = await hash(password, 10);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        fullName: fullName || null,
        phone: phone || null,
        online: false,
        isOnline: false,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        fullName: true,
        phone: true,
        avatar: true,
        createdAt: true,
      }
    });

    // === СОЗДАНИЕ СИСТЕМНЫХ ЧАТОВ ===

    // 1. Чат "Мои заметки" (чат с самим собой)
    const notesChat = await prisma.chat.create({
      data: {
        type: 'private',
        name: null,
        createdBy: user.id,
        isSystemChat: true,
        members: {
          create: {
            userId: user.id,
            role: 'creator',
            joinedAt: new Date()
          }
        }
      }
    });

    // 2. Чат с техподдержкой
    const supportChat = await prisma.chat.create({
      data: {
        type: 'private',
        name: 'Техподдержка Balloo',
        createdBy: 'system',
        isSystemChat: true,
        members: {
          create: [
            {
              userId: user.id,
              role: 'reader',
              joinedAt: new Date()
            },
            {
              userId: 'support', // Системный пользователь поддержки
              role: 'creator',
              joinedAt: new Date()
            }
          ]
        }
      }
    });

    // 3. Добавить в чат "Balloo - новости и обновления" (если существует или создать)
    let newsChat = await prisma.chat.findUnique({
      where: { id: 'balloo-news' }
    });

    if (!newsChat) {
      // Создаём чат новостей
      newsChat = await prisma.chat.create({
        data: {
          id: 'balloo-news',
          type: 'channel',
          name: 'Balloo - новости и обновления',
          description: 'Официальные новости, фичи и планы проекта',
          createdBy: 'system',
          isSystemChat: true,
          members: {
            create: {
              userId: user.id,
              role: 'reader',
              joinedAt: new Date()
            }
          }
        }
      });
    } else {
      // Добавляем пользователя в существующий чат новостей
      await prisma.chatMember.create({
        data: {
          chatId: 'balloo-news',
          userId: user.id,
          role: 'reader',
          joinedAt: new Date()
        }
      });
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
        notes: notesChat.id,
        support: supportChat.id,
        news: newsChat.id
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
