
# 🎈 Balloo Messenger

**Безопасный мессенджер с PWA и Push-уведомлениями**

---

## 🚀 Быстрый Старт

```bash
# 1. Установка зависимостей
npm install

# 2. Создание тестовых пользователей и чатов
npm run setup-test-data

# 3. Запуск разработки
npm run dev
```

**Открыть:** http://localhost:3000

---

## 🔑 Тестовые Учётные Записи

| Роль | Email | Пароль |
|------|-------|--------|
| ⭐ **Супер-админ** | `admin@balloo.ru` | `Admin123!` |
| 👤 Алексей | `user1@balloo.ru` | `User123!` |
| 👤 Мария | `user2@balloo.ru` | `User123!` |
| 👤 Дмитрий | `user3@balloo.ru` | `User123!` |

---

## ✨ Функции

- 🔒 **E2E шифрование** - TweetNaCl (NaCl)
- 🔐 **JWT авторизация** - email/пароль + Яндекс.ID
- 📎 **Вложения** - Яндекс.Диск API
- 👥 **Групповые чаты** - роли: создатель, модератор, автор, читатель
- ⭐ **Избранное** - избранные чаты и сообщения
- 😊 **16 реакций** - эмодзи реакции
- 📱 **PWA** - установка как приложения
- 🔔 **Push-уведомления** - Web Push API
- 🌍 **4 языка** - русский, хинди, китайский, татарский
- 🌓 **3 темы** - тёмная, светлая, Россия
- 📞 **Видеозвонки** - WebRTC
- 📊 **Админ-панель** - управление пользователями и жалобами

---

## 🛠 Технологии

| Компонент | Технология |
|-----------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **База данных** | RxDB (IndexedDB) |
| **Стили** | Tailwind CSS |
| **Состояние** | Zustand |
| **Шифрование** | TweetNaCl |
| **Push** | Web Push API + VAPID |
| **PWA** | Service Worker, Manifest |
| **Звонки** | WebRTC |

---

## 📁 Структура Проекта

```
messenger/
├── config.json              # ⭐ Конфигурация (заменяет .env)
├── scripts/
│   └── setup-test-data.ts   # ⭐ Создание тестовых данных
├── src/
│   ├── app/                 # Next.js страницы + API
│   │   ├── api/             # API endpoints (32+)
│   │   ├── admin/           # Админ-панель
│   │   ├── chats/           # Чаты
│   │   ├── settings/        # Настройки
│   │   └── invite/[code]/   # Приглашения
│   ├── components/          # React компоненты
│   ├── hooks/               # Custom хуки
│   │   ├── index.ts
│   │   └── usePushNotifications.ts
│   ├── lib/                 # Утилиты
│   │   ├── auth.ts          # JWT авторизация
│   │   ├── config.ts        # Загрузка config.json
│   │   ├── database/        # RxDB схемы
│   │   └── service-worker.ts # PWA регистрация
│   ├── stores/              # Zustand хранилища
│   └── i18n/                # Переводы (4 языка)
├── public/
│   ├── manifest.json        # ⭐ PWA manifest
│   ├── sw.js                # ⭐ Service Worker
│   └── icons/               # PWA иконки
├── docs/                    # Документация
│   ├── QUICK_START.md
│   ├── PAGES_TO_TEST.md
│   └── ALL_TASKS_COMPLETED.md
└── .github/workflows/       # ⭐ CI/CD
    └── ci.yml
```

---

## 📋 Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск разработки (порт 3000) |
| `npm run build` | Production сборка |
| `npm start` | Запуск продакшена |
| `npm run setup-test-data` | ⭐ Создание тестовых пользователей и чатов |
| `npm run generate-vapid` | Генерация VAPID ключей |
| `npm run lint` | ESLint проверка |
| `npm test` | Jest тесты |

---

## 🧪 Проверка Работоспособности

### 1. Создать тестовые данные
```bash
npm run setup-test-data
```

### 2. Войти в приложение
```
1. Открыть http://localhost:3000/login
2. Email: admin@balloo.ru
3. Пароль: Admin123!
```

### 3. Проверить страницы
- `/chats` - Список чатов
- `/settings` - Настройки (PWA, уведомления, темы)
- `/admin` - Админ-панель (для admin@balloo.ru)
- `/admin/reports` - Жалобы

### 4. Протестировать чаты
- Открыть любой чат
- Отправить сообщение
- Проверить статусы (Отправлено/Доставлено/Прочитано)
- Закрепить чат (макс 15)

---

## 📖 Документация

| Файл | Описание |
|------|----------|
| [`QUICK_START.md`](./QUICK_START.md) | 🚀 Быстрый старт |
| [`docs/PAGES_TO_TEST.md`](./docs/PAGES_TO_TEST.md) | 📋 Список страниц для проверки |
| [`docs/ALL_TASKS_COMPLETED.md`](./docs/ALL_TASKS_COMPLETED.md) | ✅ Выполненные задачи |
| [`docs/PROJECT_AUDIT_ERRORS.md`](./docs/PROJECT_AUDIT_ERRORS.md) | 🔍 Аудит проекта |
| [`config.json`](./config.json) | ⚙️ Конфигурация приложения |

---

## 🔧 Конфигурация

Все настройки в [`config.json`](./config.json):

```json
{
  "auth": {
    "jwtSecret": "your-secret-key"
  },
  "push": {
    "vapidPublicKey": "...",
    "vapidPrivateKey": "..."
  },
  "testUsers": [
    {
      "email": "admin@balloo.ru",
      "password": "Admin123!",
      "isAdmin": true,
      "isSuperAdmin": true
    }
  ]
}
```

---

## 🎯 Особенности

### ✅ Полностью Рабочий Проект
- 20/20 задач из аудита выполнены
- Все критические функции работают
- PWA готово к установке
- Push-уведомления настроены

### ✅ Тестовые Данные
- 4 пользователя (1 админ + 3 обычных)
- 4 чата (3 личных + 1 групповой)
- 5+ тестовых сообщений

### ✅ Безопасность
- JWT авторизация
- E2E шифрование
- Валидация Zod
- Rate limiting ready

### ✅ Production Ready
- CI/CD pipeline
- Тесты (Jest)
- Логирование
- indexedDB (персистентность)

---

## 📱 PWA Установка

### Chrome/Edge
1. Открыть http://localhost:3000
2. Нажать иконку установки в адресной строке
3. Установить приложение

### Mobile
1. Открыть сайт на телефоне
2. Меню → "Добавить на гл. экран"
3. Запустить как приложение

---

## 🐛 Решение Проблем

### Ошибка: "Module not found"
```bash
npm install
```

### Ошибка: "Database error"
```
Очистить IndexedDB:
Application → IndexedDB → Delete "balloo"
```

### Ошибка: "Unauthorized"
```
Проверить config.json:
auth.jwtSecret должен быть настроен
```

---

## 📞 Поддержка

- **Email:** admin@balloo.ru
- **Документация:** `docs/`
- **API:** `src/app/api/`

---

## 📄 Лицензия

MIT

---

**Balloo Messenger - готов к использованию!** 🎉
