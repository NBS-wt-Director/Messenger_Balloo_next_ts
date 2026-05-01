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
  
  db.prepare(`
    INSERT INTO User (id, email, displayName, passwordHash, fullName, adminRoles, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, '[]', ?, ?)
  `).run(userId, 'admin@test.com', 'Admin User', 'dummy_hash_for_testing', 'Admin', now, now);
  
  console.log('✓ Пользователь создан: admin@test.com');
}

console.log('✓ Инициализация завершена');
