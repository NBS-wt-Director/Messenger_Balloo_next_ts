/**
 * Скрипт создания тестовых пользователей и чатов
 * Запуск: node scripts/setup-test-data.js
 */

const bcrypt = require('bcryptjs');
const { createRxDatabase } = require('rxdb');
const { getRxStorageMemory } = require('rxdb/plugins/storage-memory');
const { wrappedValidateAjvStorage } = require('rxdb/plugins/validate-ajv');

// Схемы для базы данных (упрощённые для скрипта)
const userSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    email: { type: 'string' },
    passwordHash: { type: 'string' },
    displayName: { type: 'string' },
    fullName: { type: 'string' },
    avatar: { type: 'string' },
    status: { type: 'string' },
    isAdmin: { type: 'boolean' },
    isSuperAdmin: { type: 'boolean' },
    adminRoles: { type: 'array', items: { type: 'string' } },
    pushTokens: { type: 'array', items: { type: 'object' } },
    settings: {
      type: 'object',
      properties: {
        theme: { type: 'string' },
        language: { type: 'string' },
        notificationsEnabled: { type: 'boolean' }
      }
    },
    familyRelations: { type: 'array', items: { type: 'object' } },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' },
    lastSeen: { type: 'number' }
  },
  required: ['id', 'email', 'passwordHash', 'displayName', 'createdAt', 'updatedAt']
};

const chatSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    type: { type: 'string' },
    name: { type: 'string' },
    avatar: { type: 'string' },
    participants: { type: 'array', items: { type: 'string' } },
    members: { type: 'object' },
    adminIds: { type: 'array', items: { type: 'string' } },
    createdBy: { type: 'string' },
    description: { type: 'string' },
    isFavorite: { type: 'object' },
    pinned: { type: 'object' },
    unreadCount: { type: 'object' },
    lastMessage: { type: 'object' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'type', 'participants', 'createdBy', 'createdAt', 'updatedAt']
};

const messageSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    chatId: { type: 'string' },
    senderId: { type: 'string' },
    type: { type: 'string' },
    content: { type: 'string' },
    mediaUrl: { type: 'string' },
    thumbnailUrl: { type: 'string' },
    fileName: { type: 'string' },
    fileSize: { type: 'number' },
    mimeType: { type: 'string' },
    replyToId: { type: 'string' },
    replyToMessage: { type: 'object' },
    reactions: { type: 'object' },
    readBy: { type: 'array', items: { type: 'string' } },
    status: { type: 'string' },
    edited: { type: 'boolean' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'chatId', 'senderId', 'type', 'content', 'createdAt', 'updatedAt']
};

const schemas = {
  users: userSchema,
  chats: chatSchema,
  messages: messageSchema
};

const TEST_USERS = [
  {
    email: 'admin@balloo.ru',
    password: 'Admin123!',
    displayName: 'Администратор',
    isAdmin: true,
    isSuperAdmin: true
  },
  {
    email: 'user1@balloo.ru',
    password: 'User123!',
    displayName: 'Алексей Иванов',
    isAdmin: false
  },
  {
    email: 'user2@balloo.ru',
    password: 'User123!',
    displayName: 'Мария Петрова',
    isAdmin: false
  },
  {
    email: 'user3@balloo.ru',
    password: 'User123!',
    displayName: 'Дмитрий Сидоров',
    isAdmin: false
  }
];

let dbInstance = null;

async function getDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  const dbName = `balloo_setup_${Date.now()}`;
  
  const database = await createRxDatabase({
    name: dbName,
    storage: wrappedValidateAjvStorage({
      storage: getRxStorageMemory()
    }),
    multiInstance: false
  });

  await database.addCollections({
    users: { schema: schemas.users },
    chats: { schema: schemas.chats },
    messages: { schema: schemas.messages }
  });

  dbInstance = database;
  return database;
}

