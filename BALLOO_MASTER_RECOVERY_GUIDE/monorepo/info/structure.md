# 🏗️ Монорепо Balloo Platform — Структура и зависимости

**Версия:** v5.0  
**Дата:** 2026-07-02  
**Статус:** Активная разработка  

---

## 📁 Структура монорепо

```
app_balloo/
├── BALLOO_MASTER_RECOVERY_GUIDE/     # Документация и восстановление
│   ├── core/                         # Сервер рендеринга
│   ├── data/                         # JSON-данные разделов
│   ├── schemas/                      # JSON Schema
│   ├── static/                       # Клиентские файлы
│   └── sessions/                     # История сессий
│
├── api/                              # Backend API (Express.js)
│   ├── src/
│   │   ├── routes/                   # API маршруты
│   │   ├── controllers/              # Контроллеры
│   │   ├── models/                   # Модели данных
│   │   ├── middleware/               # Middleware
│   │   └── utils/                    # Утилиты
│   ├── package.json
│   └── Dockerfile
│
├── messenger/                        # WebSocket сервер (Socket.IO)
│   ├── src/
│   │   ├── events/                   # WebSocket события
│   │   ├── handlers/                 # Обработчики
│   │   └── utils/                    # Утилиты
│   ├── package.json
│   └── Dockerfile
│
├── web/                              # Frontend (Next.js 14 + TypeScript)
│   ├── src/
│   │   ├── app/                      # App Router
│   │   ├── components/               # React компоненты
│   │   ├── hooks/                    # Custom hooks
│   │   ├── lib/                      # Библиотеки
│   │   └── styles/                   # Стили
│   ├── package.json
│   └── Dockerfile
│
├── packages/                         # Общие пакеты
│   ├── core-ui/                      # UI компоненты
│   ├── shared/                       # Общие утилиты
│   └── types/                        # TypeScript типы
│
├── mobile/                           # Мобильные клиенты (V2)
│   ├── ios/                          # React Native iOS
│   └── android/                      # React Native Android
│
├── docker-compose.yml                # Оркестрация контейнеров
├── package.json                      # Корневой package.json
└── README.md                         # Основная документация
```

---

## 🔗 Зависимости между узлами

### Runtime зависимости

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│     API     │────▶│  Database   │
│  (Next.js)  │◀────│ (Express.js)│◀────│(PostgreSQL) │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │ WebSocket         │ Cache
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  Messenger  │     │    Redis    │
│ (Socket.IO) │     │   (BullMQ)  │
└─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Storage   │
                    │(Yandex Disk)│
                    └─────────────┘
```

### Зависимости пакетов

| Пакет | Зависит от | Предоставляет |
|-------|------------|---------------|
| `web` | `packages/core-ui`, `packages/types`, `api` | UI, роутинг |
| `api` | `packages/types`, `packages/shared` | REST API, БД |
| `messenger` | `packages/types`, `packages/shared` | WebSocket |
| `packages/core-ui` | `packages/types` | UI компоненты |
| `packages/shared` | — | Утилиты, константы |
| `packages/types` | — | TypeScript типы |

---

## 📦 Ключевые пакеты

### @balloo/core-ui
**Назначение:** Общие UI компоненты  
**Компоненты:**
- Button, Input, Modal, Card, Avatar, Badge
- Header, Footer, Sidebar
- MessageBubble, ChatList, ContactItem

**Использование:** web, admin-portal

### @balloo/shared
**Назначение:** Общие утилиты  
**Функции:**
- Форматирование дат
- Валидация данных
- Константы (limits, errors)
- Хелперы для API

**Использование:** api, messenger, web

### @balloo/types
**Назначение:** TypeScript типы  
**Типы:**
- User, Chat, Message, Attachment
- API Request/Response
- WebSocket Events
- Database Models

**Использование:** Все пакеты

---

## 🗄️ База данных

### Таблицы (15 основных)

| Таблица | Описание | Ключевые поля |
|---------|----------|---------------|
| `users` | Пользователи | id, email, phone, password_hash |
| `sessions` | Сессии | id, user_id, token, expires_at |
| `chats` | Чаты | id, type, name, created_by |
| `chat_members` | Участники чатов | chat_id, user_id, role |
| `messages` | Сообщения | id, chat_id, sender_id, content |
| `attachments` | Вложения | id, message_id, type, url |
| `reactions` | Реакции | id, message_id, user_id, emoji |
| `read_receipts` | Прочитано | message_id, user_id, read_at |
| `calls` | Звонки | id, caller_id, callee_id, status |
| `polls` | Опросы | id, message_id, question, options |
| `poll_responses` | Голоса | poll_id, option_id, user_id |
| `notifications` | Уведомления | id, user_id, type, read |
| `audit_log` | Аудит | id, user_id, action, timestamp |
| `settings` | Настройки | user_id, key, value |
| `templates` | Шаблоны | id, user_id, title, content |

### Связи

```
users ──┬── sessions (1:N)
        ├── chats (1:N через chat_members)
        ├── messages (1:N)
        ├── reactions (1:N)
        └── notifications (1:N)

