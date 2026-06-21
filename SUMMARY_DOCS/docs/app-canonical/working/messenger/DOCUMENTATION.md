# 📱 Messenger Node — Полная Документация

**Узел:** `messenger`  
**Домен:** `messenger.balloo.su`  
**Статус:** ✅ Production  
**Версия:** 1.0.0  
**Платформа:** Web (Next.js 15)  
**Дата обновления:** 2026-06-20

---

## 🎯 НАЗНАЧЕНИЕ

**Balloo Messenger** — веб-приложение мессенджера с E2E шифрованием, поддержкой групп, файлов и Яндекс.интеграций.

**Primary Purpose:** Web messaging application with end-to-end encryption, group chats, file sharing, and Yandex integrations.

---

## 🏗️ АРХИТЕКТУРА

### Tech Stack

| Компонент | Технология | Версия |
|-----------|-----------|--------|
| Framework | Next.js | 15 (App Router) |
| Язык | TypeScript | Latest |
| Стили | Tailwind CSS | Latest |
| State | Zustand | Latest |
| База данных | SQLite (better-sqlite3) | Embedded |
| Аутентификация | JWT | 7 days access, 30 days refresh |
| Real-time | WebSocket | ws |
| Шифрование | AES-256-GCM, RSA-2048 | Crypto |
| Хранение файлов | Яндекс.Диск | OAuth 2.0 |
| Локализации | i18n | 12 языков |

### Структура Проекта

```
messenger/
├── src/
│   ├── app/                    # Next.js App Router (68 маршрутов)
│   │   ├── layout.tsx          # Корневой layout
│   │   ├── page.tsx            # Главная страница
│   │   ├── globals.css         # Глобальные стили
│   │   ├── login/              # Страница входа
│   │   ├── register/           # Страница регистрации
│   │   ├── chats/              # Список чатов
│   │   ├── chat/[id]/          # Индивидуальный чат
│   │   ├── profile/            # Профиль пользователя
│   │   ├── settings/           # Настройки приложения
│   │   ├── admin/              # Админ-панель
│   │   ├── support/            # Поддержка
│   │   ├── installer/          # Первичная настройка
│   │   └── ... (68 маршрутов)
│   │
│   ├── components/             # React компоненты
│   │   ├── ui/                 # UI компоненты
│   │   ├── chat/               # Компоненты чатов
│   │   ├── auth/               # Компоненты авторизации
│   │   └── layout/             # Компоненты макета
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── auth-store.ts       # Состояние авторизации
│   │   ├── chat-store.ts       # Состояние чатов
│   │   ├── message-store.ts    # Состояние сообщений
│   │   └── settings-store.ts   # Состояние настроек
│   │
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Утилиты
│   ├── types/                  # TypeScript типы
│   └── i18n/                   # Локализации (12 языков)
│
├── api/                        # Next.js API Routes
├── public/                     # Статические файлы
├── scripts/                    # Скрипты настройки
└── docs/                       # Документация
```

---

## 🖥️ ЭКРАНЫ (SCREENS)

### 1. Login Screen (`/login`)

**Purpose:** User authentication — entry point to the messenger.

**Components:**
- `AuthPage` — универсальный компонент авторизации
- `Header` — глобальный хедер
- `Footer` — глобальный футер

**UI Elements:**
- Email input field
- Password input field
- Login button (primary)
- Forgot password link
- Register link
- Yandex OAuth button

**Actions:**
- Submit login form → `/api/auth/login`
- Navigate to register → `/register`
- Yandex OAuth → `/api/auth/yandex`

**Related:**
- Transition: `login-to-chats`
- Scenario: `user-login-flow`
- Integration: `auth-service`

---

### 2. Register Screen (`/register`)

**Purpose:** User registration with email/password.

**UI Elements:**
- Email input field
- Password input field
- Display name input
- Phone input (optional)
- Register button
- Login link

**Actions:**
- Submit registration → `/api/auth/register`

**Related:**
- Transition: `register-to-chats`
- Scenario: `user-register-flow`

---

### 3. Chats Screen (`/chats`)

**Purpose:** Main chat list — shows all conversations.

**Components:**
- `ChatsPage` — основной компонент списка чатов
- `Header`
- `Footer`

**UI Elements:**
- Chat list (scrollable)
- Search bar
- New chat button
- Unread message badges
- Online status indicators

**Actions:**
- Open chat → `/chats/[id]`
- Create new chat → `/chats/new`
- Search chats
- Search messages

**Related:**
- Transition: `chats-to-chat-detail`
- Scenario: `browse-chats`
- Integration: `messenger-api`

---

### 4. Chat Detail Screen (`/chats/[id]`)

**Purpose:** Individual chat view with messages.

**Components:**
- Chat message list
- Message input
- Attachment picker
- Participant list

**UI Elements:**
- Message bubbles (sent/received)
- Text input area
- Send button
- Attachment button
- Participant avatars
- Typing indicator
- Read receipts

