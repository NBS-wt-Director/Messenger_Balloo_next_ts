/**
 * Скрипт инициализации базы данных Better-SQLite3
 * Запуск: node scripts/init-db.js
 */

const path = require('path');

console.log('========================================');
console.log('  Balloo Messenger - Инициализация БД');
console.log('========================================\n');

// Импортируем БД (это создаст все таблицы)
const db = require('../src/lib/database');

console.log('✓ База данных подключена');
console.log('✓ Путь к БД:', path.join(process.cwd(), 'data/app.db'));

// Проверяем таблицы
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log(`\n✓ Таблиц: ${tables.length}`);
tables.forEach((table) => {
  console.log(`  - ${table.name}`);
});

// Проверяем поле emailVerified в User
const userColumns = db.prepare("PRAGMA table_info(User)").all();
const hasEmailVerified = userColumns.some(col => col.name === 'emailVerified');
console.log(`\n✓ Поле emailVerified: ${hasEmailVerified ? 'есть' : 'ОТСУТСТВУЕТ!'}`);

// Проверяем таблицу VerificationCode
const verificationTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='VerificationCode'").get();
console.log(`✓ Таблица VerificationCode: ${verificationTable ? 'есть' : 'ОТСУТСТВУЕТ!'}`);

// Создаём тестового пользователя если не существует
const existingUser = db.prepare('SELECT id, email, displayName, userNumber, points, adminRoles FROM User WHERE email = ?').get('admin@test.com');
if (!existingUser) {
  console.log('\n✓ Создаём тестового пользователя...');
  const userId = 'user-1';
  const now = new Date().toISOString();
  
  // Проверяем сколько пользователей уже есть
  const userCount = db.prepare('SELECT COUNT(*) as count FROM User').get();
  const userNumber = (userCount.count || 0) + 1;
  
  // Начисляем баллы: первым 10000 - 5000, остальным - 55
  const points = userNumber <= 10000 ? 5000 : -55;
  
  // Первый пользователь получает супер-админа
  const adminRoles = userNumber === 1 ? '["superadmin"]' : '[]';
  
  // Генерируем аватар
  const { generateUserAvatar } = require('../src/lib/avatar');
  const avatar = generateUserAvatar(userId, 'Admin User');
  
  db.prepare(`
    INSERT INTO User (id, email, displayName, passwordHash, fullName, adminRoles, avatar, avatarHistory, userNumber, points, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, '[]', ?, ?, ?, ?)
  `).run(userId, 'admin@test.com', 'Admin User', 'dummy_hash_for_testing', 'Admin', adminRoles, avatar, userNumber, points, now, now);
  
  console.log(`  ✓ Пользователь создан: admin@test.com`);
  console.log(`  ✓ Номер пользователя: #${userNumber}`);
  console.log(`  ✓ Баланс баллов: ${points}`);
  if (userNumber === 1) {
    console.log(`  ✓ РОЛЬ: СУПЕР-АДМИН (первый пользователь!)`);
  }
} else {
  console.log('\n✓ Тестовый пользователь уже существует:', existingUser.email);
  console.log(`  Номер: #${existingUser.userNumber}, Баллы: ${existingUser.points}`);
}

// Создаём системный чат новостей если не существует
const newsChatExists = db.prepare('SELECT id, name FROM Chat WHERE id = ?').get('balloo-news');
if (!newsChatExists) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, createdAt, updatedAt)
    VALUES (?, 'channel', 'Balloo - новости, фичи, возможности', 'Официальные новости, фичи и возможности мессенджера', 'system', 1, ?, ?)
  `).run('balloo-news', now, now);
  console.log('\n✓ Создан системный чат новостей: balloo-news');
} else {
  console.log('\n✓ Системный чат новостей уже существует:', newsChatExists.name);
}

// Показываем статистику
const totalUsers = db.prepare('SELECT COUNT(*) as count FROM User').get();
const totalChats = db.prepare('SELECT COUNT(*) as count FROM Chat').get();
const totalMessages = db.prepare('SELECT COUNT(*) as count FROM Message').get();

console.log('\n========================================');
console.log('  СТАТИСТИКА БАЗЫ ДАННЫХ');
console.log('========================================');
console.log(`  Пользователей: ${totalUsers.count}`);
console.log(`  Чатов: ${totalChats.count}`);
console.log(`  Сообщений: ${totalMessages.count}`);
console.log('========================================\n');

console.log('✓ Инициализация БД завершена успешно!');
console.log('\n💡 Для запуска приложения:');
console.log('   npm run build');
console.log('   pm2 start "npx next start -p 3000" --name messenger-alpha');
console.log('');
