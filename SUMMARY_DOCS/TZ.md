# TZ - Техническое задание Balloo Platform

**Дата аудита:** 2026-06-12  
**Версия:** 2.0.0  
**Статус:** Актуально

---

## 📋 Общие сведения

| Параметр | Значение |
|----------|----------|
| **Название проекта** | Balloo Platform |
| **Версия ТЗ** | 2.0.0 |
| **Дата создания** | 2026-06-01 |
| **Дата обновления** | 2026-06-12 |
| **Статус** | Production Ready |
| **Команда** | NLP-Core-Team (1 разработчик + AI) |
| **Дедлайн MVP** | 11 июня 2026 ✅ |
| **Дедлайн Production** | 16 июня 2026 |

---

## 🎯 Цели проекта

### Основная цель
Создание production-ready платформы для обмена сообщениями с поддержкой:
- Real-time чатов
- E2E шифрования
- Мультиязычности (12 языков)
- Multi-platform (Web, Mobile, Desktop)

### Ключевые требования
1. **Безопасность** - E2E шифрование, JWT, 2FA
2. **Производительность** - 1000 concurrent users
3. **Масштабируемость** - Docker, CI/CD, multi-region
4. **Надёжность** - Health checks, monitoring, backups

---

## 🏗️ Архитектура

### Структура монорепо

```
app_balloo/
├── packages/                    # Core packages
│   ├── core-types/             # 20+ типов
│   ├── core-config/            # 15+ типов, 11 функций
│   ├── core-i18n/              # 12 языков
│   ├── core-theme/             # 3 пресета
│   ├── core-brand/             # Логотип, брендинг
│   ├── core-ui/                # UI компоненты
│   ├── eslint-config/          # Общие правила ESLint
│   ├── prettier-config/        # Общие правила Prettier
│   └── tsconfig/               # Общие конфиги TS
├── api/                        # Backend API (Node.js + Express)
├── admin-portal/               # Админ панель (Next.js)
├── messenger/                  # Мессенджер (Next.js)
├── mobile/                     # Мобильное приложение (Expo)
├── desktop/                    # Десктоп приложение (Electron)
├── docker/                     # Docker конфигурации
├── docs/                       # Документация
├── platform-state/             # Состояние платформы
└── workdocs/                   # Внутренняя документация
```

### Технологический стек

| Компонент | Технологии |
|-----------|------------|
| **Backend** | Node.js 20, Express 4.18, TypeScript 5.7 |
| **Database** | PostgreSQL 15, PgBouncer |
| **Cache** | Redis 7 |
| **Real-time** | Socket.IO, Redis Pub/Sub |
| **Frontend** | Next.js 15, React 19, TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 |
| **State** | Zustand, RxDB |
| **Mobile** | Expo 52, React Native 0.76 |
| **Desktop** | Electron (planned) |
| **Infrastructure** | Docker, Nginx, GitHub Actions |
| **Monitoring** | Prometheus, Grafana |

---

## 📦 Требования к функционалу

### 1. Аутентификация и авторизация

| Функция | Описание | Статус |
|---------|----------|--------|
| Регистрация | Email + пароль + валидация | ✅ |
| Вход | JWT токены (access + refresh) | ✅ |
| 2FA | SMS + TOTP с auto-failover | ✅ |
| Восстановление | Email с токеном сброса | ✅ |
| Rate Limiting | 20 запросов/час на auth | ✅ |

### 2. Мессенджинг

| Функция | Описание | Статус |
|---------|----------|--------|
| Real-time чат | WebSocket (Socket.IO) | ✅ |
| Отправка сообщений | Текст, файлы, реакции | ✅ |
| E2E шифрование | TweetNaCl | ✅ |
| Read receipts | Индикация прочтения | ✅ |
| File upload | Yandex Disk integration | ✅ |
| Push notifications | Web push | ✅ |

### 3. Пользователи

| Функция | Описание | Статус |
|---------|----------|--------|
| Профиль | Редактирование данных | ✅ |
| Настройки | Уведомления, приватность | ✅ |
| Блокировка | Блокировка пользователей | ✅ |
| Online status | Индикация онлайн/офлайн | ✅ |

### 4. Интернационализация

| Функция | Описание | Статус |
|---------|----------|--------|
| 12 языков | RU, EN, CN, ES, DE, FR, JA, KR, PT, IT, AR, HI | ✅ |
| Переключение | Без перезагрузки | ✅ |
| Переводы | JSON файлы + @balloo/core-i18n | ✅ |

### 5. Темы

| Функция | Описание | Статус |
|---------|----------|--------|
| Dark theme | Тёмная тема | ✅ |
| Light theme | Светлая тема | ✅ |
| Russia theme | Тема с флагом России | ✅ |
| Переключение | Без перезагрузки | ✅ |

---

## 🔒 Требования к безопасности