**Actions:**
- Send message → POST `/api/messages`
- Attach file
- Edit message (own)
- Delete message (own/admin)
- Open participant profile

**Related:**
- Transition: `chat-to-profile`
- Scenario: `send-message-flow`
- Integration: `messenger-api`, `firebase-push`

---

### 5. Profile Screen (`/profile`)

**Purpose:** User profile display and editing.

**Components:**
- Profile header with avatar
- Personal info form
- Family relations section
- Settings grid
- Invite manager

**UI Elements:**
- Avatar (clickable to change)
- Display name input
- Full name input
- Birth date picker
- Family relations list
- Add relation form
- Language selector
- Theme selector (dark/light/russia)
- Save button
- Logout button
- Yandex Disk connect button

**Actions:**
- Update profile → PUT `/api/users/profile`
- Upload avatar → POST `/api/profile/avatar`
- Change language → `useSettingsStore`
- Change theme → `useThemeStore`
- Connect Yandex Disk → OAuth flow
- Logout → `/api/auth/logout`

**Related:**
- Transition: `profile-to-settings`
- Scenario: `view-profile`
- Integration: `auth-service`, `media-upload`

---

### 6. Settings Screen (`/settings`)

**Purpose:** Application settings and preferences.

**Components:**
- Settings header
- Profile section
- Language section
- Theme section
- Notifications section
- PWA install section
- Yandex Disk section
- About section

**UI Elements:**
- Profile info card
- Language dropdown (4 languages: ru, hi, zh, tt)
- Theme dropdown (dark/light/russia)
- Theme preview cards
- Push notifications toggle
- PWA install button
- Yandex Disk connect button
- Version info

**Actions:**
- Change language → `useSettingsStore`
- Change theme → `useThemeStore`
- Toggle push notifications → `/api/notifications/subscribe`
- Install PWA → `beforeinstallprompt` event
- Connect Yandex Disk

**Related:**
- Transition: `settings-to-login` (logout)
- Scenario: `manage-settings`
- Integration: `auth-service`

---

## 🔄 TRANSITIONS

### 1. login-to-chats

**Source:** `/login`  
**Target:** `/chats`  
**Trigger:** Successful authentication  
**Conditions:** Valid credentials, account not suspended  
**Result:** User authenticated, session created, redirected to chats

### 2. register-to-chats

**Source:** `/register`  
**Target:** `/chats`  
**Trigger:** Successful registration  
**Conditions:** Valid email, password meets requirements  
**Result:** User created, session started, redirected to chats

### 3. chats-to-chat-detail

**Source:** `/chats`  
**Target:** `/chats/[id]`  
**Trigger:** Click on chat item  
**Conditions:** User authenticated  
**Result:** Chat detail page opens with messages

### 4. chat-to-profile

**Source:** `/chats/[id]`  
**Target:** `/profile`  
**Trigger:** Click on avatar  
**Conditions:** User authenticated  
**Result:** Profile page opens

### 5. profile-to-settings

**Source:** `/profile`  
**Target:** `/settings`  
**Trigger:** Click settings icon  
**Conditions:** User authenticated  
**Result:** Settings page opens

### 6. settings-to-login

**Source:** `/settings`  
**Target:** `/login`  
**Trigger:** Logout  
**Conditions:** User authenticated  
**Result:** Session cleared, redirected to login

---

## 📋 SCENARIOS

### 1. User Login Flow

**Goal:** Authenticate user and grant access to messenger  
**Actor:** User  
**Preconditions:** User has registered account, verified email

**Steps:**
1. User opens login screen (`/login`)
2. User enters email
3. User enters password
4. User clicks login button
5. System validates credentials via `POST /api/auth/login`
6. System creates JWT session
7. User redirected to `/chats`
8. Chat list loads

**Outputs:** User authenticated, session created  
**Exceptions:** Invalid credentials, account suspended, email not verified, network failure

---

### 2. Send Message Flow

**Goal:** Send message to contact  
**Actor:** User  
**Preconditions:** User authenticated, on chat screen

**Steps:**
1. User opens chat screen (`/chats`)
2. User selects conversation
3. User types message in input field
4. User taps send button
5. Message validated (length ≤ 4096 chars)
6. Message sent via WebSocket/POST `/api/messages`
7. Message appears in chat history
8. Recipient receives push notification (if offline)

**Outputs:** Message delivered, visible to recipient  
**Exceptions:** Message too long, network failure, media upload failed

---

### 3. View Profile

**Goal:** View and edit user profile  
**Actor:** User  
**Preconditions:** User authenticated

**Steps:**
1. User taps avatar in chat header
2. Profile screen opens (`/profile`)
3. User views profile information
4. User optionally edits display name or bio
5. User optionally changes avatar
6. User clicks save to persist changes
7. Profile updates confirmed

**Outputs:** Profile viewed, changes saved (if edited)  
**Exceptions:** User data not loaded, save failed

---

