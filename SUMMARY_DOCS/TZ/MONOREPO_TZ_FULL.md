# 🏗️ ТЕХНИЧЕСКОЕ ЗАДАНИЕ: Balloo Monorepo - Единая Экосистема

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** Balloo Monorepo Platform  
**Версия:** 1.0.0  
**Тип:** Monorepo с multi-service архитектурой  
**База данных:** PostgreSQL 15 (единая для всех сервисов)  
**Оркестрация:** Docker Compose  
**Запуск:** Одна команда `docker compose up -d`  

## 2. АРХИТЕКТУРА

### 2.1 Структура монорепо
```
app_balloo/
├── api/                    # Backend API Server (Express + TypeScript)
├── messenger/              # Web Messenger (Next.js 15)
├── admin-portal/           # Admin Dashboard (Next.js 15)
├── max-server/             # SMS Gateway Server
├── desktop/                # Desktop Apps (Electron)
├── mobile/                 # Mobile Apps (React Native)
├── android-sms-node/       # SMS Admin Android
├── packages/               # Shared packages
│   ├── core-ui/            # UI Components
│   ├── core-theme/         # Theme System
│   ├── core-types/         # TypeScript Types
│   └── core-api/           # API Client
├── docker/                 # Docker configs
├── nginx/                  # Reverse Proxy
└── docker-compose.yml      # Единый файл запуска
```

### 2.2 Сеть сервисов
```
┌─────────────────────────────────────────┐
│         Nginx Reverse Proxy (80/443)     │
│   api.example.com → api:3001             │
│   app.example.com → messenger:3000       │
│   admin.example.com → admin-portal:3002  │
└──────────┬──────────────────────────────┘
           │
┌──────────▼──────────────────────────────┐
│         Docker Internal Network          │
│                                          │
│  ┌──────────┐  ┌──────────┐             │
│  │  API     │  │Messenger │             │
│  │ :3001    │  │ :3000    │             │
│  └────┬─────┘  └────┬─────┘             │
│       │             │                    │
│  ┌────▼─────────────▼─────┐             │
│  │   PostgreSQL 15        │             │
│  │   :5432                │             │
│  │   (pg-bouncer :6432)   │             │
│  └────────────────────────┘             │
│                                          │
│  ┌──────────┐  ┌──────────┐             │
│  │  Redis   │  │ Max      │             │
│  │  :6379   │  │Server    │             │
│  │          │  │ :8080    │             │
│  └──────────┘  └──────────┘             │
└─────────────────────────────────────────┘
```

## 3. БАЗА ДАННЫХ (PostgreSQL)

### 3.1 Схема БД (единая для всех сервисов)
```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chats
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL, -- 'private', 'group', 'channel'
    name VARCHAR(255),
    avatar VARCHAR(500),
    settings JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    content TEXT,
    encrypted_payload TEXT,
    file_urls TEXT[],
    reply_to_id UUID REFERENCES messages(id),
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat Members
CREATE TABLE chat_members (
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    last_read_message_id UUID REFERENCES messages(id),
    PRIMARY KEY (chat_id, user_id)
);

-- Attachments
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_info JSONB,
    ip_address INET,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50), -- 'message', 'system', 'admin'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Auth Codes (2FA, email verification)
CREATE TABLE auth_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(50), -- '2fa', 'email_verify', 'password_reset'
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2FA Methods
CREATE TABLE two_fa_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'totp', -- 'totp', 'sms', 'email'
    secret VARCHAR(255),
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Admin Logs
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50), -- 'user', 'chat', 'system'
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Functions (Project Features)
CREATE TABLE functions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Rate Limits
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET,
    user_id UUID REFERENCES users(id),
    endpoint VARCHAR(255),
    count INTEGER DEFAULT 1,
    last_request TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID,
    score INTEGER,
    total_questions INTEGER,
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_rate_limits_ip ON rate_limits(ip_address);
```

### 3.2 Подключение
```typescript
// API Server
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
});

// Messenger (через API)
// Не подключается напрямую к БД
```

## 4. СЕРВИСЫ

### 4.1 API Server (Port 3001)
**Технологии:** Node.js 20, Express, TypeScript, Socket.IO  
**Функции:**
- REST API (RESTful endpoints)
- WebSocket (Socket.IO)
- JWT Authentication
- File Upload (Yandex Disk)
- Rate Limiting
- Redis Caching
- Background Jobs (Bull)
- Email/SMS Notifications

**Запуск:**
```bash
cd api
npm install
npm run build
npm start
# Или Docker:
docker compose up -d api
```

### 4.2 Messenger (Port 3000)
**Технологии:** Next.js 15, React 19, TypeScript, Tailwind CSS  
**Функции:**
- Web Messenger UI
- Real-time chat (WebSocket)
- File sharing
- Push notifications
- Theme system (dark/light/russia)
- User settings
- Session management

