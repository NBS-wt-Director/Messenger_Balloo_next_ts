# 🚀 Деплой на VPS - Пошаговая Инструкция

**Для:** Ubuntu 20.04/22.04 или Debian 11+  
**Время:** 30-40 минут  
**Сложность:** ⭐⭐⭐ (Средняя)

---

## 📋 Содержание

1. [Подготовка сервера](#1-подготовка-сервера)
2. [Установка Node.js и зависимостей](#2-установка-nodejs-и-зависимостей)
3. [Установка PostgreSQL](#3-установка-postgresql)
4. [Загрузка проекта](#4-загрузка-проекта)
5. [Настройка окружения](#5-настройка-окружения)
6. [Настройка базы данных](#6-настройка-базы-данных)
7. [Запуск приложения](#7-запуск-приложения)
8. [Настройка Nginx](#8-настройка-nginx)
9. [SSL сертификат](#9-ssl-сертификат)
10. [Проверка работы](#10-проверка-работы)

---

## 1. Подготовка сервера

### 1.1. Подключитесь к серверу

```bash
ssh root@ваш-ip-адрес
```

### 1.2. Обновите систему

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3. Создайте пользователя для приложения

```bash
# Создайте пользователя balloo
sudo adduser balloo

# Добавьте в группу sudo (для прав администратора)
sudo usermod -aG sudo balloo

# Переключитесь на пользователя
su - balloo
```

**Пароль:** Придумайте надёжный пароль для пользователя balloo

---

## 2. Установка Node.js и зависимостей

### 2.1. Установите Node.js 18+

```bash
# Добавьте репозиторий NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Установите Node.js и npm
sudo apt install -y nodejs
```

### 2.2. Проверьте установку

```bash
node --version  # Должно быть v18.x или выше
npm --version   # Должно быть 9.x или выше
```

### 2.3. Установите PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

**PM2** - менеджер процессов для Node.js приложений

### 2.4. Установите другие утилиты

```bash
sudo apt install -y git curl wget build-essential
```

---

## 3. Установка PostgreSQL

### 3.1. Установите PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
```

### 3.2. Запустите и включите автозапуск

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3.3. Настройте пароль для postgres пользователя

```bash
sudo -u postgres psql
```

```sql
-- Введите в консоли PostgreSQL:
ALTER USER postgres PASSWORD 'ваш-надежный-пароль';
\q
```

### 3.4. Создайте базу данных и пользователя

```bash
sudo -u postgres psql
```

```sql
-- Создайте БД
CREATE DATABASE balloo;

-- Создайте пользователя
CREATE USER balloo_user WITH PASSWORD 'ваш-пароль-для-бд';

-- Дайте права
GRANT ALL PRIVILEGES ON DATABASE balloo TO balloo_user;

-- Выход
\q
```

### 3.5. Установите pg_trgm (опционально, для поиска)

```bash
sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
```

---

## 4. Загрузка проекта

### 4.1. Клонируйте репозиторий

```bash
# Перейдите в домашнюю директорию
cd ~

# Клонируйте репозиторий
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Messenger_Balloo_next_ts/messenger
```

### 4.2. Установите зависимости

```bash
npm install --production
```

Это займёт 3-5 минут.

---

## 5. Настройка окружения

### 5.1. Скопируйте пример .env

```bash
cp .env.example .env.production.local
nano .env.production.local
```

### 5.2. Заполните переменные

**Важные переменные:**

```env
# Режим работы
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# База данных (замените на свои данные!)
DATABASE_URL="postgresql://balloo_user:ваш-пароль-для-бд@localhost:5432/balloo"

# JWT Secret (сгенерируйте новый!)
JWT_SECRET=openssl rand -base64 32

# Encryption Key (сгенерируйте новый!)
ENCRYPTION_KEY=openssl rand -hex 32

# Адрес приложения (замените на ваш домен или IP)
NEXT_PUBLIC_APP_URL=https://ваш-домен.ru
NEXT_PUBLIC_SERVER_URL=https://ваш-домен.ru

# Yandex OAuth (получите на https://oauth.yandex.ru/)
NEXT_PUBLIC_YANDEX_CLIENT_ID=ваш-client-id
YANDEX_CLIENT_SECRET=ваш-client-secret

# Admin email
ADMIN_EMAIL=ваш-email@example.com

# Логирование
LOG_LEVEL=info
```

### 5.3. Сгенерируйте секреты

Откройте новую терминальную сессию (не закрывая SSH) и выполните:

```bash
# JWT Secret
openssl rand -base64 32

# Encryption Key
openssl rand -hex 32
```

Скопируйте полученные значения и вставьте в `.env.production.local`

### 5.4. Сохраните файл

В редакторе nano:
- Нажмите `Ctrl+O` → `Enter` (сохранить)
- Нажмите `Ctrl+X` (выйти)

---

## 6. Настройка базы данных

### 6.1. Сгенерируйте Prisma Client

```bash
npx prisma generate
```

### 6.2. Запустите миграции

```bash
npx prisma migrate deploy
```

Это создаст все таблицы в базе данных.

### 6.3. (Опционально) Создайте администратора

```bash
npm run create-admin
```

Если скрипт не работает, создайте админа вручную через базу данных.

---

## 7. Запуск приложения

### 7.1. Соберите проект

```bash
npm run build
```

Это займёт 2-3 минуты. Результат:
```
✓ Compiled successfully
✓ Production build completed
```

### 7.2. Запустите через PM2

```bash
pm2 start npm --name "balloo" -- start
```

### 7.3. Сохраните конфигурацию PM2

```bash
pm2 save
```

### 7.4. Настройте автозапуск при старте системы

```bash
pm2 startup systemd -u balloo --hp /home/balloo
```

Выполните команду, которую покажет PM2 (обычно sudo команды).

### 7.5. Проверьте статус

```bash
pm2 status
pm2 logs balloo
```

Приложение должно работать на `http://localhost:3000`

---

## 8. Настройка Nginx

### 8.1. Установите Nginx

```bash
sudo apt install -y nginx
```

### 8.2. Создайте конфигурацию сайта

```bash
sudo nano /etc/nginx/sites-available/balloo
```

### 8.3. Вставьте конфигурацию

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;

    # Перенаправление на Node.js приложение
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Таймауты для длинных запросов
        proxy_read_timeout 90;
        proxy_connect_timeout 90;
        proxy_send_timeout 90;
    }

    # Статические файлы (опционально)
    location /_next/static {
        proxy_pass http://localhost:3000/_next/static;
        proxy_cache_valid 200 1d;
    }
}
```

### 8.4. Активируйте сайт

```bash
# Создайте символическую ссылку
sudo ln -s /etc/nginx/sites-available/balloo /etc/nginx/sites-enabled/

# Удалите дефолтный сайт (опционально)
sudo rm /etc/nginx/sites-enabled/default

# Проверьте конфигурацию
sudo nginx -t

# Перезапустите Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 9. SSL сертификат

### 9.1. Установите Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2. Получите SSL сертификат

```bash
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

### 9.3. Следуйте инструкциям

1. Введите email
2. Примите условия
3. Выберите перенаправление HTTP → HTTPS (рекомендуется)

### 9.4. Проверьте автоматическое обновление

```bash
sudo certbot renew --dry-run
```

### 9.5. Обновите переменные окружения

```bash
nano .env.production.local
```

Измените:
```env
NEXT_PUBLIC_APP_URL=https://ваш-домен.ru
NEXT_PUBLIC_SERVER_URL=https://ваш-домен.ru
```

Перезапустите приложение:
```bash
pm2 restart balloo
```

---

## 10. Проверка работы

### 10.1. Проверьте статус всех сервисов

```bash
# PM2
pm2 status

# Nginx
sudo systemctl status nginx

# PostgreSQL
sudo systemctl status postgresql
```

### 10.2. Проверьте приложение

```bash
# Откройте в браузере
https://ваш-домен.ru

# Или через curl
curl https://ваш-домен.ru
```

### 10.3. Проверьте логи

```bash
# Логи приложения
pm2 logs balloo

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔑 Где брать данные для настройки

### 1. Yandex OAuth

**Где:** https://oauth.yandex.ru/

**Шаги:**
1. Войдите в Яндекс ID
2. Нажмите "Создать приложение"
3. Заполните:
   - Название: "Balloo Messenger"
   - Платформы: Web
   - Redirect URI: `https://ваш-домен.ru/api/auth/yandex/callback`
4. Сохраните Client ID и Client Secret

### 2. VAPID ключи для Push-уведомлений

**Генерация:**
```bash
npx web-push generate-vapid-keys
```

**Добавьте в .env.production.local:**
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=ваш-public-key
VAPID_PRIVATE_KEY=ваш-private-key
VAPID_SUBJECT=mailto:ваш-email@example.com
```

### 3. SMTP для email (опционально)

**Примеры SMTP серверов:**

| Провайдер | Host | Port |
|-----------|------|------|
| Yandex | smtp.yandex.ru | 587 |
| Gmail | smtp.gmail.com | 587 |
| Mail.ru | smtp.mail.ru | 587 |

**Добавьте в .env.production.local:**
```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=ваш-email@yandex.ru
SMTP_PASS=пароль-приложения
```

### 4. Секреты безопасности

**Генерация:**
```bash
# JWT Secret
openssl rand -base64 32

# Encryption Key
openssl rand -hex 32
```

---

## 🛠 Управление приложением

### PM2 команды

```bash
# Статус
pm2 status

# Логи
pm2 logs balloo

# Перезапуск
pm2 restart balloo

# Остановка
pm2 stop balloo

# Запуск
pm2 start balloo

# Мониторинг
pm2 monit

# Удаление
pm2 delete balloo
```

### Nginx команды

```bash
# Перезапуск
sudo systemctl restart nginx

# Статус
sudo systemctl status nginx

# Логи
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### PostgreSQL команды

```bash
# Подключение
sudo -u postgres psql

# Список БД
\l

# Подключение к БД
\c balloo

# Выход
\q
```

---

## 🔧 Решение проблем

### Проблема 1: "Cannot connect to database"

**Решение:**
```bash
# Проверьте DATABASE_URL в .env.production.local
# Убедитесь, что пароль правильный
# Проверьте права пользователя:
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE balloo TO balloo_user;"
```

### Проблема 2: "Port 3000 already in use"

**Решение:**
```bash
# Найдите процесс на порту 3000
sudo lsof -i :3000

# Убейте процесс
sudo kill -9 PID

# Или измените PORT в .env.production.local
```

### Проблема 3: "Nginx not forwarding requests"

**Решение:**
```bash
# Проверьте конфигурацию
sudo nginx -t

# Перезапустите
sudo systemctl restart nginx

# Проверьте логи
sudo tail -f /var/log/nginx/error.log
```

### Проблема 4: "SSL certificate error"

**Решение:**
```bash
# Перегенерируйте сертификат
sudo certbot delete --cert-name ваш-домен.ru
sudo certbot --nginx -d ваш-домен.ru
```

### Проблема 5: "Build failed"

**Решение:**
```bash
# Очистите кэш
rm -rf .next
npm run build

# Или увеличьте память
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## 📊 Мониторинг и поддержка

### Автоматические бэкапы БД

Создайте скрипт бэкапа:

```bash
sudo nano /usr/local/bin/backup-balloo.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U balloo_user balloo > /home/balloo/backups/balloo_$DATE.sql
find /home/balloo/backups -name "*.sql" -mtime +7 -delete
```

```bash
# Сделайте исполняемым
sudo chmod +x /usr/local/bin/backup-balloo.sh

# Добавьте в crontab (ежедневно в 3:00)
sudo crontab -e
0 3 * * * /usr/local/bin/backup-balloo.sh
```

### Мониторинг доступности

**Бесплатные сервисы:**
- [Uptime Robot](https://uptimerobot.com) - 50 мониторов бесплатно
- [Pingdom](https://www.pingdom.com) - пробный период
- [StatusCake](https://www.statuscake.com) - бесплатно

---

## 📋 Чек-лист после деплоя

- [ ] Приложение доступно по HTTPS
- [ ] SSL сертификат работает
- [ ] База данных подключена
- [ ] Вход через email работает
- [ ] Вход через Яндекс работает (если настроен)
- [ ] Отправка сообщений работает
- [ ] Загрузка файлов работает
- [ ] Логи пишутся
- [ ] Бэкапы настроены
- [ ] Мониторинг включён

---

## 🎯 Готово!

Ваш проект успешно развёрнут на VPS!

**Следующие шаги:**
1. Настройте мониторинг (Uptime Robot)
2. Настройте бэкапы
3. Добавьте Sentry для отслеживания ошибок
4. Настройте CDN для статических файлов

---

**Документация:**
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Общее руководство
- [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) - Быстрый старт
- [VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md) - Эта инструкция

🎉 **Удачи!**
