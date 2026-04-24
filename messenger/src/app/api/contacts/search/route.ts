import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection, getContactsCollection } from '@/lib/database';

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

    const usersCollection = await getUsersCollection();
    const contactsCollection = await getContactsCollection();

    // Поиск пользователей по имени, email или телефону
    const searchRegex = new RegExp(query, 'i');
    
    const allUsers = await usersCollection.find().exec();
    const matchingUsers = allUsers.filter(user => {
      const data = user.toJSON();
      return (
        data.id !== currentUserId &&
        !data.isBlocked &&
        (
          data.displayName?.match(searchRegex) ||
          data.fullName?.match(searchRegex) ||
          data.email?.match(searchRegex) ||
          data.phone?.match(searchRegex)
        )
      );
    }).slice(0, limit);

    // Получение информации о существующих контактах
    const contactIds = matchingUsers.map(u => u.id);
    const existingContacts = await contactsCollection.find({
      selector: {
        userId: currentUserId,
        contactUserId: { $in: contactIds }
      }
    }).exec();

    const existingContactMap = new Map(
      existingContacts.map(c => [c.toJSON().contactUserId, c.toJSON()])
    );

    // Формирование результата
    const contacts = matchingUsers.map(user => {
      const userData = user.toJSON();
      const existingContact = existingContactMap.get(userData.id);
      
      return {
        id: userData.id,
        displayName: userData.displayName,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        avatar: userData.avatar,
        status: userData.status,
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
    if (process.env.NODE_ENV === 'development') {
      console.error('[API] Error searching contacts:', error);
    }
    return NextResponse.json(
      { error: 'Не удалось выполнить поиск' },
      { status: 500 }
    );
  }
}
