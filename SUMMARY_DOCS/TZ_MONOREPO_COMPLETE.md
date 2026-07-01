# ОБЩЕЕ ТЕХНИЧЕСКОЕ ЗАДАНИЕ: BALLOO MONOREPO

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** Balloo Monorepo  
**Версия:** 1.0.0  
**Дата:** 2026-06-23  
**Структура:** Monorepo с PostgreSQL в качестве единой базы данных

## 2. АРХИТЕКТУРА СИСТЕМЫ

### 2.1 Компоненты

```
app_balloo/
├── api/                    # API Server (Node.js + Express)
├── messenger/              # Messenger Web App (Next.js)
├── admin-portal/           # Admin Dashboard (Next.js)
├── max-server/             # SMS Server (Node.js + Express)
├── desktop/                # Desktop Apps (Electron)
├── mobile/                 # Mobile Apps (React Native)
├── android-sms-node/       # Android SMS Node
├── android-service/        # Android Service
├── packages/               # Shared packages
│   ├── core-theme/         # Theme system
│   ├── core-ui/            # UI components
│   ├── core-brand/         # Brand assets
│   └── core-i18n/          # i18n
├── docker/                 # Docker configs
├── nginx/                  # Nginx config
├── docker-compose.yml      # Docker Compose
└── SUMMARY_DOCS/           # Документация
```

### 2.2 Связи между компонентами

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Messenger  │────▶│     API     │────▶│  PostgreSQL │
│   (3000)    │     │   (3001)    │     │   (5432)    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │    Redis    │
                    │   (6379)    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   PgBouncer │
                    │   (6432)    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐     ┌─────────────┐
                    │   Max-      │────▶│  Android    │
                    │  Server     │     │   SMS Node  │
                    │   (8080)    │     │             │
                    └─────────────┘     └─────────────┘

┌─────────────┐
│   Admin     │
│  Portal     │
│   (3002)    │
└──────┬──────┘
       │
       ▼
    [API]
```

## 3. БАЗА ДАННЫХ

### 3.1 Подключение

**Драйвер:** PostgreSQL 15  
**Порт:** 5432 (прямое) / 6432 (через PgBouncer)  
**База:** balloo_production  
**Пользователь:** balloo  
**Пароль:** из переменной DB_PASSWORD

### 3.2 Схема

```sql
-- users
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

-- conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) DEFAULT 'private',
  last_message TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  type VARCHAR(20) DEFAULT 'text',
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- attachments
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id),
  file_path TEXT,
  file_type VARCHAR(50),
  file_size INTEGER,
  yandex_disk_id VARCHAR(255)
);

-- functions (projects)
CREATE TABLE project_functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 4. КОНФИГУРАЦИЯ

### 4.1 Переменные окружения

#### 4.1.1 API
```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=<секретный_ключ_мин_32_символа>
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://balloo:<password>@postgres:5432/balloo_production
REDIS_HOST=redis
REDIS_PORT=6379
MAX_SERVER_URL=http://max-server:8080
MAX_SERVER_API_KEY=<сгенерировать_uuid>
YANDEX_CLIENT_ID=<id_из_яндекс_кабинета>
YANDEX_CLIENT_SECRET=<секрет_из_яндекс_кабинета>
YANDEX_DISK_CLIENT_ID=<id_диска>
YANDEX_DISK_CLIENT_SECRET=<секрет_диска>
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=465
EMAIL_USER=<email>
EMAIL_PASSWORD=<пароль_приложения>
STORAGE_PROVIDER=yandex
MESSAGE_RETENTION_DAYS=90
```

#### 4.1.2 Messenger
```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
DATABASE_URL=postgresql://balloo:<password>@postgres:5432/balloo_production
REDIS_HOST=redis
REDIS_PORT=6379
```

#### 4.1.3 Admin Portal
```bash
NODE_ENV=production
PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3001
ADMIN_KEY=<сгенерировать_uuid>
```

#### 4.1.4 Max Server
```bash
MAX_SERVER_PORT=8080
MAX_SERVER_API_KEY=<тот_же_что_в_API>
LOG_LEVEL=info
```

#### 4.1.5 PostgreSQL
```bash
POSTGRES_USER=balloo
POSTGRES_PASSWORD=<сгенерировать_надежный_пароль>
POSTGRES_DB=balloo_production
```

