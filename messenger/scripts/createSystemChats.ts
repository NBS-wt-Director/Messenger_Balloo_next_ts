/**
 * createSystemChats.ts
 * Скрипт для создания системных чатов при регистрации пользователя
 * 
 * Запуск: npx ts-node createSystemChats.ts <userId>
 */

const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

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
    const user = db.prepare('SELECT id FROM User WHERE id = ?').get(userId);

    if (!user) {
      console.error(`[SystemChats] Пользователь ${userId} не найден!`);
      return false;
    }

    // 2. Создать чат "Избранное" (личная заметка)
    const notesChatId = `${SYSTEM_CHATS.NOTES.idPrefix}${userId}`;
    
    const existingNotes = db.prepare('SELECT id FROM Chat WHERE id = ?').get(notesChatId);
    
    if (!existingNotes) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, createdAt, updatedAt)
        VALUES (?, 'private', ?, ?, ?, 1, ?, ?)
      `).run(notesChatId, SYSTEM_CHATS.NOTES.name, SYSTEM_CHATS.NOTES.description, userId, now, now);
      
      db.prepare(`
        INSERT INTO ChatMember (chatId, userId, role, joinedAt)
        VALUES (?, ?, 'creator', ?)
      `).run(notesChatId, userId, now);
      
      console.log(`[SystemChats] ✅ Чат "Избранное" создан: ${notesChatId}`);
    }

    // 3. Проверить существование чата новостей
    const newsChat = db.prepare('SELECT id FROM Chat WHERE id = ?').get(SYSTEM_CHATS.NEWS.id);

    // 4. Если чат новостей не существует - создать
    if (!newsChat) {
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, createdAt, updatedAt)
        VALUES (?, 'channel', ?, ?, 'system', 1, ?, ?)
      `).run(SYSTEM_CHATS.NEWS.id, SYSTEM_CHATS.NEWS.name, SYSTEM_CHATS.NEWS.description, now, now);
      
      db.prepare(`
        INSERT INTO ChatMember (chatId, userId, role, joinedAt)
        VALUES (?, ?, 'reader', ?)
      `).run(SYSTEM_CHATS.NEWS.id, userId, now);
      
      console.log(`[SystemChats] ✅ Чат "Новости" создан (первый пользователь)`);
    } else {
      // 5. Добавить пользователя в существующий чат новостей
      const existingMember = db.prepare('SELECT * FROM ChatMember WHERE chatId = ? AND userId = ?').get(SYSTEM_CHATS.NEWS.id, userId);
      
      if (!existingMember) {
        const now = new Date().toISOString();
        db.prepare(`
          INSERT INTO ChatMember (chatId, userId, role, joinedAt)
          VALUES (?, ?, 'reader', ?)
        `).run(SYSTEM_CHATS.NEWS.id, userId, now);
        console.log(`[SystemChats] ✅ Пользователь добавлен в чат "Новости"`);
      } else {
        console.log(`[SystemChats] ✅ Пользователь уже в чате "Новости"`);
      }
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
  process.exit(success ? 0 : 1);
}

main();