async function createUsers() {
  console.log('[Setup] Создаю тестовых пользователей...');
  
  const db = await getDatabase();
  const usersCollection = db.users;
  
  for (const userData of TEST_USERS) {
    const existingUser = await usersCollection.findOne({
      selector: { email: userData.email }
    }).exec();
    
    if (existingUser) {
      console.log(`  ✅ Пользователь ${userData.displayName} уже существует`);
      continue;
    }
    
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const now = Date.now();
    
    const newUser = await usersCollection.insert({
      id: `user_${userData.email.split('@')[0]}`,
      email: userData.email,
      passwordHash,
      displayName: userData.displayName,
      fullName: userData.displayName,
      avatar: '',
      status: 'offline',
      isAdmin: userData.isAdmin,
      isSuperAdmin: userData.isSuperAdmin || false,
      adminRoles: userData.isAdmin ? ['admin'] : [],
      pushTokens: [],
      settings: {
        theme: 'dark',
        language: 'ru',
        notificationsEnabled: true,
        soundEnabled: true,
        vibrateEnabled: false
      },
      familyRelations: [],
      createdAt: now,
      updatedAt: now,
      lastSeen: now
    });
    
    console.log(`  ✅ Создан пользователь: ${newUser.displayName} (${newUser.email})`);
  }
  
  console.log('[Setup] Пользователи созданы!\n');
}

