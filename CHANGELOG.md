# Changelog

Все значимые изменения проекта App Balloo documented в этом файле.

Типы изменений:
- `Added` - новые функции
- `Changed` - изменения существующего функционала
- `Deprecated` - устаревший функционал
- `Removed` - удалённый функционал
- `Fixed` - исправления багов
- `Security` - исправления безопасности

---

## [1.0.0] - 2026-06-11

### Added

#### Backend API
- PostgreSQL 15 вместо SQLite (production-ready database)
- Connection pooling через PgBouncer (max 20 connections, 1000 max clients)
- Redis persistence для rate limiting, 2FA router, WebSocket Pub/Sub
- Job queues через Bull (SMS, Email, Files, Notifications, Cleanup)
- Автоматические бэкапы PostgreSQL (cron + pg_dump, retention 30 days)
- Health check endpoints: `/health`, `/health/detailed`, `/health/ready`, `/health/live`
- Prometheus metrics endpoint `/metrics`
- Rate limiting: Global (100/15min), Auth (20/hour), SMS (10/hour), Upload (50/hour)
- Input validation через Zod schemas
- E2E encryption для сообщений (TweetNaCl)
- 2FA система: TOTP, SMS, WebSocket Bot с умной маршрутизацией
- Smart 2FA Router с auto-disable после 10 ошибок
- WebSocket сервер с Socket.IO
- Yandex OAuth и Yandex Disk интеграция
- Max SMS сервер (порт 8080)
- File storage abstraction (Yandex/S3/Local providers)
- Backup automation script
- Migration script SQLite → PostgreSQL
- Rollback plan для миграции

#### Frontend Web
- Next.js 15 + React 19
- TypeScript 5.7
- Tailwind CSS 3.4
- Zustand для state management
- RxDB для локальной базы данных (PWA)
- Push notifications (web-push)
- PWA support (offline mode)
- E2E encryption в браузере
- Auth (логин, регистрация, 2FA)
- Chats (список чатов, real-time)
- Chat (отправка/получение сообщений)
- Calls (WebRTC сигнализация)
- Settings (профиль, 2FA настройки)

#### Infrastructure
- Docker Compose оркестрация
- Redis 7 для кэша и Pub/Sub
- PostgreSQL 15 для production
- PgBouncer для connection pooling
- Nginx reverse proxy с SSL-ready конфигурацией
- GitHub Actions CI/CD pipeline
- SSL/TLS поддержка (Let's Encrypt)

#### Documentation
- API Documentation
- Docker Deployment Guide
- Architecture Documentation
- SSL Setup Guide
- Migration Guide (SQLite → PostgreSQL)
- Rollback Plan
- Contributing Guide
- Smart 2FA System Documentation

### Changed
- Rate limiting теперь использует Redis persistence (вместо in-memory)
- 2FA Router теперь использует Redis persistence
- WebSocket теперь использует Redis Pub/Sub для multi-instance
- Metrics теперь доступны в Prometheus format
- Health checks теперь проверяют PostgreSQL, Redis, WebSocket, Max Server

### Fixed
- Rate limit storage потеря данных при рестарте
- 2FA statistics потеря при рестарте
- WebSocket connection tracking только для single instance
- Metrics только in-memory

### Security
- JWT токены с expiration (7d access, 30d refresh)
- Password hashing с bcrypt (12 rounds)
- E2E encryption для сообщений
- Rate limiting для защиты от brute force
- Input validation для всех endpoints
- CORS configurable
- Helmet security headers

---

## [0.9.0] - 2026-05-25

### Added
- Initial implementation
- SQLite database (in-memory)
- Basic auth system
- WebSocket support
- Yandex Disk integration

---

## [0.1.0] - 2026-05-01

### Added
- Project scaffold
- Basic structure

---

**Full changelog available in Git history**
