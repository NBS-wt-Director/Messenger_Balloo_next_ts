/**
 * createSystemChats.ts
 * Скрипт для создания системных чатов при регистрации пользователя
 * 
 * Запуск: npx ts-node createSystemChats.ts <userId>
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYSTEM_CHATS = {
  NOTES: {
    name: 'Избранное',
    description: 'Ваши заметки',
    idPrefix: 'notes_'
  },
  NEWS: {
    name: 'Balloo - новости, фичи, план',
    description: 'Официальные обновления Balloo',
    id: 'balloo-news'
  }
};

async function createSystemChats(userId: string) {
  console.log(`[SystemChats] Создание системных чатов для пользователя ${userId}...`);

  try {
    // 1. Проверить существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.error(`[SystemChats] Пользователь ${userId} не найден!`);
      return false;
    }

    // 2. Создать чат "Избранное" (личная заметка)
    const notesChatId = `${SYSTEM_CHATS.NOTES.idPrefix}${userId}`;
    
    const notesChat = await prisma.chat.upsert({
      where: { id: notesChatId },
      update: {},
      create: {
        id: notesChatId,
        type: 'private',
        name: SYSTEM_CHATS.NOTES.name,
        description: SYSTEM_CHATS.NOTES.description,
        createdBy: userId,
        isSystemChat: true,
        members: {
          create: {
            userId: userId,
            role: 'creator',
            joinedAt: new Date()
          }
        }
      }
    });

    console.log(`[SystemChats] ✅ Чат "Избранное" создан: ${notesChatId}`);

    // 3. Проверить существование чата новостей
    let newsChat = await prisma.chat.findUnique({
      where: { id: SYSTEM_CHATS.NEWS.id }
    });

    // 4. Если чат новостей не существует - создать
    if (!newsChat) {
      newsChat = await prisma.chat.create({
        data: {
          id: SYSTEM_CHATS.NEWS.id,
          type: 'channel',
          name: SYSTEM_CHATS.NEWS.name,
          description: SYSTEM_CHATS.NEWS.description,
          createdBy: 'system',
          isSystemChat: true,
          members: {
            create: {
              userId: userId,
              role: 'reader',
              joinedAt: new Date()
            }
          }
        }
      });
      console.log(`[SystemChats] ✅ Чат "Новости" создан (первый пользователь)`);
    } else {
      // 5. Добавить пользователя в существующий чат новостей
      await prisma.chatMember.upsert({
        where: {
          chatId_userId: {
            chatId: SYSTEM_CHATS.NEWS.id,
            userId: userId
          }
        },
        update: {
          joinedAt: new Date()
        },
        create: {
          chatId: SYSTEM_CHATS.NEWS.id,
          userId: userId,
          role: 'reader',
          joinedAt: new Date()
        }
      });
      console.log(`[SystemChats] ✅ Пользователь добавлен в чат "Новости"`);
    }

    console.log(`[SystemChats] ✅ Все системные чаты созданы для ${userId}`);
    return true;

  } catch (error) {
    console.error('[SystemChats] Ошибка:', error);
    return false;
  }
}

// Запуск при вызове скрипта
async function main() {
  const userId = process.argv[2];

  if (!userId) {
    console.error('Использование: npx ts-node createSystemChats.ts <userId>');
    process.exit(1);
  }

  const success = await createSystemChats(userId);
  
  await prisma.$disconnect();
  process.exit(success ? 0 : 1);
}

main();
