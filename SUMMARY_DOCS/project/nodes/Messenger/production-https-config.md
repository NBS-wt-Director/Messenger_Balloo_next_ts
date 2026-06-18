# 🔐 HTTPS & Production Configuration для Balloo Messenger

## 📋 Содержание
1. [Настройка HTTPS на Beget](#1-настройка-https-на-beget)
2. [PostgreSQL Database Setup](#2-postgresql-database-setup)
3. [Nginx Reverse Proxy](#3-nginx-reverse-proxy)
4. [PM2 Process Manager](#4-pm2-process-manager)
5. [Environment Variables](#5-environment-variables)
6. [SSL Certificate Auto-Renewal](#6-ssl-certificate-auto-renewal)
7. [Production Checklist](#7-production-checklist)

---

## 1. Настройка HTTPS на Beget

### 1.1. Получение SSL Сертификата (Let's Encrypt)

**Через панель Beget:**

1. Зайдите в панель: https://beget.com
2. Раздел **Хостинг** → **Ваш аккаунт**
3. **Домены** → Выберите ваш домен
4. **SSL-сертификаты**
5. **Получить бесплатно (Let's Encrypt)**
6. Введите домены:
   - `ваш-домен.ru`
   - `www.ваш-домен.ru`
   - `api.ваш-домен.ru`
7. Нажмите **Получить**

**Через SSH (ручной метод):**

```bash
# Установите certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Получите сертификат
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru

# Автоматическое обновление (добавьте в crontab)
crontab -e
# Добавьте строку:
0 0 1 * * certbot renew --quiet
```

### 1.2. Настройка Nginx для HTTPS

**Файл: `/etc/nginx/sites-available/balloo`**

```nginx
# ===========================================
# Balloo Messenger - Nginx Configuration
# ===========================================

# HTTP → HTTPS Redirect
server {
    listen 80;
    listen [::]:80;
    server_name ваш-домен.ru www.ваш-домен.ru;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all other requests to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ваш-домен.ru www.ваш-домен.ru;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/ваш-домен.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ваш-домен.ru/privkey.pem;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
    
    # Static Files
    location /_next/static/ {
        root /var/www/ваш-домен.ru/balloo/messenger;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /static/ {
        root /var/www/ваш-домен.ru/balloo/messenger;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /icons/ {
        root /var/www/ваш-домен.ru/balloo/messenger/public;
        expires 1y;
    }
    
    location /avatars/ {
        root /var/www/ваш-домен.ru/balloo/messenger/public;
        expires 30d;
    }
    
    # API Proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }
    
    # Main Application
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
    }
    
    # Error Pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

**Активация конфигурации:**

```bash
# Создайте симлинк
sudo ln -s /etc/nginx/sites-available/balloo /etc/nginx/sites-enabled/

# Удалите дефолтную конфигурацию
sudo rm /etc/nginx/sites-enabled/default

# Проверьте конфигурацию
sudo nginx -t

# Перезагрузите Nginx
sudo systemctl reload nginx
```

---

## 2. PostgreSQL Database Setup

### 2.1. Установка PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install -y postgresql-server postgresql-contrib
```

### 2.2. Создание Базы Данных

```bash
# Запустите скрипт настройки
cd /var/www/ваш-домен.ru/balloo
chmod +x messenger/scripts/setup-database.sh
./messenger/scripts/setup-database.sh
```

**Или вручную:**

```bash
# Войдите в PostgreSQL
sudo -u postgres psql

# Создайте пользователя
CREATE USER balloo WITH PASSWORD 'your_secure_password';

# Создайте базу данных
CREATE DATABASE balloo OWNER balloo;

# Дайте права
GRANT ALL PRIVILEGES ON DATABASE balloo TO balloo;

# Выйдите
\q
```

### 2.3. Настройка Подключения

**Файл: `.env.local`**

```env
DATABASE_URL="postgresql://balloo:ваш_пароль@localhost:5432/balloo?schema=public"
```

### 2.4. Генерация и Применение Миграций

```bash
cd messenger

# Генерируем Prisma Client
npm run db:generate

# Применяем миграции
npm run db:migrate

# Заполняем тестовыми данными
npx prisma db seed
```

---

## 3. Nginx Reverse Proxy

### 3.1. Установка Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 3.2. Настройка Конфигурации

Создайте файл: `/etc/nginx/sites-available/balloo` (см. раздел 1.2)

### 3.3. Проверка и Перезагрузка

```bash
# Проверка конфигурации
sudo nginx -t

# Перезагрузка
sudo systemctl reload nginx

# Статус
sudo systemctl status nginx
```

---

## 4. PM2 Process Manager

### 4.1. Установка PM2

```bash
npm install -g pm2
```

### 4.2. Запуск Приложения

```bash
cd /var/www/ваш-домен.ru/balloo/messenger

# Запуск
pm2 start npm --name "balloo" -- start

# Сохранение процесса
pm2 save

# Автозапуск при старте системы
pm2 startup
# Выполните команду, которую выведет pm2
```

### 4.3. Управление Приложением

```bash
# Статус
pm2 status

# Логи
pm2 logs balloo

# Перезапуск
pm2 restart balloo

# Остановка
pm2 stop balloo

# Мониторинг
pm2 monit
```

### 4.4. PM2 Configuration File

**Файл: `ecosystem.config.js`**

```javascript
module.exports = {
  apps: [{
    name: 'balloo',
    cwd: '/var/www/ваш-домен.ru/balloo/messenger',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
    },
    env_production: {
      NODE_ENV: 'production',
    },
    max_memory_restart: '500M',
    instances: 1,
    autorestart: true,
    watch: false,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: '/var/log/balloo/error.log',
    out_file: '/var/log/balloo/out.log',
    merge_logs: true,
  }],
};
```

**Запуск с конфигурацией:**

```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## 5. Environment Variables

### 5.1. Production .env.local

```env
# ===========================================
# PRODUCTION ENVIRONMENT
# ===========================================

NODE_ENV=production

# URLs
NEXT_PUBLIC_SERVER_URL=https://ваш-домен.ru
DATABASE_URL="postgresql://balloo:ваш_пароль@localhost:5432/balloo?schema=public"

# JWT & Security
JWT_SECRET=RnTytYjfV1Np5dEi4J8vroMHG2uPFKUCZx9DQ3eqbLOX0hSI6zWkgscmAlBa7w
ENCRYPTION_KEY=ваш-32-символьный-encryption-key-minimum
RXDB_PASSWORD=ваш-пароль-для-локальной-bdb

# Yandex OAuth
YANDEX_CLIENT_ID=ваш-yandex-client-id
YANDEX_CLIENT_SECRET=ваш-yandex-client-secret
YANDEX_DISK_TOKEN=ваш-yandex-disk-token

# Push Notifications
VAPID_PUBLIC_KEY=ваш-vapid-public-key
VAPID_PRIVATE_KEY=ваш-vapid-private-key
VAPID_SUBJECT=mailto:admin@ваш-домен.ru

# Email
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=ваш-email@yandex.ru
SMTP_PASS=ваш-пароль-yandex

# Admin
ADMIN_EMAIL=admin@ваш-домен.ru

# Logging
LOG_LEVEL=warn
```

### 5.2. Безопасность

```bash
# Установите правильные права
chmod 600 /var/www/ваш-домен.ru/balloo/messenger/.env.local

# Никогда не коммитьте .env.local в Git
# Убедитесь, что он в .gitignore
```

---

## 6. SSL Certificate Auto-Rewewal

### 6.1. Автоматическое Обновление

```bash
# Проверка обновления
sudo certbot renew --dry-run

# Добавить в crontab
sudo crontab -e

# Добавьте строку (обновление в 00:00 1-го числа каждого месяца):
0 0 1 * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

### 6.2. Проверка Сертификата

```bash
# Информация о сертификате
sudo certbot certificates

# Обновить конкретный сертификат
sudo certbot renew --cert-name ваш-домен.ru
```

---

## 7. Production Checklist

### ✅ Перед Релизом

- [ ] **Домен зарегистрирован и привязан к серверу**
- [ ] **DNS прописались** (проверьте через `nslookup`)
- [ ] **PostgreSQL установлен и настроен**
- [ ] **База данных создана** (`balloo`)
- [ ] **Миграции применены** (`npm run db:migrate`)
- [ ] **Тестовые данные загружены** (`prisma db seed`)
- [ ] **SSL сертификат получен** (Let's Encrypt)
- [ ] **HTTPS работает** (откройте https://ваш-домен.ru)
- [ ] **Nginx настроен** (проверьте `nginx -t`)
- [ ] **PM2 запущен** (`pm2 status`)
- [ ] **Переменные окружения настроены** (.env.local)
- [ ] **config.json загружен** на сервер
- [ ] **Админ-аккаунт создан** (admin@balloo.ru)

### ✅ Проверка Работоспособности

- [ ] **Главная страница загружается** (`https://ваш-домен.ru`)
- [ ] **Регистрация работает**
- [ ] **Вход работает**
- [ ] **Чаты создаются**
- [ ] **Сообщения отправляются**
- [ ] **Админка доступна** (`/admin`)
- [ ] **Страница поддержки работает** (`/support`)
- [ ] **Страница "О компании" работает** (`/about-company`)
- [ ] **PWA устанавливается** (Chrome → F12 → Application)
- [ ] **Push-уведомления работают**

### ✅ Мониторинг

```bash
# Логи приложения
pm2 logs balloo --lines 100

# Статус
pm2 status

# Ресурсы
pm2 monit

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL
sudo -u postgres psql -c "SELECT datname, numbackends FROM pg_stat_database;"
```

### ✅ Резервное Копирование

```bash
# Скрипт бэкапа базы данных
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U balloo balloo > /backups/balloo_$DATE.sql
find /backups -name "balloo_*.sql" -mtime +7 -delete

# Добавьте в crontab (ежедневно в 2:00)
0 2 * * * /path/to/backup.sh
```

---

## 🎉 Готово!

Ваш Balloo Messenger развёрнут с HTTPS и серверной базой данных!

### Полезные Команды

```bash
# Перезапуск приложения
pm2 restart balloo

# Просмотр логов
pm2 logs balloo

# Перезагрузка Nginx
sudo systemctl reload nginx

# Проверка SSL
curl -vI https://ваш-домен.ru

# Проверка базы данных
sudo -u postgres psql -d balloo -c "SELECT COUNT(*) FROM \"User\";"
```

### Контакты Поддержки

- **Beget**: 8 (800) 200-04-04
- **Certbot**: https://certbot.eff.org
- **PM2**: https://pm2.keymetrics.io
- **Prisma**: https://www.prisma.io/docs

---

**Успешного запуска с HTTPS!** 🔐✨
