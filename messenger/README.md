
# 🎈 Balloo Messenger

**Безопасный мессенджер с PWA и Push-уведомлениями**

**Статус:** ✅ **Production Ready** | **Build:** ✓ Passing

---

## 🚀 Быстрый Деплой

### Vercel (Рекомендуется - 5 минут)
```bash
npm i -g vercel
vercel --prod
```

### Railway (7 минут)
```bash
npm i -g @railway/cli
railway login
railway up
```

### Собственный сервер (30 минут)
Смотрите [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📋 Быстрый Старт (Local)

```bash
# 1. Установка зависимостей
npm install

# 2. Настройка окружения
cp .env.example .env.local
# Отредактируйте .env.local и заполните переменные

# 3. Инициализация БД
npm run db:setup

# 4. Запуск разработки
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

### Аутентификация и профиль
- 🔒 **E2E шифрование** - TweetNaCl (NaCl)
- 🔐 **JWT авторизация** - email/пароль + Яндекс.ID
- ✅ **Подтверждение email** - AUTH-005
- ✅ **Восстановление пароля** - AUTH-006 (с кнопкой на странице входа)
- ✅ **Загрузка аватарки** - AUTH-203 (с оптимизацией)
- ✅ **Смена пароля** - AUTH-204
- ⏳ **Привязка Яндекс.Диска** - AUTH-206 (API готово)

### Групповые чаты
- 👥 **Создание группы** - CHAT-101
- 👥 **Управление участниками** - CHAT-102 (с пагинацией)
- 🎭 **Роли: creator/moderator/author/reader** - CHAT-103
- 🎭 **Назначение ролей** - CHAT-104
- 🚪 **Выход из группы** - CHAT-105
- 🔗 **Пригласительные ссылки** - CHAT-107

### Сообщения и вложения
- 📨 **Пересылка сообщений** - MSG-007
- 🎥 **Загрузка видео** - MSG-103, MSG-104
- 📄 **Загрузка документов** - MSG-105, MSG-106
- 👁️ **Предпросмотр вложений** - MSG-109
- ⭐ **Избранное** - избранные чаты и сообщения
- 😊 **16 реакций** - эмодзи реакции

### Дополнительные функции
- 📱 **PWA** - установка как приложения
- 🔔 **Push-уведомления** - Web Push API
- 🌍 **4 языка** - русский, хинди, китайский, татарский
- 🌓 **3 темы** - тёмная, светлая, Россия
- 📞 **Видеозвонки** - WebRTC
- 📊 **Админ-панель** - управление пользователями и жалобами

### Production Ready
- ✅ **Rate Limiting** - защита от DDoS
- ✅ **CSRF Защита** - защита от CSRF атак
- ✅ **Кэширование** - оптимизация производительности
- ✅ **Пагинация** - работа с большими списками
- ✅ **Оптимизация изображений** - WebP, thumbnails
- ✅ **Логирование** - мониторинг ошибок
- ✅ **Аналитика** - статистика использования

Подробный список реализованных функций см. в [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
Детали production улучшений: [PRODUCTION_FIXES.md](./PRODUCTION_FIXES.md)

---

## 🔑 API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/yandex/callback` - Яндекс OAuth callback
- `POST /api/auth/email/verify` - Подтверждение email
- `POST /api/auth/password/recovery` - Восстановление пароля
- `POST /api/auth/password/reset` - Сброс пароля

### Профиль
- `POST /api/profile/password` - Смена пароля
- `POST /api/profile/avatar/upload` - Загрузка аватарки
- `GET /api/profile` - Получение профиля

### Группы
- `POST /api/chats/group/create` - Создание группы
- `GET /api/chats/group/members?id={id}` - Участники группы
- `POST /api/chats/group/members` - Добавить участников
- `DELETE /api/chats/group/members` - Удалить участника
- `PUT /api/chats/group/role/update` - Назначить роль

### Приглашения
- `POST /api/invitations` - Создать приглашение
- `GET /api/invitations?code={code}` - Получить приглашение
- `PUT /api/invitations` - Принять приглашение

### Сообщения
- `POST /api/messages` - Отправить сообщение
- `GET /api/messages?chatId={id}` - Получить сообщения
- `POST /api/messages/forward` - Переслать сообщение

### Вложения
- `POST /api/attachments` - Загрузить вложение
- `POST /api/attachments/preview` - Предпросмотр вложения
- `POST /api/yandex-disk/upload/video` - Загрузить видео
- `POST /api/yandex-disk/upload/document` - Загрузить документ
- `GET /api/yandex-disk/download` - Скачать документ

### Яндекс.Диск
- `GET /api/yandex-disk/auth` - URL авторизации
- `POST /api/yandex-disk/link` - Связать аккаунт
- `DELETE /api/yandex-disk/unlink` - Отвязать аккаунт

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
| [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) | 🚀 **Полная инструкция по деплою** |
| [`DEPLOYMENT_STATUS.md`](./DEPLOYMENT_STATUS.md) | 📊 Статус готовности к деплою |
| [`IMPLEMENTATION_COMPLETE.md`](./IMPLEMENTATION_COMPLETE.md) | ✅ Реализованные функции |
| [`PRODUCTION_FIXES.md`](./PRODUCTION_FIXES.md) | 🔧 Production улучшения |
| [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) | 📋 Сводка по функциям |
| [`QUICK_START.md`](./QUICK_START.md) | 🚀 Быстрый старт |
| [`docs/PAGES_TO_TEST.md`](./docs/PAGES_TO_TEST.md) | 📋 Список страниц для проверки |

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
