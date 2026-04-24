
import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection, getChatsCollection } from '@/lib/database';

interface BanData {
  id: string;
  userId: string;
  chatId: string | null;
  bannedBy: string;
  reason: string;
  expiresAt: number | null;
  createdAt: number;
}

// Хранилище банов (в реальном приложении - база данных)
const bans = new Map<string, BanData>();

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

    let filteredBans = Array.from(bans.values());

    if (userId) {
      filteredBans = filteredBans.filter(b => b.userId === userId);
    }

    if (chatId) {
      filteredBans = filteredBans.filter(b => b.chatId === chatId);
    }

    return NextResponse.json({
      success: true,
      bans: filteredBans
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching bans:', error);
    }
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

    const usersCollection = await getUsersCollection();
    const admin = await usersCollection.findOne(adminId).exec();

    if (!admin || !admin.toJSON().isAdmin) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const banId = `ban_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const expiresAt = expiresDays ? now + (expiresDays * 24 * 60 * 60 * 1000) : null;

    const ban: BanData = {
      id: banId,
      userId,
      chatId: chatId || null,
      bannedBy: adminId,
      reason,
      expiresAt,
      createdAt: now
    };

    bans.set(banId, ban);

    // Обновление статуса пользователя
    const userDoc = await usersCollection.findOne({ selector: { id: userId } }).exec();
    if (userDoc) {
      await userDoc.patch({
        status: 'banned',
        updatedAt: now
      });
    }

    // Если бан в чате - удаление из участников
    if (chatId) {
      const chatsCollection = await getChatsCollection();
      const chatDoc = await chatsCollection.findOne({ selector: { id: chatId } }).exec();
      if (chatDoc) {
        const newParticipants = chatDoc.participants.filter((p: string) => p !== userId);
        const newMembers = { ...chatDoc.members };
        delete newMembers[userId];
        await chatDoc.patch({
          participants: newParticipants,
          members: newMembers,
          updatedAt: now
        });
      }
    }

    return NextResponse.json({
      success: true,
      ban,
      message: 'Пользователь заблокирован'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error creating ban:', error);
    }
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

    const ban = bans.get(banId);
    if (!ban) {
      return NextResponse.json(
        { error: 'Бан не найден' },
        { status: 404 }
      );
    }

    bans.delete(banId);

    // Восстановление статуса пользователя
    const usersCollection = await getUsersCollection();
    const userDoc = await usersCollection.findOne({ selector: { id: ban.userId } }).exec();
    if (userDoc) {
      await userDoc.patch({
        status: 'offline',
        updatedAt: Date.now()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Пользователь разблокирован'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error removing ban:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось удалить бан' },
      { status: 500 }
    );
  }
}
