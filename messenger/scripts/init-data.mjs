/**
 * Скрипт инициализации страниц и предложений функций
 * Запуск: node scripts/init-data.mjs
 * Требует запущенного dev-сервера
 */

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const DEFAULT_PAGES = [
  {
    slug: 'support',
    title: 'Поддержать проект',
    content: 'Ваша поддержка помогает развивать Balloo Messenger',
    sections: [
      {
        id: 'sbp',
        type: 'payment',
        title: 'СБП (Система Быстрых Платежей)',
        content: 'Перевод по номеру телефона через Сбербанк',
        data: {
          method: 'sbp',
          phone: '+7 (999) 123-45-67',
          bank: 'Сбербанк',
          recipient: 'Иван Оберюхтин'
        }
      },
      {
        id: 'qr',
        type: 'qr',
        title: 'QR-код для оплаты',
        content: 'Отсканируйте QR-код для быстрого перевода',
        data: { qrCodeUrl: '' }
      }
    ],
    metadata: { icon: 'Heart', color: '#ef4444' }
  },
  {
    slug: 'about-company',
    title: 'О компании',
    content: 'История создания Balloo Messenger',
    sections: [
      {
        id: 'developer',
        type: 'person',
        title: 'Разработчик',
        content: 'Иван Оберюхтин',
        data: {
          name: 'Иван Оберюхтин',
          location: 'Екатеринбург, Россия',
          bio: 'Разработчик-одиночка, создающий Balloo Messenger',
          interests: [
            'Разработка на React/Next.js',
            'Тренировки',
            'Тренерская деятельность'
          ]
        }
      },
      {
        id: 'story',
        type: 'text',
        title: 'История проекта',
        content: 'Balloo был создан как независимый мессенджер с фокусом на приватность и безопасность. Проект разрабатывается одним энтузиастом в свободное от основной работы время.',
        data: {}
      },
      {
        id: 'tech',
        type: 'features',
        title: 'Технологии',
        content: 'Современный стек технологий',
        data: {
          technologies: [
            { name: 'React', icon: '⚛️' },
            { name: 'Next.js', icon: '▲' },
            { name: 'TypeScript', icon: '📘' },
            { name: 'RxDB', icon: '🗄️' },
            { name: 'WebRTC', icon: '📞' },
            { name: 'Web Crypto API', icon: '🔐' }
          ]
        }
      }
    ],
    metadata: { icon: 'Building2', color: '#3b82f6' }
  },
  {
    slug: 'about-balloo',
    title: 'О Balloo',
    content: 'Balloo Messenger - безопасный мессенджер с шифрованием',
    sections: [
      {
        id: 'features',
        type: 'features-list',
        title: 'Возможности',
        content: 'Все функции мессенджера',
        data: { features: [] }
      }
    ],
    metadata: { icon: 'MessageCircle', color: '#8b5cf6' }
  }
];

const DEFAULT_FEATURES = [
  {
    title: 'Голосовые сообщения',
    description: 'Возможность записывать и отправлять голосовые сообщения в чат',
    category: 'general',
    status: 'planned',
    votes: 15,
    createdBy: 'system',
    createdByName: 'Администратор'
  },
  {
    title: 'Темы оформления',
    description: 'Больше цветовых тем: космическая, лесная, океан и другие',
    category: 'ui',
    status: 'in-progress',
    votes: 23,
    createdBy: 'system',
    createdByName: 'Администратор'
  },
  {
    title: 'Двухфакторная аутентификация',
    description: '2FA через TOTP (Google Authenticator, Authy)',
    category: 'security',
    status: 'planned',
    votes: 31,
    createdBy: 'system',
    createdByName: 'Администратор'
  },
  {
    title: 'Боты и API',
    description: 'Публичное API для создания ботов и интеграций',
    category: 'performance',
    status: 'pending',
    votes: 18,
    createdBy: 'system',
    createdByName: 'Администратор'
  },
  {
    title: 'Редактирование сообщений',
    description: 'Возможность редактировать отправленные сообщения в течение 15 минут',
    category: 'general',
    status: 'completed',
    votes: 42,
    createdBy: 'system',
    createdByName: 'Администратор'
  }
];

async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { response, data };
  } catch (error) {
    return { response: null, data: null, error };
  }
}

async function initPages() {
  console.log('\n📄 Инициализация страниц...\n');

  for (const page of DEFAULT_PAGES) {
    const { response, data, error } = await fetchJson(`${API_URL}/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: page.slug,
        title: page.title,
        content: page.content,
        sections: page.sections,
        metadata: page.metadata
      })
    });

    if (error) {
      console.log(`❌ Страница "${page.slug}": ${error.message}`);
    } else if (response?.ok) {
      console.log(`✅ Страница "${page.slug}" инициализирована`);
    } else {
      console.log(`⚠️  Страница "${page.slug}": ${data?.error || 'уже существует'}`);
    }
  }
}

async function initFeatures() {
  console.log('\n💡 Инициализация предложений функций...\n');

  for (const feature of DEFAULT_FEATURES) {
    const { response, data, error } = await fetchJson(`${API_URL}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...feature,
        userId: 'system',
        userName: 'Администратор'
      })
    });

    if (error) {
      console.log(`❌ Функция "${feature.title}": ${error.message}`);
    } else if (response?.ok || response?.status === 400) {
      console.log(`✅ Функция "${feature.title}" инициализирована`);
    } else {
      console.log(`⚠️  Функция "${feature.title}": ${data?.error || 'уже существует'}`);
    }
  }
}

async function main() {
  console.log('================================================');
  console.log('  Balloo - Инициализация страниц и функций');
  console.log('================================================');

  console.log('\n⚠️  Убедитесь, что сервер запущен (npm run dev)\n');

  // Проверка доступности сервера
  try {
    await fetch(`${API_URL.replace('/api', '')}/`);
  } catch (error) {
    console.error('\n❌ Сервер недоступен! Запустите: npm run dev\n');
    process.exit(1);
  }

  await initPages();
  await initFeatures();

  console.log('\n================================================');
  console.log('  ✅ ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНА!');
  console.log('================================================\n');

  console.log('📱 Страницы:');
  console.log('   • http://localhost:3000/support');
  console.log('   • http://localhost:3000/about-company');
  console.log('   • http://localhost:3000/about-balloo\n');

  console.log('🛠️  Админка:');
  console.log('   • http://localhost:3000/admin → Функции и страницы\n');
}

main().catch(error => {
  console.error('\n❌ Критическая ошибка:', error.message);
  process.exit(1);
});
