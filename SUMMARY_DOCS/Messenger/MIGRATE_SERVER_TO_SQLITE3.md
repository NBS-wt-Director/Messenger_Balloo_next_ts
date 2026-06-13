# 🚀 Миграция с Prisma на Better-SQLite3 на Сервере

## ⚠️ ПРОБЛЕМА

Текущее приложение на сервере использует **Prisma**, а мы мигрировали на **Better-SQLite3**.

Ошибки в логах:
```
Invalid `prisma.chat.findUnique()` invocation:
The table `main.Chat` does not exist in the current database.
```

## 🛠️ РЕШЕНИЕ

### Шаг 1: Удалить старую сборку

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Остановить приложение
pm2 stop messenger-alpha

# Удалить старую сборку
rm -rf .next
rm -rf node_modules/.cache

# Удалить Prisma dependencies
npm uninstall @prisma-client prisma --save-dev
```

### Шаг 2: Установить Better-SQLite3

```bash
# Установить better-sqlite3
npm install better-sqlite3

# Проверить установку
npm list better-sqlite3
```

### Шаг 3: Обновить DATABASE_URL

```bash
# Обновить .env.production
echo 'DATABASE_URL="file:/home/balloo/Messenger_Balloo_next_ts/messenger/prisma/dev.db"' >> .env.production

# Или отредактировать вручную
nano .env.production
```

### Шаг 4: Инициализировать базу данных

```bash
# Создать папку data если нет
mkdir -p data

# Запустить инициализацию (создаст таблицы если нет)
node scripts/init-db.js

# Проверить таблицы
sqlite3 prisma/dev.db ".tables"
# Должно показать: Chat, ChatMember, Message, User, VerificationCode, ...
```

### Шаг 5: Пересобрать приложение

```bash
# Пересобрать с новым кодом
NODE_ENV=production npm run build

# Проверить что сборка прошла без ошибок
```

### Шаг 6: Запустить с PM2

```bash
# Запустить приложение
NODE_ENV=production DATABASE_URL="file:/home/balloo/Messenger_Balloo_next_ts/messenger/prisma/dev.db" pm2 start "npx next start -p 3000" --name "messenger-alpha"

# Сохранить
pm2 save

# Проверить логи
pm2 logs messenger-alpha --lines 50
```

### Шаг 7: Проверить работу

```bash
# Проверить статус
pm2 status

# Проверить API
curl http://localhost:3000/api/versions

# Проверить регистрацию
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@balloo.su","password":"Test1234!","displayName":"Test"}'
```

---

## 📝 ПРОВЕРКА УСПЕХА

### Логирование при старте:

При успешном запуске в логах должно быть:
```
✓ Все таблицы и индексы созданы успешно
✓ База данных инициализирована
```

Вместо ошибок Prisma:
```
❌ Invalid `prisma.chat.findUnique()` invocation:
```

### Проверка БД:

```bash
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM User;"
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Chat;"
sqlite3 prisma/dev.db "SELECT COUNT(*) FROM Message;"
```

### Проверка API:

```bash
# Должно вернуть версии
curl http://localhost:3000/api/versions

# Должно вернуть 400 (нет данных) или 200 (есть данные)
curl http://localhost:3000/api/chats?userId=test
```

---

## 🔄 ОТКАТ (если нужно)

Если что-то пошло не так:

```bash
# Остановить приложение
pm2 stop messenger-alpha

# Установить Prisma обратно
npm install @prisma/client prisma --save-dev

# Сгенерировать Prisma Client
npx prisma generate

# Запустить миграции
npx prisma migrate deploy

# Перезапустить
pm2 start messenger-alpha
```

---

**Дата:** 2026-06-01  
**Статус:** ✅ Готово к выполнению
