import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userId } = body;

    if (!code || !userId) {
      return NextResponse.json({ error: 'code и userId являются обязательными' }, { status: 400 });
    }

    const invitation = db.prepare('SELECT * FROM Invitation WHERE code = ?').get(code) as any;

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    const now = Date.now();
    const expiresAt = invitation.expiresAt ? new Date(invitation.expiresAt).getTime() : null;

    if (expiresAt && now > expiresAt) {
      return NextResponse.json({ success: false, error: 'Приглашение истекло' });
    }

    if (invitation.maxUses && invitation.usedCount >= invitation.maxUses) {
      return NextResponse.json({ success: false, error: 'Приглашение достигло лимита использований' });
    }

    if (!invitation.isActive) {
      return NextResponse.json({ success: false, error: 'Приглашение больше не активно' });
    }

    const chat = db.prepare('SELECT * FROM Chat WHERE id = ?').get(invitation.chatId) as any;
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const member = db.prepare('SELECT * FROM ChatMember WHERE chatId = ? AND userId = ?').get(invitation.chatId, userId) as any;
    if (member) {
      return NextResponse.json({ success: false, error: 'Вы уже состоите в этом чате' });
    }

    const nowIso = new Date().toISOString();
    db.prepare('INSERT INTO ChatMember (chatId, userId, role, joinedAt) VALUES (?, ?, ?, ?)')
      .run(invitation.chatId, userId, 'author', nowIso);

    const newUsedCount = invitation.usedCount + 1;
    const shouldStayActive = !invitation.isOneTime && newUsedCount < (invitation.maxUses || Infinity);
    db.prepare('UPDATE Invitation SET usedCount = ?, isActive = ?, updatedAt = ? WHERE id = ?')
      .run(newUsedCount, shouldStayActive ? 1 : 0, nowIso, invitation.id);

    return NextResponse.json({
      success: true,
      chatId: invitation.chatId,
      message: 'Успешно присоединились к чату'
    });
  } catch (error) {
    console.error('[API] Error accepting invitation:', error);
    return NextResponse.json({ error: 'Не удалось принять приглашение' }, { status: 500 });
  }
}
