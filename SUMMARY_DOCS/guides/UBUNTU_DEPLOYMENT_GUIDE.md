---
title: Ubuntu Deployment Guide — Balloo Platform
description: Пошаговая инструкция по развёртыванию Balloo на Ubuntu 22.04
version: 1.0.0
date: 2026-06-14
author: Koda (NLP-Core-Team)
status: active
audience: devops
tags:
  - deployment
  - ubuntu
  - docker
  - phase1
related_docs:
  - SUMMARY_DOCS/BALLOO_BUILD_SPEC.md
  - SUMMARY_DOCS/IMPLEMENTATION_ROADMAP.md
---

# 🚀 UBUNTU DEPLOYMENT GUIDE (BALLOO PLATFORM)

**Версия:** 1.0.0  
**Дата:** 2026-06-14  
**OS:** Ubuntu 22.04 LTS  
**Статус:** Active

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Требования

- [ ] Сервер Ubuntu 22.04 LTS (минимум 4 CPU, 8GB RAM, 50GB disk)
- [ ] Домен balloo.su настроен на IP сервера
- [ ] SSH доступ с root правами
- [ ] Email для SSL сертификата
- [ ] Yandex OAuth credentials (client-id, secret)
- [ ] Android устройство для SMS-узла

---

## 🔧 ШАГ 1: ПОДГОТОВКА СЕРВЕРА

### 1.1 Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

### 1.2 Создание пользователя balloo

```bash
sudo adduser balloo
sudo usermod -aG sudo balloo
su - balloo
```

### 1.3 Настройка firewall

```bash
sudo ufw enable
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000-3010/tcp  # App ports
sudo ufw status
```

---

## 🐳 ШАГ 2: УСТАНОВКА DOCKER

### 2.1 Установка Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker balloo
```

### 2.2 Установка Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### 2.3 Проверка Docker

```bash
docker run hello-world
```

---

## 🗄️ ШАГ 3: УСТАНОВКА POSTGRESQL + REDIS

### 3.1 PostgreSQL 15

```bash
sudo apt install -y postgresql-15 postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 3.2 Создание БД и пользователя

```bash
sudo -u postgres psql

CREATE DATABASE balloo;
CREATE USER balloo WITH PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE balloo TO balloo;
\c balloo
GRANT ALL ON SCHEMA public TO balloo;
\q
```

### 3.3 Redis 7

```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
sudo systemctl status redis-server
```

### 3.4 Проверка подключения

```bash
# PostgreSQL
psql -h localhost -U balloo -d balloo

# Redis
redis-cli ping  # Должен ответить: PONG
```

---

## 🔒 ШАГ 4: SSL СЕРТИФИКАТ (LET'S ENCRYPT)

### 4.1 Установка Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2 Получение сертификата

```bash
sudo certbot certonly --standalone -d balloo.su -d www.balloo.su
```

### 4.3 Проверка автообновления

```bash
sudo certbot renew --dry-run
```

### 4.4 Настройка Nginx (опционально)

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 📦 ШАГ 5: КЛОНИРОВАНИЕ РЕПОЗИТОРИЯ

```bash
cd ~
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git balloo
cd balloo
```

---

## ⚙️ ШАГ 6: НАСТРОЙКА .ENV ФАЙЛА

```bash
cp .env.example .env
nano .env
```

### .env содержимое:

```bash
# Database
DB_PASSWORD=YOUR_SECURE_PASSWORD
DATABASE_URL=postgresql://balloo:YOUR_SECURE_PASSWORD@localhost:5432/balloo

# Redis
REDIS_URL=redis://localhost:6379

# Yandex OAuth
YANDEX_CLIENT_ID=your-yandex-client-id
YANDEX_CLIENT_SECRET=your-yandex-client-secret
YANDEX_REDIRECT_URI=https://balloo.su/auth/yandex/callback

# Email (Yandex SMTP)
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=your-yandex-email@yandex.ru
SMTP_PASSWORD=your-yandex-app-password
SMTP_FROM=noreply@balloo.su

# Creator Superadmin
CREATOR_EMAIL=o8eryuhtin@yandex.ru
CREATOR_PHONE=+79292167585
CREATOR_PASSWORD=YOUR_ADMIN_PASSWORD

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# App URLs
BALLOO_URL=https://balloo.su
MESSENGER_URL=https://messenger.balloo.su
ADMIN_URL=https://admin.balloo.su

# Android SMS-Node
SMS_API_URL=https://api.working.balloo.su/sms
SMS_API_TOKEN=your-sms-api-token

# Yandex Disk
YANDEX_DISK_TOKEN=your-yandex-disk-oauth-token
YANDEX_DISK_FOLDER=/balloo-storage
```

---

## 🐳 ШАГ 7: DOCKER COMPOSE DEPLOY

### 7.1 Создание docker-compose.yml

