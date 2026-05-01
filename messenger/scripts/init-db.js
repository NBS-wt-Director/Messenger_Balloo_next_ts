/**
 * Скрипт инициализации базы данных Better-SQLite3
 */

const db = require('../src/lib/database');

console.log('✓ База данных инициализирована успешно');
console.log('✓ Путь к БД:', db.name);

// Проверяем таблицы
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(`✓ Таблиц: ${tables.length}`);
tables.forEach((table: any) => {
  console.log(`  - ${table.name}`);
});

// Создаём тестового пользователя если не существует
const existingUser = db.prepare('SELECT id FROM User WHERE email = ?').get('admin@test.com');
if (!existingUser) {
  console.log('✓ Создаём тестового пользователя...');
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
  const { generateUserAvatar } = require('./src/lib/avatar');
  const avatar = generateUserAvatar(userId, 'Admin User');
  
  db.prepare(`
    INSERT INTO User (id, email, displayName, passwordHash, fullName, adminRoles, avatar, avatarHistory, userNumber, points, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, '[]', ?, ?, ?, ?)
  `).run(userId, 'admin@test.com', 'Admin User', 'dummy_hash_for_testing', 'Admin', adminRoles, avatar, userNumber, points, now, now);
  
  console.log(`✓ Пользователь создан: admin@test.com`);
  console.log(`✓ Номер пользователя: #${userNumber}`);
  console.log(`✓ Баланс баллов: ${points}`);
  if (userNumber === 1) {
    console.log(`✓ РОЛЬ: СУПЕР-АДМИН (первый пользователь!)`);
  }
}

// Создаём системный чат новостей если не существует
const newsChatExists = db.prepare('SELECT id FROM Chat WHERE id = ?').get('balloo-news');
if (!newsChatExists) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, createdAt, updatedAt)
    VALUES (?, 'channel', 'Balloo - новости, фичи, возможности', 'Официальные новости, фичи и возможности мессенджера', 'system', 1, ?, ?)
  `).run('balloo-news', now, now);
  console.log('✓ Создан системный чат новостей');
}

console.log('✓ Инициализация завершена');