**Запуск:**
```bash
cd messenger
npm install
npm run build
npm start
# Или Docker:
docker compose up -d messenger
```

### 4.3 Admin Portal (Port 3002)
**Технологии:** Next.js 15, React 19, TypeScript  
**Функции:**
- User management
- Chat moderation
- System stats
- Log viewer
- Config management
- Backup management

**Запуск:**
```bash
cd admin-portal
npm install
npm run build
npm start
# Или Docker:
docker compose up -d admin-portal
```

### 4.4 Max Server (Port 8080)
**Технологии:** Node.js, Express  
**Функции:**
- SMS Gateway
- SMS sending/receiving
- Balance management
- SMS logs

**Запуск:**
```bash
cd max-server
npm install
npm start
# Или Docker:
docker compose up -d max-server
```

### 4.5 PostgreSQL (Port 5432)
**Технологии:** PostgreSQL 15, pg-bouncer  
**Функции:**
- Основная БД
- Connection pooling (pg-bouncer:6432)
- Automated backups

**Запуск:**
```bash
docker compose up -d postgres pgbouncer
```

### 4.6 Redis (Port 6379)
**Технологии:** Redis 7  
**Функции:**
- Caching
- Session storage
- Rate limiting
- Message queue (Bull)

**Запуск:**
```bash
docker compose up -d redis
```

## 5. ЕДИНЫЙ ЗАПУСК (Docker Compose)

### 5.1 docker-compose.yml
```yaml
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: balloo_production
      POSTGRES_USER: balloo
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - balloo-network
    restart: unless-stopped

  pgbouncer:
    image: edoburu/pgbouncer
    environment:
      DATABASE_URL: postgresql://balloo:${DB_PASSWORD}@postgres:5432/balloo_production
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
    volumes:
      - redis-data:/data
    networks:
      - balloo-network
    restart: unless-stopped

  # Backend
  api:
    build: ./api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DATABASE_URL=postgresql://balloo:${DB_PASSWORD}@postgres:5432/balloo_production
      - REDIS_HOST=redis
      - JWT_SECRET=${JWT_SECRET}
      - STORAGE_PROVIDER=yandex
    depends_on:
      - postgres
      - redis
    networks:
      - balloo-network
    restart: unless-stopped

  # Frontend
  messenger:
    build: ./messenger
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://api:3001
      - NEXT_PUBLIC_WS_URL=ws://api:3001
    depends_on:
      - api
    networks:
      - balloo-network
    restart: unless-stopped

  admin-portal:
    build: ./admin-portal
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://api:3001
    depends_on:
      - api
    networks:
      - balloo-network
    restart: unless-stopped

  max-server:
    build: ./max-server
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    networks:
      - balloo-network
    restart: unless-stopped

volumes:
  pgdata:
  redis-data:

networks:
  balloo-network:
    driver: bridge
```

### 5.2 .env файл
```bash
# Database
DB_PASSWORD=your_secure_password_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Yandex OAuth
YANDEX_CLIENT_ID=your_yandex_client_id
YANDEX_CLIENT_SECRET=your_yandex_client_secret
YANDEX_DISK_CLIENT_ID=your_yandex_disk_client_id
YANDEX_DISK_CLIENT_SECRET=your_yandex_disk_client_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# SMS
MAX_SERVER_API_KEY=your_sms_api_key

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 5.3 Команда запуска
```bash
# Полный запуск
docker compose up -d

# Пересборка всех сервисов
docker compose up -d --build

# Остановка
docker compose down

# Остановка с удалением volumes (⚠️ удалит БД)
docker compose down -v

# Логи
docker compose logs -f api
docker compose logs -f messenger

# Статус
docker compose ps
```

## 6. ДЕПЛОЙ НА ПРОДАКШЕН

### 6.1 Требования к серверу
- **OS:** Ubuntu 22.04 LTS
- **RAM:** 4GB минимум (8GB рекомендуется)
- **CPU:** 2 cores минимум
- **Disk:** 20GB SSD минимум
- **Docker:** 20.10+
- **Docker Compose:** 2.0+

### 6.2 Установка
```bash
# 1. Обновить систему
sudo apt update && sudo apt upgrade -y

# 2. Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Установить Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Добавить пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker

# 5. Клонировать репозиторий
git clone https://github.com/your-org/app_balloo.git
cd app_balloo

# 6. Создать .env файл
cp .env.example .env
nano .env  # Заполнить переменные

