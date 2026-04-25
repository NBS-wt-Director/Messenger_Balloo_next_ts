# 📁 Структура Проекта Balloo Messenger

**Полная структура после настройки под HTTPS + PostgreSQL + Monorepo**

---

## 🌳 Дерево Файлов

```
app_balloo/
├── 📄 package.json                 # Root monorepo (скрипты для всех платформ)
├── 📄 .gitignore                   # Глобальный gitignore
├── 📄 README_MONOREPO.md           # Документация по монорепозиторию
├── 📄 PROJECT_STRUCTURE.md         # Этот файл
│
├── 📁 messenger/                   # ⭐ Web приложение (Next.js 15)
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 next.config.js
│   ├── 📄 .env.example
│   ├── 📄 .env.local               # ⚠️ НЕ коммитится! (секреты)
│   ├── 📄 config.json              # ⚠️ НЕ коммитится! (секреты)
│   ├── 📄 prisma.schema
│   │
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma        # Схема БД (PostgreSQL)
│   │   ├── 📄 seed.js              # Тестовые данные
│   │   └── 📄 migrations/          # Миграции БД
│   │
│   ├── 📁 src/
│   │   ├── 📁 app/                 # Next.js App Router
│   │   │   ├── 📄 layout.tsx       # Корневой layout
│   │   │   ├── 📄 page.tsx         # Главная страница
│   │   │   ├── 📄 globals.css      # Глобальные стили
│   │   │   │
│   │   │   ├── 📁 login/           # Страница входа
│   │   │   ├── 📁 register/        # Страница регистрации
│   │   │   ├── 📁 chats/           # Список чатов
│   │   │   ├── 📁 chat/[id]/       # Чат
│   │   │   ├── 📁 installer/       # ⭐ Страница первичной настройки
│   │   │   ├── 📁 admin/           # Админ-панель
│   │   │   ├── 📁 support/         # Поддержка
│   │   │   ├── 📁 about-company/   # О компании
│   │   │   ├── 📁 features/        # Функции
│   │   │   └── 📁 [...]/           # Остальные страницы (68 маршрутов)
│   │   │
│   │   ├── 📁 components/          # React компоненты
│   │   │   ├── 📁 ui/              # UI компоненты (кнопки, инпуты)
│   │   │   ├── 📁 chat/            # Компоненты чатов
│   │   │   ├── 📁 auth/            # Компоненты авторизации
│   │   │   └── 📁 layout/          # Компоненты макета
│   │   │
│   │   ├── 📁 lib/
│   │   │   ├── 📄 prisma.ts        # ⭐ Prisma Client wrapper
│   │   │   ├── 📄 database.ts      # RxDB (клиентская БД)
│   │   │   ├── 📄 auth.ts          # JWT утилиты
│   │   │   ├── 📄 crypto.ts        # Шифрование
│   │   │   └── 📄 utils.ts         # Вспомогательные функции
│   │   │
│   │   ├── 📁 stores/              # Zustand state management
│   │   │   ├── 📄 useAuthStore.ts
│   │   │   ├── 📄 useChatStore.ts
│   │   │   └── 📄 useMessageStore.ts
│   │   │
│   │   ├── 📁 hooks/               # Кастомные React hooks
│   │   │   ├── 📄 useAuth.ts
│   │   │   ├── 📄 useChat.ts
│   │   │   └── 📄 useMessages.ts
│   │   │
│   │   ├── 📁 types/               # TypeScript типы
│   │   │   ├── 📄 user.ts
│   │   │   ├── 📄 chat.ts
│   │   │   └── 📄 message.ts
│   │   │
│   │   └── 📁 i18n/                # Локализации (12 языков)
│   │       ├── 📄 ru.json
│   │       ├── 📄 en.json
│   │       ├── 📄 tt.json
│   │       └── 📄 [others]/
│   │
│   ├── 📁 public/
│   │   ├── 🖼️ logo.png
│   │   ├── 🖼️ mascot.png
│   │   ├── 🖼️ manifest.json
│   │   ├── 📁 icons/               # PWA иконки
│   │   ├── 📁 avatars/             # Аватары по умолчанию
│   │   └── 📁 qr/                  # QR-коды
│   │
│   ├── 📁 scripts/
│   │   ├── 📄 setup-database.sh    # ⭐ Скрипт настройки БД
│   │   ├── 📄 create-admin.ts      # Создание админа
│   │   └── 📄 create-image-placeholders.js
│   │
│   ├── 📁 api/                     # Next.js API Routes
│   │   ├── 📁 auth/
│   │   │   ├── 📄 login.ts
│   │   │   ├── 📄 register.ts
│   │   │   └── 📄 [...nextauth]/
│   │   ├── 📁 chats/
│   │   ├── 📁 messages/
│   │   ├── 📁 users/
│   │   └── 📁 admin/
│   │
│   ├── 📄 DEPLOY_BEGET_FINAL.md    # ⭐ Инструкция по деплою
│   └── 📄 production-https-config.md
│
├── 📁 mobile/                      # 📱 Mobile приложение (React Native + Expo)
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 app.json
│   ├── 📄 eas.json
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   ├── 📁 screens/
│   │   ├── 📁 navigation/
│   │   ├── 📁 stores/
│   │   └── 📁 services/
│   │
│   └── 📁 assets/
│       ├── 🖼️ icon.png
│       ├── 🖼️ splash.png
│       └── 🖼️ adaptive-icon.png
│
├── 📁 desktop/                     # 💻 Desktop приложение (Electron)
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   │
│   ├── 📁 electron/
│   │   ├── 📄 main.js
│   │   ├── 📄 preload.js
│   │   └── 📄 tray.js
│   │
│   └── 📁 renderer/                # React приложение
│       └── 📁 src/
│
├── 📁 android-service/             # 🤖 Android Service (Node.js)
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   │
│   ├── 📁 src/
│   │   ├── 📁 routes/
│   │   │   ├── 📄 sms.ts
│   │   │   ├── 📄 admin.ts
│   │   │   └── 📄 push.ts
│   │   ├── 📁 services/
│   │   │   ├── 📄 sms-service.ts
│   │   │   ├── 📄 push-service.ts
│   │   │   └── 📄 admin-service.ts
│   │   └── 📁 middleware/
│   │       ├── 📄 auth.ts
│   │       └── 📄 validation.ts
│   │
│   └── 📁 android/                 # Android приложение (опционально)
│       └── 📁 app/
│
└── 📁 shared/                      # 🔗 Общие типы и утилиты
    ├── 📄 package.json
    ├── 📄 tsconfig.json
    │
    └── 📁 src/
        ├── 📄 index.ts             # Экспорты
        ├── 📄 types.ts             # Общие интерфейсы
        ├── 📄 auth.ts              # JWT утилиты
        ├── 📄 api.ts               # API клиент
        ├── 📄 utils.ts             # Вспомогательные функции
        └── 📄 config.ts            # Конфигурация
```

