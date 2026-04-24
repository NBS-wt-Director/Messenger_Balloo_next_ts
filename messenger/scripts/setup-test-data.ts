/**
 * Скрипт создания тестовых пользователей и чатов
 * Запуск: npm run setup-test-data
 * 
 * Использует API endpoints вместо прямого доступа к БД
 */

const API_URL = 'http://localhost:3000';

interface TestUser {
  email: string;
  password: string;
  displayName: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
}

const TEST_USERS: TestUser[] = [
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

async function registerUser(userData: TestUser): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName
      })
    });

    const data = await response.json();
    
    if (response.ok || data.success) {
      return data;
    } else if (data.error?.includes('already exists')) {
      console.log(`  ✅ Пользователь ${userData.displayName} уже существует`);
      return null;
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  } catch (error: any) {
    console.error(`  ❌ Ошибка регистрации ${userData.displayName}:`, error.message);
    throw error;
  }
}

async function login(email: string, password: string): Promise<{ token: string; user: any }> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Login failed');
  }

  return { token: data.token, user: data.user };
}

async function main() {
  console.log('========================================');
  console.log('  Balloo Messenger - Setup Test Data');
  console.log('========================================\n');

  console.log('⚠️  ВАЖНО: Перед запуском убедитесь, что:');
  console.log('   1. Сервер запущен (npm run dev)');
  console.log('   2. Порт 3000 свободен\n');

  console.log('[Setup] Регистрация пользователей...\n');
  
  for (const userData of TEST_USERS) {
    await registerUser(userData);
  }

  console.log('\n========================================');
  console.log('  ✅ ПОЛЬЗОВАТЕЛИ СОЗДАНЫ!');
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
  console.log('\n🌐 СЛЕДУЮЩИЕ ШАГИ:');
  console.log('   1. Запустите: npm run dev');
  console.log('   2. Откройте: http://localhost:3000');
  console.log('   3. Войдите как: admin@balloo.ru / Admin123!');
  console.log('   4. Создайте чаты через интерфейс\n');
  console.log('========================================\n');
}

main().catch((error: any) => {
  console.error('[Setup] Критическая ошибка:', error);
  process.exit(1);
});
