/**
 * Создание тестовых пользователей
 * ВАЖНО: Запустить ПОСЛЕ первого реального пользователя!
 */

const db = require('../src/lib/database');
const { hash } = require('bcryptjs');
const { generateUserAvatar } = require('../src/lib/avatar');

async function createTestUsers() {
  console.log('🔧 Создание тестовых пользователей...');

  // Проверяем сколько пользователей уже есть
  const userCount = db.prepare('SELECT COUNT(*) as count FROM User').get();
  const currentCount = userCount.count || 0;

  console.log(`✓ Текущее количество пользователей: ${currentCount}`);

  if (currentCount === 0) {
    console.error('❌ ОШИБКА: Сначала зарегистрируйте реального пользователя!');
    console.error('Первый пользователь автоматически станет супер-админом.');
    process.exit(1);
  }

  const testUsers = [
    {
      email: 'test1@balloo.app',
      password: 'Test1234!',
      displayName: 'Test User One',
      fullName: 'Test User One'
    },
    {
      email: 'test2@balloo.app',
      password: 'Test1234!',
      displayName: 'Test User Two',
      fullName: 'Test User Two'
    }
  ];

  for (const testData of testUsers) {
    // Проверяем существует ли пользователь
    const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(testData.email);
    
    if (existing) {
      console.log(`⏭️  Пользователь ${testData.email} уже существует`);
      continue;
    }

    const userId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    // Проверяем количество для номера и баллов
    const countAfter = db.prepare('SELECT COUNT(*) as count FROM User').get();
    const userNumber = (countAfter.count || 0) + 1;
    const points = userNumber <= 10000 ? 5000 : -55;
    
    // Генерируем аватар
    const avatar = generateUserAvatar(userId, testData.displayName);

    // Хешируем пароль
    const passwordHash = await hash(testData.password, 10);

    // Создаём пользователя
    db.prepare(`
      INSERT INTO User (id, email, displayName, passwordHash, fullName, phone, bio, avatar, avatarHistory, settings, adminRoles, online, isOnline, status, userNumber, points, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, '', '', ?, '[]', '{}', '[]', 0, 0, 'offline', ?, ?, ?, ?)
    `).run(
      userId, 
      testData.email, 
      testData.displayName, 
      passwordHash, 
      testData.fullName,
      avatar,
      userNumber,
      points,
      now,
      now
    );

    console.log(`✅ Создан тестовый пользователь:`);
    console.log(`   Email: ${testData.email}`);
    console.log(`   Пароль: ${testData.password}`);
    console.log(`   ID: ${userId}`);
    console.log(`   Номер: #${userNumber}`);
    console.log(`   Баллы: ${points}`);
    console.log('');
  }

  // Проверяем что чат новостей существует
  const newsChatExists = db.prepare('SELECT id FROM Chat WHERE id = ?').get('balloo-news');
  if (!newsChatExists) {
    db.prepare(`
      INSERT INTO Chat (id, type, name, description, createdBy, isSystemChat, createdAt, updatedAt)
      VALUES (?, 'channel', 'Balloo - новости, фичи, возможности', 'Официальные новости, фичи и возможности мессенджера', 'system', 1, ?, ?)
    `).run('balloo-news', now, now);
    console.log('✓ Создан системный чат новостей');
  }

  console.log('🎉 Тестовые пользователи созданы!');
  console.log('\n📝 Данные для входа:');
  console.log('   Реальный пользователь: ' + (currentCount === 1 ? '(первый = супер-админ)' : 'см. базу данных'));
  console.log('   Тест 1: test1@balloo.app / Test1234!');
  console.log('   Тест 2: test2@balloo.app / Test1234!');
}

createTestUsers().catch(console.error);
