import { NextRequest, NextResponse } from 'next/server';
import { getInvitationsCollection, getChatsCollection } from '@/lib/database';

/**
 * API для получения приглашений пользователя
 * GET /api/invitations/my?userId=USER_ID
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId требуется' },
        { status: 400 }
      );
    }

    const invitationsCollection = await getInvitationsCollection();
    const now = Date.now();

    // Получение всех приглашений созданных пользователем
    const invitations = await invitationsCollection
      .find({
        selector: {
          invitedBy: userId
        },
        sort: [{ createdAt: 'desc' }]
      })
      .exec();

    // Получение информации о чатах
    const chatsCollection = await getChatsCollection();
    const invitationsWithChat = await Promise.all(
      invitations.map(async (invitation) => {
        const chat = await chatsCollection.findOne(invitation.chatId).exec();
        return {
          ...invitation.toJSON(),
          chatName: chat?.name || 'Личный чат',
          chatAvatar: chat?.avatar,
          chatType: chat?.type || 'private',
          isExpired: invitation.expiresAt < now,
          isActive: invitation.isActive && invitation.expiresAt > now && 
                   (!invitation.isOneTime || invitation.currentUses < invitation.maxUses),
          inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${invitation.code}`
        };
      })
    );

    return NextResponse.json({
      success: true,
      invitations: invitationsWithChat,
      count: invitationsWithChat.length
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error fetching invitations:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось получить приглашения: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * Создание нового приглашения
 * POST /api/invitations/my
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      chatId,
      invitedBy,
      message,
      maxUses = 0, // 0 = безлимитно
      expiresAt,
      isOneTime = false
    } = body;

    if (!chatId || !invitedBy) {
      return NextResponse.json(
        { error: 'chatId и invitedBy обязательны' },
        { status: 400 }
      );
    }

    const invitationsCollection = await getInvitationsCollection();
    const chatsCollection = await getChatsCollection();

    // Проверка существования чата
    const chat = await chatsCollection.findOne(chatId).exec();
    if (!chat) {
      return NextResponse.json(
        { error: 'Чат не найден' },
        { status: 404 }
      );
    }

    // Генерация уникального кода
    const code = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    // Создание приглашения
    const newInvitation = await invitationsCollection.insert({
      id: `invitation_${now}_${Math.random().toString(36).substr(2, 9)}`,
      code,
      chatId,
      invitedBy,
      invitedByEmail: '',
      chatName: chat.name || 'Личный чат',
      chatAvatar: chat.avatar,
      chatType: chat.type,
      message: message || '',
      maxUses,
      currentUses: 0,
      expiresAt: expiresAt || (now + (7 * 24 * 60 * 60 * 1000)), // 7 дней по умолчанию
      isActive: true,
      isOneTime,
      createdAt: now,
      updatedAt: now
    });

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${code}`;

    return NextResponse.json({
      success: true,
      invitation: {
        ...newInvitation.toJSON(),
        inviteUrl,
        chatName: chat.name || 'Личный чат',
        chatType: chat.type
      },
      message: 'Приглашение создано'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error creating invitation:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось создать приглашение: ' + error.message },
      { status: 500 }
    );
  }
}

/**
 * Удаление/деактивация приглашения
 * DELETE /api/invitations/my?id=INVITATION_ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('id');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId требуется' },
        { status: 400 }
      );
    }

    const invitationsCollection = await getInvitationsCollection();
    const invitation = await invitationsCollection.findOne(invitationId).exec();

    if (!invitation) {
      return NextResponse.json(
        { error: 'Приглашение не найдено' },
        { status: 404 }
      );
    }

    // Деактивация приглашения
    await invitation.update({
      $set: {
        isActive: false,
        updatedAt: Date.now()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Приглашение деактивировано'
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error deleting invitation:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось удалить приглашение: ' + error.message },
      { status: 500 }
    );
  }
}