chats ──┬── chat_members (1:N)
        ├── messages (1:N)
        └── polls (1:1)

messages ──┬── attachments (1:N)
           ├── reactions (1:N)
           └── read_receipts (1:N)
```

---

## 🌐 API Endpoints

### Auth (`/api/v1/auth`)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | /register | Регистрация |
| POST | /login | Вход |
| POST | /logout | Выход |
| POST | /verify-code | Верификация |
| GET | /me | Текущий пользователь |
| PUT | /me | Обновление профиля |

### Chats (`/api/v1/chats`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | / | Список чатов |
| POST | / | Создание чата |
| GET | /:id | Детали чата |
| PUT | /:id | Обновление чата |
| DELETE | /:id | Удаление чата |
| GET | /:id/members | Участники |
| POST | /:id/members | Добавить участника |

### Messages (`/api/v1/messages`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | /chats/:chatId | Сообщения чата |
| POST | /chats/:chatId | Отправка сообщения |
| PUT | /:id | Редактирование |
| DELETE | /:id | Удаление |
| POST | /:id/reactions | Добавить реакцию |
| POST | /:id/read | Отметить прочитанным |

---

## 🔌 WebSocket события

### Client → Server

| Событие | Описание | Payload |
|---------|----------|---------|
| `message:send` | Отправка сообщения | { chatId, content, type } |
| `message:read` | Прочитано | { messageId } |
| `typing:start` | Начал печатать | { chatId } |
| `typing:stop` | Перестал печатать | { chatId } |
| `reaction:add` | Добавить реакцию | { messageId, emoji } |
| `call:start` | Начало звонка | { calleeId, type } |

### Server → Client

| Событие | Описание | Payload |
|---------|----------|---------|
| `message:new` | Новое сообщение | Message |
| `message:read-receipt` | Прочитано другими | { messageId, userIds } |
| `user:online` | Пользователь онлайн | { userId } |
| `user:offline` | Пользователь оффлайн | { userId } |
| `typing:update` | Печатает | { chatId, userId } |
| `call:incoming` | Входящий звонок | { callerId, type } |

---

## 🐳 Docker конфигурация

### Сервисы

```yaml
version: '3.8'
services:
  api:
    build: ./api
    ports: ["3001:3001"]
    depends_on: [db, cache]
  
  messenger:
    build: ./messenger
    ports: ["3002:3002"]
    depends_on: [cache]
  
  web:
    build: ./web
    ports: ["3000:3000"]
    depends_on: [api]
  
  db:
    image: postgres:16
    ports: ["3006:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
  
  cache:
    image: redis:7
    ports: ["3007:6379"]
  
  storage:
    image: minio/minio
    ports: ["3008:9000"]
    volumes: [s3data:/data]

volumes:
  pgdata:
  s3data:
```

---

## 📋 Команды разработки

### Установка зависимостей

```bash
# Все пакеты
npm install

# Конкретный пакет
npm install --workspace=api
```

### Запуск

```bash
# Development (все сервисы)
npm run dev

# Конкретный сервис
npm run dev:api
npm run dev:web
npm run dev:messenger

# Production
npm run build
npm start
```

### Тесты

```bash
# Все тесты
npm test

# Конкретный пакет
npm test --workspace=api

# Coverage
npm run test:coverage
```

### Линтинг

```bash
npm run lint
npm run lint:fix
```

---

## 🔐 Безопасность

### Аутентификация
- JWT токены (access + refresh)
- 2FA (TOTP)
- Сессии с экспирацией

### Шифрование
- TLS 1.3 (транспорт)
- Argon2 (хеширование паролей)
- Signal Protocol V2 (E2E, V2 Premium)

### Compliance
- 152-ФЗ (персональные данные)
- 150-ФЗ (ОРМ/СОРМ)
- Сервер в Екатеринбурге, РФ

---

## 📊 Метрики проекта

| Показатель | Значение |
|------------|----------|
| Пакетов | 6 (api, messenger, web, 3 shared) |
| Таблиц БД | 15 |
| API Endpoints | 30+ |
| WebSocket Events | 14 |
| Функций V1 | 53 |
| Функций V2 | 21 |
| Экранов | 50 |
| Компонентов UI | 8 |

---

*Документация для восстановления/развития монорепо*
