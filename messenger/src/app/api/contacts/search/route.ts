import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const currentUserId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        contacts: []
      });
    }

    if (!currentUserId) {
      return NextResponse.json(
        { error: 'userId требуется для поиска' },
        { status: 400 }
      );
    }

    // Поиск пользователей по имени, email или телефону
    const searchPattern = `%${query}%`;
    const users = db.prepare(`
      SELECT * FROM User 
      WHERE id != ? 
      AND (
        displayName LIKE ? 
        OR fullName LIKE ? 
        OR email LIKE ? 
        OR phone LIKE ?
      )
      LIMIT ?
    `).all(currentUserId, searchPattern, searchPattern, searchPattern, searchPattern, limit) as any[];

    // Получение информации о существующих контактах
    const contactIds = users.map(u => u.id);
    let existingContacts: any[] = [];
    
    if (contactIds.length > 0) {
      const placeholders = contactIds.map(() => '?').join(',');
      existingContacts = db.prepare(`
        SELECT * FROM Contact 
        WHERE userId = ? AND contactId IN (${placeholders})
      `).all(currentUserId, ...contactIds) as any[];
    }

    const existingContactMap = new Map(
      existingContacts.map(c => [c.contactId, c])
    );

    // Формирование результата
    const contacts = users.map(user => {
      const existingContact = existingContactMap.get(user.id);
      
      return {
        id: user.id,
        displayName: user.displayName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        isContact: !!existingContact,
        isFavorite: existingContact?.isFavorite || false,
        isBlocked: existingContact?.isBlocked || false
      };
    });

    return NextResponse.json({
      success: true,
      contacts,
      query
    });
  } catch (error) {
    console.error('[API] Error searching contacts:', error);
    return NextResponse.json(
      { error: 'Не удалось выполнить поиск' },
      { status: 500 }
    );
  }
}
