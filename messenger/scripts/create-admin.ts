/**
 * Скрипт создания первого админ-аккаунта
 * 
 * Запуск: npx ts-node scripts/create-admin.ts
 * Или: node scripts/create-admin.js (после компиляции)
 * 
 * Учетные данные:
 * Email: i@o8eryukhtin.ru
 * Пароль: A13n10n13a
 * Имя: Balloo_father
 * ФИО: Оберюхтин Иван Анатольевич
 * Дата рождения: 06.04.1993
 * 
 * Права админа:
 * - SuperAdmin (полный доступ)
 * - Все административные роли
 */

import { getDatabase } from '../src/lib/database';
import bcrypt from 'bcryptjs';

// Конфигурация админ-аккаунта
const ADMIN_CONFIG = {
  email: 'i@o8eryukhtin.ru',
  password: 'A13n10n13a',
  displayName: 'Balloo_father',
  fullName: 'Оберюхтин Иван Анатольевич',
  birthDate: new Date('1993-04-06').getTime(), // 06.04.1993
};

// Все возможные роли админа
const ALL_ADMIN_ROLES = [
  'superadmin',
  'users',
  'chats',
  'messages',
  'invites',
  'settings',
  'analytics',
  'bans',
  'content',
];

async function createAdminAccount() {
  console.log('🚀 Создание админ-аккаунта...\n');
  
  try {
    // Подключаемся к БД
    const db = await getDatabase();
    const usersCollection = db.users;
    
    if (!usersCollection) {
      console.error('❌ Не удалось подключиться к базе данных');
      console.log('💡 Убедитесь, что приложение запущено и IndexedDB доступен');
      process.exit(1);
    }
    
    // Проверяем, существует ли пользователь
    const existingUser = await usersCollection.findOne({
      selector: { email: ADMIN_CONFIG.email }
    }).exec();
    
    if (existingUser) {
      console.log('⚠️  Пользователь уже существует, обновляем права...\n');
    }
    
    // Хешируем пароль
    const passwordHash = await bcrypt.hash(ADMIN_CONFIG.password, 10);
    
    // Создаем/обновляем пользователя с правами админа
    const userData = {
      id: existingUser?.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: ADMIN_CONFIG.email,
      displayName: ADMIN_CONFIG.displayName,
      fullName: ADMIN_CONFIG.fullName,
      avatar: '',
      publicKey: '',
      passwordHash,
      createdAt: existingUser?.createdAt || Date.now(),
      lastSeen: Date.now(),
      isOnline: false,
      status: 'online',
      updatedAt: Date.now(),
      birthDate: ADMIN_CONFIG.birthDate,
      familyRelations: [],
      
      // Админ-права (полный доступ)
      isAdmin: true,
      isSuperAdmin: true,
      adminRoles: ALL_ADMIN_ROLES,
      adminSince: Date.now(),
    };
    
    // Сохраняем пользователя
    if (existingUser) {
      await existingUser.patch(userData);
    } else {
      await usersCollection.insert(userData);
    }
    
    console.log('✅ Админ-аккаунт успешно создан/обновлён!\n');
    console.log('📧 Email:', ADMIN_CONFIG.email);
    console.log('🔐 Пароль:', ADMIN_CONFIG.password);
    console.log('👤 Имя:', ADMIN_CONFIG.displayName);
    console.log('📝 ФИО:', ADMIN_CONFIG.fullName);
    console.log('📅 Дата рождения: 06.04.1993');
    console.log('\n🔑 Права администратора:');
    console.log('   • SuperAdmin: ДА');
    console.log('   • Роли:', ALL_ADMIN_ROLES.join(', '));
    console.log('\n📅 Админ с:', new Date().toLocaleString('ru-RU'));
    
    // Проверяем созданного пользователя
    const verifyUser = await usersCollection.findOne({
      selector: { email: ADMIN_CONFIG.email }
    }).exec();
    
    if (verifyUser) {
      console.log('\n✅ Верификация: Пользователь найден в базе');
      console.log('   ID:', verifyUser.id);
      console.log('   isAdmin:', verifyUser.isAdmin);
      console.log('   isSuperAdmin:', verifyUser.isSuperAdmin);
      console.log('   adminRoles:', verifyUser.adminRoles?.join(', '));
    }
    
    console.log('\n🎉 Готово! Теперь вы можете войти как админ.\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Ошибка при создании админ-аккаунта:', error);
    process.exit(1);
  }
}

// Запуск
createAdminAccount();
