 import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

/**
 * GET /api/chats/group/members?id={id} - Получить участников группы
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('id');

    // Пагинация
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const db = await getDatabase();
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

    // Получаем информацию о всех участниках
    const usersCollection = db.users;
    const memberIds = Object.keys(chatData.members);
    const totalCount = memberIds.length;
    
    // Пагинация
    const paginatedIds = memberIds.slice(skip, skip + limit);
    const members = [];

    for (const userId of paginatedIds) {
      const user = await usersCollection.findOne({
        selector: { id: userId }
      }).exec();

      if (user) {
        const userData = user.toJSON();
        members.push({
          userId,
          role: chatData.members[userId].role,
          joinedAt: chatData.members[userId].joinedAt,
          displayName: userData.displayName,
          avatar: userData.avatar,
          thumbnailUrl: userData.thumbnailUrl,
          email: userData.email,
          isOnline: userData.isOnline,
          lastSeen: userData.lastSeen
        });
      }
    }

    return NextResponse.json({
      success: true,
      members,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + members.length < totalCount
      }
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching members:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении участников' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chats/group/members - Добавить участника в группу
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, userIds, roles = {} } = body;

    if (!chatId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Необходимо указать chatId и userIds' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
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
    const now = Date.now();

    // Добавляем новых участников
    const updatedMembers = { ...chatData.members };
    const updatedParticipants = [...chatData.participants];
    const addedUsers = [];

    for (const userId of userIds) {
      // Проверяем, что пользователь ещё не участник
      if (updatedMembers[userId]) {
        continue;
      }

      updatedMembers[userId] = {
        role: roles[userId] || 'reader',
        joinedAt: now,
        lastReadMessageId: null
      };
      updatedParticipants.push(userId);
      addedUsers.push(userId);
    }

    await chat.atomicUpdate(() => ({
      ...chatData,
      members: updatedMembers,
      participants: updatedParticipants,
      updatedAt: now
    }));

    return NextResponse.json({
      success: true,
      addedUsers,
      message: `Добавлено ${addedUsers.length} участника(ов)`
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error adding members:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при добавлении участников' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chats/group/members - Удалить участника из группы
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId, userId, currentUserId } = body;

    if (!chatId || !userId || !currentUserId) {
      return NextResponse.json(
        { error: 'Необходимо указать chatId, userId и currentUserId' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
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

    // Проверка прав
    const currentMember = chatData.members[currentUserId];
    if (!currentMember) {
      return NextResponse.json(
        { error: 'Вы не являетесь участником этого чата' },
        { status: 403 }
      );
    }

    // Нельзя удалить создателя
    if (userId === chatData.createdBy) {
      return NextResponse.json(
        { error: 'Нельзя удалить создателя группы' },
        { status: 400 }
      );
    }

    // Если удаляем себя - обычный выход из группы
    if (userId === currentUserId) {
      const { [userId]: removed, ...updatedMembers } = chatData.members;
      const updatedParticipants = chatData.participants.filter((id: string) => id !== userId);
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
        message: 'Вы вышли из группы'
      });
    }

    // Если удаляем другого участника - нужны права
    const targetMember = chatData.members[userId];
    if (!targetMember) {
      return NextResponse.json(
        { error: 'Пользователь не является участником чата' },
        { status: 404 }
      );
    }

    // Только creator и moderator могут удалять участников
    if (!['creator', 'moderator'].includes(currentMember.role)) {
      return NextResponse.json(
        { error: 'У вас нет прав для удаления участников' },
        { status: 403 }
      );
    }

    // Удаляем участника
    const { [userId]: removed, ...updatedMembers } = chatData.members;
    const updatedParticipants = chatData.participants.filter((id: string) => id !== userId);
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
      console.error('[API] Error removing member:', error);
    }
    return NextResponse.json(
      { error: error.message || 'Ошибка при удалении участника' },
      { status: 500 }
    );
  }
}
