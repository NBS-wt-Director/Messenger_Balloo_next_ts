# 🎉 Release Notes - App Balloo v1.0.0

**Дата релиза:** 2026-06-11  
**Версия:** 1.0.0  
**Статус:** Production Ready

---

## 🎯 Что нового в v1.0.0

### Основные улучшения

#### 🗄️ База данных
- **PostgreSQL 15** вместо SQLite (production-ready)
- **Connection pooling** через PgBouncer (20 connections, 1000 max clients)
- **Автоматические бэкапы** (каждый день, retention 30 дней)
- **Миграция данных** из SQLite с полным сохранением

#### 🔐 Безопасность
- **PostgreSQL authentication** (secure password)
- **JWT tokens** с expiration (7d access, 30d refresh)
- **Password hashing** bcrypt 12 rounds
- **E2E encryption** для всех сообщений (TweetNaCl)
- **Rate limiting** (Global: 100/15min, Auth: 20/hour, SMS: 10/hour)
- **Input validation** Zod schemas для всех endpoints
- **CORS** configurable по домену

#### 📡 Real-time
- **WebSocket** с Redis Pub/Sub (multi-instance ready)
- **Push notifications** (web-push для PWA)
- **Smart 2FA Router** (SMS → Bot → TOTP с auto-failover)
- **Job queues** через Bull (асинхронная обработка)

#### 📊 Мониторинг
- **Health checks**: `/health`, `/health/detailed`, `/health/ready`, `/health/live`
- **Prometheus metrics**: `/metrics` (text/plain)
- **Structured logging** (Winston JSON format)
- **Connection pool stats**

#### 🏗️ Infrastructure
- **Docker Compose** (PostgreSQL, Redis, PgBouncer, API, Max SMS, Nginx)
- **SSL/TLS ready** (Let's Encrypt интеграция)
- **CI/CD pipeline** (GitHub Actions)
- **Rollback plan** для миграции

---

## 📦 Компоненты

### Backend API (v1.0.0)
- Node.js 18+ + Express 4.18.2
- PostgreSQL 15 + PgBouncer
- Redis 7
- Bull 4.12 (job queues)
- Socket.IO (WebSocket)
- 25+ controllers
- 9 services (SMS, Email, Storage, Queue, etc.)

### Frontend Web (v1.0.0)
- Next.js 15 + React 19
- TypeScript 5.7
- Tailwind CSS 3.4
- Zustand (state)
- RxDB (local DB)
- PWA support

### Mobile App (v0.35.0)
- Expo 52 + React Native 0.76
- TypeScript 5.7
- React Navigation 7.0
- **Статус:** Development (релиз 25.06.2026)

### Desktop App (v0.40.0)
- Electron (planned)
- **Статус:** Planning (релиз 25.06.2026)

---

## 🚀 Быстрый старт

### Требования
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (для разработки)

### Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/your-org/app_balloo.git
cd app_balloo

# 2. Настроить .env
cp api/.env.example api/.env
nano api/.env  # Отредактировать секреты

# 3. Запустить все сервисы
docker-compose up -d

# 4. Запустить миграцию (если есть данные из SQLite)
cd api
node scripts/migrate-to-pg.js

# 5. Проверить здоровье
curl http://localhost:3001/health
curl http://localhost:3001/health/detailed

# 6. Получить SSL (production)
docker-compose run --rm nginx certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d api.balloo.ru \
  -d app.balloo.ru
```

---

## ⚙️ Конфигурация

### Основные переменные окружения

```bash
# Database
DATABASE_URL=postgresql://balloo:YOUR_PASSWORD@pgbouncer:6432/balloo_production
DB_POOL_SIZE=20

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=YOUR_64_CHAR_SECRET_KEY
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://app.balloo.ru

# Storage
STORAGE_PROVIDER=yandex
```

---

## 📈 Метрики

### Health Check
```bash
# Simple
curl http://localhost:3001/health

# Detailed (PostgreSQL, Redis, WebSocket, Max Server)
curl http://localhost:3001/health/detailed

# Readiness (Kubernetes)
curl http://localhost:3001/health/ready

# Liveness (Kubernetes)
curl http://localhost:3001/health/live
```

### Prometheus Metrics
```bash
# JSON format
curl http://localhost:3001/metrics

# Prometheus format
curl -H "Accept: text/plain" http://localhost:3001/metrics
```

---

## 🐛 Known Issues

### Mobile App
- **Статус:** Development
- **Релиз:** 25.06.2026
- **Причина:** Приоритет Web MVP к 11.06

### Desktop App
- **Статус:** Planning
- **Релиз:** 25.06.2026
- **Причина:** Приоритет Web MVP к 11.06

### PostgreSQL Migration
- **Риск:** Потеря данных при сбое
- **Mitigation:** Полные бэкапы перед миграцией
- **Rollback:** `docs/ROLLBACK_PLAN.md`

---

## 🔒 Security Notes

### Обязательные действия перед production

1. **Сменить все пароли по умолчанию**
   - DB_PASSWORD в docker-compose.yml
   - JWT_SECRET в .env
   - MAX_SERVER_API_KEY в .env

2. **Настроить SSL/TLS**
   - Let's Encrypt сертификаты
   - Навсегда HTTPS

3. **Настроить бэкапы**
   - Cron для pg_dump
   - Хранить вне сервера

4. **Настроить мониторинг**
   - Алерты для health checks
   - Prometheus + Grafana

---

## 📚 Документация

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Docker Deployment](docs/DOCKER_DEPLOYMENT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [SSL Setup](docs/SSL_SETUP.md)
- [Migration Guide](docs/MIGRATION_GUIDE.md)
- [Rollback Plan](docs/ROLLBACK_PLAN.md)

---

## 🙏 Благодарности

**Команда разработки:**
- NLP-Core-Team
- 1 разработчик + AI агент

**Технологии:**
- Node.js, Express, PostgreSQL, Redis
- Next.js, React, TypeScript
- Docker, Nginx, Let's Encrypt
- Bull, Socket.IO, Zod

---

## 📞 Поддержка

**Проблемы и предложения:**
- GitHub Issues
- Документация в /docs

**Контакты команды:**
- NLP-Core-Team

---

## 🎯 Roadmap

### Q2 2026 (Июнь)
- [x] Web MVP (11.06)
- [ ] Mobile App (25.06)
- [ ] Desktop App (25.06)

### Q3 2026 (Июль-Сентябрь)
- [ ] APM (New Relic/Datadog)
- [ ] CDN (Cloudflare)
- [ ] Multi-region deployment

### Q4 2026 (Октябрь-Декабрь)
- [ ] Microservices architecture
- [ ] Advanced monitoring
- [ ] Enterprise features

---

**Спасибо за использование App Balloo!** 🎉

**Сделано с ❤️ командой NLP-Core-Team**  
**В подарок Родине ко Дню России! 🇷🇺**