### 4. Push Notification

**Goal:** Receive and handle push notification  
**Actor:** System  
**Preconditions:** User enabled notifications, browser permission granted

**Steps:**
1. System sends push via Firebase Cloud Messaging
2. User sees browser notification
3. User taps notification
4. App opens to relevant chat
5. Notification marked as read

**Outputs:** User notified, redirected to chat  
**Exceptions:** Permission denied, chat not found

---

## 🔗 INTEGRATIONS

### 1. Auth Service

**Direction:** Bidirectional  
**Target:** `auth-service` (internal)  
**Purpose:** User authentication and session management  
**Protocol:** HTTPS / REST API  
**Auth:** JWT tokens (access: 7 days, refresh: 30 days)

**Endpoints:**
- `POST /api/auth/login` — User login
- `POST /api/auth/register` — User registration
- `POST /api/auth/logout` — User logout
- `GET /api/auth/profile` — Get user profile
- `PUT /api/users/profile` — Update profile

**Data Flow:**
```
User → Login → POST /api/auth/login → Auth Service
                              ↓
                      JWT tokens returned
                              ↓
                      Session stored in Zustand store
```

**Failure Handling:**
- Invalid credentials → 401, show error toast
- Account suspended → 403, show suspension message
- Server error → 500, retry with backoff

---

### 2. Firebase Push

**Direction:** Outbound  
**Target:** Firebase Cloud Messaging (FCM)  
**Purpose:** Push notifications for new messages  
**Protocol:** FCM HTTP v1 API

**Push Payload:**
```json
{
  "token": "device_fcm_token",
  "notification": {
    "title": "New message",
    "body": "User: Hello!",
    "icon": "/favicon.ico",
    "click_action": "OPEN_CHAT"
  },
  "data": {
    "chatId": "conversation_id",
    "senderId": "user_id",
    "timestamp": "2026-06-20T00:00:00Z"
  }
}
```

**Failure Handling:**
- Invalid token → Remove from registry
- Rate limited → Retry with exponential backoff
- Server error → Queue for retry

---

### 3. Yandex Disk

**Direction:** Bidirectional  
**Target:** Yandex Disk API  
**Purpose:** File storage and media sharing  
**Protocol:** HTTPS / REST API  
**Auth:** OAuth 2.0 (client credentials)

**Endpoints:**
- `POST /api/disk/upload` — Upload file to Yandex Disk
- `GET /api/disk/files` — List files
- `DELETE /api/disk/files/:id` — Delete file

**Data Flow:**
```
User → Select file → POST /api/disk/upload → Yandex Disk
                              ↓
                      Encrypted file stored
                              ↓
                      CDN URL returned
```

**Security:**
- Files encrypted before upload (AES-256-GCM)
- Yandex tokens encrypted before storage
- Client ID/Secret only on server

---

## 🔐 БЕЗОПАСНОСТЬ

### E2E Шифрование

- Сообщения шифруются **на клиенте** перед отправкой
- Используется AES-256-GCM для сообщений
- RSA-2048 для обмена ключами
- Ключи шифрования хранятся **только на устройствах**
- Сервер получает только зашифрованные данные

### JWT Аутентификация

- Access token: 7 дней
- Refresh token: 30 дней
- Хранение сессий в БД
- Возможность завершить все сессии

### Секреты

- JWT Secret: хранится в `.env.local`
- Yandex Client ID/Secret: только на сервере
- Encryption Key: в `.env.local`
- Admin Password: в `.env.local`

---

## 🌍 ЛОКАЛИЗАЦИЯ

**Поддерживаемые языки:** 12

| Code | Language |
|------|----------|
| ru | Русский |
| hi | हिंदी |
| zh | 中文 |
| tt | Татарча |
| ... | ... (8 других) |

**Файлы:**
- `src/i18n/ru.json`
- `src/i18n/en.json`
- `src/i18n/tt.json`
- `src/i18n/[others]/`

---

## 📦 DEPLOY

### Production

```bash
# Установка
npm install

# Настройка БД
npm run db:setup

# Сборка
npm run build

# Запуск
npm start

# PM2
pm2 start npm --name "balloo" -- start
```

### Бэкап БД

```bash
# Один файл!
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)
```

---

## 📊 СТАТИСТИКА

| Метрика | Значение |
|---------|----------|
| Маршрутов | 68 |
| API endpoints | 50+ |
| Языков | 12 |
| Размер пакета | ~234 MB |
| Статус | ✅ Production |

---

## 📝 ПРИМЕЧАНИЯ

1. **SQLite (Server):** Встроенная БД, один файл `prisma/dev.db`
2. **RxDB (Client):** Кэширование и офлайн-режим
3. **HTTPS обязателен:** В production
4. **Installer:** Доступен по `/installer` для первичной настройки
5. **Monorepo:** npm workspaces для зависимостей
6. **Бэкап:** Просто скопируйте файл БД

---

**🎈 Balloo - Переверни общение!**
