
# 🚀 SQLite - Быстрый Старт

## ⚡ Минуты 5 до Работающей Базы

```bash
# 1. Перейдите в папку проекта
cd messenger

# 2. Создайте .env.local
cp .env.example .env.local

# 3. Установите зависимости (Prisma 6)
npm install --legacy-peer-deps

# 4. Настройте и создайте БД
node scripts/migrate-sqlite.js

# 5. Генерируем Prisma Client
npm run db:generate

# 6. Применяем схему к БД
npm run db:push

# 7. Заполняем тестовыми данными
npm run db:seed

# 8. Запустите приложение
npm run dev
```

**Готово!** 🎉 База данных создана и приложение запущено.

---

## 📁 Где Файл Базы Данных?

```
messenger/prisma/dev.db
```

**Это один файл!** Просто скопируйте его для бэкапа.

---

## 🔧 Основные Команды

| Команда | Что Делает |
|---------|------------|
| `node scripts/migrate-sqlite.js` | Настроить .env.local и schema |
| `npm run db:generate` | Сгенерировать Prisma Client |
| `npm run db:push` | Применить схему к БД |
| `npm run db:seed` | Заполнить тестовыми данными |
| `npx prisma studio` | Открывает GUI для БД |
| `npm run build` | Сборка (с авто-настройкой) |

**⚠️ Важно:** Используйте Prisma 6.x (не 7.x). Если у вас Prisma 7, удалите `node_modules` и переустановите с `--legacy-peer-deps`.

---

## 📊 Структура БД

**16 таблиц:**
- User, Chat, Message
- ChatMember, Invitation, Contact
- Notification, Report, Feature
- FeatureVote, Page, FamilyRelation
- MessageReaction, ChatFavorite, ChatPinned, InvitationUse

---

## 🎯 Тестовые Данные

После `npm run db:setup` создается:

| Пользователь | Email | Пароль |
|--------------|-------|--------|
| Admin | admin@balloo.ru | BallooAdmin2024!SecurePass#XyZ |
| Test User | test@balloo.ru | TestUser123! |

---

## 🔐 Безопасность

**Никогда не коммитьте в Git:**
```gitignore
prisma/*.db       # Файл БД
.env.local        # Секреты
config.json       # Секреты
```

---

## 💾 Бэкап

**Создать:**
```bash
cp prisma/dev.db prisma/dev.db.backup
```

**Восстановить:**
```bash
cp prisma/dev.db.backup prisma/dev.db
```

---

## 📈 Производительность

| Метрика | Значение |
|---------|----------|
| **Размер файла** | ~100 KB - 10 MB |
| **Записи/сек** | 100K+ |
| **Чтение/сек** | 500K+ |
| **Макс. пользователей** | ~100K активных |

**Для Balloo Messenger более чем достаточно!**

---

## 🔄 Миграция на PostgreSQL (опционально)

Если в будущем захотите PostgreSQL:

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

## ❓ Troubleshooting

### "Database locked"
```bash
rm prisma/dev.db
npm run db:setup
```

### "Table doesn't exist"
```bash
rm prisma/dev.db
npm run db:push
npx prisma db seed
```

---

**Готово!** 🎈
