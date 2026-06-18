# Миграция с Prisma на Better-SQLite3 - ПОЛНАЯ ДОКУМЕНТАЦИЯ

## ✅ Что изменено

### 1. Удалена зависимость от Prisma
- ❌ `@prisma/client` - УДАЛЁН
- ❌ `prisma` - УДАЛЁН
- ❌ `prisma/schema.prisma` - УДАЛЁН
- ❌ `prisma/migrations/` - УДАЛЁН
- ❌ `prisma/dev.db` - УДАЛЁН (старая БД)

### 2. Установлен Better-SQLite3
- ✅ `better-sqlite3` - УСТАНОВЛЕН
- ✅ `@types/better-sqlite3` - УСТАНОВЛЕН

### 3. Созданы новые файлы
- ✅ `src/lib/database.js` - Драйвер БД с таблицами
- ✅ `src/lib/prisma.ts` - Обёртка с функциями (переименован из Prisma Client)
- ✅ `scripts/init-db.js` - Скрипт инициализации
- ✅ `scripts/createSystemChats.ts` - Обновлён для Better-SQLite3

### 4. Переписаны API Route Files
Все route файлы изменены с `await prisma.XXX()` на синхронные вызовы `db.prepare().run()`

## 📍 Расположение базы данных

### Новый путь
```
~/Messenger_Balloo_next_ts/messenger/data/app.db
```

### Файлы БД
```
data/
├── app.db        # Основной файл БД
├── app.db-wal    # WAL journal (автоматически создаётся)
└── app.db-shm    # Shared memory (автоматически создаётся)
```

## 🔄 Поведение при запуске

### Первый запуск
1. Создаётся папка `data/` если не существует
2. Создаётся файл `data/app.db`
3. Создаются все таблицы (`CREATE TABLE IF NOT EXISTS`)
4. Добавляется тестовый пользователь `admin@test.com`

### Повторный запуск
1. Загружается существующий файл `data/app.db`
2. Таблицы не создаются заново (проверка `IF NOT EXISTS`)
3. **ВСЕ ДАННЫЕ СОХРАНЯЮТСЯ**

### После перезагрузки сервера
- **ВСЕ ДАННЫЕ СОХРАНЯЮТСЯ**
- SQLite - это файл-база, данные не теряются

## ⚠️ БЕЗОПАСНОСТЬ ДАННЫХ

### ✅ Данные НЕ удаляются когда:
- Перезапускается PM2 процесс
- Перезагружается сервер
- Обновляется код приложения
- Пересобирается Next.js (`next build`)
- Изменяются файлы route.ts
- Запускается `node scripts/init-db.js`

### ❌ Данные УДАЛЯЮТСЯ только когда:
- Вручную удалён файл: `rm data/app.db`
- Вручную удалена папка: `rm -rf data/`
- Явно выполнен `DROP TABLE` или `DELETE FROM`

## 🚀 Команды для запуска

### Полный запуск с нуля
```bash
cd ~/Messenger_Balloo_next_ts/messenger

# 1. Установить зависимости
npm install

# 2. Установить better-sqlite3 (если не в package.json)
npm install better-sqlite3 @types/better-sqlite3

# 3. Удалить Prisma (опционально, но рекомендуется)
npm uninstall @prisma/client prisma

# 4. Создать папку для данных
mkdir -p data

# 5. Инициализировать БД (создаст таблицы + тестового пользователя)
node scripts/init-db.js

# 6. Собрать приложение
NODE_ENV=production npx next build

# 7. Запустить через PM2
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha"

# 8. Сохранить конфигурацию PM2
pm2 save

# 9. Проверить
pm2 logs messenger-alpha --lines 20
sqlite3 data/app.db "SELECT * FROM User;"
curl -I http://localhost:3000
```

### Запуск после первого запуска (обычный)
```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Просто запустить PM2
pm2 start messenger-alpha

# Или перезапустить
pm2 restart messenger-alpha --update-env
```

## 📊 Проверка работы

### Проверка БД
```bash
# Путь к БД
ls -lh ~/Messenger_Balloo_next_ts/messenger/data/app.db

# Количество пользователей
sqlite3 data/app.db "SELECT COUNT(*) FROM User;"

# Количество чатов
sqlite3 data/app.db "SELECT COUNT(*) FROM Chat;"

# Список таблиц
sqlite3 data/app.db ".tables"

# Проверка целостности
sqlite3 data/app.db "PRAGMA integrity_check;"
```