async function createChats() {
  console.log('[Setup] Создаю тестовые чаты...');
  
  const db = await getDatabase();
  const chatsCollection = db.chats;
  const usersCollection = db.users;
  
  const users = await usersCollection.find().exec();
  
  if (users.length < 2) {
    console.log('  ❌ Нужно минимум 2 пользователя для создания чатов');
    return;
  }
  
  const [user1, user2, user3] = users;
  
  // Функция для создания чата если не существует
  async function createChatIfNotExists(chatId, chatData) {
    try {
      const existing = await chatsCollection.findOne(chatId).exec();
      if (existing) {
        console.log(`  ℹ️ Чат ${chatId} уже существует`);
        return;
      }
      await chatsCollection.insert(chatData);
      console.log(`  ✅ Создан чат: ${chatData.name || chatData.participants.join('-')}`);
    } catch (e) {
      if (e.code === 'CONFLICT') {
        console.log(`  ℹ️ Чат ${chatId} уже существует (conflict)`);
      } else {
        throw e;
      }
    }
  }
  
  // Чат: Администратор и Алексей
  await createChatIfNotExists('chat_admin_alex', {
    id: 'chat_admin_alex',
    type: 'private',
    name: '',
    avatar: '',
    participants: [user1.id, user2.id],
    members: {
      [user1.id]: { role: 'author', joinedAt: Date.now(), lastReadMessageId: '' },
      [user2.id]: { role: 'author', joinedAt: Date.now(), lastReadMessageId: '' }
    },
    adminIds: [],
    createdBy: user1.id,
    description: '',
    isFavorite: { [user1.id]: false, [user2.id]: false },
    pinned: { [user1.id]: false, [user2.id]: false },
    unreadCount: { [user1.id]: 0, [user2.id]: 0 },
    lastMessage: {},
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  
  // Чат: Администратор и Мария
  await createChatIfNotExists('chat_admin_maria', {
    id: 'chat_admin_maria',
    type: 'private',
    name: '',
    avatar: '',
    participants: [user1.id, user3.id],
    members: {
      [user1.id]: { role: 'author', joinedAt: Date.now(), lastReadMessageId: '' },
      [user3.id]: { role: 'author', joinedAt: Date.now(), lastReadMessageId: '' }
    },
    adminIds: [],
    createdBy: user1.id,
    description: '',
    isFavorite: { [user1.id]: false, [user3.id]: false },
    pinned: { [user1.id]: false, [user3.id]: false },
    unreadCount: { [user1.id]: 0, [user3.id]: 0 },
    lastMessage: {},
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  
  // Чат: Алексей и Мария
  await createChatIfNotExists('chat_alex_maria', {
    id: 'chat_alex_maria',
    type: 'private',
    name: '',
    avatar: '',
    participants: [user2.id, user3.id],
    members: {
      [user2.id]: { role: 'author', joinedAt: Date.now(), lastReadMessageId: '' },
      [user3.id]: { role: 'author', joinedAt: Date.now(), lastReadMessageId: '' }
    },
    adminIds: [],
    createdBy: user2.id,
    description: '',
    isFavorite: { [user2.id]: false, [user3.id]: false },
    pinned: { [user2.id]: false, [user3.id]: false },
    unreadCount: { [user2.id]: 0, [user3.id]: 0 },
    lastMessage: {},
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  
  // Групповой чат: Все участники
  try {
    await createChatIfNotExists('chat_all_group', {
      id: 'chat_all_group',
      type: 'group',
      name: 'Общая группа',
      avatar: '',
      participants: [user1.id, user2.id, user3.id],
      members: {
        [user1.id]: { role: 'creator', joinedAt: Date.now(), lastReadMessageId: '' },
        [user2.id]: { role: 'author', joinedAt: Date.now(), lastReadMessageId: '' },
        [user3.id]: { role: 'author', joinedAt: Date.now(), lastReadMessageId: '' }
      },
      adminIds: [user1.id],
      createdBy: user1.id,
      description: 'Тестовый групповой чат',
      isFavorite: { [user1.id]: false, [user2.id]: false, [user3.id]: false },
      pinned: { [user1.id]: false, [user2.id]: false, [user3.id]: false },
      unreadCount: { [user1.id]: 0, [user2.id]: 0, [user3.id]: 0 },
      lastMessage: {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  } catch (e) {
    if (e.code !== 'CONFLICT') {
      throw e;
    }
    console.log('  ℹ️ Групповой чат уже существует');
  }
  
  console.log('[Setup] Чаты созданы!\n');
}

async function createTestMessages() {
  console.log('[Setup] Создаю тестовые сообщения...');
  console.log('[Setup] Сообщения создаются автоматически в браузере при использовании приложения\n');
  console.log('========================================');
  console.log('  ✅ ВСЁ ГОТОВО!');
  console.log('========================================\n');
  
  console.log('📝 ЛОГИНЫ И ПАРОЛИ:');
  console.log('───────────────────────────────────────');
  TEST_USERS.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.displayName}`);
    console.log(`   Email:    ${user.email}`);
    console.log(`   Пароль:   ${user.password}`);
    if (user.isSuperAdmin) {
      console.log(`   ⭐ СУПЕР-АДМИН`);
    } else if (user.isAdmin) {
      console.log(`   👑 АДМИН`);
    }
  });
  
  console.log('\n───────────────────────────────────────');
  console.log('\n📱 ТЕСТОВЫЕ ЧАТЫ:');
  console.log('   1. Администратор ↔ Алексей');
  console.log('   2. Администратор ↔ Мария');
  console.log('   3. Алексей ↔ Мария');
  console.log('   4. Общая группа (все участники)');
  
  console.log('\n🌐 ДОСТУП К ПРИЛОЖЕНИЮ:');
  console.log('   http://localhost:3000');
  console.log('\n========================================\n');
}

async function main() {
  try {
    console.log('========================================');
    console.log('  Balloo Messenger - Setup Test Data');
    console.log('========================================\n');
    
    await createUsers();
    await createChats();
    await createTestMessages();
    
    console.log('========================================');
    console.log('  ✅ ВСЁ ГОТОВО!');
    console.log('========================================\n');
    
    console.log('📝 ЛОГИНЫ И ПАРОЛИ:');
    console.log('───────────────────────────────────────');
    TEST_USERS.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.displayName}`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   Пароль:   ${user.password}`);
      if (user.isSuperAdmin) {
        console.log(`   ⭐ СУПЕР-АДМИН`);
      } else if (user.isAdmin) {
        console.log(`   👑 АДМИН`);
      }
    });
    
    console.log('\n───────────────────────────────────────');
    console.log('\n📱 ТЕСТОВЫЕ ЧАТЫ:');
    console.log('   1. Алексей ↔ Мария');
    console.log('   2. Алексей ↔ Дмитрий');
    console.log('   3. Мария ↔ Дмитрий');
    console.log('   4. Общая группа (все участники)');
    
    console.log('\n🌐 ДОСТУП К ПРИЛОЖЕНИЮ:');
    console.log('   http://localhost:3000');
    console.log('\n========================================\n');
    
  } catch (error) {
    console.error('[Setup] Ошибка:', error);
    process.exit(1);
  }
}

main();
