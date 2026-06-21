# 🚀 API Node — Полная Документация

**Узел:** `api`  
**Домен:** `api.balloo.su`  
**Статус:** ✅ Production  
**Версия:** 1.0.0  
**Платформа:** Node.js (Express.js)  
**Дата обновления:** 2026-06-20

---

## 🎯 НАЗНАЧЕНИЕ

**Balloo API** — backend API server для мессенджера App Balloo с поддержкой E2E шифрования и Яндекс.интеграций.

**Primary Purpose:** Backend API server for messenger with end-to-end encryption and Yandex integrations.

---

## 🏗️ АРХИТЕКТУРА

### Tech Stack

| Компонент | Технология | Версия |
|-----------|-----------|--------|
| Runtime | Node.js | >= 18 |
| Framework | Express.js | Latest |
| Database | Better-SQLite3 | Embedded |
| Аутентификация | JWT | jsonwebtoken |
| Real-time | WebSocket | ws |
| Шифрование | AES-256-GCM, RSA-2048 | crypto-js |
| Хранение файлов | Яндекс.Диск | OAuth 2.0 |
| Логирование | Winston | Latest |
| Тесты | Jest | Latest |

### Структура Проекта

```
api/
├── src/
│   ├── index.ts              # Application entry point
│   ├── config/               # Configuration
│   │   ├── database.js       # SQLite setup & migrations
│   │   ├── yandex.js         # Yandex OAuth & Disk config
│   │   └── encryption.js     # Crypto utilities
│   ├── controllers/          # Route controllers (26 файлов)
│   │   ├── auth.controller.js
│   │   ├── yandex-auth.controller.js
│   │   ├── yandex-disk.controller.js
│   │   ├── users.controller.js
│   │   ├── chats.controller.js
│   │   ├── messages.controller.js
│   │   ├── contacts.controller.js
│   │   ├── groups.controller.js
│   │   ├── invitations.controller.js
│   │   ├── notifications.controller.js
│   │   ├── themes.controller.js
│   │   ├── theme-subscriptions.controller.js
│   │   ├── features.controller.js
│   │   ├── polls.controller.js
│   │   ├── quizzes.controller.js
│   │   ├── surveys.controller.js
│   │   ├── pages.controller.js
│   │   ├── searches.controller.js
│   │   ├── reports.controller.js
│   │   ├── bans.controller.js
│   │   ├── sync.controller.js
│   │   ├── statuses.controller.js
│   │   ├── lists.controller.js
│   │   ├── audio.controller.js
│   │   ├── calls.controller.js
│   │   ├── webrtc.controller.js
│   │   └── admin.controller.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   ├── validation.js     # Request validation
│   │   ├── errorHandler.js   # Error handling
│   │   └── rateLimiter.js    # Rate limiting
│   ├── routes/               # API routes
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── yandex-auth.routes.js
│   │   ├── users.routes.js
│   │   ├── chats.routes.js
│   │   ├── messages.routes.js
│   │   └── ...
│   ├── services/             # Business logic
│   │   ├── email.service.js
│   │   ├── yandex-disk.service.js
│   │   ├── encryption.service.js
│   │   └── notification.service.js
│   ├── websocket/            # WebSocket handler
│   │   └── index.js
│   └── migrations/           # DB migrations
├── tests/                    # Test files
├── data/                     # SQLite database files
├── uploads/                  # Temporary file uploads
├── logs/                     # Log files
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── TODO.md                   # Full API specification
```

---

## 🖥️ ЭКРАНЫ (SCREENS)

API не имеет UI экранов, но предоставляет endpoints для следующих интерфейсов:

### 1. Authentication Endpoints

**Purpose:** User registration, login, session management

**Endpoints:**
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `GET /api/auth/profile` — Get user profile
- `PUT /api/auth/profile` — Update profile
- `POST /api/auth/refresh` — Refresh JWT token
- `POST /api/auth/forgot-password` — Password reset request
- `POST /api/auth/reset-password` — Password reset

**Data Flow:**
```
Client → POST /api/auth/login → Auth Controller
                              → Auth Service
                              → JWT tokens returned
```

---

### 2. Users Endpoints

**Purpose:** User profile management, search, contacts

**Endpoints:**
- `GET /api/users` — List users (search)
- `GET /api/users/:id` — Get user profile
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user (admin)
- `GET /api/users/:id/contacts` — Get contacts
- `POST /api/users/:id/contacts` — Add contact
- `DELETE /api/users/:id/contacts/:contactId` — Remove contact
- `GET /api/users/:id/family` — Get family relations
- `POST /api/users/:id/family` — Add family relation

---

### 3. Chats Endpoints

**Purpose:** Chat creation, management, participants

