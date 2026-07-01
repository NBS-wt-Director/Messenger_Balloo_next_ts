# 📋 Техническое задание: API Сервер (App Balloo)

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** App Balloo API Server  
**Версия:** 1.0.0  
**Язык:** TypeScript (Node.js 20)  
**Фреймворк:** Express.js  
**База данных:** PostgreSQL 15 (через pg-bouncer)  
**Кэш/Очереди:** Redis 7  
**WebSocket:** Socket.IO  
**Докер:** Multi-stage build  

## 2. АРХИТЕКТУРА

### 2.1 Структура проекта
```
api/
├── src/
│   ├── config/          # Конфигурация (БД, Redis, Logger)
│   ├── controllers/     # Контроллеры (обработка запросов)
│   ├── middleware/      # Middleware (auth, rateLimit, upload)
│   ├── routes/          # API роуты
│   ├── services/        # Бизнес-логика
│   ├── websocket/       # WebSocket обработчики
│   ├── scripts/         # Миграции и утилиты
│   └── index.ts         # Точка входа
├── Dockerfile
├── package.json
└── tsconfig.json
```

### 2.2 Порты
- **HTTP API:** 3001
- **WebSocket:** 3001 (upgrade)
- **Health Check:** `/health`

## 3. БАЗА ДАННЫХ (PostgreSQL)

### 3.1 Подключение
```typescript
// config/database.js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_SIZE) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000,
});
```

### 3.2 Схемы таблиц (реализованные)
- `users` - пользователи (id, username, email, password_hash, avatar, settings, created_at)
- `chats` - чаты (id, type, name, avatar, settings, created_at)
- `messages` - сообщения (id, chat_id, sender_id, content, encrypted_payload, created_at)
- `attachments` - вложения (id, message_id, file_url, file_type, file_size)
- `sessions` - сессии (id, user_id, device_info, created_at)
- `functions` - функции проектов (id, name, description, settings)
- `notifications` - уведомления (id, user_id, title, message, type, created_at)
- `auth_codes` - коды авторизации (id, user_id, code, expires_at)
- `rate_limits` - ограничения (id, ip, endpoint, count, last_request)
- `2fa_methods` - методы 2FA (id, user_id, type, secret, is_active)
- `quiz_attempts` - попытки квизов (id, user_id, quiz_id, score, completed_at)
- `admin_logs` - логи админа (id, admin_id, action, target, details, created_at)

### 3.3 Миграции
```bash
npm run db:init  # Запуск миграций
```
Файлы миграций: `src/migrations/*.sql`

## 4. API ЭНДПОИНТЫ

### 4.1 Аутентификация
```
POST   /api/v1/auth/register      # Регистрация
POST   /api/v1/auth/login          # Вход
POST   /api/v1/auth/logout         # Выход
POST   /api/v1/auth/refresh        # Refresh token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/2fa/enable
POST   /api/v1/auth/2fa/verify
POST   /api/v1/auth/yandex         # Яндекс OAuth
```

### 4.2 Пользователи
```
GET    /api/v1/users/me            # Профиль текущего
PUT    /api/v1/users/me            # Обновить профиль
GET    /api/v1/users/:id           # Профиль пользователя
POST   /api/v1/users/avatar        # Загрузить аватар
```

### 4.3 Чаты и сообщения
```
GET    /api/v1/chats               # Список чатов
POST   /api/v1/chats               # Создать чат
GET    /api/v1/chats/:id           # Детали чата
PUT    /api/v1/chats/:id           # Обновить чат
DELETE /api/v1/chats/:id           # Удалить чат
GET    /api/v1/chats/:id/messages  # Сообщения чата
POST   /api/v1/chats/:id/messages  # Отправить сообщение
DELETE /api/v1/messages/:id        # Удалить сообщение
POST   /api/v1/chats/:id/typing    # Индикатор набора
```

### 4.4 Вложения
```
POST   /api/v1/attachments/upload  # Загрузить файл
GET    /api/v1/attachments/:id     # Получить вложение
DELETE /api/v1/attachments/:id     # Удалить вложение
```

### 4.5 Уведомления
```
GET    /api/v1/notifications       # Список уведомлений
PUT    /api/v1/notifications/:id   # Прочитать
PUT    /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
POST   /api/v1/notifications/webpush  # Подписка WebPush
```

### 4.6 SMS
```
POST   /api/v1/sms/send            # Отправить SMS
POST   /api/v1/sms/verify          # Подтвердить код
POST   /api/v1/sms/resend          # Повторная отправка
```