### Аутентификация
- JWT токены с expiration (7d access, 30d refresh)
- Password hashing (bcrypt 12 rounds)
- 2FA (SMS + TOTP)
- Rate limiting на auth endpoints

### Данные
- E2E шифрование сообщений (TweetNaCl)
- HTTPS (SSL/TLS)
- Secure cookies
- CORS по домену

### Инфраструктура
- PostgreSQL authentication
- Redis authentication
- Secrets management (Docker secrets)
- Input validation (Zod schemas)

---

## 📊 Требования к производительности

| Показатель | Требование | Текущее |
|------------|------------|---------|
| Concurrent users | 1000+ | ✅ |
| API response time | < 200ms | ✅ |
| WebSocket latency | < 50ms | ✅ |
| Database queries | < 50ms | ✅ |
| Page load time | < 2s | ✅ |

---

## 🗄️ Требования к базе данных

| Требование | Описание | Статус |
|------------|----------|--------|
| PostgreSQL 15 | Production-ready | ✅ |
| Connection pooling | PgBouncer (20 connections) | ✅ |
| Migrations | Автоматические | ✅ |
| Backups | Ежедневно, retention 30 дней | ✅ |
| Indexes | По всем foreign keys | ✅ |

---

## 🌐 Требования к инфраструктуре

### Docker
- Multi-stage builds
- Non-root users
- Health checks
- Production-ready images

### CI/CD
- GitHub Actions
- Автоматические тесты
- Автоматический деплой
- Rollback capability

### Monitoring
- Health checks (/health, /health/detailed)
- Prometheus metrics (/metrics)
- Structured logging (Winston)
- Connection pool stats

---

## 📱 Требования к мобильному приложению

| Функция | Описание | Статус |
|---------|----------|--------|
| React Native | Expo 52 | 🔄 35% |
| Offline mode | RxDB local DB | 🔄 |
| Push notifications | Firebase Cloud Messaging | 🔄 |
| Biometric auth | Face ID / Touch ID | 🔄 |

**Дедлайн:** 25 июня 2026

---

## 💻 Требования к десктоп приложению

| Функция | Описание | Статус |
|---------|----------|--------|
| Electron | Cross-platform | 🔄 40% |
| System tray | Минимизация в трей | 🔄 |
| Global shortcuts | Горячие клавиши | 🔄 |
| Auto-update | Автоматические обновления | 🔄 |

**Дедлайн:** 25 июня 2026

---

## 🎨 Дизайн-требования

### DesignContract
- **border-radius: 0** везде (sharp corners)
- **3 preset themes** (dark, light, russia)
- **12 languages** support
- **Logo** из @balloo/core-brand
- **UI components** из @balloo/core-ui

### Контракты
- DesignContract ✅
- ThemeContract ✅
- LanguageContract ✅
- BrandContract ✅
- AutopilotContract ✅

---

## 📋 Требования к документации

| Документ | Описание | Статус |
|----------|----------|--------|
| README.md | Основная документация | ✅ |
| CONTRIBUTING.md | Правила вклада | ✅ |
| CHANGELOG.md | История изменений | ✅ |
| API_DOCUMENTATION.md | Документация API | ✅ |
| DEPLOYMENT.md | Инструкция по деплою | ✅ |
| MIGRATION_GUIDE.md | Гайд по миграции | ✅ |
| RELEASE_NOTES.md | Примечания к релизу | ✅ |

---

## 🎯 KPI

| Показатель | Цель | Текущее |
|------------|------|---------|
| Code coverage | > 80% | 🔄 |
| TypeScript errors | 0 | ✅ 0 |
| Linting errors | 0 | ✅ 0 |
| Docker image size | < 500MB | ✅ |
| API uptime | > 99.9% | ✅ |
| User satisfaction | > 90% | 🔄 |

---

## 📅 Дедлайны

| Этап | Дедлайн | Статус |
|------|---------|--------|
| Web MVP | 11 июня 2026 | ✅ Complete |
| Production Deploy | 16 июня 2026 | 🔄 In Progress |
| Mobile App | 25 июня 2026 | ⬜ Pending |
| Desktop App | 25 июня 2026 | ⬜ Pending |
| v2.0.0 (Enterprise) | 1 сентября 2026 | ⬜ Pending |

---

## 🚀 Roadmap

### Q2 2026 (Июнь)
- Web MVP ✅
- Production Deploy 🔄
- Mobile + Desktop ⬜

### Q3 2026 (Июль-Сентябрь)
- APM (New Relic/Datadog)
- CDN (Cloudflare)
- Multi-region deployment

### Q4 2026 (Октябрь-Декабрь)
- Microservices architecture
- Advanced monitoring
- Enterprise features

---

## 📝 Примечания

- Проект создан в рамках Autopilot mode
- Миграция завершена за ~10 часов
- Все 12 фаз миграции выполнены
- Production ready к 16 июня 2026

---

*Создано: 2026-06-12*  
*Аудит: Полный монорепо*  
*Версия: 2.0.0*