**Endpoints:**
- `GET /api/chats?userId=xxx` — List user chats
- `POST /api/chats` — Create chat
- `GET /api/chats/:id` — Get chat details
- `PUT /api/chats/:id` — Update chat
- `DELETE /api/chats/:id` — Delete chat
- `POST /api/chats/:id/participants` — Add participant
- `DELETE /api/chats/:id/participants/:userId` — Remove participant
- `GET /api/chats/search?q=...&userId=...` — Search chats

**Chat Types:**
- `private` — Individual chat
- `group` — Group chat
- `channel` — Channel

---

### 4. Messages Endpoints

**Purpose:** Message CRUD, search, reactions

**Endpoints:**
- `GET /api/messages?chatId=xxx` — List messages
- `POST /api/messages` — Send message
- `PUT /api/messages/:id` — Edit message
- `DELETE /api/messages/:id` — Delete message
- `GET /api/messages/search?q=...&userId=...` — Search messages
- `POST /api/messages/:id/reactions` — Add reaction
- `DELETE /api/messages/:id/reactions` — Remove reaction
- `GET /api/messages/:id` — Get message details

**E2E Encryption:**
- Messages encrypted on client before sending
- Server stores only encrypted data
- Decryption happens on client

---

### 5. Files Endpoints

**Purpose:** File upload, download, Yandex Disk integration

**Endpoints:**
- `POST /api/files/upload` — Upload file
- `GET /api/files/:id` — Download file
- `DELETE /api/files/:id` — Delete file
- `GET /api/files?chatId=xxx` — List chat files
- `POST /api/disk/upload` — Upload to Yandex Disk
- `GET /api/disk/files` — List Yandex Disk files
- `DELETE /api/disk/files/:id` — Delete Yandex Disk file

**File Types:**
- Images (JPG, PNG, GIF)
- Documents (PDF, DOC, etc.)
- Audio
- Video

---

### 6. Notifications Endpoints

**Purpose:** Push notifications, in-app notifications

**Endpoints:**
- `GET /api/notifications?userId=xxx` — List notifications
- `PUT /api/notifications/:id/read` — Mark as read
- `PUT /api/notifications/read-all` — Mark all as read
- `DELETE /api/notifications/:id` — Delete notification
- `POST /api/notifications/subscribe` — Subscribe to push
- `POST /api/notifications/unsubscribe` — Unsubscribe from push

---

### 7. Themes Endpoints

**Purpose:** Theme management, subscriptions

**Endpoints:**
- `GET /api/themes` — List available themes
- `GET /api/themes/:id` — Get theme details
- `POST /api/theme-subscriptions` — Subscribe to theme
- `DELETE /api/theme-subscriptions/:id` — Unsubscribe

**Themes:**
- `dark` — Dark theme
- `light` — Light theme
- `russia` — Russia patriotic theme

---

### 8. Admin Endpoints

**Purpose:** Admin panel, user management, analytics

**Endpoints:**
- `GET /api/admin/users` — List all users
- `PUT /api/admin/users/:id/ban` — Ban user
- `PUT /api/admin/users/:id/unban` — Unban user
- `GET /api/admin/stats` — Get statistics
- `GET /api/admin/reports` — List reports
- `PUT /api/admin/reports/:id` — Resolve report

---

### 9. Features Endpoints

**Purpose:** Feature requests, polls, quizzes, surveys

**Endpoints:**
- `GET /api/features` — List features
- `POST /api/features` — Create feature request
- `GET /api/polls` — List polls
- `POST /api/polls` — Create poll
- `POST /api/polls/:id/vote` — Vote on poll
- `GET /api/quizzes` — List quizzes
- `POST /api/quizzes/:id/answer` — Answer quiz
- `GET /api/surveys` — List surveys
- `POST /api/surveys/:id/submit` — Submit survey

---

### 10. Search Endpoints

**Purpose:** Global search across chats, messages, users

**Endpoints:**
- `GET /api/global-search?q=...&type=all` — Global search
- `GET /api/chats/search?q=...&userId=...` — Search chats
- `GET /api/messages/search?q=...&userId=...` — Search messages
- `GET /api/users/search?q=...` — Search users

---

## 🔄 TRANSITIONS

API transitions are implicit through state changes:

### 1. Unauthenticated → Authenticated

**Trigger:** Successful login  
**Condition:** Valid credentials  
**Result:** JWT tokens returned, session created

### 2. Chat Created → Messages Active

**Trigger:** Chat creation  
**Condition:** Valid chat data  
**Result:** Chat added to user's list, WebSocket connection opened

### 3. Message Sent → Delivered

**Trigger:** Message send  
**Condition:** Valid message, participant exists  
**Result:** Message stored (encrypted), push notification sent (if offline)

---

## 📋 SCENARIOS

### 1. User Registration

**Goal:** Create new user account  
**Actor:** User  
**Preconditions:** None

**Steps:**
1. User fills registration form
2. Client sends POST `/api/auth/register`
3. Server validates data
4. Server creates user in SQLite
5. Server generates JWT tokens
6. Server returns tokens to client

**Outputs:** User created, session started  
**Exceptions:** Email already exists, invalid format, server error

