# Миграция с Prisma на Better-SQLite3

## Изменения

- ✅ **Удалена зависимость от Prisma** - больше нет проблем с путями к базе данных
- ✅ **Установлен better-sqlite3** - быстрая и надёжная SQLite библиотека
- ✅ **Все API route файлы переписаны** - замена Prisma Client на прямой SQL
- ✅ **Единый файл БД** - `data/app.db` в корне проекта

## Установка

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Удалить Prisma
npm uninstall @prisma client prisma

# Установить better-sqlite3
npm install better-sqlite3 @types/better-sqlite3

# Удалить старую БД (если есть)
rm -rf prisma/prisma 2>/dev/null
rm -rf data 2>/dev/null

# Создать папку для данных
mkdir -p data

# Инициализировать БД
node scripts/init-db.js

# Пересобрать приложение
NODE_ENV=production npx next build

# Запустить
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha"
pm2 save
```

## Проверка

```bash
# Проверить что PM2 запущен
pm2 status

# Проверить логи
pm2 logs messenger-alpha --lines 20

# Проверить БД
sqlite3 data/app.db "SELECT id, email, displayName FROM User;"

# Проверить API
curl -I http://localhost:3000
```

## Вход в систему

- Email: `admin@test.com`
- Пароль: (требует регистрации через API)

Для создания пользователя:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","displayName":"Test User"}'
```

## Структура БД

- `data/app.db` - основная база данных SQLite
- `data/app.db-wal` - WAL файл (journal mode)
- `data/app.db-shm` - Shared memory файл

## Важные изменения

1. **Удалены Prisma migrations** - теперь все таблицы создаются при первом запуске
2. **Изменён путь к БД** - `data/app.db` вместо `prisma/dev.db`
3. **Убраны асинхронные запросы** - Better-SQLite3 использует синхронный API
4. **adminRoles теперь JSON** - хранится как строка JSON вместо массива

## Откат на Prisma

Если нужно вернуть Prisma:

```bash
npm uninstall better-sqlite3
npm install @prisma/client prisma
# Восстановить файлы из git
git checkout messenger/src/lib/prisma.ts
git checkout messenger/src/app/api/**/route.ts
```
