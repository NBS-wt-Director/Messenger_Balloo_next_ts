

# ✅ SQLite Настройка Завершена

## 🎉 Что Сделано

### 1. Prisma Schema
✅ Обновлён: `messenger/prisma/schema.prisma`
- Provider: `sqlite`
- URL: `file:./dev.db`
- Типы: `DateTime` вместо `Int` для дат
- Все 16 моделей обновлены

### 2. Скрипты Настройки
✅ Созданы:
- `messenger/scripts/migrate-sqlite.js` - автоматическая подготовка
- `messenger/scripts/setup-sqlite.sh` - ручная настройка (Linux)

### 3. Package.json
✅ Обновлены скрипты:
```json
{
  "db:generate": "prisma generate",
  "db:push": "prisma db push",
  "db:migrate": "prisma db push",
  "db:studio": "prisma studio",
  "db:seed": "prisma db seed",
  "db:setup": "node scripts/migrate-sqlite.js",
  "db:deploy": "node scripts/migrate-sqlite.js"
}
```

✅ Зависимости:
- `"prisma": "^6.11.0"` (не 7.x!)
- `"@prisma/client": "^6.11.0"`

### 4. .env.example
✅ Обновлён:
```env
DATABASE_URL="file:./prisma/dev.db"
```

### 5. .gitignore
✅ Добавлено:
```gitignore
prisma/*.db
*.sqlite
```

### 6. Документация
✅ Создана:
- `SETUP_SQLITE.md` - полная документация
- `SQLITE_QUICK_START.md` - быстрый старт
- `DEPLOY_BEGET_FINAL.md` - инструкция по деплою (v3.0)
- `PROJECT_STRUCTURE.md` - структура проекта (обновлена)
- `SQLITE_MIGRATION_SUMMARY.md` - этот файл

---

## 🚀 Быстрый Старт

```bash
cd messenger

# 1. Установите зависимости
npm install --legacy-peer-deps

# 2. Создайте .env.local
cp .env.example .env.local

# 3. Подготовьте БД
node scripts/migrate-sqlite.js

# 4. Сгенерируйте Prisma Client
npm run db:generate

# 5. Создайте таблицы
npm run db:push

# 6. Заполните тестовыми данными
npm run db:seed

# 7. Запустите
npm run dev
```

**Готово!** База данных создана автоматически.

---

## 📊 Структура Базы Данных

**16 таблиц в одном файле:**

| Таблица | Назначение |
|---------|------------|
| User | Пользователи |
| Chat | Чаты |
| Message | Сообщения |
| ChatMember | Участники чатов |
| Invitation | Пригласительные коды |
| Contact | Контакты |
| Notification | Уведомления |
| Report | Жалобы |
| Feature | Предложения функций |
| FeatureVote | Голоса за функции |
| Page | Страницы контента |
| FamilyRelation | Семейные связи |
| MessageReaction | Реакции на сообщения |
| ChatFavorite | Избранные чаты |
| ChatPinned | Закреплённые чаты |
| InvitationUse | Использование приглашений |

**Файл БД:** `messenger/prisma/dev.db`

---

## 🔧 Основные Команды

| Команда | Описание |
|---------|----------|
| `node scripts/migrate-sqlite.js` | Настроить .env и schema |
| `npm run db:generate` | Сгенерировать Prisma Client |
| `npm run db:push` | Применить схему к БД |
| `npm run db:seed` | Заполнить тестовыми данными |
| `npx prisma studio` | GUI для просмотра БД |
| `npm run build` | Сборка (авто-настройка) |

---

## 📦 Тестовые Данные

После `npm run db:seed`:

| Роль | Email | Пароль |
|------|-------|--------|
| Admin | admin@balloo.ru | BallooAdmin2024!SecurePass#XyZ |
| User | test@balloo.ru | TestUser123! |

---

## 💾 Бэкап

**Создать:**
```bash
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)
```

**Восстановить:**
```bash
cp prisma/dev.db.backup prisma/dev.db
```

---

## 📈 Преимущества SQLite

| ✅ | Описание |
|----|----------|
| **Один файл** | Все данные в `prisma/dev.db` |
| **Не нужен сервер** | Работает из коробки |
| **Лёгкий** | ~500 KB размер |
| **Быстрый** | 100K+ операций/сек |
| **Бэкап** | Просто скопируйте файл |
| **Миграция** | Можно перейти на PostgreSQL |

---

## ⚠️ Важно

### Prisma Версия

Используется **Prisma 6.11.0** (не 7.x).

**Почему:** Prisma 7.x требует новую конфигурацию с `prisma.config.ts`. Prisma 6.x работает с классической схемой.

**Если у вас Prisma 7:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Не Коммитьте в Git

```gitignore
prisma/*.db       # Файл БД
.env.local        # Секреты
config.json       # Секреты
```

---

## 🔄 Миграция на PostgreSQL (опционально)

Если захотите PostgreSQL в будущем:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```env
# .env.local
DATABASE_URL="postgresql://user:pass@localhost:5432/balloo"
```

**Prisma автоматически конвертирует схему!**

---

## ✅ Проверка

```bash
# Проверьте файл БД
ls -lh prisma/dev.db

# Откройте GUI
npm run db:studio

# Проверьте API
curl http://localhost:3000/api/health
```

---

## 📚 Документация

- `SETUP_SQLITE.md` - Полная документация
- `SQLITE_QUICK_START.md` - Быстрый старт
- `DEPLOY_BEGET_FINAL.md` - Инструкция по деплою
- `PROJECT_STRUCTURE.md` - Структура проекта

---

**Готово к производству!** 🎈

Проект полностью настроен под SQLite — встроенную базу данных в одном файле.

**Следующие шаги:**
1. Запустите `npm run dev`
2. Откройте `http://localhost:3000`
3. Создайте первого пользователя
4. Проверьте чаты и сообщения

**Успешной разработки!** 🚀
