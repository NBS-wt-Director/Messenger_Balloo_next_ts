# Rollback Plan - PostgreSQL Migration

## Сценарии отката

### Сценарий 1: Миграция не удалась

**Признаки:**
- Ошибка при запуске `node scripts/migrate-to-pg.js`
- Данные не перенеслись
- Приложение не работает с PostgreSQL

**Действия:**

```bash
# 1. Откатить DATABASE_URL в .env
DATABASE_URL=postgresql://balloo:old_password@localhost:5432/balloo_old

# 2. Если была SQLite in-memory - данные потеряны
#    Восстановить из бэкапа если есть
cp backups/database.sqlite.bak data/database.sqlite

# 3. Перезапустить API
docker-compose restart api
```

---

### Сценарий 2: PostgreSQL упал после миграции

**Признаки:**
- Приложение не подключается к БД
- Ошибки в логах: `ECONNREFUSED`, `ENOTFOUND`

**Действия:**

```bash
# 1. Проверить статус PostgreSQL
docker-compose ps postgres

# 2. Перезапустить PostgreSQL
docker-compose restart postgres

# 3. Проверить логи
docker-compose logs postgres

# 4. Если не помогает - откатить на SQLite (временное решение)
#    Обновить config/database.js для использования sql.js
#    Перезапустить API
```

---

### Сценарий 3: Потеря данных после миграции

**Признаки:**
- Пользователи не могут войти
- Чаты пусты
- Сообщения не отображаются

**Действия:**

```bash
# 1. Проверить таблицы в PostgreSQL
docker exec -it postgres psql -U balloo -d balloo_production -c "\dt"

# 2. Проверить количество записей
docker exec -it postgres psql -U balloo -d balloo_production -c "SELECT COUNT(*) FROM users;"

# 3. Если данных нет - восстановить из бэкапа
docker exec -i postgres psql -U balloo -d balloo_production < backups/backup_YYYYMMDD.sql

# 4. Если бэкапа нет - запустить миграцию заново
node api/scripts/migrate-to-pg.js
```

---

### Сценарий 4: PgBouncer не работает

**Признаки:**
- Ошибки подключения к БД
- `too many connections`

**Действия:**

```bash
# 1. Перезапустить PgBouncer
docker-compose restart pgbouncer

# 2. Проверить логи
docker-compose logs pgbouncer

# 3. Временно отключить PgBouncer
#    Обновить DATABASE_URL для прямого подключения к PostgreSQL:
DATABASE_URL=postgresql://balloo:password@postgres:5432/balloo_production

# 4. Перезапустить API
docker-compose restart api
```

---

## Полная процедура отката

```bash
#!/bin/bash
# rollback.sh - Полная процедура отката

set -e

echo "⚠️  Starting rollback procedure..."

# 1. Остановить все сервисы
echo "1/6 Stopping all services..."
docker-compose stop

# 2. Сохранить текущее состояние PostgreSQL
echo "2/6 Saving PostgreSQL state..."
docker exec postgres pg_dump -U balloo balloo_production > rollback_backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Удалить PostgreSQL контейнер
echo "3/6 Removing PostgreSQL container..."
docker-compose rm -f postgres

# 4. Восстановить SQLite (если есть бэкап)
if [ -f "backups/database.sqlite.bak" ]; then
    echo "4/6 Restoring SQLite from backup..."
    cp backups/database.sqlite.bak api/data/database.sqlite
else
    echo "4/6 No SQLite backup found. Using empty database."
fi

# 5. Обновить .env
echo "5/6 Updating .env..."
sed -i 's|DATABASE_URL=.*|DATABASE_URL=sqlite://./data/database.sqlite|g' api/.env

# 6. Запустить сервисы
echo "6/6 Starting services..."
docker-compose up -d

echo "✅ Rollback completed!"
echo "⚠️  Check logs: docker-compose logs -f"
```

---

## Профилактика

### Перед миграцией

1. **Сделать полный бэкап:**
   ```bash
   docker exec postgres pg_dump -U balloo balloo_production > pre_migration_backup.sql
   ```

2. **Протестировать на staging:**
   ```bash
   # Запустить миграцию на тестовом сервере
   DATABASE_URL=postgresql://... node scripts/migrate-to-pg.js
   ```

3. **Подготовить откат:**
   ```bash
   # Сохранить текущее состояние SQLite
   cp data/database.sqlite backups/database.sqlite.pre_migration
   ```

### Во время миграции

1. **Мониторить логи:**
   ```bash
   docker-compose logs -f postgres api
   ```

2. **Проверить health:**
   ```bash
   curl http://localhost:3001/health/detailed
   ```

3. **Тестовые запросы:**
   ```bash
   curl -H "Authorization: Bearer TEST_TOKEN" \
        http://localhost:3001/api/v1/auth/me
   ```

### После миграции

1. **Проверить все таблицы:**
   ```bash
   docker exec postgres psql -U balloo -d balloo_production -c "\dt"
   ```

2. **Проверить количество записей:**
   ```bash
   docker exec postgres psql -U balloo -d balloo_production \
     -c "SELECT 'users' as table, COUNT(*) FROM users
         UNION ALL
         SELECT 'chats', COUNT(*) FROM chats
         UNION ALL
         SELECT 'messages', COUNT(*) FROM messages;"
   ```

3. **Тестовый вход:**
   ```bash
   # Попробовать войти в приложение
   # Проверить чаты, сообщения, 2FA
   ```

---

## Контакты экстренной помощи

| Роль | Кто | Контакты |
|------|-----|----------|
| Lead Dev | 1 человек | - |
| AI Agent | NLP-Core-Team | - |

---

**Последнее обновление:** 03.06.2026  
**Версия:** 1.0
