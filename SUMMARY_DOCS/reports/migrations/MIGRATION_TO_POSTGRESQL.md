---
title: MIGRATION TO POSTGRESQL
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: urgent
priority: critical
---

# 🔄 МИГРАЦИЯ С SQLITE НА POSTGRESQL

**Дата:** 2026-06-13  
**Статус:** 🔴 КРИТИЧНО - НЕМЕДЛЕННАЯ МИГРАЦИЯ  
**Приоритет:** CRITICAL  
**Оценка:** 4 часа

---

## 🎯 ЦЕЛЬ

Полная миграция всей платформы Balloo с SQLite на PostgreSQL 15+ для production-ready развёртывания.

**Причина:** Мы договорились использовать настоящую production базу данных - PostgreSQL, а не SQLite.

---

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ

### Где используется SQLite:

1. **api/** - API Server
   - Файл: `api/src/config/database.js`
   - Библиотека: `sql.js`
   - Путь: `./data/database.sqlite`

2. **messenger/** - Messenger (Next.js)
   - Файл: `messenger/src/lib/database.js`
   - Библиотека: `better-sqlite3`
   - Путь: `./data/app.db`

3. **admin-portal/** - Admin Portal
   - Использует API Server БД

4. **Документация**
   - Все документы в SUMMARY_DOCS/
   - Все документы в docs/
   - Все README файлы

---

## ✅ ЦЕЛЕВОЕ СОСТОЯНИЕ

### PostgreSQL для всех модулей:

1. **Единая база данных PostgreSQL** для API, Messenger, Admin Portal
2. **Connection pooling** через PgBouncer
3. **Миграции** через SQL scripts
4. **WAL режим** для производительности
5. **Репликация** (опционально для scaling)

---

## 📋 ПЛАН МИГРАЦИИ

### Фаза 1: Подготовка (30 минут)

#### 1.1 Создать PostgreSQL миграции

```sql
-- migrations/001_create_postgresql_schema.sql
-- PostgreSQL схема для Balloo

-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    display_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar TEXT,
    public_key TEXT,
    provider VARCHAR(50) DEFAULT 'email',
    yandex_id VARCHAR(100),
    yandex_token TEXT,
    yandex_refresh_token TEXT,
    settings JSONB DEFAULT '{}',
    family_relations JSONB DEFAULT '[]',
    push_tokens JSONB DEFAULT '[]',
    is_admin BOOLEAN DEFAULT FALSE,
    is_super_admin BOOLEAN DEFAULT FALSE,
    admin_roles JSONB DEFAULT '[]',
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    two_fa_secret TEXT,
    temp_2fa_secret TEXT,
    sms_2fa_enabled BOOLEAN DEFAULT FALSE,
    sms_2fa_enabled_at TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE
);

-- Таблица чатов
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('private', 'group', 'channel')),
    name VARCHAR(255),
    avatar TEXT,
    participants JSONB NOT NULL,
    members JSONB DEFAULT '{}',
    admin_ids JSONB DEFAULT '[]',
    created_by UUID NOT NULL REFERENCES users(id),
    description TEXT,
    is_favorite JSONB DEFAULT '{}',
    pinned JSONB DEFAULT '{}',
    muted JSONB DEFAULT '{}',
    unread_count JSONB DEFAULT '{}',
    last_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'image', 'video', 'file', 'audio', 'system')),
    content TEXT NOT NULL,
    encrypted_info TEXT,
    attachment_id UUID,
    reply_to_id UUID REFERENCES messages(id),
    forward_from_id UUID REFERENCES messages(id),
    reactions JSONB DEFAULT '{}',
    read_by JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'sent',
    edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица вложений
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    yandex_disk_path TEXT,
    yandex_disk_id VARCHAR(255),
    public_url TEXT,
    thumbnail_url TEXT,
    width INTEGER,
    height INTEGER,
    duration INTEGER,
    status VARCHAR(50) DEFAULT 'uploading',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица приглашений
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES users(id),
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_permanent BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица контактов
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    is_favorite BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, contact_user_id)
);

-- Таблица уведомлений
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Таблица сессий
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    platform VARCHAR(50),
    device_id VARCHAR(255),
    last_active TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Таблица устройств
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50),
    device_id VARCHAR(255),
    push_token TEXT,
    device_name VARCHAR(255),
    last_active TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отчётов
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    reported_by UUID NOT NULL REFERENCES users(id),
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица версий
CREATE TABLE IF NOT EXISTS versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL,
    version VARCHAR(50) NOT NULL,
    min_version VARCHAR(50),
    update_url TEXT,
    release_notes TEXT,
    is_force_update BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform, version)
);

-- Таблица кодов подтверждения
CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'password_reset',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE
);

-- Таблица звонков
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID NOT NULL REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    chat_id UUID REFERENCES chats(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('audio', 'video', 'group')),
    offer TEXT,
    answer TEXT,
    status VARCHAR(50) DEFAULT 'offered',
    recording BOOLEAN DEFAULT FALSE,
    recording_id VARCHAR(255),
    recording_path TEXT,
    recording_url TEXT,
    duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица статусов (сторис)
CREATE TABLE IF NOT EXISTS statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    attachment_id UUID NOT NULL REFERENCES attachments(id) ON DELETE CASCADE,
    views JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Таблица голосовых сообщений
CREATE TABLE IF NOT EXISTS audio_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    duration INTEGER DEFAULT 0,
    yandex_disk_id VARCHAR(255),
    public_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица запросов в друзья
CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(from_user_id, to_user_id)
);

-- Таблица E2E ключей
CREATE TABLE IF NOT EXISTS e2e_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id VARCHAR(255) NOT NULL,
    public_key TEXT NOT NULL,
    encrypted_private_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, device_id)
);

-- Таблица тикетов поддержки
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(50) DEFAULT 'medium',
    user_id UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сообщений тикетов
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица страниц
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sections JSONB,
    metadata JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица голосований за фичи
CREATE TABLE IF NOT EXISTS features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    votes INTEGER DEFAULT 0,
    voted_by JSONB DEFAULT '[]',
    created_by UUID REFERENCES users(id),
    created_by_name VARCHAR(255),
    admin_note TEXT,
    planned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица банов
CREATE TABLE IF NOT EXISTS bans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    banned_by UUID REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица токенов Yandex Disk
CREATE TABLE IF NOT EXISTS yandex_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Таблица push-подписок
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Таблица методов аутентификации
CREATE TABLE IF NOT EXISTS auth_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    failures INTEGER DEFAULT 0,
    last_failure TIMESTAMP WITH TIME ZONE,
    disabled_at TIMESTAMP WITH TIME ZONE,
    disable_reason TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица функций проекта (из SUMMARY_DOCS)
CREATE TABLE IF NOT EXISTS project_functions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    function_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    short_description TEXT,
    long_description TEXT,
    technical_description TEXT,
    module VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    function_type VARCHAR(50) DEFAULT 'feature',
    status VARCHAR(50) DEFAULT 'planned',
    priority VARCHAR(50) DEFAULT 'medium',
    completion_percentage INTEGER DEFAULT 0,
    implemented_date TIMESTAMP WITH TIME ZONE,
    implemented_by VARCHAR(255),
    github_commit VARCHAR(500),
    github_pr VARCHAR(500),
    components JSONB,
    hooks JSONB,
    api_endpoints JSONB,
    database_tables JSONB,
    ui_tabs JSONB,
    ui_pages JSONB,
    ui_buttons JSONB,
    ui_forms JSONB,
    attachment_types JSONB,
    supported_formats JSONB,
    max_file_size INTEGER,
    auth_methods JSONB,
    permissions JSONB,
    roles JSONB,
    icon_url TEXT,
    screenshot_url TEXT,
    demo_url TEXT,
    docs_url TEXT,
    changelog JSONB,
    planned_quarter VARCHAR(50),
    estimated_hours INTEGER,
    actual_hours INTEGER,
    tags JSONB,
    related_functions JSONB,
    parent_function_id VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_visible_to_users BOOLEAN DEFAULT TRUE,
    is_visible_to_staff BOOLEAN DEFAULT TRUE,
    is_api_exposed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Таблица истории функций
CREATE TABLE IF NOT EXISTS project_functions_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    function_id VARCHAR(100) NOT NULL REFERENCES project_functions(function_id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    changed_by VARCHAR(255),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица настроек системы
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    is_encrypted BOOLEAN DEFAULT FALSE,
    requires_restart BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Таблица версий документации
CREATE TABLE IF NOT EXISTS documentation_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doc_path VARCHAR(500) NOT NULL,
    version VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    changelog TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    UNIQUE(doc_path, version)
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_calls_from_user ON calls(from_user_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_statuses_user_id ON statuses(user_id);
CREATE INDEX IF NOT EXISTS idx_statuses_expires ON statuses(expires_at);
CREATE INDEX IF NOT EXISTS idx_contact_requests_to_user ON contact_requests(to_user_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_e2e_keys_user ON e2e_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(is_active);
CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
CREATE INDEX IF NOT EXISTS idx_features_votes ON features(votes DESC);
CREATE INDEX IF NOT EXISTS idx_bans_user ON bans(user_id);
CREATE INDEX IF NOT EXISTS idx_bans_expires ON bans(expires_at);
CREATE INDEX IF NOT EXISTS idx_yandex_tokens_user ON yandex_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_messages_chat ON audio_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_audio_messages_message ON audio_messages(message_id);
CREATE INDEX IF NOT EXISTS idx_functions_module ON project_functions(module);
CREATE INDEX IF NOT EXISTS idx_functions_category ON project_functions(category);
CREATE INDEX IF NOT EXISTS idx_functions_status ON project_functions(status);
CREATE INDEX IF NOT EXISTS idx_functions_visible ON project_functions(is_visible_to_users);
CREATE INDEX IF NOT EXISTS idx_settings_key ON system_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON system_settings(category);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed данные
INSERT INTO auth_methods (id, name, enabled, failures, last_failure, disabled_at, disable_reason, updated_at) VALUES
(uuid_generate_v4(), 'sms', TRUE, 0, NULL, NULL, NULL, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'bot', TRUE, 0, NULL, NULL, NULL, CURRENT_TIMESTAMP),
(uuid_generate_v4(), 'totp', TRUE, 0, NULL, NULL, NULL, CURRENT_TIMESTAMP);
```

#### 1.2 Создать Docker Compose с PostgreSQL

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: balloo-postgres
    environment:
      POSTGRES_USER: balloo
      POSTGRES_PASSWORD: ${DB_PASSWORD:-BallooSecurePassword2026}
      POSTGRES_DB: balloo
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./api/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U balloo -d balloo"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: balloo-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@balloo.local}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-Admin123!}
    ports:
      - "5050:80"
    depends_on:
      - postgres
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: balloo-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

### Фаза 2: Обновление API Server (1 час)

#### 2.1 Установить PostgreSQL драйвер

```bash
cd api
npm uninstall sql.js
npm install pg @types/pg
```

#### 2.2 Обновить database.js

```javascript
// api/src/config/database.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Получаем настройки из .env
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_NAME = process.env.DB_NAME || 'balloo';
const DB_USER = process.env.DB_USER || 'balloo';
const DB_PASSWORD = process.env.DB_PASSWORD || 'BallooSecurePassword2026';

// Создаём connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  max: 20, // Максимум соединений в пуле
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Обработчики событий
pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

/**
 * Выполнение запроса
 */
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
  return res;
}

