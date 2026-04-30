#!/usr/bin/env node
/**
 * deploy-fix.js
 * Полный скрипт для исправления всех проблем при деплое
 * 
 * Что делает:
 * 1. Создаёт системных пользователей (support)
 * 2. Создаёт системные чаты для всех пользователей
 * 3. Исправляет контакты и семейные связи
 * 4. Проверяет целостность данных
 * 
 * Запуск: node deploy-fix.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Начато исправление при деплое...\n');

  // === 1. Создание системного пользователя поддержки ===
  console.log('=== 1. Системные пользователи ===');
  
  const supportExists = await prisma.user.findUnique({
    where: { id: 'support' }
  });

  if (!supportExists) {
    await prisma.user.create({
      data: {
        id: 'support',
        email: 'support@balloo.su',
        passwordHash: 'system', // Не используется
        displayName: 'Техподдержка Balloo',
        isAdmin: true,
        isOnline: true,
        status: 'online'
      }
    });
    console.log('✅ Создан пользователь support');
  } else {
    console.log('ℹ️  Пользователь support уже существует');
  }

  // === 2. Создание системных чатов для всех пользователей ===
  console.log('\n=== 2. Системные чаты ===');

  const users = await prisma.user.findMany({
    where: { id: { not: 'support' } },
    select: { id: true, email: true }
  });

  console.log(`📊 Найдено пользователей: ${users.length}`);

  let chatsCreated = 0;
  let errors = 0;

  for (const user of users) {
    try {
      // 1.1 Чат "Мои заметки"
      const existingNotes = await prisma.chat.findFirst({
        where: {
          type: 'private',
          isSystemChat: true,
          members: {
            some: { userId: user.id }
          }
        }
      });

      if (!existingNotes) {
        await prisma.chat.create({
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
        chatsCreated++;
      }

      // 1.2 Чат с техподдержкой
      const existingSupport = await prisma.chat.findFirst({
        where: {
          isSystemChat: true,
          name: 'Техподдержка Balloo',
          members: {
            some: { userId: user.id }
          }
        }
      });

      if (!existingSupport) {
        await prisma.chat.create({
          data: {
            type: 'private',
            name: 'Техподдержка Balloo',
            createdBy: 'system',
            isSystemChat: true,
            members: {
              create: [
                { userId: user.id, role: 'reader', joinedAt: new Date() },
                { userId: 'support', role: 'creator', joinedAt: new Date() }
              ]
            }
          }
        });
        chatsCreated++;
      }

      // 1.3 Чат новостей
      let newsChat = await prisma.chat.findUnique({
        where: { id: 'balloo-news' }
      });

      if (!newsChat) {
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
        chatsCreated++;
      } else {
        const alreadyMember = await prisma.chatMember.findUnique({
          where: {
            chatId_userId: {
              chatId: 'balloo-news',
              userId: user.id
            }
          }
        });

        if (!alreadyMember) {
          await prisma.chatMember.create({
            data: {
              chatId: 'balloo-news',
              userId: user.id,
              role: 'reader',
              joinedAt: new Date()
            }
          });
          chatsCreated++;
        }
      }

    } catch (error) {
      console.error(`❌ Ошибка для ${user.email}:`, error.message);
      errors++;
    }
  }

  console.log(`✅ Создано/обновлено чатов: ${chatsCreated}`);
  console.log(`❌ Ошибок: ${errors}`);

  // === 3. Исправление контактов и семейных связей ===
  console.log('\n=== 3. Контакты и связи ===');

  const privateChats = await prisma.chat.findMany({
    where: { type: 'private' },
    include: {
      members: {
        select: { userId: true }
      }
    }
  });

  let contactsFixed = 0;
  let relationsFixed = 0;

  for (const chat of privateChats) {
    if (chat.members.length === 2) {
      const [user1, user2] = chat.members.map(m => m.userId);

      // Создаём контакты зеркально
      const contact1 = await prisma.contact.upsert({
        where: {
          userId_contactId: { userId: user1, contactId: user2 }
        },
        update: {},
        create: {
          userId: user1,
          contactId: user2,
          name: user2 === 'support' ? 'Техподдержка' : `User ${user2}`
        }
      });

      const contact2 = await prisma.contact.upsert({
        where: {
          userId_contactId: { userId: user2, contactId: user1 }
        },
        update: {},
        create: {
          userId: user2,
          contactId: user1,
          name: user1 === 'support' ? 'Техподдержка' : `User ${user1}`
        }
      });

      contactsFixed += 2;

      // Создаём семейные связи
      await prisma.familyRelation.upsert({
        where: {
          userId_relatedUserId: { userId: user1, relatedUserId: user2 }
        },
        update: {},
        create: {
          userId: user1,
          relatedUserId: user2,
          relationType: 'friend'
        }
      });

      await prisma.familyRelation.upsert({
        where: {
          userId_relatedUserId: { userId: user2, relatedUserId: user1 }
        },
        update: {},
        create: {
          userId: user2,
          relatedUserId: user1,
          relationType: 'friend'
        }
      });

      relationsFixed += 2;
    }
  }

  console.log(`✅ Исправлено контактов: ${contactsFixed}`);
  console.log(`✅ Исправлено связей: ${relationsFixed}`);

  // === 4. Проверка целостности данных ===
  console.log('\n=== 4. Проверка целостности ===');

  const totalUsers = await prisma.user.count();
  const totalChats = await prisma.chat.count();
  const totalMessages = await prisma.message.count();
  const totalContacts = await prisma.contact.count();
  const totalRelations = await prisma.familyRelation.count();

  console.log(`📊 Пользователей: ${totalUsers}`);
  console.log(`📊 Чатов: ${totalChats}`);
  console.log(`📊 Сообщений: ${totalMessages}`);
  console.log(`📊 Контактов: ${totalContacts}`);
  console.log(`📊 Связей: ${totalRelations}`);

  // Проверка орфанных записей
  const orphanMessages = await prisma.message.count({
    where: {
      OR: [
        { chat: null },
        { sender: null }
      ]
    }
  });

  if (orphanMessages > 0) {
    console.log(`⚠️  Обнаружено орфанных сообщений: ${orphanMessages}`);
  } else {
    console.log('✅ Нет орфанных сообщений');
  }

  console.log('\n✨ Исправление завершено успешно!');
}

main()
  .catch((error) => {
    console.error('💥 Критическая ошибка:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