```bash
nano docker-compose.yml
```

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: balloo-postgres
    restart: always
    environment:
      POSTGRES_DB: balloo
      POSTGRES_USER: balloo
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    networks:
      - balloo-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U balloo"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: balloo-redis
    restart: always
    volumes:
      - redis_data:/data
    ports:
      - "127.0.0.1:6379:6379"
    networks:
      - balloo-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  balloo:
    build:
      context: ./balloo
      dockerfile: Dockerfile
    container_name: balloo-main
    restart: always
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - NODE_ID=balloo.su
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "3000:3000"
    networks:
      - balloo-network

  messenger:
    build:
      context: ./messenger
      dockerfile: Dockerfile
    container_name: balloo-messenger
    restart: always
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - NODE_ID=messenger.balloo.su
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "3001:3000"
    networks:
      - balloo-network

  admin:
    build:
      context: ./admin
      dockerfile: Dockerfile
    container_name: balloo-admin
    restart: always
    environment:
      - NODE_ENV=production
      - NODE_ID=admin.balloo.su
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "3002:3000"
    networks:
      - balloo-network

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: balloo-api
    restart: always
    environment:
      - NODE_ENV=production
      - NODE_ID=api.working.balloo.su
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "3003:3000"
    networks:
      - balloo-network

  workdocs:
    build:
      context: ./workdocs
      dockerfile: Dockerfile
    container_name: balloo-workdocs
    restart: always
    environment:
      - NODE_ENV=production
      - NODE_ID=workdocs.working.balloo.su
    ports:
      - "3004:3000"
    networks:
      - balloo-network

  kodegen:
    build:
      context: ./kodegen
      dockerfile: Dockerfile
    container_name: balloo-kodegen
    restart: always
    environment:
      - NODE_ENV=production
      - NODE_ID=kodegen.working.balloo.su
    ports:
      - "3005:3000"
    networks:
      - balloo-network

  nodes-switcher:
    build:
      context: ./nodes-switcher
      dockerfile: Dockerfile
    container_name: balloo-nodes-switcher
    restart: always
    environment:
      - NODE_ENV=production
      - NODE_ID=nodes-switcher.working.balloo.su
    ports:
      - "3006:3000"
    networks:
      - balloo-network

  working:
    build:
      context: ./working
      dockerfile: Dockerfile
    container_name: balloo-working
    restart: always
    environment:
      - NODE_ENV=production
      - NODE_ID=working.balloo.su
    ports:
      - "3007:3000"
    networks:
      - balloo-network

volumes:
  postgres_data:
  redis_data:

networks:
  balloo-network:
    driver: bridge
```

### 7.2 Запуск сервисов

```bash
docker-compose up -d --build
```

### 7.3 Проверка статуса

```bash
docker-compose ps
docker-compose logs -f
```

### 7.4 Остановка сервисов

```bash
docker-compose down
```

### 7.5 Перезапуск

```bash
docker-compose restart
```

---

## 📱 ШАГ 8: ANDROID SMS-УЗЕЛ

### 8.1 Сборка APK

```bash
cd android-sms-node
npm install
npx react-native build-android --release
```

### 8.2 Установка на Android устройство

```bash
adb install app/build/outputs/apk/release/app-release.apk
```

### 8.3 Настройка приложения

1. Открыть приложение на Android
2. Ввести API endpoint: `https://api.working.balloo.su/sms`
3. Ввести auth token
4. Предоставить разрешение на отправку SMS
5. Запустить background service

---

## ☁️ ШАГ 9: YANDEX DISK OAUTH

### 9.1 Создание OAuth приложения

1. Перейти на https://oauth.yandex.ru/client/new
2. Создать новое приложение
3. Выбрать права:
   - login:email
   - login:info
   - disk:app_folder.files

### 9.2 Получение токена

```bash
curl -X POST https://oauth.yandex.ru/token \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

### 9.3 Добавление в .env

```bash
YANDEX_DISK_TOKEN=your-oauth-token
```

---

## 📊 ШАГ 10: MONITORING

### 10.1 Проверка логов

```bash
# Все логи
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f messenger
```

### 10.2 Мониторинг ресурсов

```bash
# Docker stats
docker stats

# System resources
htop
df -h
free -h
```

### 10.3 Health checks

```bash
# PostgreSQL
docker exec balloo-postgres pg_isready -U balloo

# Redis
docker exec balloo-redis redis-cli ping

# App health
curl http://localhost:3000/health
curl http://localhost:3001/health
```

---

## 🔧 TROUBLESHOOTING

### Проблема: Docker не запускается

```bash
sudo systemctl status docker
sudo systemctl restart docker
```

### Проблема: PostgreSQL недоступен

```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT 1"
```

### Проблема: SSL сертификат не работает

```bash
sudo certbot certificates
sudo certbot renew
```

### Проблема: Порты заняты

```bash
sudo lsof -i :3000
sudo systemctl stop <service>
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] Все 8 сервисов запущены (`docker-compose ps`)
- [ ] PostgreSQL доступен
- [ ] Redis доступен
- [ ] SSL сертификат активен
- [ ] Yandex OAuth работает
- [ ] Android SMS-узел подключён
- [ ] Яндекс.Диск интегрирован
- [ ] Health checks проходят
- [ ] Логи в порядке
- [ ] Пользователи могут регистрироваться

---

## 📞 SUPPORT

**Email:** o8eryuhtin@yandex.ru  
**GitHub:** https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts  
**Documentation:** https://balloo.su/docs

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 1.0.0  
**Статус:** Active