/**
 * Получить клиент из пула
 */
async function getClient() {
  const client = await pool.connect();
  return {
    query: (text, params) => client.query(text, params),
    release: () => client.release(),
  };
}

/**
 * Проверка подключения
 */
async function checkConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection healthy');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * Закрыть пул соединений
 */
async function closeDatabase() {
  await pool.end();
  console.log('Database pool closed');
}

module.exports = {
  query,
  getClient,
  checkConnection,
  closeDatabase,
  pool, // Экспортируем pool для прямого доступа если нужно
};
```

#### 2.3 Обновить .env

```bash
# api/.env

# База данных PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=balloo
DB_USER=balloo
DB_PASSWORD=BallooSecurePassword2026
DATABASE_URL=postgresql://balloo:BallooSecurePassword2026@localhost:5432/balloo?sslmode=disable

# Удалить старые настройки SQLite
# DB_PATH=./data/database.sqlite
```

#### 2.4 Обновить все API routes

Заменить все вызовы `db.prepare()` на `query()` с асинхронностью.

---

### Фаза 3: Обновление Messenger (1 час)

Аналогично обновить messenger/src/lib/database.js для использования PostgreSQL.

---

### Фаза 4: Обновление документации (30 минут)

Заменить все упоминания SQLite на PostgreSQL во всех документах.

---

## ✅ CHECKLIST

### Подготовка
- [ ] Создать SQL миграции для PostgreSQL
- [ ] Настроить docker-compose с PostgreSQL
- [ ] Сделать бэкап текущих SQLite баз

### API Server
- [ ] Установить pg драйвер
- [ ] Обновить database.js
- [ ] Обновить .env
- [ ] Обновить все API routes на async/await
- [ ] Протестировать подключение к БД

### Messenger
- [ ] Обновить database.js
- [ ] Обновить API routes
- [ ] Протестировать

### Документация
- [ ] Обновить SUMMARY_DOCS/REPO_CHECK_REPORT_2026-06-13.md
- [ ] Обновить все README файлы
- [ ] Обновить FULL_AUDIT_2026-06-13.md
- [ ] Обновить TZ.md

### Тестирование
- [ ] Запустить PostgreSQL в Docker
- [ ] Запустить миграции
- [ ] Запустить API Server
- [ ] Запустить Messenger
- [ ] Проверить все endpoints
- [ ] Проверить WebSocket

---

## 🚨 ВАЖНЫЕ ПРИМЕЧАНИЯ

1. **UUID вместо INTEGER** - PostgreSQL использует UUID для Primary Keys
2. **TIMESTAMP вместо INTEGER** - Даты хранятся как TIMESTAMP
3. **JSONB вместо TEXT** - JSON данные в формате JSONB
4. **Асинхронность** - Все запросы async/await
5. **Connection Pool** - Использование пула соединений

---

**Дата создания:** 2026-06-13  
**Статус:** 🔴 КРИТИЧНО  
**Срок выполнения:** Немедленно

---

**🎈 Balloo - Share your moments safely!**
