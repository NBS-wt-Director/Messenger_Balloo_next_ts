# ТЕХНИЧЕСКОЕ ЗАДАНИЕ: API NODE (App Balloo API)

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** App Balloo API  
**Версия:** 1.0.0  
**Стек:** Node.js 20, TypeScript, Express.js, PostgreSQL, Redis  
**Порт:** 3001  
**URL:** http://localhost:3001  
**Docker Image:** app_balloo-api  
**Статус:** ✅ Работает, подключено к PostgreSQL через PgBouncer

## 2. АРХИТЕКТУРА

### 2.1 Структура проекта
```
api/
├── src/
│   ├── config/
│   │   ├── database.js      # PostgreSQL коннектор
│   │   ├── redis.js         # Redis клиент
│   │   └── logger.js        # Winston logger
│   ├── controllers/         # Контроллеры
│   ├── middleware/          # Express middleware
│   ├── routes/              # API роуты
│   ├── services/            # Бизнес-логика
│   ├── websocket/           # WebSocket сервер
│   └── index.ts             # Точка входа
├── Dockerfile               # Multi-stage build
├── package.json
└── tsconfig.json
```

### 2.2 Зависимости
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "winston": "^3.11.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "sql.js": "^1.10.3",
    "crypto-js": "^4.2.0",
    "multer": "^1.4.5-lts.1",
    "node-fetch": "^2.7.0",
    "ws": "^8.14.2",
    "uuid": "^9.0.1",
    "express-rate-limit": "^7.1.5",
    "axios": "^1.6.2",
    "nodemailer": "^6.9.16",
    "zod": "^3.23.8",
    "ioredis": "^5.3.2",
    "bull": "^4.12.0",
    "pg": "^8.11.3",
    "rate-limit-redis": "^4.2.0",
    "web-push": "^3.6.7",
    "better-sqlite3": "^9.4.3",
    "socket.io": "^4.7.2"
  }
}
```

## 3. БАЗА ДАННЫХ

### 3.1 Подключение
- **Драйвер:** pg (node-postgres)
- **Host:** postgres (через PgBouncer на порту 6432)
- **База:** balloo_production
- **Пользователь:** balloo
- **Пароль:** из переменной DB_PASSWORD
- **Pool:** 20 соединений

### 3.2 Схема таблиц
```sql
-- users - пользователи
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  display_name VARCHAR(100),
  avatar_url TEXT,
  yandex_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- conversations - диалоги
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) DEFAULT 'private',
  last_message TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- messages - сообщения
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  type VARCHAR(20) DEFAULT 'text',
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- attachments - вложения
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id),
  file_path TEXT,
  file_type VARCHAR(50),
  file_size INTEGER,
  yandex_disk_id VARCHAR(255)
);
```

## 4. API ENDPOINTS

### 4.1 Health Check
- **GET** `/health` - Проверка состояния
- **Response:** `{"status":"ok","database":"healthy"}`

### 4.2 Root
- **GET** `/` - Информация об API
- **Response:** `{"name":"App Balloo API","version":"1.0.0","docs":"/api/docs","features":[...]}`

### 4.3 Authentication
- **POST** `/api/v1/auth/register` - Регистрация
- **POST** `/api/v1/auth/login` - Вход
- **POST** `/api/v1/auth/yandex` - Yandex OAuth
- **POST** `/api/v1/auth/refresh` - Обновление токена
- **POST** `/api/v1/auth/logout` - Выход

### 4.4 Users
- **GET** `/api/v1/users/me` - Профиль текущего пользователя
- **PUT** `/api/v1/users/me` - Обновление профиля
- **GET** `/api/v1/users/:id` - Профиль пользователя

### 4.5 Conversations
- **GET** `/api/v1/conversations` - Список диалогов
- **POST** `/api/v1/conversations` - Создать диалог
- **GET** `/api/v1/conversations/:id` - Диалог
- **PUT** `/api/v1/conversations/:id` - Обновить диалог
- **DELETE** `/api/v1/conversations/:id` - Удалить диалог

### 4.6 Messages
- **GET** `/api/v1/conversations/:id/messages` - Сообщения
- **POST** `/api/v1/conversations/:id/messages` - Отправить сообщение
- **PUT** `/api/v1/messages/:id` - Редактировать
- **DELETE** `/api/v1/messages/:id` - Удалить

### 4.7 Attachments
- **POST** `/api/v1/attachments/upload` - Загрузить файл
- **GET** `/api/v1/attachments/:id` - Получить файл
- **DELETE** `/api/v1/attachments/:id` - Удалить

### 4.8 SMS (через Max Server)
- **POST** `/api/v1/sms/send` - Отправить SMS
- **GET** `/api/v1/sms/status/:id` - Статус SMS

### 4.9 Functions (Проекты)
- **GET** `/api/v1/functions` - Список функций
- **POST** `/api/v1/functions` - Создать функцию
- **PUT** `/api/v1/functions/:id` - Обновить
- **DELETE** `/api/v1/functions/:id` - Удалить

### 4.10 Admin
- **GET** `/api/v1/admin/stats` - Статистика
- **GET** `/api/v1/admin/users` - Управление пользователями
- **PUT** `/api/v1/admin/users/:id` - Изменить роль

## 5. MIDDLEWARE

### 5.1 authenticate
- Проверяет JWT токен в заголовке Authorization
- Добавляет user в req.user
- Статус 401 при ошибке

### 5.2 rateLimit
- **globalLimiter:** 100 запросов/15 минут
- **authLimiter:** 20 запросов/час
- **smsLimiter:** 10 SMS/час
- **uploadLimiter:** 50 загрузок/час

### 5.3 validate
- Валидация тела запроса через Zod schemas
- Статус 400 при ошибке

### 5.4 upload
- Multer для загрузки файлов
- Лимит: 10MB
- Типы: image/*, video/*, application/pdf

## 6. WEBSOCKET

### 6.1 Подключение
- **URL:** ws://localhost:3001
- **Авторизация:** через query параметр `token`
- **События:**
  - `connect` - подключение
  - `message` - новое сообщение
  - `typing` - печать
  - `read` - прочитано
  - `call` - звонок
  - `call:accepted` - принят звонок
  - `call:ended` - звонок завершен

### 6.2 Комнаты
- Комната conversation:{id} для диалогов
- Комната user:{id} для пользователя

## 7. КОНФИГУРАЦИЯ

### 7.1 Переменные окружения
```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=<секретный_ключ>
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://balloo:password@pgbouncer:6432/balloo_production
REDIS_HOST=redis
REDIS_PORT=6379
MAX_SERVER_URL=http://max-server:8080
MAX_SERVER_API_KEY=<ключ_max_server>
YANDEX_CLIENT_ID=<id_яндекс>
YANDEX_CLIENT_SECRET=<секрет_яндекс>
YANDEX_DISK_CLIENT_ID=<id_диска>
YANDEX_DISK_CLIENT_SECRET=<секрет_диска>
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=465
EMAIL_USER=<email>
EMAIL_PASSWORD=<пароль>
STORAGE_PROVIDER=yandex
MESSAGE_RETENTION_DAYS=90
```

### 7.2 Логирование
- **Уровень:** info
- **Формат:** JSON
- **Транспорты:** Console, File (combined.log, error.log)
- **Сервис:** api

## 8. ДОКУМЕНТАЦИЯ API

### 8.1 Swagger/OpenAPI
- **URL:** /api/docs
- **Формат:** OpenAPI 3.0
- **Автоматическая генерация** из аннотаций

### 8.2 Examples
```bash
# Health
curl http://localhost:3001/health

