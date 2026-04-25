# 🚀 Полная Инструкция по Деплою Balloo Messenger на Beget VPS (Ubuntu 24.04)

## 📋 Содержание

1. [Оценка Готовности к Деплою](#1-оценка-готовности-к-деплою)
2. [Подготовка Проекта](#2-подготовка-проекта)
3. [Настройка VPS Сервера Beget](#3-настройка-vps-сервера-beget)
4. [Установка Необходимого ПО](#4-установка-необходимого-по)
5. [Развертывание Приложения](#5-развертывание-приложения)
6. [Настройка Домена alpha.balloo.su](#6-настройка-домена-alphaballoosu)
7. [Настройка SSL (HTTPS)](#7-настройка-ssl-https)
8. [Первичная Настройка и Тестирование](#8-первичная-настройка-и-тестирование)
9. [Мониторинг и Поддержка](#9-мониторинг-и-поддержка)
10. [Резервное Копирование](#10-резервное-копирование)

---

## 1. Оценка Готовности к Деплою

### ✅ Проект ГОТОВ к деплою!

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| **Сборка** | ✅ Готово | `npm run build` успешен |
| **TypeScript** | ✅ Готово | Все типы исправлены |
| **RxDB Bug Fixed** | ✅ Исправлено | Добавлен wrappedValidateAjvStorage |
| **Prisma Types** | ✅ Исправлено | Все типы Date.now() → new Date() |
| **Страницы** | ✅ 68 маршрутов | Все страницы работают |
| **API Routes** | ✅ 50+ endpoints | Все endpoints созданы |
| **PWA** | ✅ Готово | Manifest, Service Worker |
| **Installer Page** | ✅ Готово | /installer работает |

**Вывод:** Проект полностью готов к производству! ✅

---

## 2. Подготовка Проекта

### 2.1. Проверка Локально

```bash
# Перейдите в папку проекта
cd messenger

# Убедитесь, что сборка успешна
npm run build

# Проверьте, что папка .next создана
ls -la .next/
```

### 2.2. Создание .env.production

```bash
# Создайте файл .env.production
cp .env.example .env.production
```

Отредактируйте `.env.production`:

```env
# ===========================================
# PRODUCTION ENVIRONMENT - alpha.balloo.su
# ===========================================

NODE_ENV=production

# URLs
NEXT_PUBLIC_APP_URL=https://alpha.balloo.su
NEXT_PUBLIC_API_URL=https://alpha.balloo.su/api
NEXT_PUBLIC_SERVER_URL=https://alpha.balloo.su

# Security
NEXTAUTH_SECRET=сгенерируйте-с помощью-openssl-rand-base64-32
ENCRYPTION_KEY=сгенерируйте-уникальный-ключ-минимум-32-символа

# Yandex OAuth (получить в https://oauth.yandex.ru/)
YANDEX_CLIENT_ID=ваш_client_id
YANDEX_CLIENT_SECRET=ваш_client_secret
YANDEX_DISK_API_URL=https://cloud-api.yandex.net/v1/disk
YANDEX_DISK_TOKEN=ваш_токен_диска

# Push Notifications (VAPID)
VAPID_PUBLIC_KEY=сгенерируйте-npx-web-push-generate-vapid-keys
VAPID_PRIVATE_KEY=сгенерируйте-npx-web-push-generate-vapid-keys

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60

# Email (опционально)
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=ваша@почта.ru
SMTP_PASS=ваш_пароль
```

### 2.3. Генерация Ключей

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# VAPID Keys
npx web-push generate-vapid-keys
```

### 2.4. config.json

Создайте `messenger/config.json`:

```json
{
  "app": {
    "name": "Balloo Messenger",
    "version": "1.0.0",
    "description": "Безопасный мессенджер с шифрованием",
    "url": "https://alpha.balloo.su"
  },
  "push": {
    "vapidPublicKey": "ВАШ_VAPID_PUBLIC_KEY",
    "vapidPrivateKey": "ВАШ_VAPID_PRIVATE_KEY",
    "vapidSubject": "mailto:admin@balloo.su"
  },
  "installer": {
    "enabled": true,
    "testAccounts": [
      {
        "email": "test@alpha.balloo.su",
        "password": "TestPassword123!",
        "displayName": "Тестовый Пользователь",
        "isAdmin": false
      }
    ]
  }
}
```

### 2.5. Проверка .gitignore

Убедитесь, что `.env.production` и `config.json` в `.gitignore`:

```bash
cat .gitignore | grep -E "env|config.json"
```

Должно быть:
```
.env.local
.env.production
config.json
```

---

## 3. Настройка VPS Сервера Beget

### 3.1. Получение Доступа к VPS

1. Зайдите в панель Beget: https://beget.com
2. Перейдите в раздел **VPS**
3. Выберите ваш сервер (Ubuntu 24.04)
4. Скопируйте IP-адрес сервера
5. Используйте SSH-ключ или пароль для доступа

### 3.2. Подключение по SSH

```bash
# Подключитесь к серверу
ssh root@ВАШ_IP_АДРЕС

# Или с ключом
ssh -i ~/.ssh/id_rsa root@ВАШ_IP_АДРЕС
```

### 3.3. Обновление Системы

```bash
# Обновите пакеты
apt update && apt upgrade -y

# Установите базовые утилиты
apt install -y curl wget git nano htop
```

---

## 4. Установка Необходимого ПО

### 4.1. Установка Node.js 20.x

```bash
# Установите NodeSource репозиторий
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Установите Node.js
apt install -y nodejs

# Проверьте версии
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 4.2. Установка PM2

```bash
# Установите PM2 глобально
npm install -g pm2

# Проверьте установку
pm2 --version
```

### 4.3. Установка Nginx

```bash
# Установите Nginx
apt install -y nginx

# Проверьте статус
systemctl status nginx
```

### 4.4. Установка Certbot (Let's Encrypt)

```bash
# Установите Certbot
apt install -y certbot python3-certbot-nginx

# Проверьте установку
certbot --version
```

---

## 5. Развертывание Приложения

### 5.1. Создание Папки для Приложения

```bash
# Создайте папку для приложения
mkdir -p /var/www/balloo
cd /var/www/balloo
```

### 5.2. Клонирование Репозитория

```bash
# Если у вас есть Git репозиторий
git clone https://github.com/ВАШ-НИК/balloo-messenger.git .

# ИЛИ загрузите файлы через SCP/FTP
# scp -r ./messenger/* root@ВАШ_IP:/var/www/balloo/
```

### 5.3. Установка Зависимостей

```bash
cd /var/www/balloo/messenger

# Установите зависимости
npm install --production

# Проверьте, что node_modules создан
ls -la node_modules/ | head -20
```

### 5.4. Загрузка Конфигурационных Файлов

```bash
# Скопируйте .env.production
nano /var/www/balloo/messenger/.env.production
# Вставьте содержимое из вашего .env.production

# Скопируйте config.json
nano /var/www/balloo/messenger/config.json
# Вставьте содержимое из вашего config.json
```

### 5.5. Сборка Приложения

```bash
# Соберите приложение
npm run build

# Проверьте результат
ls -la .next/
```

### 5.6. Запуск через PM2

```bash
# Запустите приложение
cd /var/www/balloo/messenger
pm2 start npm --name "balloo" -- start

# Сохраните процесс
pm2 save

# Настройте автозапуск при перезагрузке
pm2 startup
# Скопируйте команду из вывода и выполните её
```

### 5.7. Проверка Работающего Приложения

```bash
# Проверьте статус
pm2 status

# Проверьте логи
pm2 logs balloo --lines 50

# Проверьте, что приложение доступно локально
curl http://localhost:3000
```

---

## 6. Настройка Домена alpha.balloo.su

### 6.1. Настройка DNS

В панели Beget или у регистратора домена:

1. **Создайте A запись:**
   - Имя: `alpha`
   - Значение: `ВАШ_IP_АДРЕС`
   - TTL: 3600

2. **Создайте A запись для корня (опционально):**
   - Имя: `@`
   - Значение: `ВАШ_IP_АДРЕС`
   - TTL: 3600

### 6.2. Проверка DNS

```bash
# На вашем компьютере
nslookup alpha.balloo.su
# или
ping alpha.balloo.su
```

Ожидается: IP-адрес вашего VPS сервера.

### 6.3. Ожидание Прописывания DNS

DNS может прописываться от 15 минут до 24 часов.

---

## 7. Настройка SSL (HTTPS)

### 7.1. Настройка Nginx

```bash
# Откройте конфиг Nginx
nano /etc/nginx/sites-available/balloo
```

Добавьте конфигурацию:

```nginx
server {
    listen 80;
    server_name alpha.balloo.su www.alpha.balloo.su;
    
    # Перенаправление на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name alpha.balloo.su www.alpha.balloo.su;
    
    # SSL сертификаты (будут созданы certbot)
    ssl_certificate /etc/letsencrypt/live/alpha.balloo.su/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/alpha.balloo.su/privkey.pem;
    
    # Настройки SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Корень сайта
    root /var/www/balloo/messenger;
    index index.html;
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Proxy к Node.js приложению
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
    
    # Статические файлы
    location /_next/static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Public файлы
    location /_next/image {
        proxy_pass http://localhost:3000/_next/image;
    }
    
    # WebSocket (для real-time функций)
    location /api/webrtc {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 7.2. Активация Конфигурации

```bash
# Создайте символическую ссылку
ln -s /etc/nginx/sites-available/balloo /etc/nginx/sites-enabled/

# Удалите дефолтный конфиг
rm /etc/nginx/sites-enabled/default

# Проверьте конфигурацию
nginx -t

# Перезагрузите Nginx
systemctl restart nginx
```

### 7.3. Получение SSL Сертификата

```bash
# Получите сертификат Let's Encrypt
certbot --nginx -d alpha.balloo.su -d www.alpha.balloo.su

# Следуйте инструкциям:
# 1. Введите email
# 2. Примите условия
# 3. Выберите перенаправление на HTTPS (рекомендуется)
```

### 7.4. Проверка SSL

```bash
# Проверьте сертификат
curl -vI https://alpha.balloo.su

# Или используйте онлайн-инструменты:
# https://www.ssllabs.com/ssltest/
```

### 7.5. Автоматическое Обновление Сертификата

```bash
# Проверьте автоматическое обновление
systemctl status certbot.timer

# Тестовое обновление
certbot renew --dry-run
```

---

## 8. Первичная Настройка и Тестирование

### 8.1. Доступ к Приложению

Откройте в браузере:
- **Главная:** https://alpha.balloo.su
- **Вход:** https://alpha.balloo.su/login
- **Регистрация:** https://alpha.balloo.su/register
- **Installer:** https://alpha.balloo.su/installer

### 8.2. Создание Первого Пользователя

```bash
# Вариант 1: Через веб-интерфейс
# 1. Откройте https://alpha.balloo.su/register
# 2. Зарегистрируйте первого пользователя
# 3. Первый пользователь автоматически становится SuperAdmin

# Вариант 2: Через API
curl -X POST https://alpha.balloo.su/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@balloo.su",
    "password": "ВашСильныйПароль2024!",
    "displayName": "Администратор"
  }'
```

### 8.3. Проверка Страниц

| Страница | URL | Ожидаемый результат |
|----------|-----|---------------------|
| Главная | `/` | Загружается, логотип виден |
| Вход | `/login` | Форма входа |
| Регистрация | `/register` | Форма регистрации |
| Чаты | `/chats` | Список чатов (требуется вход) |
| Installer | `/installer` | Страница установки |
| Поддержка | `/support` | Информация о СБП |
| О компании | `/about-company` | Информация о разработчике |
| Функции | `/features` | Список функций |
| Админка | `/admin` | Требуется вход админа |

### 8.4. Проверка API

```bash
# Проверьте health endpoint
curl https://alpha.balloo.su/api/auth/health

# Проверьте CSRF token
curl https://alpha.balloo.su/api/csrf-token
```

### 8.5. Проверка PWA

1. Откройте `https://alpha.balloo.su` в Chrome
2. F12 → Application → Manifest
3. Проверьте:
   - ✅ name: Balloo Messenger
   - ✅ icons: 192x192, 512x512
   - ✅ start_url: /chats
4. F12 → Application → Service Workers
5. Проверьте: ✅ Registered, ✅ Activated

---

## 9. Мониторинг и Поддержка

### 9.1. PM2 Команды

```bash
# Статус процессов
pm2 status

# Логи приложения
pm2 logs balloo

# Мониторинг ресурсов
pm2 monit

# Перезапуск приложения
pm2 restart balloo

# Остановка приложения
pm2 stop balloo

# Удаление приложения
pm2 delete balloo
```

### 9.2. Логи Nginx

```bash
# Логи доступа
tail -f /var/log/nginx/access.log

# Логи ошибок
tail -f /var/log/nginx/error.log
```

### 9.3. Логи Приложение

```bash
# Логи через PM2
pm2 logs balloo --lines 100

# Или напрямую
tail -f /var/www/balloo/messenger/.next/server/logs/*.log
```

### 9.4. Проверка Сетевых Портов

```bash
# Проверьте открытые порты
ss -tulpn | grep -E "80|443|3000"

# Должно быть:
# 0.0.0.0:80   (Nginx)
# 0.0.0.0:443  (Nginx SSL)
# 127.0.0.1:3000 (Node.js)
```

### 9.5. Фаервол (UFW)

```bash
# Включите фаервол
ufw enable

# Разрешите необходимые порты
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Проверьте статус
ufw status
```

---

## 10. Резервное Копирование

### 10.1. Скрипт Резервного Копирования

Создайте `/usr/local/bin/balloo-backup.sh`:

```bash
#!/bin/bash

# Настройки
BACKUP_DIR="/var/backups/balloo"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/balloo"

# Создайте папку для бэкапов
mkdir -p $BACKUP_DIR

# Создайте архив
tar -czf $BACKUP_DIR/balloo-backup-$DATE.tar.gz \
  $APP_DIR/messenger/.env.production \
  $APP_DIR/messenger/config.json \
  $APP_DIR/messenger/.next

# Удалите старые бэкапы (старше 30 дней)
find $BACKUP_DIR -name "balloo-backup-*.tar.gz" -mtime +30 -delete

echo "Backup created: $BACKUP_DIR/balloo-backup-$DATE.tar.gz"
```

Сделайте скрипт исполняемым:

```bash
chmod +x /usr/local/bin/balloo-backup.sh
```

### 10.2. Настройка Cron

```bash
# Отредактируйте crontab
crontab -e

# Добавьте задачу для ежедневного бэкапа в 2:00
0 2 * * * /usr/local/bin/balloo-backup.sh >> /var/log/balloo-backup.log 2>&1
```

### 10.3. Ручное Резервное Копирование

```bash
# Создайте бэкап
/usr/local/bin/balloo-backup.sh

# Скопируйте бэкап на другой сервер
scp /var/backups/balloo/balloo-backup-*.tar.gz user@backup-server:/backups/
```

### 10.4. Восстановление из Бэкапа

```bash
# Остановите приложение
pm2 stop balloo

# Распакуйте бэкап
tar -xzf balloo-backup-DATE.tar.gz -C /var/www/balloo/

# Перезапустите приложение
pm2 start balloo
```

---

## 🔧 Обновление Приложения

### 11.1. Обновление из Git

```bash
cd /var/www/balloo/messenger

# Получите последние изменения
git pull

# Установите новые зависимости
npm install --production

# Пересоберите приложение
npm run build

# Перезапустите приложение
pm2 restart balloo
```

### 11.2. Обновление вручную

```bash
# Остановите приложение
pm2 stop balloo

# Загрузите новые файлы через SCP/FTP

# Установите зависимости
npm install --production

# Пересоберите
npm run build

# Запустите
pm2 start balloo
```

---

## 🆘 Решение Проблем

### Приложение не запускается

```bash
# Проверьте логи PM2
pm2 logs balloo

# Проверьте порт 3000
ss -tulpn | grep 3000

# Перезапустите
pm2 restart balloo
```

### Nginx не работает

```bash
# Проверьте статус
systemctl status nginx

# Проверьте конфигурацию
nginx -t

# Перезапустите
systemctl restart nginx
```

### SSL сертификат не работает

```bash
# Проверьте сертификат
certbot certificates

# Переустановите
certbot --nginx --reinstall
```

### Приложение медленно работает

```bash
# Проверьте ресурсы
pm2 monit

# Проверьте логи Nginx
tail -f /var/log/nginx/error.log

# Увеличьте количество worker процессов в /etc/nginx/nginx.conf
```

---

## 📞 Контакты и Поддержка

### Beget Support
- **Телефон:** 8 (800) 200-04-04
- **Email:** support@beget.com
- **Чат:** https://beget.com/help

### Let's Encrypt
- **Документация:** https://letsencrypt.org/docs/
- **Certbot:** https://certbot.eff.org/

---

## ✅ Чек-лист Деплоя

- [ ] Node.js 20.x установлен
- [ ] PM2 установлен и настроен
- [ ] Nginx установлен и настроен
- [ ] certbot установлен
- [ ] Домен alpha.balloo.su указывает на IP сервера
- [ ] .env.production создан и заполнен
- [ ] config.json создан и заполнен
- [ ] Приложение собрано (`npm run build`)
- [ ] Приложение запущено через PM2
- [ ] Nginx конфигурирован и запущен
- [ ] SSL сертификат получен и активен
- [ ] HTTPS работает (https://alpha.balloo.su)
- [ ] Первая регистрация успешна
- [ ] PWA работает
- [ ] Резервное копирование настроено

---

**Успешного запуска Balloo Messenger на alpha.balloo.su!** 🎉
