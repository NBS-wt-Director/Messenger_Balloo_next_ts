# 🔄 План объединения API и Messenger в единый проект

## 📊 Текущее состояние

### messenger/
- **Тип:** Next.js 15 (App Router + Pages Router)
- **Бэкенд:** Next.js API Routes (src/app/api/**)
- **База данных:** RxDB (IndexedDB) + SQLite (sql.js)
- **Протоколы:** REST + WebSocket (ручная реализация)
- **Хранение:** Фронтенд + бэкенд в одном проекте

### api/
- **Тип:** Express.js + WebSocket Server
- **База данных:** SQLite (sql.js)
- **Протоколы:** REST + WebSocket
- **Хранение:** Отдельный сервер

### admin-portal/
- **Тип:** Next.js 14 (App Router)
- **База данных:** Нет (клиент API)
- **Зависимость:** @app-balloo/settings

---

## 🎯 Цель объединения

**Единая архитектура:**
```
app-balloo/
├── backend/          # Единый бэкенд (Express.js)
├── messenger/        # Чистый фронтенд (Next.js)
├── admin-portal/     # Админка (Next.js)
└── settings/         # Общие настройки
```

---

## 🔍 Анализ текущего бэкенда в messenger

### 📁 Структура бэкенда (src/app/api/)

| Модуль | Файлов | Описание |
|--------|--------|----------|
| auth/ | 10+ | Регистрация, вход, восстановление |
| chats/ | 15+ | CRUD чатов, участники, права |
| messages/ | 10+ | Отправка, поиск, reactions |
| contacts/ | 5+ | Контакты, блокировка |
| notifications/ | 6+ | Push-уведомления |
| admin/ | 10+ | Админ-функции |
| uploads/ | 10+ | Загрузка файлов |
| yandex-disk/ | 5+ | Интеграция с Яндекс |
| webrtc/ | 3+ | WebRTC сигналинг |
| calls/ | 3+ | Звонки |
| sync/ | 2+ | Синхронизация E2E ключей |
| **Итого** | **~83 файла** | **Полный бэкенд** |

### 📦 Зависимости бэкенда в messenger

```json
{
  "bcryptjs": "^3.0.3",         // Хэширование паролей
  "jose": "^5.9.0",             // JWT
  "nodemailer": "^6.10.0",      // Email
  "web-push": "^3.6.7",         // Push-уведомления
  "yandex-disk": "^0.0.6",      // Яндекс Диск
  "ioredis": "^5.10.1",         // Redis (кэш)
  "sql.js": "^1.11.0",          // SQLite
  "rxdb": "^17.1.0",            // IndexedDB (фронтенд)
  "zod": "^3.23.8"              // Валидация
}
```

### 🗄️ База данных в messenger

**RxDB (IndexedDB)** - клиентская БД для оффлайн-работы:
- users, chats, messages, invitations
- contacts, notifications, reports
- pages, features, statuses, calls

**SQLite (sql.js)** - серверная БД в Next.js API Routes:
- Та же схема, что и в api/

---

## 🚀 План миграции

### Этап 1: Подготовка (1-2 дня)

#### 1.1 Создать monorepo структуру
```bash
mkdir app-balloo
cd app-balloo
git init
```

**Структура:**
```
app-balloo/
├── backend/
├── messenger/
├── admin-portal/
├── settings/
├── package.json
├── pnpm-workspace.yaml
└── .gitignore
```

#### 1.2 Настроить pnpm workspaces
```yaml
# pnpm-workspace.yaml
packages:
  - 'backend'
  - 'messenger'
  - 'admin-portal'
  - 'settings'
```

#### 1.3 Перенести settings
```bash
cp -r settings app-balloo/
cp -r admin-portal app-balloo/
```

---

### Этап 2: Миграция бэкенда из messenger в backend/ (3-5 дней)

#### 2.1 Создать backend/ на базе api/
```bash
mkdir backend
cp -r api/* backend/
```

#### 2.2 Перенести контроллеры из messenger

**Источники:**
- `messenger/src/app/api/auth/**` → `backend/src/controllers/auth.controller.js`
- `messenger/src/app/api/chats/**` → `backend/src/controllers/chats.controller.js`
- `messenger/src/app/api/messages/**` → `backend/src/controllers/messages.controller.js`
- `messenger/src/app/api/contacts/**` → `backend/src/controllers/contacts.controller.js`
- `messenger/src/app/api/notifications/**` → `backend/src/controllers/notifications.controller.js`
- `messenger/src/app/api/admin/**` → `backend/src/controllers/admin.controller.js`
- `messenger/src/app/api/yandex-disk/**` → `backend/src/services/yandex-disk.service.js`
- `messenger/src/app/api/webrtc/**` → `backend/src/services/webrtc.service.js`
- `messenger/src/app/api/calls/**` → `backend/src/services/calls.service.js`

#### 2.3 Перенести сервисы

| messenger/src/lib/ | backend/src/services/ |
|--------------------|----------------------|
| email.js | email.service.js |
| crypto.ts | e2e.service.js |
| yandex-disk.ts | yandex-disk.service.js |
| notifications/ | push.service.js |
| verification-code.js | verification.service.js |
| file-logger.ts | logger.service.js |

#### 2.4 Перенести middleware аутентификации

**Из:** `messenger/src/lib/auth.ts`  
**В:** `backend/src/middleware/auth.js`

#### 2.5 Обновить базу данных

**Схема в messenger (RxDB):**
```typescript
users, chats, messages, invitations, contacts, 
notifications, reports, pages, features, statuses, calls
```

**Схема в api (SQLite):**
```javascript
users, chats, messages, invitations, contacts, 
notifications, reports, e2e_keys, sessions, devices, 
versions, recordings, support_tickets, support_messages
```

**Задача:** Объединить схемы, добавить недостающие таблицы:
- pages
- features  
- statuses
- calls
- recordings

---

### Этап 3: Обновление API Routes в backend/ (2-3 дня)

#### 3.1 Создать маршруты

**Из messenger:**
```typescript
messenger/src/app/api/auth/login/route.ts
  → backend/src/routes/auth.routes.js
  
messenger/src/app/api/chats/[id]/route.ts
  → backend/src/routes/chats.routes.js
  
// и т.д.
```

#### 3.2 Перенести логику из Next.js API Routes

**Пример:**
```typescript
// messenger/src/app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  // ... логика
  return NextResponse.json({ token, user });
}
```

**В Express:**
```javascript
// backend/src/controllers/auth.controller.js
exports.login = async (req, res) => {
  const { email, password } = req.body;
  // ... та же логика
  res.json({ token, user });
};
```

---

### Этап 4: Настройка WebSocket в backend/ (1-2 дня)

**Из messenger:**
- `messenger/src/lib/screen-share/` - WebRTC
- `messenger/src/app/api/webrtc/signal/route.ts` - Signaling

**В backend:**
```javascript
// backend/src/websocket/
├── index.js          // WebSocket server
├── handlers/
│   ├── chat.js       // Обработка сообщений
│   ├── typing.js     // "Печатает..."
│   ├── presence.js   // Online/offline
│   └── webrtc.js     // WebRTC signaling
```

---

### Этап 5: Обновление messenger/ (2-3 дня)

#### 5.1 Удалить бэкенд из messenger

**Удалить:**
- `messenger/src/app/api/**` (все Next.js API Routes)
- `messenger/src/lib/database/` (серверная часть)
- `messenger/src/lib/auth.ts` (серверная часть)
- `messenger/src/lib/email.js`
- `messenger/src/lib/verification-code.js`

**Оставить:**
- `messenger/src/lib/api/` - клиент для API
- `messenger/src/lib/database/` - только RxDB для оффлайн
- `messenger/src/lib/config.ts`

#### 5.2 Обновить API клиент

**Из:**
```typescript
// messenger/src/api/index.ts
const API_URL = '/api';  // Next.js API Routes
```

**В:**
```typescript
// messenger/src/api/index.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
```

#### 5.3 Обновить .env

```env
# messenger/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

---

### Этап 6: Обновление admin-portal/ (1 день)

**Изменить:**
```env
# admin-portal/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

**Никаких изменений в коде не требуется!**

---

### Этап 7: Тестирование (2-3 дня)

#### 7.1 Unit тесты для backend/
```bash
cd backend
npm test
```

#### 7.2 Интеграционные тесты
- auth (регистрация, вход, refresh)
- chats (создание, участники, права)
- messages (отправка, получение, reactions)
- admin (управление пользователями)
- internal-chat (NBS w-t)
- support (тикеты)

#### 7.3 E2E тесты
```bash
cd messenger
npx cypress run
```

---

## 📋 Чек-лист миграции

### ✅ Backend

- [ ] Создать backend/ из api/
- [ ] Перенести auth контроллеры из messenger
- [ ] Перенести chat контроллеры из messenger
- [ ] Перенести message контроллеры из messenger
- [ ] Перенести contact контроллеры из messenger
- [ ] Перенести notification контроллеры из messenger
- [ ] Перенести admin контроллеры из messenger
- [ ] Перенести yandex-disk интеграцию
- [ ] Перенести WebRTC signaling
- [ ] Перенести calls сервис
- [ ] Добавить missing tables (pages, features, statuses, calls, recordings)
- [ ] Настроить WebSocket handlers
- [ ] Обновить middleware аутентификации
- [ ] Настроить rate limiting
- [ ] Добавить CORS для messenger/admin-portal
- [ ] Протестировать все endpoints

### ✅ Messenger

- [ ] Удалить Next.js API Routes (src/app/api/**)
- [ ] Удалить серверную БД (src/lib/database/index.ts - серверная часть)
- [ ] Оставить только RxDB (клиентская БД)
- [ ] Обновить API клиент на новый baseURL
- [ ] Обновить WebSocket подключение
- [ ] Обновить .env.local
- [ ] Протестировать регистрацию/вход
- [ ] Протестировать чаты
- [ ] Протестировать сообщения
- [ ] Протестировать файлы
- [ ] Протестировать звонки
- [ ] Протестировать admin panel (внутри messenger)

### ✅ Admin Portal

- [ ] Обновить .env.local
- [ ] Протестировать вход
- [ ] Протестировать все разделы

### ✅ Settings

- [ ] Убедиться, что используется всеми проектами
- [ ] Добавить недостающие настройки

---

## 🎯 Финальная архитектура

```
app-balloo/
├── backend/                    # Express.js + WebSocket
│   ├── src/
│   │   ├── controllers/        # Все контроллеры
│   │   ├── routes/             # Все маршруты
│   │   ├── middleware/         # Auth, rate-limit, CORS
│   │   ├── services/           # Email, Yandex, Push, E2E
│   │   ├── websocket/          # WebSocket handlers
│   │   ├── config/             # Database, logger
│   │   └── index.js            # Entry point
│   ├── tests/
│   ├── package.json
│   └── .env
│
├── messenger/                  # Next.js 15 (только фронтенд)
│   ├── src/
│   │   ├── app/                # Pages + Layouts
│   │   ├── components/         # UI компоненты
│   │   ├── api/                # API клиент (axios)
│   │   ├── stores/             # Zustand stores
│   │   ├── hooks/              # React hooks
│   │   ├── i18n/               # Локализации
│   │   └── lib/
│   │       └── database/       # RxDB (IndexedDB) - оффлайн
│   ├── package.json
│   └── .env.local
│
├── admin-portal/               # Next.js 14 (только фронтенд)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── api-client.ts   # API клиент
│   │   └── stores/
│   ├── package.json
│   └── .env.local
│
└── settings/                   # Общие настройки
    ├── src/
    │   ├── config.ts
    │   ├── types.ts
    │   └── environment.ts
    └── package.json
```

---

## 🚀 Запуск после миграции

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
# http://localhost:3001
# ws://localhost:3001
```

### Terminal 2: Messenger
```bash
cd messenger
npm install
npm run dev
# http://localhost:3000
```

### Terminal 3: Admin Portal
```bash
cd admin-portal
npm install
npm run dev
# http://localhost:3002
```

### Terminal 4: Settings (опционально)
```bash
cd settings
npm install
npm run build
```

---

## ⚠️ Риски и решения

| Риск | Решение |
|------|---------|
| Потеря данных при миграции БД | Сделать бэкап SQLite перед миграцией |
| Несовместимость схем | Сначала протестировать на dev окружении |
| Сломанные ссылки на API | Обновить все API_URL в .env файлах |
| WebSocket reconnect | Добавить переподключение в messenger |
| Кэширование Next.js | Очистить .next после миграции |
| RxDB миграции | Сохранить старую БД для сравнения |

---

## 📈 Оценка времени

| Этап | Время | Приоритет |
|------|-------|-----------|
| Подготовка monorepo | 1-2 дня | 🔴 Высокий |
| Миграция бэкенда | 3-5 дней | 🔴 Высокий |
| Обновление маршрутов | 2-3 дня | 🔴 Высокий |
| WebSocket | 1-2 дня | 🟡 Средний |
| Обновление messenger | 2-3 дня | 🔴 Высокий |
| Тестирование | 2-3 дня | 🔴 Высокий |
| **Итого** | **11-18 дней** | |

---

## 💡 Рекомендации

### 1. Поэтапная миграция
- Сначала auth + users
- Потом chats + messages
- Затем admin + дополнительные модули

### 2. Параллельная работа
- Старый messenger продолжает работать
- Новый backend тестируется отдельно
- Переключение по .env переключателю

### 3. Feature flags
```env
NEW_BACKEND_ENABLED=true
```

### 4. Мониторинг
- Логирование всех API запросов
- Метрики производительности
- Ошибки в реальном времени

---

## ✅ Критерии успешной миграции

- [ ] Все API endpoints работают
- [ ] WebSocket reconnect работает
- [ ] RxDB оффлайн режим работает
- [ ] Регистрация/вход работают
- [ ] Чаты и сообщения работают
- [ ] Файлы загружаются
- [ ] Звонки работают
- [ ] Admin portal работает
- [ ] Internal chat работает
- [ ] Support система работает
- [ ] Нет ошибок в консоли
- [ ] Все тесты проходят

---

**Готов к реализации!** 🚀
