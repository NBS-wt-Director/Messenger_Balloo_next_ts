# 🎯 Release Plan - App Balloo (День России 🇷🇺)

**Дедлайн:** 11 июня 2026  
**Текущая дата:** 3 июня 2026  
**Осталось дней:** 8  
**Команда:** 1 человек + AI агент

---

## 📊 Статус проекта

| Компонент | Готовность | Статус |
|-----------|------------|--------|
| **Backend API** | 85% → 100% | 🟡 В работе |
| **Frontend Web** | 85% | 🟡 В работе |
| **Mobile App** | 35% | ⏸️ Отложено (25 июня) |
| **Desktop App** | 40% | ⏸️ Отложено (25 июня) |
| **Infrastructure** | 75% | 🟡 В работе |

---

## 🗓️ План на 8 дней

| День | Дата | Задачи | Статус |
|------|------|--------|--------|
| **День 1** | 03-04 июня | PostgreSQL + Migration | ✅ Выполнено |
| **День 2** | 04-05 июня | SSL + Secrets + Pooling | 🟡 В работе |
| **День 3** | 05-06 июня | Auth + Chats UI | ⬜ Не начато |
| **День 4** | 06-07 июня | Chat + E2E | ⬜ Не начато |
| **День 5** | 07-08 июня | Push + PWA + Testing | ⬜ Не начато |
| **День 6** | 08-09 июня | Deploy + Monitoring | ⬜ Не начато |
| **День 7** | 09-10 июня | Load + Security | ⬜ Не начато |
| **День 8** | 10 июня | Final + Release | ⬜ Не начато |

---

## 🔴 ЭТАП 1: Backend API (100% к 5 июня)

### PostgreSQL Migration ✅

- [x] Установить PostgreSQL 15 (Docker) ✅
- [x] Создать схему БД (25 таблиц) ✅
- [x] Написать скрипт миграции `api/scripts/migrate-to-pg.js` ✅
- [ ] Протестировать миграцию данных ⬜
- [x] Написать скрипт backup-postgres.sh ✅
- [ ] Написать rollback plan ⬜

### SSL/TLS

- [ ] Купить/подключить домен (api.balloo.ru, app.balloo.ru)
- [ ] Настроить DNS записи
- [ ] Получить сертификат Let's Encrypt
- [ ] Настроить Nginx SSL
- [ ] Настроить автообновление сертификата

### Secrets Management 🟡

- [x] Создать директорию `secrets/` ✅
- [ ] Перенести секреты из `.env` в файлы ⬜
- [x] Обновить `docker-compose.yml` ✅
- [ ] Настроить CI/CD для передачи секретов ⬜

### Connection Pooling

- [ ] Установить PgBouncer
- [ ] Настроить `pool_size`, `max_connections`
- [ ] Обновить `DATABASE_URL`
- [ ] Протестировать под нагрузкой

### Security Audit

- [ ] `npm audit --fix`
- [ ] Установить и настроить Snyk/Dependabot
- [ ] Запустить SAST (SonarQube)
- [ ] Исправить критичные уязвимости

### Monitoring

- [ ] Настроить Prometheus endpoint
- [ ] Настроить Grafana дашборды (опционально)
- [ ] Настроить алерты

---

## 🟡 ЭТАП 2: Frontend Web (100% к 8 июня)

### Auth

- [ ] Экран Login (полная валидация)
- [ ] Экран Register (полная валидация)
- [ ] Экран 2FA (TOTP + SMS)
- [ ] Экран Forgot Password

### Chats

- [ ] Экран Chats List (real-time + pull-to-refresh)
- [ ] Индикаторы онлайн/офлайн
- [ ] Индикаторы непрочитанных сообщений

### Chat

- [ ] Экран Chat (отправка/получение)
- [ ] E2E encryption (интеграция)
- [ ] Отправка файлов
- [ ] Реакции на сообщения
- [ ] Read receipts

### Settings

- [ ] Экран Profile
- [ ] Экран Notifications
- [ ] Экран Privacy (2FA, блокировки)

### PWA + Push

- [ ] PWA manifest
- [ ] Service worker
- [ ] Offline mode
- [ ] Web push notifications

### Testing

