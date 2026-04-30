#!/bin/bash
# fixSystemChats.sh - Исправление системных чатов при деплое
# Запуск: bash fixSystemChats.sh

set -e

echo "========================================="
echo "Исправление системных чатов Balloo"
echo "========================================="

cd "$(dirname "$0")"

# Проверяем наличие Prisma
if ! command -v npx &> /dev/null; then
    echo "Ошибка: npx не найден!"
    exit 1
fi

# Проверяем наличие базы данных
if [ ! -f "prisma/dev.db" ]; then
    echo "Ошибка: База данных prisma/dev.db не найдена!"
    exit 1
fi

# 1. Создаём миграцию для новых полей
echo ""
echo "1. Создание миграции для поля phone..."
npx prisma migrate dev --name add_phone_field --create-only || true
npx prisma migrate deploy || true

# 2. Создаём/обновляем Prisma Client
echo ""
echo "2. Генерация Prisma Client..."
npx prisma generate

# 3. Проверяем существование чата новостей
echo ""
echo "3. Проверка чата новостей..."

node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkNewsChat() {
  const newsChat = await prisma.chat.findUnique({
    where: { id: 'balloo-news' }
  });

  if (!newsChat) {
    console.log('Чат новостей не существует, создаём...');
    await prisma.chat.create({
      data: {
        id: 'balloo-news',
        type: 'channel',
        name: 'Balloo - новости, фичи, план',
        description: 'Официальные обновления Balloo',
        createdBy: 'system',
        isSystemChat: true
      }
    });
    console.log('✅ Чат новостей создан');
  } else {
    console.log('✅ Чат новостей существует');
  }
  
  await prisma.$disconnect();
}

checkNewsChat().catch(console.error);
"

# 4. Добавляем всех пользователей в чат новостей
echo ""
echo "4. Добавление всех пользователей в чат новостей..."

node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAllUsersToNews() {
  const users = await prisma.user.findMany({
    select: { id: true }
  });

  let added = 0;
  for (const user of users) {
    try {
      await prisma.chatMember.upsert({
        where: {
          chatId_userId: {
            chatId: 'balloo-news',
            userId: user.id
          }
        },
        update: {
          joinedAt: new Date()
        },
        create: {
          chatId: 'balloo-news',
          userId: user.id,
          role: 'reader',
          joinedAt: new Date()
        }
      });
      added++;
      console.log('  ✅ Добавлен пользователь:', user.id);
    } catch (error) {
      console.log('  ⚠️  Ошибка для пользователя:', user.id, error.message);
    }
  }

  console.log('');
  console.log('✅ Добавлено пользователей в чат новостей:', added);
  console.log('Всего пользователей:', users.length);
  
  await prisma.$disconnect();
}

addAllUsersToNews().catch(console.error);
"

# 5. Создаём "Избранное" для всех пользователей (если нет)
echo ""
echo "5. Создание чата 'Избранное' для всех пользователей..."

node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createNotesForAll() {
  const users = await prisma.user.findMany({
    select: { id: true }
  });

  let created = 0;
  for (const user of users) {
    const chatId = 'notes_' + user.id;
    
    try {
      await prisma.chat.upsert({
        where: { id: chatId },
        update: {},
        create: {
          id: chatId,
          type: 'private',
          name: 'Избранное',
          description: 'Ваши заметки',
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
      created++;
      console.log('  ✅ Создано Избранное для:', user.id);
    } catch (error) {
      console.log('  ⚠️  Ошибка для пользователя:', user.id, error.message);
    }
  }

  console.log('');
  console.log('✅ Создано чатов "Избранное":', created);
  console.log('Всего пользователей:', users.length);
  
  await prisma.$disconnect();
}

createNotesForAll().catch(console.error);
"

echo ""
echo "========================================="
echo "✅ Исправление системных чатов завершено!"
echo "========================================="
echo ""
echo "Следующие шаги:"
echo "1. Перезагрузите приложение: pm2 restart messenger-alpha"
echo "2. Проверьте логи: pm2 logs messenger-alpha --lines 20"
echo ""