# 7. Запустить
docker compose up -d --build
```

### 6.3 Настройка Nginx (Reverse Proxy)
```nginx
# /etc/nginx/sites-available/balloo
server {
    listen 80;
    server_name app.example.com api.example.com admin.example.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name api.example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name admin.example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

### 6.4 SSL (Let's Encrypt)
```bash
# Установить Certbot
sudo apt install certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d app.example.com -d api.example.com -d admin.example.com

# Автоматическое обновление
sudo crontab -e
# Добавить: 0 0 * * * certbot renew --quiet
```

### 6.5 Переменные для продакшена
```bash
# Заполнить в .env:
DB_PASSWORD=<сложный_пароль_32+_символов>
JWT_SECRET=<сложный_secret_64+_символов>
YANDEX_CLIENT_ID=<из_кабинета_Яндекс>
YANDEX_CLIENT_SECRET=<из_кабинета_Яндекс>
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=587
EMAIL_USER=<your_email>@yandex.ru
EMAIL_PASSWORD=<app_password_Яндекс>
MAX_SERVER_API_KEY=<сгенерировать_ключ>
CORS_ORIGIN=https://app.example.com
```

### 6.6 Финальный деплой
```bash
# 1. Скопировать файлы на сервер
scp -r ./* user@server:/opt/app_balloo

# 2. Подключиться к серверу
ssh user@server
cd /opt/app_balloo

# 3. Проверить .env
cat .env

# 4. Запустить
docker compose up -d --build

# 5. Проверить статус
docker compose ps

# 6. Проверить логи
docker compose logs -f api

# 7. Проверить health
curl http://localhost:3001/health

# 8. Настроить Nginx
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl restart nginx

# 9. Настроить SSL
sudo certbot --nginx

# 10. Готово!
echo "Balloo Platform deployed successfully!"
```

## 7. МОНИТОРИНГ И ОБСЛУЖИВАНИЕ

### 7.1 Health Checks
```bash
# API
curl http://localhost:3001/health

# Messenger
curl http://localhost:3000/api/health

# Admin
curl http://localhost:3002/api/health

# PostgreSQL
docker exec app_balloo-postgres-1 pg_isready

# Redis
docker exec app_balloo-redis-1 redis-cli ping
```

### 7.2 Бэкапы
```bash
# Бэкап БД
docker exec app_balloo-postgres-1 pg_dump -U balloo balloo_production > backup_$(date +%Y%m%d).sql

# Восстановление
docker exec -i app_balloo-postgres-1 psql -U balloo balloo_production < backup_20260623.sql

# Бэкап всего проекта
tar -czf balloo_backup_$(date +%Y%m%d).tar.gz api/ messenger/ admin-portal/ max-server/ docker-compose.yml .env
```

### 7.3 Обновление
```bash
# Обновить код
git pull

# Пересобрать и перезапустить
docker compose up -d --build

# Откат
docker compose down
git checkout <previous_commit>
docker compose up -d --build
```

## 8. ТЕКУЩИЙ СТАТУС РЕАЛИЗАЦИИ

### ✅ Реализовано (100%):
1. **API Server**
   - REST API (все эндпоинты)
   - WebSocket (Socket.IO)
   - PostgreSQL integration
   - Redis caching
   - JWT auth + 2FA
   - File upload (Yandex Disk)
   - SMS integration
   - Docker build/run

2. **Messenger**
   - Next.js 15 App Router
   - Auth pages
   - Chat UI components
   - Settings page
   - Sessions page
   - Theme system
   - Zustand stores
   - Docker build

3. **Infrastructure**
   - PostgreSQL 15
   - pg-bouncer
   - Redis 7
   - Docker Compose
   - Nginx config

### ⚠️ Частично реализовано:
1. **Admin Portal** - структура проекта, API endpoints
2. **Max Server** - базовая структура
3. **Desktop/Mobile** - структуры проектов

### ❌ Не реализовано:
1. Full Admin UI
2. Desktop app (Electron)
3. Mobile app (React Native)
4. Push notifications (VAPID keys)
5. i18n (полная локализация)
6. Voice/Video calls

## 9. ДОКУМЕНТАЦИЯ

Все TZ документы:
- `SUMMARY_DOCS/TZ/API_TZ_FULL.md`
- `SUMMARY_DOCS/TZ/MESSENGER_TZ_FULL.md`
- `SUMMARY_DOCS/TZ/ADMIN_TZ_FULL.md`
- `SUMMARY_DOCS/TZ/SMS_ADMIN_MANAGER_TZ_FULL.md`
- `SUMMARY_DOCS/TZ/DESKTOP_MOBILE_TZ_FULL.md`
- `SUMMARY_DOCS/TZ/MONOREPO_TZ_FULL.md` (этот файл)

---

**Дата создания:** 2026-06-23  
**Версия документа:** 1.0  
**Автор:** Balloo Development Team
