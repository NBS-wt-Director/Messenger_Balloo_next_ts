# Balloo Messenger - Запуск на сервере

## ⚠️ ВАЖНОЕ ПРЕДУПРЕЖДЕНИЕ

### ✅ База данных НЕ стирается при перезапуске

**Better-SQLite3 сохраняет все данные между запусками приложения.**

- Перезапуск PM2 → данные **сохраняются**
- Перезагрузка сервера → данные **сохраняются**
- Обновление кода → данные **сохраняются**
- Пересборка Next.js → данные **сохраняются**

### 🗑️ Когда данные удалятся?

**ТОЛЬКО** если вы вручную удалите файл базы данных:
```bash
rm data/app.db  # <-- только так
rm -rf data/    # <-- или так
```

### 📁 Где хранятся данные?

```
~/Messenger_Balloo_next_ts/messenger/data/app.db
```

## Важная информация о базе данных

### ✅ База данных БЕЗОПАСНА

- **Не стирается при перезапуске** - SQLite сохраняет данные между запусками
- **Автоматически создаётся при первом запуске** - если файла нет, он создаётся
- **Таблицы не пересоздаются** - используется `CREATE TABLE IF NOT EXISTS`
- **Данные сохраняются** - все пользователи, чаты, сообщения остаются

### 📁 Расположение БД

```
~/Messenger_Balloo_next_ts/messenger/data/app.db
```

### 🔄 Поведие при запуске

| Ситуация | Что происходит |
|----------|----------------|
| **Первый запуск** | Создаётся `data/app.db`, создаются таблицы, добавляется тестовый пользователь |
| **Повторный запуск** | Загружается существующая БД, таблицы не меняются |
| **После перезагрузки сервера** | Все данные сохраняются |
| **После обновления кода** | Данные сохраняются, новые таблицы добавляются если есть |

### ⚠️ Когда данные УДАЛЯЮТСЯ

Данные удалятся **ТОЛЬКО** если вы вручную:
- Удалите файл `data/app.db`
- Удалите папку `data/`
- Выполните `rm -rf data/`

### 🛡️ Резервное копирование

```bash
# Создать бэкап
cp data/app.db data/app.db.backup.$(date +%Y%m%d)

# Восстановить из бэкапа
cp data/app.db.backup.20240101 data/app.db
```

## Быстрый старт

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# 1. Установить зависимости
npm install

# 2. Инициализировать базу данных
node scripts/init-db.js

# 3. Собрать приложение
NODE_ENV=production npx next build

# 4. Запустить через PM2
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha"

# 5. Сохранить конфигурацию PM2
pm2 save

# 6. Проверить работу
pm2 logs messenger-alpha --lines 20
curl -I http://localhost:3000
```

## Регистрация пользователя

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!",
    "displayName": "Admin User"
  }'
```

## Управление PM2

```bash
# Статус
pm2 status

# Логи
pm2 logs messenger-alpha

# Перезапуск
pm2 restart messenger-alpha

# Остановка
pm2 stop messenger-alpha

# Удаление
pm2 delete messenger-alpha
```

## База данных

- **Путь**: `~/Messenger_Balloo_next_ts/messenger/data/app.db`
- **Тип**: SQLite (Better-SQLite3)
- **Таблицы**: User, Chat, ChatMember, Message, Notification, Feature, Page, Report

## Диагностика

```bash
# Проверить что приложение запущено
curl -I http://localhost:3000

# Проверить базу данных
sqlite3 data/app.db "SELECT COUNT(*) FROM User;"
sqlite3 data/app.db "SELECT COUNT(*) FROM Chat;"

# Проверить свободное место
df -h ~/Messenger_Balloo_next_ts/messenger/data

# Проверить процессы
ps aux | grep next
```

## Проблемы и решения

### "Unable to open the database file"

```bash
# Проверить права доступа
chmod 755 ~/Messenger_Balloo_next_ts/messenger/data
chmod 644 ~/Messenger_Balloo_next_ts/messenger/data/app.db
```

### Port 3000 already in use

```bash
# Найти процесс
lsof -i :3000

# Убить процесс
kill -9 <PID>

# Или использовать другой порт
pm2 start "npx next start -p 3001" --name "messenger-alpha"
```

### PM2 процесс падает

```bash
# Проверить логи
pm2 logs messenger-alpha --lines 50

# Пересобрать приложение
NODE_ENV=production npx next build

# Перезапустить
pm2 restart messenger-alpha --update-env
```

## Обновление

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Получить изменения (если есть git)
git pull

# Установить зависимости
npm install

# Пересобрать
NODE_ENV=production npx next build

# Перезапустить
pm2 restart messenger-alpha --update-env
```

## Мониторинг

```bash
# Мониторинг PM2
pm2 monit

# Логи в реальном времени
pm2 logs messenger-alpha

# Статистика
pm2 show messenger-alpha
```
