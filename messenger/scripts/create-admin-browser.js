/**
 * Скрипт для создания админ-аккаунта через браузерную консоль
 * 
 * Инструкция:
 * 1. Откройте приложение в браузере
 * 2. Откройте DevTools (F12)
 * 3. Вставьте этот код в консоль и нажмите Enter
 * 4. После этого вы можете войти с админскими правами
 * 5. Перейдите на страницу /admin
 */

(function() {
  // Конфигурация главного пользователя
  const ADMIN_EMAIL = 'i@o8eryukhtin.ru';
  const ADMIN_PASSWORD = 'A13n10n13a';
  const ADMIN_NAME = 'Balloo_father';
  const ADMIN_FULL_NAME = 'Оберюхтин Иван Анатольевич';
  const ADMIN_BIRTHDATE = new Date('1993-04-06').getTime(); // 06.04.1993
  
  // Все роли админа
  const ADMIN_ROLES = [
    'superadmin', 'users', 'chats', 'messages', 
    'invites', 'settings', 'analytics', 'bans', 'content'
  ];

  console.log('%c🚀 Создание админ-аккаунта...', 'font-size: 16px; color: #4F46E5; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4F46E5;');
  
  // Проверяем наличие localStorage
  if (typeof localStorage === 'undefined') {
    console.error('❌ localStorage недоступен');
    return;
  }

  try {
    // Создаем ID пользователя
    const userId = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Простой хеш пароля (для демо-целей)
    const simpleHash = btoa(ADMIN_PASSWORD + '_salt_balloo');
    
    // Сохраняем в localStorage как авторизованного пользователя
    const adminUser = {
      id: userId,
      email: ADMIN_EMAIL,
      displayName: ADMIN_NAME,
      avatarUrl: null,
      provider: 'email',
      accessToken: 'admin_token_' + Date.now(),
      refreshToken: null,
      
      // Дополнительные поля
      fullName: ADMIN_FULL_NAME,
      birthDate: ADMIN_BIRTHDATE,
      familyRelations: [],
      
      // Админ-права - ВАЖНО!
      isAdmin: true,
      isSuperAdmin: true,
      adminRoles: ADMIN_ROLES,
      adminSince: Date.now(),
    };
    
    console.log('%c📋 Данные пользователя:', 'color: #6B7280;');
    console.log('  - isAdmin:', adminUser.isAdmin);
    console.log('  - isSuperAdmin:', adminUser.isSuperAdmin);
    console.log('  - adminRoles:', adminUser.adminRoles);
    
    // Сохраняем в localStorage (имитация Zustand persist)
    const authData = {
      state: {
        user: adminUser,
        isAuthenticated: true,
        isLoading: false,
      },
      version: 0,
    };
    
    localStorage.setItem('messenger-auth', JSON.stringify(authData));
    
    console.log('%c✅ Админ-аккаунт создан!', 'color: #22C55E; font-size: 14px;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4F46E5;');
    console.log('%c📧 Email: ' + ADMIN_EMAIL, 'color: #6B7280;');
    console.log('%c🔐 Пароль: ' + ADMIN_PASSWORD, 'color: #6B7280;');
    console.log('%c👤 Имя: ' + ADMIN_NAME, 'color: #6B7280;');
    console.log('%c📝 ФИО: ' + ADMIN_FULL_NAME, 'color: #6B7280;');
    console.log('%c📅 Дата рождения: 06.04.1993', 'color: #6B7280;');
    console.log('%c⭐ SuperAdmin: ДА', 'color: #F59E0B; font-weight: bold;');
    console.log('%c🔑 Роли: ' + ADMIN_ROLES.join(', '), 'color: #6B7280;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4F46E5;');
    console.log('%c📱 Следующий шаг:', 'color: #F59E0B; font-weight: bold;');
    console.log('%c1. Обновите страницу (F5)', 'color: #6B7280;');
    console.log('%c2. Вы будете автоматически авторизованы', 'color: #6B7280;');
    console.log('%c3. Перейдите на /admin для проверки', 'color: #6B7280;');
    
    // Также создаем запись в accounts store
    const accountsData = {
      state: {
        accounts: [{
          id: 'acc_' + Date.now(),
          userId: userId,
          email: ADMIN_EMAIL,
          displayName: ADMIN_NAME,
          avatarUrl: null,
          provider: 'email',
          isActive: true,
          lastUsed: Date.now(),
        }],
        currentAccountId: 'acc_' + Date.now(),
      },
      version: 0,
    };
    localStorage.setItem('messenger-accounts', JSON.stringify(accountsData));
    
    console.log('%c\n🎉 Готово!', 'color: #22C55E; font-weight: bold;');
    
    // Предлагаем обновить страницу
    if (confirm('Админ-аккаунт создан!\n\nПерейдите на страницу /admin для проверки доступа.\n\nОбновить страницу?')) {
      window.location.reload();
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
})();
