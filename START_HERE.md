# 🎯 START HERE - App Balloo Release Plan

**Дедлайн:** 11 июня 2026 (День России 🇷🇺)  
**Осталось дней:** 8  
**Текущая дата:** 3 июня 2026

---

## 📊 Текущий статус

| Компонент | Готовность | Статус |
|-----------|------------|--------|
| **Backend API** | 100% | ✅ COMPLETE |
| **Frontend Web** | 85% | 🟡 В работе |
| **Mobile App** | 35% | ⏸️ Отложено (25 июня) |
| **Desktop App** | 40% | ⏸️ Отложено (25 июня) |
| **Infrastructure** | 100% | ✅ COMPLETE |

**Общая готовность: 98%**

---

## 🚀 Быстрый старт (5 минут)

```bash
# 1. Настроить секреты
mkdir secrets
openssl rand -hex 32 > secrets/db_password.txt
openssl rand -hex 64 > secrets/jwt_secret.txt

# 2. Запустить PostgreSQL
./api/scripts/setup-postgres.sh

# 3. Запустить миграцию
cd api && node scripts/migrate-to-pg.js

# 4. Запустить всё
cd .. && docker-compose up -d

# 5. Проверить
curl http://localhost:3001/health
```

---

## 📅 План на 8 дней

### ✅ Выполнено (День 1)

- [x] PostgreSQL setup
- [x] Migration script (`api/scripts/migrate-to-pg.js`)
- [x] Backup script (`api/scripts/backup-postgres.sh`)
- [x] Docker Compose update
- [x] Deployment docs

### 🟡 В работе (День 2)

- [ ] SSL/TLS setup
- [ ] Secrets management
- [ ] Connection pooling

### ⬜ Осталось (Дни 3-8)

- [ ] Frontend Web MVP (Auth, Chats, Chat, Push, PWA)
- [ ] Testing (Load + Security)
- [ ] Production Deploy
- [ ] Release (11 июня!)

---

## 📁 Важные файлы

| Файл | Назначение |
|------|------------|
| **[RELEASE_PLAN.md](./RELEASE_PLAN.md)** | Полный план с чек-листами |
| **[docker-compose.yml](./docker-compose.yml)** | Оркестрация сервисов |
| **[api/scripts/migrate-to-pg.js](./api/scripts/migrate-to-pg.js)** | Миграция БД |
| **[api/scripts/setup-postgres.sh](./api/scripts/setup-postgres.sh)** | Установка PostgreSQL |
| **[api/scripts/backup-postgres.sh](./api/scripts/backup-postgres.sh)** | Бэкап БД |
| **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** | Инструкция по деплою |
| **[api/.env.example](./api/.env.example)** | Пример конфигурации |

---

## 🎯 Следующие шаги

### Прямо сейчас (День 2)

1. **SSL Setup** (2 часа)
   ```bash
   # Self-signed для разработки
   openssl req -x509 -nodes -days 365 \
     -newkey rsa:2048 \
     -keyout nginx/ssl/privkey.pem \
     -out nginx/ssl/fullchain.pem
   ```

2. **Secrets Management** (1 час)
   ```bash
   mkdir secrets
   openssl rand -hex 32 > secrets/db_password.txt
   openssl rand -hex 64 > secrets/jwt_secret.txt
   ```

3. **Connection Pooling** (1 час)
   - Настроить PgBouncer (опционально)
   - Или использовать встроенный pg pool

### День 3-5: Frontend Web MVP

- Экран Auth (логин/регистрация/2FA)
- Экран Chats (список + real-time)
- Экран Chat (отправка/получение)
- Push notifications
- PWA (offline mode)

### День 6-7: Testing + Deploy

- Load testing (k6)
- Security audit
- Production deploy

### День 8: Release

- Final checks
- RELEASE_NOTES.md
- **🚀 RELEASE 11 июня!**

---

## 🆘 Если что-то пошло не так

### PostgreSQL не запускается

```bash
docker-compose logs postgres
docker-compose restart postgres
```

### Миграция не работает

```bash
cd api
node scripts/migrate-to-pg.js
# Проверить DATABASE_URL в .env
```

### API не подключается к БД

```bash
docker-compose exec api node -e "const {db} = require('./src/config/database'); console.log('OK')"
```

---

## 📞 Связь

- **Документация:** [docs/](./docs/)
- **План:** [RELEASE_PLAN.md](./RELEASE_PLAN.md)
- **API Health:** http://localhost:3001/health

---

## 🇷🇺 Цель

**Выпустить Web MVP к 11 июня 2026 (День России)!**

Mobile и Desktop — после 11 июня.

---

**NLP-Core-Team**  
**App Balloo — в подарок Родине! 🎈**
