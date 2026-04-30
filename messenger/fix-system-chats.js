#!/usr/bin/env node
/**
 * fix-system-chats.js
 * Скрипт для создания системных чатов у всех существующих пользователей
 * Запуск: node fix-system-chats.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Начато исправление системных чатов...');

  // Получаем всех пользователей
  const users = await prisma.user.findMany({
    select: { id: true, email: true }
  });

  console.log(`📊 Найдено пользователей: ${users.length}`);

  let created = 0;
  let errors = 0;

  for (const user of users) {
    try {
      // 1. Чат "Мои заметки"
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
        console.log(`✅ Созданы заметки для ${user.email}`);
      }

      // 2. Чат с техподдержкой
      const existingSupport = await prisma.chat.findFirst({
        where: {
          id: { startsWith: 'support-' },
          isSystemChat: true,
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
                {
                  userId: user.id,
                  role: 'reader',
                  joinedAt: new Date()
                },
                {
                  userId: 'support',
                  role: 'creator',
                  joinedAt: new Date()
                }
              ]
            }
          }
        });
        console.log(`✅ Создана техподдержка для ${user.email}`);
      }

      // 3. Чат новостей (balloo-news)
      const newsChat = await prisma.chat.findUnique({
        where: { id: 'balloo-news' }
      });

      if (newsChat) {
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
          console.log(`✅ Добавлен в новости для ${user.email}`);
        }
      } else {
        // Создаём чат новостей
        await prisma.chat.create({
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
        console.log(`✅ Создан чат новостей для ${user.email}`);
      }

      created++;
    } catch (error) {
      console.error(`❌ Ошибка для ${user.email}:`, error.message);
      errors++;
    }
  }

  console.log('\n📈 Итоги:');
  console.log(`✅ Успешно: ${created}`);
  console.log(`❌ Ошибки: ${errors}`);
  console.log(`📊 Всего пользователей: ${users.length}`);
}

main()
  .catch((error) => {
    console.error('💥 Критическая ошибка:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