#### 4.1.6 PgBouncer
```bash
DB_HOST=postgres
DB_PORT=5432
DB_NAME=balloo_production
DB_USER=balloo
DB_PASSWORD=<тот_же_что_в_PostgreSQL>
POOL_MODE=transaction
MAX_DB_CONN=100
MAX_CLIENT_CONN=1000
```

#### 4.1.7 Redis
```bash
# Без пароля для локальной разработки
# Для продакшена:
REDIS_PASSWORD=<сгенерировать_пароль>
```

### 4.2 Файл .env.example

```bash
# PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_NAME=balloo_production
DB_USER=balloo
DB_PASSWORD=<сгенерировать_надежный_пароль>

# PgBouncer
PGBOUNCER_HOST=pgbouncer
PGBOUNCER_PORT=6432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=<сгенерировать_минимум_32_символа>

# Yandex OAuth
YANDEX_CLIENT_ID=<id_из_кабинета>
YANDEX_CLIENT_SECRET=<секрет_из_кабинета>
YANDEX_DISK_CLIENT_ID=<id_диска>
YANDEX_DISK_CLIENT_SECRET=<секрет_диска>

# Email
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=465
EMAIL_USER=<email>
EMAIL_PASSWORD=<пароль_приложения>

# Max Server
MAX_SERVER_API_KEY=<сгенерировать_uuid>

# CORS
CORS_ORIGIN=http://localhost:3000

# Storage
STORAGE_PROVIDER=yandex

# Messages
MESSAGE_RETENTION_DAYS=90
```

## 5. ЗАВИСИМОСТИ

### 5.1 API
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

### 5.2 Messenger
```json
{
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@balloo/core-theme": "file:../packages/core-theme",
    "@balloo/core-ui": "file:../packages/core-ui",
    "axios": "^1.16.1",
    "bcryptjs": "^3.0.3",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "ioredis": "^5.10.1",
    "jose": "^5.9.0",
    "lokijs": "^1.5.12",
    "lucide-react": "^0.460.0",
    "nodemailer": "^6.10.0",
    "sql.js": "^1.1.0",
    "tweetnacl": "^1.0.3",
    "tweetnacl-util": "^0.15.1",
    "web-push": "^3.6.7",
    "yandex-disk": "^0.0.6",
    "zod": "^3.23.8",
    "zustand": "^5.0.0"
  }
}
```

### 5.3 Max Server
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "uuid": "^9.0.0",
    "winston": "^3.11.0"
  }
}
```

## 6. DOCKER COMPOSE

### 6.1 docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER:-balloo}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME:-balloo_production}
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - balloo-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-balloo}"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgbouncer:
    image: edoburu/pgbouncer
    environment:
      DATABASE_URL: "postgresql://${DB_USER:-balloo}:${DB_PASSWORD}@postgres:5432/${DB_NAME:-balloo_production}"
      POOL_MODE: transaction
      MAX_DB_CONN: 100
      MAX_CLIENT_CONN: 1000
    ports:
      - "6432:6432"
    depends_on:
      - postgres
    networks:
      - balloo-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped
    networks:
      - balloo-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  api:
    build: ./api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - JWT_SECRET=${JWT_SECRET}
      - BCRYPT_ROUNDS=12
      - CORS_ORIGIN=${CORS_ORIGIN}
      - DATABASE_URL=postgresql://${DB_USER:-balloo}:${DB_PASSWORD}@postgres:5432/${DB_NAME:-balloo_production}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - MAX_SERVER_URL=http://max-server:8080
      - MAX_SERVER_API_KEY=${MAX_SERVER_API_KEY}
      - YANDEX_CLIENT_ID=${YANDEX_CLIENT_ID}
      - YANDEX_CLIENT_SECRET=${YANDEX_CLIENT_SECRET}
      - YANDEX_DISK_CLIENT_ID=${YANDEX_DISK_CLIENT_ID}
      - YANDEX_DISK_CLIENT_SECRET=${YANDEX_DISK_CLIENT_SECRET}
      - EMAIL_HOST=${EMAIL_HOST}
      - EMAIL_PORT=${EMAIL_PORT}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASSWORD=${EMAIL_PASSWORD}
      - STORAGE_PROVIDER=yandex
      - MESSAGE_RETENTION_DAYS=90
    depends_on:
      - postgres
      - redis
      - max-server
    restart: unless-stopped
    networks:
      - balloo-network

  messenger:
    build: ./messenger
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - NEXT_PUBLIC_API_URL=http://api:3001
      - NEXT_PUBLIC_WS_URL=ws://api:3001
      - DATABASE_URL=postgresql://${DB_USER:-balloo}:${DB_PASSWORD}@postgres:5432/${DB_NAME:-balloo_production}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - api
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - balloo-network

  admin-portal:
    build: ./admin-portal
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - PORT=3002
      - NEXT_PUBLIC_API_URL=http://api:3001
      - NEXT_PUBLIC_WS_URL=ws://api:3001
    depends_on:
      - api
    restart: unless-stopped
    networks:
      - balloo-network

  max-server:
    build: ./max-server
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - MAX_SERVER_PORT=8080
      - MAX_SERVER_API_KEY=${MAX_SERVER_API_KEY}
      - LOG_LEVEL=info
    restart: unless-stopped
    networks:
      - balloo-network

volumes:
  pgdata:
  redis-data:

networks:
  balloo-network:
    driver: bridge
```

