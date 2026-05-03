import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

/**
 * PUT /api/chats/group/role - Назначение роли участнику
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, userId, role } = body;

    if (!chatId || !userId || !role) {
      return NextResponse.json(
        { error: 'Необходимо указать chatId, userId и role' },
        { status: 400 }
      );
    }

    const validRoles = ['creator', 'moderator', 'author', 'reader'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Недопустимая роль. Доступны: creator, moderator, author, reader' },
        { status: 400 }
      );
    }

    // SQLite db уже доступен
    const chatsCollection = db.chats;

    const chat = await chatsCollection.findOne({
      selector: { id: chatId }
    }).exec();

    if (!chat) {
      return NextResponse.json(
        { error: 'Чат не найден' },
        { status: 404 }
      );
    }

    const chatData = chat.toJSON();
    
    // Проверяем, что пользователь является участником
    if (!chatData.members[userId]) {
      return NextResponse.json(
        { error: 'Пользователь не является участником чата' },
        { status: 400 }
      );
    }

    // Обновляем роль
    const updatedMembers = {
      ...chatData.members,
      [userId]: {
        ...chatData.members[userId],
        role
      }
    };

    // Если роль creator или moderator - добавляем в adminIds
    const adminIds = new Set(chatData.adminIds || []);
    if (role === 'creator' || role === 'moderator') {
      adminIds.add(userId);
    } else {
      // Удаляем из adminIds если роль ниже
      if (userId !== chatData.createdBy) { // creator всегда остаётся admin
        adminIds.delete(userId);
      }
    }

    await chat.atomicUpdate(() => ({
      ...chatData,
      members: updatedMembers,
      adminIds: Array.from(adminIds),
      updatedAt: Date.now()
    }));

    return NextResponse.json({
      success: true,
      message: 'Роль успешно назначена'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error setting role:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при назначении роли' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chats/group/participant - Добавление участника
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, userId, role = 'reader' } = body;

    if (!chatId || !userId) {
      return NextResponse.json(
        { error: 'Необходимо указать chatId и userId' },
        { status: 400 }
      );
    }

    // SQLite db уже доступен
    const chatsCollection = db.chats;

    const chat = await chatsCollection.findOne({
      selector: { id: chatId }
    }).exec();

    if (!chat) {
      return NextResponse.json(
        { error: 'Чат не найден' },
        { status: 404 }
      );
    }

    const chatData = chat.toJSON();

    // Проверяем, что пользователь ещё не участник
    if (chatData.members[userId]) {
      return NextResponse.json(
        { error: 'Пользователь уже является участником' },
        { status: 400 }
      );
    }

    // Добавляем участника
    const updatedMembers = {
      ...chatData.members,
      [userId]: {
        role,
        joinedAt: Date.now(),
        lastReadMessageId: null
      }
    };

    const updatedParticipants = [...chatData.participants, userId];

    await chat.atomicUpdate(() => ({
      ...chatData,
      members: updatedMembers,
      participants: updatedParticipants,
      updatedAt: Date.now()
    }));

    return NextResponse.json({
      success: true,
      message: 'Участник успешно добавлен'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error adding participant:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при добавлении участника' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chats/group/participant - Удаление участника
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, userId } = body;

    if (!chatId || !userId) {
      return NextResponse.json(
        { error: 'Необходимо указать chatId и userId' },
        { status: 400 }
      );
    }

    // SQLite db уже доступен
    const chatsCollection = db.chats;

    const chat = await chatsCollection.findOne({
      selector: { id: chatId }
    }).exec();

    if (!chat) {
      return NextResponse.json(
        { error: 'Чат не найден' },
        { status: 404 }
      );
    }

    const chatData = chat.toJSON();

    // Нельзя удалить создателя
    if (userId === chatData.createdBy) {
      return NextResponse.json(
        { error: 'Нельзя удалить создателя группы' },
        { status: 400 }
      );
    }

    // Удаляем участника
    const { [userId]: removed, ...updatedMembers } = chatData.members;
    const updatedParticipants = chatData.participants.filter((id: string) => id !== userId);

    // Удаляем из adminIds
    const updatedAdminIds = (chatData.adminIds || []).filter((id: string) => id !== userId);

    await chat.atomicUpdate(() => ({
      ...chatData,
      members: updatedMembers,
      participants: updatedParticipants,
      adminIds: updatedAdminIds,
      updatedAt: Date.now()
    }));

    return NextResponse.json({
      success: true,
      message: 'Участник успешно удалён'
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error removing participant:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при удалении участника' },
      { status: 500 }
    );
  }
}