### 4.7 Функции (проекты)
```
GET    /api/v1/functions           # Список функций
POST   /api/v1/functions           # Создать функцию
GET    /api/v1/functions/:id       # Детали функции
PUT    /api/v1/functions/:id       # Обновить функцию
DELETE /api/v1/functions/:id       # Удалить функцию
```

### 4.8 Администрирование
```
GET    /api/v1/admin/users         # Все пользователи
GET    /api/v1/admin/chats         # Все чаты
GET    /api/v1/admin/stats         # Статистика
GET    /api/v1/admin/logs          # Логи админа
PUT    /api/v1/admin/users/:id     # Заблокировать пользователя
POST   /api/v1/admin/config        # Обновить настройки
GET    /api/v1/admin/backup        # Создать бэкап
```

### 4.9 Квизы
```
GET    /api/v1/quizzes             # Список квизов
POST   /api/v1/quizzes/attempt     # Начать попытку
GET    /api/v1/quizzes/:id/results # Результаты
```

## 5. СЕРВИСЫ

### 5.1 Auth Service
- JWT токены (access + refresh)
- Bcrypt хеширование (12 раундов)
- 2FA (TOTP через OTPAuth)
- Яндекс OAuth

### 5.2 Notification Service
- Web Push (web-push lib)
- Email (nodemailer)
- WebSocket push
- SMS через Max Server

### 5.3 WebSocket (Socket.IO)
```typescript
// websocket/index.ts
const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*' },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// События
io.on('connection', (socket) => {
  socket.on('join_chat', (chatId) => { ... });
  socket.on('message', (data) => { ... });
  socket.on('typing', (data) => { ... });
  socket.on('disconnect', () => { ... });
});
```

### 5.4 File Storage
- Yandex Disk (основной)
- Local storage (fallback)
- Multer middleware для загрузки

### 5.5 Rate Limiting
```javascript
// middleware/rateLimit.js
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

## 6. КОНФИГУРАЦИЯ (Environment Variables)

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@pgbouncer:6432/dbname
DB_POOL_SIZE=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=<secret>
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
STORAGE_PROVIDER=yandex
MESSAGE_RETENTION_DAYS=90

# Yandex OAuth
YANDEX_CLIENT_ID=<id>
YANDEX_CLIENT_SECRET=<secret>
YANDEX_DISK_CLIENT_ID=<id>
YANDEX_DISK_CLIENT_SECRET=<secret>

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<email>
EMAIL_PASSWORD=<password>

# Max Server (SMS)
MAX_SERVER_URL=http://max-server:8080
MAX_SERVER_API_KEY=<key>
SMS_SERVER_URL=http://max-server:8080
SMS_SERVER_API_KEY=<key>
```

## 7. DOCKER

### 7.1 Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["dumb-init", "node", "dist/index.js"]
```

### 7.2 docker-compose.yml (фрагмент)
```yaml
api:
  build: ./api
  ports:
    - "3001:3001"
  environment:
    - NODE_ENV=production
    - PORT=3001
    - DATABASE_URL=postgresql://balloo:pass@postgres:5432/balloo_production
    - REDIS_HOST=redis
  depends_on:
    - postgres
    - redis
    - pgbouncer
  networks:
    - balloo-network
```

## 8. БЕЗОПАСНОСТЬ

- Helmet.js для HTTP заголовков
- CORS restriction
- Rate limiting (global, auth, SMS, upload)
- JWT авторизация
- Bcrypt (12 rounds)
- 2FA (TOTP)
- SQL injection protection (pg parameterized queries)
- XSS protection (CSP headers)
- File upload validation (type, size)

## 9. ЛОГИРОВАНИЕ

Winston logger с уровнями:
- error
- warn
- info
- http
- debug

Формат: JSON с timestamp, service, message, context

## 10. ТЕКУЩИЙ СТАТУС

✅ **Реализовано:**
- REST API (все эндпоинты)
- WebSocket (Socket.IO)
- PostgreSQL подключение
- Redis кэш/очереди
- JWT авторизация
- 2FA (TOTP)
- Web Push уведомления
- File upload (Yandex Disk)
- SMS integration (Max Server)
- Admin panel endpoints
- Rate limiting
- Health check
- Docker build/run

⚠️ **Частично:**
- Email notifications (нужны credentials)
- Yandex OAuth (нужны credentials)
- SMS (нужен Max Server)

❌ **Не реализовано:**
- GraphQL API
- Server-sent events (только WebSocket)
- Offline mode sync
- End-to-end encryption (только payload)

---

**Дата создания:** 2026-06-23  
**Версия документа:** 1.0