## 7. NGINX REVERSE PROXY

### 7.1 nginx.conf

```nginx
upstream api {
    server api:3001;
}

upstream messenger {
    server messenger:3000;
}

upstream admin-portal {
    server admin-portal:3002;
}

upstream max-server {
    server max-server:8080;
}

server {
    listen 80;
    server_name localhost;

    location /api/ {
        proxy_pass http://api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://messenger/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://admin-portal/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /sms/ {
        proxy_pass http://max-server/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 8. ЗАПУСК

### 8.1 Локальная разработка

```bash
# 1. Клонировать репозиторий
git clone <repo_url>
cd app_balloo

# 2. Создать .env файл
cp .env.example .env
# Заполнить переменные

# 3. Запустить все сервисы
docker compose up -d

# 4. Проверить статус
docker compose ps

# 5. Открыть приложения
# Messenger: http://localhost:3000
# API: http://localhost:3001
# Admin: http://localhost:3002
# Max Server: http://localhost:8080
```

### 8.2 Продакшен

```bash
# 1. Настроить сервер (Ubuntu 22.04)
# 2. Установить Docker и Docker Compose
# 3. Клонировать репозиторий
# 4. Настроить .env
# 5. Настроить домены
# 6. Настроить SSL (Let's Encrypt)
# 7. Запустить
docker compose up -d

# 8. Настроить firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable

# 9. Настроить systemd для автозапуска
# 10. Настроить мониторинг (Prometheus + Grafana)
# 11. Настроить бэкапы
```

## 9. МОНИТОРИНГ

### 9.1 Health Checks

- **API:** /health
- **Messenger:** /api/health
- **Admin:** /api/health
- **Max Server:** /health
- **PostgreSQL:** pg_isready
- **Redis:** redis-cli ping
- **PgBouncer:** статус процесса

### 9.2 Metrics

- Количество пользователей
- Количество сообщений
- Активные пользователи
- Использование хранилища
- Время отклика API
- Ошибки

## 10. БЕЗОПАСНОСТЬ

### 10.1 SSL/TLS
- Все соединения через HTTPS
- Сертификаты Let's Encrypt
- Обновление автоматическое

### 10.2 Аутентификация
- JWT токены
- Refresh токены
- Rate limiting
- IP whitelist (опционально)

### 10.3 Шифрование
- E2E для сообщений
- bcrypt для паролей
- TLS для соединений

### 10.4 Backup
- PostgreSQL: ежедневный бэкап
- Redis: AOF + RDB
- Файлы: Yandex Disk

## 11. ТЕСТЫ

### 11.1 API
```bash
cd api
npm test
```

### 11.2 Messenger
```bash
cd messenger
npm test
```

### 11.3 Max Server
```bash
cd max-server
npm test
```

## 12. ДОКУМЕНТАЦИЯ

- API: /api/docs (Swagger)
- Messenger: README.md
- Admin: README.md
- Max Server: README.md

---

**Статус:** ✅ Базовая структура реализована  
**Последнее обновление:** 2026-06-23