# Root
curl http://localhost:3001/

# Auth
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

## 9. БЕЗОПАСНОСТЬ

### 9.1 Шифрование
- **Пароли:** bcrypt (12 rounds)
- **Сообщения:** E2E шифрование (на стороне клиента)
- **Токены:** JWT (HS256)
- **HTTPS:** Helmet middleware

### 9.2 Rate Limiting
- Глобальный: 100/15min
- Auth: 20/hour
- SMS: 10/hour
- Upload: 50/hour

### 9.3 CORS
- Разрешенные origin: из переменной CORS_ORIGIN
- Methods: GET, POST, PUT, DELETE
- Credentials: true

## 10. ТЕСТЫ

### 10.1 Jest
- **Фреймворк:** Jest 29
- **Покрытие:** controllers, services, middleware
- **Запуск:** `npm test`

### 10.2 End-to-End
- **Фреймворк:** Supertest
- **Тесты:** API endpoints
- **Mock:** база данных

## 11. DEPLOY

### 11.1 Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### 11.2 Docker Compose
```yaml
api:
  build: ./api
  ports:
    - "3001:3001"
  environment:
    - NODE_ENV=production
    - DATABASE_URL=postgresql://...
  depends_on:
    - postgres
    - redis
    - pgbouncer
  restart: unless-stopped
```

## 12. МОНИТОРИНГ

### 12.1 Health Check
- **Endpoint:** /health
- **Параметры:** status, timestamp, database
- **Docker:** HEALTHCHECK каждые 30с

### 12.2 Metrics
- Uptime
- Количество соединений к БД
- Количество WebSocket клиентов
- Количество сообщений в очереди

---

**Статус:** ✅ Полностью реализовано и работает  
**Последнее обновление:** 2026-06-23