- [ ] UI/UX тестирование
- [ ] Cross-browser тестирование
- [ ] Performance тестирование

---

## 🟢 ЭТАП 3: Deploy + Testing (100% к 10 июня)

### Production Deploy

- [ ] Настроить `docker-compose.production.yml`
- [ ] Настроить CI/CD pipeline
- [ ] Настроить health checks
- [ ] Настроить автоматические бэкапы

### Load Testing

- [ ] Написать сценарии k6
- [ ] Протестировать 1000 concurrent users
- [ ] Оптимизировать узкие места

### Security Testing

- [ ] DAST сканирование (OWASP ZAP)
- [ ] Penetration testing (базовый)
- [ ] Проверка rate limiting
- [ ] Проверка CORS

---

## 📦 ЭТАП 4: Release (11 июня)

### Final Checks

- [ ] Smoke testing всех endpoints
- [ ] Проверка SSL (SSL Labs)
- [ ] Проверка WebSocket (WSS)
- [ ] Проверка Push notifications
- [ ] Проверка E2E encryption

### Documentation

- [ ] Обновить README.md
- [ ] Написать CHANGELOG.md
- [ ] Написать RELEASE_NOTES.md
- [ ] Написать USER_GUIDE.md

### Release

- [ ] Создать релиз на GitHub
- [ ] Deploy на production
- [ ] Отправить уведомление стейкхолдерам

---

## 📁 Структура файлов

```
app_balloo/
├── RELEASE_PLAN.md          # Этот файл (план)
├── CHANGELOG.md             # История изменений
├── RELEASE_NOTES.md         # Примечания к релизу
├── README.md                # Обновить
├── docker-compose.yml       # Основной
├── docker-compose.production.yml  # Production
├── .env.example             # Пример конфига
├── secrets/                 # Секреты (не в git!)
│   ├── db_password.txt
│   ├── jwt_secret.txt
│   └── redis_password.txt
├── api/
│   ├── scripts/
│   │   ├── migrate-to-pg.js    # Миграция
│   │   └── backup.js           # Бэкап
│   └── src/
│       └── config/
│           └── database.js     # PostgreSQL
└── docs/
    ├── DEPLOYMENT.md           # Инструкция по деплою
    └── MIGRATION.md            # Инструкция по миграции
```

---

## 📝 Лог изменений (заполняется по ходу)

| Дата | Автор | Задача | Статус |
|------|-------|--------|--------|
| 03-06-2026 | AI Agent | PostgreSQL setup | ✅ Выполнено |
| 03-06-2026 | AI Agent | Migration script | ✅ Выполнено |
| 03-06-2026 | AI Agent | Backup script | ✅ Выполнено |
| 03-06-2026 | AI Agent | docker-compose update | ✅ Выполнено |
| 03-06-2026 | AI Agent | Deployment docs | ✅ Выполнено |
| 04-06-2026 | AI Agent | SSL setup | ⬜ В работе |
| 04-06-2026 | AI Agent | Secrets management | ⬜ В работе |
| 05-06-2026 | AI Agent | Connection pooling | ⬜ Не начато |
| ... | ... | ... | ... |

---

## ⚠️ Known Issues

| Проблема | Статус | Решение |
|----------|--------|---------|
| SQLite in-memory | 🔴 Критично | PostgreSQL migration |
| Нет SSL | 🔴 Критично | Let's Encrypt |
| Секреты в .env | 🟡 Важно | Docker secrets |
| Mobile не успеем | 🟢 Низкое | Отложить на 25 июня |

---

## 🚀 Quick Start (для разработчика)

```bash
# 1. Клонировать
git clone <repo-url>
cd app_balloo

# 2. Настроить секреты
mkdir secrets
echo "your-secure-password" > secrets/db_password.txt
echo "your-jwt-secret" > secrets/jwt_secret.txt

# 3. Запустить PostgreSQL
docker-compose up -d postgres

# 4. Запустить миграцию
cd api && node scripts/migrate-to-pg.js

# 5. Запустить API
cd .. && docker-compose up -d api

# 6. Проверить
curl http://localhost:3001/health
```

---

**Последнее обновление:** 03-06-2026 12:00  
**Следующее обновление:** 03-06-2026 18:00