### Проверка API
```bash
# Регистрация пользователя
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Admin123!","displayName":"Test User"}'

# Получение чатов
curl "http://localhost:3000/api/chats?userId=user-1"

# Поиск
curl "http://localhost:3000/api/global-search?q=test"
```

## 🛡️ Резервное копирование

### Создавать бэкап
```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Остановить PM2 (рекомендуется для консистентности)
pm2 stop messenger-alpha

# Создать бэкап
cp data/app.db data/app.db.backup.$(date +%Y%m%d_%H%M%S)

# Запустить обратно
pm2 start messenger-alpha

# Или бэкап без остановки (работает с WAL)
tar czf backup-$(date +%Y%m%d).tar.gz data/
```

### Восстанавливать из бэкапа
```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Остановить PM2
pm2 stop messenger-alpha

# Восстановить
cp data/app.db.backup.20240101 data/app.db

# Запустить
pm2 start messenger-alpha
```

## 🔧 Диагностика

### БД не создаётся
```bash
# Проверить права
ls -la ~/Messenger_Balloo_next_ts/messenger/data/

# Исправить права
chmod 755 ~/Messenger_Balloo_next_ts/messenger/data
chmod 644 ~/Messenger_Balloo_next_ts/messenger/data/app.db
```

### Ошибка "Unable to open database file"
```bash
# Проверить что папка существует
ls -la ~/Messenger_Balloo_next_ts/messenger/data/

# Пересоздать папку
mkdir -p ~/Messenger_Balloo_next_ts/messenger/data

# Пересоздать БД
node scripts/init-db.js
```

### PM2 процесс падает сразу
```bash
# Проверить логи
pm2 logs messenger-alpha --lines 50

# Проверить что БД существует
ls -lh data/app.db

# Проверить таблицы
sqlite3 data/app.db ".tables"

# Пересобрать
NODE_ENV=production npx next build
```

## 📝 Структура таблиц

### User
```sql
id TEXT PRIMARY KEY
email TEXT UNIQUE NOT NULL
displayName TEXT NOT NULL
passwordHash TEXT
adminRoles TEXT DEFAULT '[]'  -- JSON строка
status TEXT DEFAULT 'offline'
settings TEXT DEFAULT '{}'     -- JSON строка
createdAt TEXT
updatedAt TEXT
```

### Chat
```sql
id TEXT PRIMARY KEY
type TEXT DEFAULT 'private'
name TEXT
description TEXT
isSystemChat INTEGER DEFAULT 0
createdAt TEXT
updatedAt TEXT
```

### ChatMember
```sql
chatId TEXT NOT NULL
userId TEXT NOT NULL
role TEXT DEFAULT 'member'
PRIMARY KEY (chatId, userId)
```

### Message
```sql
id TEXT PRIMARY KEY
chatId TEXT NOT NULL
userId TEXT NOT NULL
text TEXT
createdAt TEXT
```

## ⚡ Преимущества Better-SQLite3 перед Prisma

| Feature | Prisma | Better-SQLite3 |
|---------|--------|----------------|
| **Путь к БД** | ❌ Проблемы с относительными путями | ✅ Абсолютный путь `data/app.db` |
| **Производительность** | ⚠️ Оверхед ORM | ✅ Прямые SQL запросы |
| **Сложность** | ❌ Нужно `prisma generate`, `migrate` | ✅ Один файл `database.js` |
| **Размер** | ❌ ~50MB node_modules | ✅ ~5MB |
| **Надёжность** | ⚠️ Сбои при обновлении schema | ✅ Стабильная SQLite |
| **Синхронность** | ❌ async/await везде | ✅ Синхронный API |

## 🔄 Откат на Prisma (если нужно)

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Удалить Better-SQLite3
npm uninstall better-sqlite3 @types/better-sqlite3

# Установить Prisma
npm install @prisma/client prisma --save-dev

# Восстановить файлы из git
git checkout src/lib/prisma.ts
git checkout src/app/api/**/route.ts

# Создать schema.prisma
# (восстановить из git или создать заново)

# Генерировать Prisma Client
npx prisma generate

# Пересобрать
npx next build
```

## 📞 Контакты и поддержка

При проблемах проверьте:
1. ✅ Файл `data/app.db` существует
2. ✅ Папка `data/` имеет права 755
3. ✅ PM2 процесс запущен: `pm2 status`
4. ✅ Нет ошибок в логах: `pm2 logs messenger-alpha`

---

**Дата миграции:** 2024
**Версия БД:** Better-SQLite3 v11.x
**Статус:** ✅ Стабильно
