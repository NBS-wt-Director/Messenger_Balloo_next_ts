import { NextRequest, NextResponse } from 'next/server';
import { getInvitationsCollection, getChatsCollection } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userId } = body;

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'code и userId являются обязательными' },
        { status: 400 }
      );
    }

    const invitationsCollection = await getInvitationsCollection();
    const chatsCollection = await getChatsCollection();

    // Поиск приглашения
    const invitation = await invitationsCollection.findOne({
      selector: { code },
      sort: [{ createdAt: 'desc' }]
    }).exec();

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const inviteData = invitation.toJSON();

    // Проверка срока действия
    if (inviteData.expiresAt && Date.now() > inviteData.expiresAt) {
      return NextResponse.json({
        success: false,
        error: 'Приглашение истекло'
      });
    }

    // Проверка лимита использования
    if (inviteData.maxUses && inviteData.currentUses >= inviteData.maxUses) {
      return NextResponse.json({
        success: false,
        error: 'Приглашение достигло лимита использований'
      });
    }

    if (!inviteData.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Приглашение больше не активно'
      });
    }

    // Получение информации о чате
    const chat = await chatsCollection.findOne({ selector: { id: inviteData.chatId } }).exec();
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Проверка, не состоит ли пользователь уже в чате
    if (chat.participants.includes(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Вы уже состоите в этом чате'
      });
    }

    // Добавление пользователя в чат
    const chatDoc = await chatsCollection.findOne({ selector: { id: inviteData.chatId } }).exec();
    if (chatDoc) {
      const newMembers = { ...chatDoc.members, [userId]: { role: 'author', joinedAt: Date.now() } };
      await chatDoc.patch({
        participants: [...chatDoc.participants, userId],
        members: newMembers,
        updatedAt: Date.now()
      });
    }

    // Обновление счетчика использований
    const newCurrentUses = inviteData.currentUses + 1;
    const invDoc = await invitationsCollection.findOne({ selector: { id: invitation.id } }).exec();
    if (invDoc) {
      await invDoc.patch({
        currentUses: newCurrentUses,
        isActive: !inviteData.isOneTime && newCurrentUses < (inviteData.maxUses || Infinity),
        updatedAt: Date.now()
      });
    }

    return NextResponse.json({
      success: true,
      chatId: inviteData.chatId,
      message: 'Успешно присоединились к чату'
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error accepting invitation:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось принять приглашение' },
      { status: 500 }
    );
  }
}
