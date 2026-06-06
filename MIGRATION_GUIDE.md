# 🔄 PostgreSQL Migration Guide

**Миграция с SQLite → PostgreSQL**

---

## 🎯 Цель

Заменить `sql.js` (SQLite in-memory) на PostgreSQL 15+ для production-развёртывания.

**Проблема:** SQLite in-memory теряет все данные при перезапуске контейнера.  
**Решение:** PostgreSQL с persistence volume.

---

## 📋 Pre-requisites

- Docker 20.10+
- Node.js 18+
- 2GB RAM
- 10GB disk space

---

## 🚀 Quick Migration (5 minutes)

```bash
# 1. Запустить PostgreSQL
./api/scripts/setup-postgres.sh

# 2. Запустить миграцию
cd api && node scripts/migrate-to-pg.js

# 3. Проверить
docker-compose exec api node -e "const {db} = require('./src/config/database'); console.log('OK')"
```

---

## 📝 Step-by-Step

### Шаг 1: Установить PostgreSQL

**Вариант A: Docker (рекомендуется)**

```bash
./api/scripts/setup-postgres.sh
```

**Вариант B: Manual (production)**

```bash
# Ubuntu/Debian
sudo apt install postgresql-15

# CentOS/RHEL
sudo yum install postgresql15

# Создаём пользователя и БД
sudo -u postgres psql
CREATE USER balloo WITH PASSWORD 'YOUR_PASSWORD';
CREATE DATABASE balloo_production OWNER balloo;
\q
```

---

### Шаг 2: Настроить секреты

```bash
mkdir -p secrets

# Генерируем пароль (если нет)
if [ ! -f secrets/db_password.txt ]; then
    openssl rand -hex 32 > secrets/db_password.txt
fi

# Устанавливаем права
chmod 600 secrets/*
```

---

### Шаг 3: Запустить миграцию

```bash
cd api

# Запуск миграции
node scripts/migrate-to-pg.js
```

**Что делает скрипт:**

1. Подключается к PostgreSQL
2. Создаёт схему (25 таблиц)
3. Читает данные из SQLite
4. Переносит данные таблиц
5. Создаёт индексы
6. Заполняет `auth_methods`

**Лог вывода:**

```
🚀 Starting migration: SQLite → PostgreSQL

✅ Found SQLite file: /app/data/database.sqlite
✅ Connected to PostgreSQL
📝 Creating PostgreSQL schema...
✅ Schema created

📦 Migrating data...
🔄 Migrating users...
  📊 50 rows to migrate
  ✅ Migrated 50/50 rows
🔄 Migrating chats...
  📊 120 rows to migrate
  ✅ Migrated 120/120 rows
...

✅ Migration completed successfully!
```

---

### Шаг 4: Обновить .env

```bash
# api/.env

# OLD (SQLite)
DB_PATH=./data/database.sqlite

# NEW (PostgreSQL)
DATABASE_URL=postgresql://balloo:$(cat ../secrets/db_password.txt)@localhost:5432/balloo_production
```

**Для Docker:**

```yaml
# docker-compose.yml
environment:
  - DATABASE_URL=postgresql://balloo:${DB_PASSWORD}@postgres:5432/balloo_production
```

---

### Шаг 5: Перезапустить API

```bash
# Docker
docker-compose restart api

# Manual
pm2 restart api
# или
systemctl restart balloo-api
```

---

### Шаг 6: Проверить

```bash
# Health check
curl http://localhost:3001/health

# Detailed health
curl http://localhost:3001/health/detailed

# Проверка подключения
docker-compose exec api node -e "
const {db} = require('./src/config/database');
console.log('Connected:', !!db);
"
```

---

## 🔄 Rollback (если что-то пошло не так)

```bash
# 1. Остановить API
docker-compose stop api

# 2. Вернуть .env к SQLite
cp api/.env.backup api/.env

# 3. Перезапустить API
docker-compose start api

# 4. Проверить
curl http://localhost:3001/health
```

---

## 📊 Мигрируемые таблицы

| Таблица | Статус | Кол-во строк |
|---------|--------|--------------|
| users | ✅ | - |
| sessions | ✅ | - |
| auth_methods | ✅ | 3 |
| verification_codes | ✅ | - |
| chats | ✅ | - |
| chat_participants | ✅ | - |
| messages | ✅ | - |
| contacts | ✅ | - |
| groups | ✅ | - |
| invitations | ✅ | - |
| notifications | ✅ | - |
| bans | ✅ | - |
| reports | ✅ | - |
| files | ✅ | - |
| calls | ✅ | - |
| user_settings | ✅ | - |
| ... (всего 25 таблиц) | ✅ | - |

---

## ⚠️ Known Issues

### Проблема: Migration failed - table already exists

**Решение:**

```bash
# Удалить существующую БД и создать заново
docker-compose down -v postgres
./api/scripts/setup-postgres.sh
node scripts/migrate-to-pg.js
```

### Проблема: Connection refused

**Решение:**

```bash
# Проверить PostgreSQL
docker-compose ps postgres
docker-compose logs postgres

# Перезапустить
docker-compose restart postgres

# Подождать 5 секунд
sleep 5

# Повторить миграцию
node scripts/migrate-to-pg.js
```

### Проблема: Permission denied

**Решение:**

```bash
# Проверить права
chmod +x api/scripts/migrate-to-pg.js
chmod +x api/scripts/setup-postgres.sh

# Запускать с sudo (если нужно)
sudo node api/scripts/migrate-to-pg.js
```

---

## 💾 Backup before Migration

```bash
# Бэкап SQLite
cp data/database.sqlite data/database.sqlite.backup

# Бэкап PostgreSQL (после миграции)
./api/scripts/backup-postgres.sh
```

---

## 📈 Post-Migration Checklist

- [ ] Health check проходит
- [ ] Данные перенесены (проверить в pgAdmin)
- [ ] API работает корректно
- [ ] WebSocket подключается
- [ ] Redis подключается
- [ ] Бэкап создан
- [ ] Мониторинг настроен

---

## 🔧 Advanced: Custom Migration

```javascript
// api/scripts/custom-migrate.js

const { runMigration, CONFIG } = require('./migrate-to-pg');

// Добавить custom логику
async function customMigration() {
  await runMigration();
  
  // Дополнительные преобразования
  const client = new Client({ connectionString: CONFIG.postgresUrl });
  await client.connect();
  
  // Пример: обновление старых данных
  await client.query(`
    UPDATE users SET status = 'online' 
    WHERE lastSeen > (EXTRACT(EPOCH FROM NOW()) - 300) * 1000
  `);
  
  await client.end();
}

customMigration().catch(console.error);
```

---

**NLP-Core-Team**  
**App Balloo Migration Guide**