---

## 📊 Статистика

| Пакет | Язык | Фреймворк | Статус | Размер |
|-------|------|-----------|--------|--------|
| **messenger** | TypeScript | Next.js 15 | ✅ Готово | ~234 MB |
| **mobile** | TypeScript | React Native | 🟡 Структура | ~450 MB |
| **desktop** | TypeScript | Electron | 🟡 Структура | ~150 MB |
| **android-service** | TypeScript | Express | 🟡 Структура | ~120 MB |
| **shared** | TypeScript | - | ✅ Готово | ~5 MB |

---

## 🔑 Ключевые Файлы

### Конфигурация

| Файл | Описание |
|------|----------|
| `messenger/.env.local` | Переменные окружения (секреты) |
| `messenger/config.json` | Конфиг приложения (секреты) |
| `messenger/prisma/schema.prisma` | Схема базы данных |
| `messenger/next.config.js` | Конфиг Next.js |
| `package.json` (root) | Monorepo скрипты |

### Безопасность

| Файл | Описание |
|------|----------|
| `messenger/src/lib/prisma.ts` | Prisma Client wrapper |
| `messenger/src/lib/auth.ts` | JWT утилиты |
| `messenger/src/lib/crypto.ts` | Шифрование сообщений |
| `shared/src/auth.ts` | Общие JWT утилиты |

### Деплой