---

### 2. Send Encrypted Message

**Goal:** Send E2E encrypted message  
**Actor:** User  
**Preconditions:** User authenticated, chat exists

**Steps:**
1. User types message
2. Client encrypts message (AES-256-GCM)
3. Client sends POST `/api/messages` with encrypted data
4. Server stores encrypted message
5. Server sends WebSocket event to participants
6. Recipients decrypt message on client

**Outputs:** Message stored and delivered  
**Exceptions:** Network failure, invalid chat, encryption error

---

### 3. Upload File to Yandex Disk

**Goal:** Store file in Yandex Disk with encryption  
**Actor:** User  
**Preconditions:** User authenticated, Yandex tokens valid

**Steps:**
1. User selects file
2. Client encrypts file (AES-256-GCM)
3. Client sends POST `/api/disk/upload`
4. Server encrypts file again (double encryption)
5. Server uploads to Yandex Disk via OAuth
6. Server stores file metadata and CDN URL
7. Server returns file ID to client

**Outputs:** File stored securely  
**Exceptions:** Yandex OAuth expired, file too large, encryption error

---

## 🔗 INTEGRATIONS

### 1. SQLite Database

**Direction:** Bidirectional  
**Target:** Embedded SQLite (better-sqlite3)  
**Purpose:** Data storage  
**Protocol:** SQLite API

**Tables:**
- `users` — Users
- `chats` — Chats
- `messages` — Messages
- `attachments` — Attachments
- `invitations` — Invitations
- `contacts` — Contacts
- `notifications` — Notifications
- `sessions` — Sessions
- `devices` — Devices
- `reports` — Reports
- `versions` — Versions

---

### 2. WebSocket Server

**Direction:** Bidirectional  
**Target:** WebSocket (ws)  
**Purpose:** Real-time events  
**Protocol:** WebSocket

**Connection:** `ws://localhost:3001/ws?token=<jwt_token>`

**Events:**
- `message:new` — New message
- `message:edited` — Message edited
- `message:deleted` — Message deleted
- `chat:new` — New chat
- `chat:updated` — Chat updated
- `notification:new` — New notification
- `user:online` — User online
- `user:offline` — User offline

---

### 3. Yandex OAuth

**Direction:** Bidirectional  
**Target:** Yandex OAuth API  
**Purpose:** Yandex authentication and Disk access  
**Protocol:** HTTPS / OAuth 2.0

**Endpoints:**
- `https://oauth.yandex.ru/authorize` — Authorization
- `https://oauth.yandex.ru/token` — Token exchange
- `https://disk.yandex.ru/api/v2` — Disk API

**Scopes:**
- `disk:read` — Read files
- `disk:write` — Write files
- `login:devices` — Device management

---

### 4. Email Service

**Direction:** Outbound  
**Target:** SMTP server  
**Purpose:** Password reset, verification emails  
**Protocol:** SMTP

---

## 🔐 БЕЗОПАСНОСТЬ

### E2E Шифрование

- Сообщения шифруются **на клиенте** перед отправкой
- Используется AES-256-GCM
- RSA-2048 для обмена ключами
- Ключи шифрования только на устройствах
- Сервер получает только зашифрованные данные

### JWT Аутентификация

- Access token: 7 дней
- Refresh token: 30 дней
- Хранение сессий в БД
- Возможность завершить все сессии

### Rate Limiting

- `/api/auth/login` — 5 requests/minute
- `/api/auth/register` — 3 requests/minute
- General — 100 requests/minute

### Middleware

- `auth.js` — JWT validation
- `validation.js` — Request validation
- `errorHandler.js` — Error handling
- `rateLimiter.js` — Rate limiting

---

## 📦 DEPLOY

### Production

```bash
# Установка
npm install

# Настройка БД
npm run db:init

# Запуск
npm start
```

### Environment Variables

```bash
JWT_SECRET=your-secret
YANDEX_CLIENT_ID=your-client-id
YANDEX_CLIENT_SECRET=your-client-secret
ENCRYPTION_KEY=your-encryption-key
EMAIL_HOST=smtp.example.com
EMAIL_USER=user@example.com
EMAIL_PASSWORD=password
```

---

## 📊 СТАТИСТИКА

| Метрика | Значение |
|---------|----------|
| Controllers | 26 |
| API endpoints | 100+ |
| Tables | 11 |
| WebSocket events | 10 |
| Статус | ✅ Production |

---

## 📝 ПРИМЕЧАНИЯ

1. **SQLite (Embedded):** Один файл, не требует отдельного сервера
2. **E2E Encryption:** Клиент шифрует, сервер хранит зашифрованное
3. **WebSocket:** Real-time events для сообщений и уведомлений
4. **Yandex Integration:** OAuth 2.0 для Disk и Auth
5. **Rate Limiting:** Защита от brute-force
6. **Logging:** Winston logs to files

---

**🎈 Balloo - Переверни общение!**
