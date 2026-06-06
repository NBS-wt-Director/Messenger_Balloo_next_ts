# Migration Guide: SQLite → PostgreSQL

## Предварительные требования

- Docker и Docker Compose
- Node.js 18+
- 30 минут времени
- Бэкап текущей базы данных

---

## Шаг 1: Подготовка

### 1.1 Сделать бэкап SQLite

```bash
# Копия текущей базы
cp api/data/database.sqlite api/backups/database.sqlite.pre_migration_$(date +%Y%m%d)

# Проверить размер
ls -lh api/backups/database.sqlite.pre_migration_*
```

### 1.2 Установить PostgreSQL зависимости

```bash
cd api
npm install pg
```

### 1.3 Настроить DATABASE_URL

```bash
# api/.env.production
DATABASE_URL=postgresql://balloo:YOUR_SECURE_PASSWORD@localhost:5432/balloo_production
```

---

## Шаг 2: Запуск PostgreSQL

### 2.1 Docker Compose

```bash
# Запустить только PostgreSQL
docker-compose up -d postgres

# Проверить статус
docker-compose ps postgres

# Проверить логи
docker-compose logs postgres
```

### 2.2 Подключение к PostgreSQL

```bash
# Войти в контейнер
docker exec -it postgres psql -U balloo -d balloo_production

# Показать таблицы
\dt

# Выйти
\q
```

---

## Шаг 3: Запуск миграции

### 3.1 Запустить скрипт миграции

```bash
cd api
node scripts/migrate-to-pg.js
```

**Ожидаемый вывод:**
```
🚀 Starting migration: SQLite → PostgreSQL
✅ Connected to PostgreSQL
✅ Found SQLite file: /app/data/database.sqlite
📝 Creating PostgreSQL schema...
✅ Schema created
📦 Migrating data...
🔄 Migrating users...
  📊 5 rows to migrate
  ✅ Migrated 5/5 rows
...
✅ Migration completed successfully!
```

### 3.2 Проверить результат

```bash
# Подключиться к PostgreSQL
docker exec -it postgres psql -U balloo -d balloo_production

# Показать таблицы
\dt

# Проверить пользователей
SELECT COUNT(*) FROM users;

# Проверить чаты
SELECT COUNT(*) FROM chats;

# Проверить сообщения
SELECT COUNT(*) FROM messages;

# Выйти
\q
```

---

## Шаг 4: Настройка API

### 4.1 Обновить .env

```bash
# Для Docker Compose
DATABASE_URL=postgresql://balloo:${DB_PASSWORD}@pgbouncer:6432/balloo_production

# Для локальной разработки
DATABASE_URL=postgresql://balloo:YOUR_PASSWORD@localhost:5432/balloo_production
```

### 4.2 Перезапустить API

```bash
# Через Docker Compose
docker-compose restart api

# Или локально
cd api
npm start
```

### 4.3 Проверить health

```bash
curl http://localhost:3001/health
curl http://localhost:3001/health/detailed
```

---

## Шаг 5: Тестирование

### 5.1 Тестовый вход

```bash
# Зарегистрировать тестового пользователя
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@balloo.ru",
    "password": "TestPassword123",
    "displayName": "Test User"
  }'

# Войти
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@balloo.ru",
    "password": "TestPassword123"
  }'
```

### 5.2 Проверить чаты

```bash
# Получить чаты (нужен токен)
curl -X GET http://localhost:3001/api/v1/chats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5.3 Проверить WebSocket

```javascript
// ws-test.js
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001/ws?token=YOUR_TOKEN');

ws.on('open', () => {
  console.log('✅ Connected to WebSocket');
});

ws.on('message', (data) => {
  console.log('Received:', data.toString());
});

ws.on('error', (error) => {
  console.error('❌ Error:', error);
});
```

---

## Шаг 6: Настройка PgBouncer (опционально)

### 6.1 Запустить PgBouncer

```bash
docker-compose up -d pgbouncer
```

### 6.2 Проверить подключение

```bash
# Порт 6432 (PgBouncer) вместо 5432 (PostgreSQL)
DATABASE_URL=postgresql://balloo:PASSWORD@localhost:6432/balloo_production
```

### 6.3 Проверить пул

```bash
docker exec -it pgbouncer pgbouncer -h localhost -p 6432 -U pgbouncer \
  -c "SHOW POOLS;"
```

---

## Откат (если что-то пошло не так)

### Откат на SQLite

```bash
# 1. Остановить API
docker-compose stop api

# 2. Восстановить SQLite
cp api/backups/database.sqlite.pre_migration_* api/data/database.sqlite

# 3. Обновить .env
DATABASE_URL=sqlite://./data/database.sqlite

# 4. Запустить API
docker-compose start api
```

### Очистить PostgreSQL

```bash
docker-compose down -v postgres
```

---

## Troubleshooting

### Ошибка: "password authentication failed"

**Решение:**
```bash
# Проверить пароль в .env
echo $DB_PASSWORD

# Пересоздать контейнер с правильным паролем
docker-compose up -d --force-recreate postgres
```

### Ошибка: "database does not exist"

**Решение:**
```bash
# Создать базу данных
docker exec -it postgres psql -U postgres -c "CREATE DATABASE balloo_production;"
docker exec -it postgres psql -U postgres -c "CREATE USER balloo WITH PASSWORD 'YOUR_PASSWORD';"
docker exec -it postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE balloo_production TO balloo;"
```

### Ошибка: "relation does not exist"

**Решение:**
```bash
# Запустить миграцию заново
node api/scripts/migrate-to-pg.js
```

### Ошибка: "too many connections"

**Решение:**
```bash
# Увеличить max_connections в PostgreSQL
docker exec -it postgres psql -U postgres -c "ALTER SYSTEM SET max_connections = 200;"
docker-compose restart postgres

# Или использовать PgBouncer
docker-compose up -d pgbouncer
```

---

## Производительность после миграции

### Проверить pool stats

```bash
# В приложении
curl http://localhost:3001/health/detailed

# В PostgreSQL
docker exec -it postgres psql -U balloo -d balloo_production -c \
  "SELECT sum(numbackends) as active_connections FROM pg_stat_database;"
```

### Настроить авто-бэкапы

```bash
# Добавить в crontab
crontab -e

# Бэкап каждый день в 3:00
0 3 * * * /path/to/api/scripts/backup-pg.sh >> /var/log/pg_backup.log 2>&1
```

---

## Чек-лист после миграции

- [ ] PostgreSQL работает
- [ ] Все таблицы созданы
- [ ] Данные перенесены
- [ ] API подключается к БД
- [ ] Health check проходит
- [ ] Регистрация работает
- [ ] Login работает
- [ ] WebSocket работает
- [ ] Чаты отображаются
- [ ] Сообщения отправляются
- [ ] Бэкапы настроены

---

**Миграция завершена!** 🎉

**NLP-Core-Team** - App Balloo Migration Guide