| Файл | Описание |
|------|----------|
| `messenger/DEPLOY_BEGET_FINAL.md` | ⭐ Основная инструкция по деплою |
| `messenger/production-https-config.md` | Конфигурация HTTPS |
| `messenger/scripts/setup-database.sh` | Скрипт настройки БД |
| `README_MONOREPO.md` | Документация monorepo |

---

## 🗄 База Данных

### SQLite (Серверная, Встроенная)

**Один файл:** `messenger/prisma/dev.db`

**Модели:**
- `User` - Пользователи
- `Chat` - Чаты
- `Message` - Сообщения
- `Invitation` - Пригласительные коды
- `Contact` - Контакты
- `Notification` - Уведомления
- `Report` - Жалобы
- `Feature` - Предложения функций
- `Page` - Страницы контента
- `ChatMember` - Участники чатов
- `FamilyRelation` - Семейные связи
- `MessageReaction` - Реакции
- `ChatFavorite` - Избранные чаты
- `ChatPinned` - Закреплённые чаты
- `FeatureVote` - Голоса за функции
- `InvitationUse` - Использование приглашений

**Преимущества SQLite:**
- ✅ Встроена в проект (один файл)
- ✅ Не нужен отдельный сервер
- ✅ ~500 KB размер
- ✅ До 100K пользователей
- ✅ Легкий бэкап (скопируй файл)
- ✅ Можно мигрировать на PostgreSQL

**RxDB (Клиентская)**

Используется для:
- Кэширования данных на клиенте
- Офлайн-режима
- Быстрого доступа к данным

---

## 🔐 Секреты

**JWT Secret:**
```
RnTytYjfV1Np5dEi4J8vroMHG2uPFKUCZx9DQ3eqbLOX0hSI6zWkgscmAlBa7w
```

**Admin Password:**
```
BallooAdmin2024!SecurePass#XyZ
```

**Места хранения:**
- `messenger/config.json`
- `messenger/.env.local`
- `android-service/.env`

---

## 📱 Платформы

### Web (Готово)
- ✅ Next.js 15
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Prisma + PostgreSQL
- ✅ HTTPS (Let's Encrypt)
- ✅ 68 маршрутов
- ✅ 50+ API endpoints
- ✅ 12 локализаций

### Mobile (Структура)
- 🟡 React Native + Expo
- 🟡 React Navigation 7
- 🟡 Zustand
- 🟡 EAS Build

### Desktop (Структура)
- 🟡 Electron 33
- 🟡 React Renderer
- 🟡 electron-builder

### Android Service (Структура)
- 🟡 Node.js + Express
- 🟡 Twilio (SMS)
- 🟡 Firebase Admin (Push)

---

## 🚀 Команды

### Development

```bash
# Web
npm run dev:web

# Mobile
npm run dev:mobile

# Desktop
npm run dev:desktop

# Android Service
npm run dev:android-service
```

### Build

```bash
# Web
npm run build:web

# All
npm run build:all
```

### Database

```bash
cd messenger

# Настройка и создание БД (SQLite)
npm run db:setup

# Генерация Prisma Client
npm run db:generate

# Применить схему
npm run db:push

# GUI для просмотра БД
npm run db:studio

# Сборка (автоматически настраивает БД)
npm run build
```

### Production

```bash
cd messenger

# Сборка (включает настройку БД)
npm run build

# Запуск
npm start

# PM2
pm2 start npm --name "balloo" -- start

# Бэкап БД (ОДИН ФАЙЛ!)
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)
```

---

## 📝 Примечания

1. **SQLite (Сервер)**: Встроена в проект, один файл `prisma/dev.db`. Не требует отдельного сервера БД.

2. **RxDB (Клиент)**: Используется для кэширования и офлайн-режима в браузере клиента.

3. **HTTPS обязателен**: Все API запросы должны идти через HTTPS в production.

4. **Страница Installer**: Доступна по `/installer` для первичной настройки.

5. **Monorepo**: Проект использует npm workspaces для управления зависимостями между пакетами.

6. **Безопасность**: Все секреты хранятся в `.env.local` и `config.json`, которые исключены из `.gitignore`.

7. **Бэкап БД**: Просто скопируйте файл `prisma/dev.db` для резервной копии.

---

**Готово к производству!** 🎉
