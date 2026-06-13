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

## [2.0.0] - 2026-06-07

### Added

#### Темы оформления
- 3 предустановленные темы: Тёмная, Светлая, Россия
- Кнопка "Все темы" в Header (видна всем пользователям)
- Модальное окно выбора тем с 3 вкладками
- Случайная анимация цвета для кнопки "?" (меняется каждые 7 секунд)
- На теме Россия кнопка "?" показывает флаг России
- **ВАЖНО:** Полностью запрет скруглений (border-radius: 0 везде)
- Пользовательские темы доступны всем (без регистрации)
- Сохранение тем только после 2 дней использования (для авторизованных)

#### Вложения в сообщения
- **Голосования (Polls)**
  - Single/Multiple выбор опций
  - Результаты в реальном времени
  - Текстовые комментарии
  - Анонимные/именные голосования
  - Таймер окончания

- **Тесты (Quizzes)**
  - Пошаговое прохождение вопросов
  - Single/Multiple выбор ответов
  - Таймер на весь тест
  - Подсчёт баллов и процентов
  - Порог прохождения
  - Результаты с возможностью повтора

- **Опросы (Surveys)**
  - Разделы с вопросами
  - 6 типов полей: text, textarea, select, radio, checkbox, rating
  - Валидация обязательных полей
  - Прогресс-бар по разделам

- **Списки (Lists)**
  - Чек-листы с выполнением элементов
  - Прогресс-бар выполнения
  - Сортировка по статусу
  - Назначение исполнителей

#### Бэкенд API
- Контроллер тем: `themes.controller.js`
- Контроллер подписок: `theme-subscriptions.controller.js`
- Контроллер голосований: `polls.controller.js`
- Контроллер тестов: `quizzes.controller.js`
- Контроллер опросов: `surveys.controller.js`
- Контроллер списков: `lists.controller.js`
- Роуты вложений: `attachments.js` (22 endpoint)

#### Типизация
- Единые типы для вложений в `types/index.ts`
- Полная типизация TypeScript
- Синхронизация с schema.sql

### Changed
- Увеличены шрифты названий тем (18px → 28px в модальных окнах)
- Прямоугольная форма всех UI компонентов (border-radius: 0)
- Оптимизирована структура компонентов

### Fixed
- Исправлен `backup/route.ts` - добавлен импорт `getDatabase`
- Исправлен `crypto.ts` - типы Buffer заменены на Uint8Array
- Удалён `create-admin.ts` (критическая ошибка экспорта)
- Удалён `csrf-token/route.ts` (несуществующий функционал)

### Documentation
- Создана документация по критическим требованиям (запрет скруглений)
- Документация по темам оформления
- Прогресс-отчёт проекта
- Итоговая документация по кнопкам тем

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
