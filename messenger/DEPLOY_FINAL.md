# 🚀 Деплой на Ubuntu Сервер

**Версия:** 1.0  
**Дата:** 2026-04-30

---

## 📋 Что Было Исправлено

### Проблемы Решены

1. ✅ **Удалён `client-db.ts`** - не нужен (RxDB инициализируется автоматически)
2. ✅ **Упрощён `Providers.tsx`** - убрана инициализация БД в `useEffect`
3. ✅ **Обновлён `next.config.js`** - исправлено имя опции `serverExternalPackages`
4. ✅ **Создана документация** - `DB_ARCHITECTURE.md` с полной информацией по БД

### Архитектура БД

| База данных | Тип | Где используется |
|-------------|-----|------------------|
| **SQLite** | better-sqlite3 | API routes (сервер) |
| **RxDB** | IndexedDB | Клиент (браузер) |

**Важно:** Эти базы данных НЕ конфликтуют - они используются в разных средах!

---

## 🔧 Инструкция по Деплою

### 1. Подготовить Сервер

```bash
# Установить Node.js (если ещё не установлен)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установить PM2 (менеджер процессов)
sudo npm install -g pm2

# Проверить версии
node -v  # v20.x.x
npm -v   # 10.x.x
```

### 2. Клонировать Репозиторий

```bash
cd ~
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Messenger_Balloo_next_ts/messenger
```

### 3. Установить Зависимости

```bash
# Установить production зависимости
npm install --production

# better-sqlite3 скомпилируется автоматически (нужен Python 3.x)
# Если есть ошибка Python:
sudo apt-get install -y python3 python3-pip
```

### 4. Создать `.env.production`

```bash
# Проверить какие переменные нужны
cat .env.example

# Создать файл с секретами
cat > .env.production << 'EOF'
NODE_ENV=production
JWT_SECRET=ваш-32-символьный-секрет
VAPID_PUBLIC_KEY=ваш-public-key
VAPID_PRIVATE_KEY=ваш-private-key
VAPID_SUBJECT=mailto:robot@balloo.su
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=balloo.Messenger@yandex.ru
SMTP_PASS=ваш-пароль
DATABASE_URL=file:./data/app.db
FRONTEND_URL=https://alpha.balloo.su
RXDB_DATABASE_NAME=balloo-prod
EOF
```

**Генерация JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Создать Папку для БД

```bash
mkdir -p data
chmod 755 data
```

### 6. Собрать Приложение

```bash
# Очистить кэш
rm -rf .next

# Собрать production версию
NODE_ENV=production npx next build
```

**Ожидаемый результат:**
```
✓ Compiled successfully
✓ Compiled production pages successfully
✓ Exported (XXX/XXX)
```

### 7. Создать Админа

```bash
npm run create-admin
```

Введите:
- Email: `admin@balloo.su`
- Пароль: `BallooAdmin2024!`

### 8. Запустить через PM2

```bash
# Создать eco.config.js если нужен кастомный запуск
# Или просто запустить:
pm2 start "npx next start -p 3000" --name messenger-alpha

# Сохранить конфигурацию
pm2 save

# Настроить автозапуск при перезагрузке
pm2 startup
```

### 9. Проверить Работу

```bash
# Проверить статус
pm2 status

# Просмотр логов
pm2 logs messenger-alpha --lines 50

# Проверить API
curl http://localhost:3000/api/health
```

---

## 🔄 Обновление Приложения

### 1. Получить Последние Изменения

```bash
cd ~/Messenger_Balloo_next_ts/messenger
git pull origin main
```

### 2. Установить Новые Зависимости

```bash
npm install --production
```

### 3. Пересобрать

```bash
pm2 stop messenger-alpha
rm -rf .next
NODE_ENV=production npx next build
pm2 start messenger-alpha
```

### 4. Проверить

```bash
pm2 logs messenger-alpha --lines 20
curl http://localhost:3000/api/health
```

---

## 💾 Резервное Копирование БД

### Создать Бэкап

```bash
# Остановить приложение (опционально)
pm2 stop messenger-alpha

# Создать бэкап
cp data/app.db data/app.db.backup.$(date +%Y%m%d_%H%M%S)

# Сжать
tar czf backup-$(date +%Y%m%d).tar.gz data/app.db

# Запустить обратно
pm2 start messenger-alpha
```

### Восстановить из Бэкапа

```bash
# Остановить
pm2 stop messenger-alpha

# Восстановить
cp data/app.db.backup.20260430 data/app.db

# Проверить целостность
sqlite3 data/app.db "PRAGMA integrity_check;"

# Запустить
pm2 start messenger-alpha
```

---

## 🚨 Перенос на Другой Сервер

### Шаг 1: Создать Бэкап (Старый Сервер)

```bash
cd ~/Messenger_Balloo_next_ts/messenger
tar czf backup-$(date +%Y%m%d).tar.gz data/app.db .env.production
scp backup-*.tar.gz user@new-server:~/backup.tar.gz
```

### Шаг 2: Восстановить (Новый Сервер)

```bash
# Клонировать код
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Messenger_Balloo_next_ts/messenger

# Восстановить бэкап
tar xzf ~/backup.tar.gz
mkdir -p data
mv app.db data/

# Проверить права
chmod 644 data/app.db

# Собрать и запустить
npm install --production
NODE_ENV=production npx next build
pm2 start "npx next start -p 3000" --name messenger-alpha
```

---

## 🔍 Диагностика

### Проверка БД

```bash
# Проверить что БД существует
ls -lh data/app.db

# Проверить таблицы
sqlite3 data/app.db ".tables"

# Проверить пользователей
sqlite3 data/app.db "SELECT id, email, displayName FROM User LIMIT 5;"

# Проверить целостность
sqlite3 data/app.db "PRAGMA integrity_check;"
```

### Проверка Приложения

```bash
# Статус PM2
pm2 status

# Логирование
pm2 logs messenger-alpha --lines 50

# Проверка API
curl http://localhost:3000/api/health

# Проверка памяти
pm2 monit
```

### Распространённые Ошибки

**Ошибка: "Cannot find module 'nodemailer'"**
```bash
npm install nodemailer
```

**Ошибка: "Database file not found"**
```bash
mkdir -p data
chmod 755 data
```

**Ошибка: "Port 3000 already in use"**
```bash
lsof -i :3000
# Убить процесс или изменить PORT в .env.production
```

---

## 📞 Полезные Команды

```bash
# Перезапуск приложения
pm2 restart messenger-alpha

# Остановка
pm2 stop messenger-alpha

# Просмотр логов в реальном времени
pm2 logs messenger-alpha --lines 100 --flush

# Мониторинг ресурсов
pm2 monit

# Удаление приложения (с сохранением БД!)
pm2 delete messenger-alpha

# Экспорт конфигурации
pm2 save
```

---

## ✅ Чеклист Перед Деплоем

- [ ] Node.js v20+ установлен
- [ ] PM2 установлен глобально
- [ ] Репозиторий клонирован
- [ ] `.env.production` создан со всеми переменными
- [ ] Папка `data/` создана с правами 755
- [ ] `npm install --production` прошёл успешно
- [ ] `npx next build` прошёл без ошибок
- [ ] Админ создан (`npm run create-admin`)
- [ ] PM2 процесс запущен
- [ ] API health проверяется: `curl http://localhost:3000/api/health`
- [ ] Бэкап сделан

---

**Поддержка:** i@o8eryuhtin.ru  
**Версия:** 1.0  
**Последнее обновление:** 2026-04-30
