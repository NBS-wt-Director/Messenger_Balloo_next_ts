# 🔧 Настройка SQLite для Balloo Messenger

## 📋 Что Такое SQLite?

**SQLite** — это встраиваемая SQL-база данных, которая хранит все данные в **одном файле** на диске.

### Преимущества для Balloo Messenger:

| ✅ | Описание |
|----|----------|
| **Встроенная** | Не нужен отдельный сервер БД (PostgreSQL, MySQL) |
| **Один файл** | Все данные в `prisma/dev.db` |
| **Лёгкая** | ~500 KB, работает из коробки |
| **Быстрая** | До 100K+ операций в секунду |
| **Бэкап** | Просто скопируйте файл `.db` |
| **Миграции** | Prisma Migrate поддерживает SQLite |
| **Production** | Подойдёт до ~100K пользователей |

---

## 🚀 Быстрая Настройка

### 1. Установка Зависимостей

```bash
cd messenger
npm install
```

### 2. Создайте .env.local

```bash
cp .env.example .env.local
```

**Проверьте содержимое:**

```env
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Запустите Скрипт Настройки

```bash
npm run db:setup
```

**Что сделает скрипт:**
- ✅ Создаст папку `prisma/`
- ✅ Сгенерирует Prisma Client
- ✅ Создаст файл базы данных `prisma/dev.db`
- ✅ Создаст все таблицы (User, Chat, Message, и т.д.)
- ✅ Заполнит тестовыми данными (если есть seed.js)

### 4. Проверьте Базу Данных

```bash
# GUI для просмотра БД
npx prisma studio
```

Откроется в браузере: `http://localhost:5555`

---

## 📁 Структура Базы Данных

### Файлы:

```
messenger/
├── prisma/
│   ├── schema.prisma     # Схема БД (модели)
│   ├── dev.db            # Файл базы данных (создаётся автоматически)
│   └── seed.js           # Тестовые данные
└── .env.local            # Переменные окружения
```

### Таблицы:

| Таблица | Описание |
|---------|----------|
| `User` | Пользователи (email, пароль, имя) |
| `Chat` | Чаты (личные, групповые) |
| `Message` | Сообщения (текст, медиа) |
| `ChatMember` | Участники чатов (роли) |
| `Invitation` | Пригласительные коды |
| `Contact` | Контакты пользователей |
| `Notification` | Уведомления |
| `Report` | Жалобы на контент |
| `Feature` | Предложения функций |
| `FeatureVote` | Голоса за функции |
| `Page` | Страницы контента (Support, About) |
| `FamilyRelation` | Семейные связи |
| `MessageReaction` | Реакции на сообщения |
| `ChatFavorite` | Избранные чаты |
| `ChatPinned` | Закреплённые чаты |
| `InvitationUse` | Использование приглашений |

---

## 🛠 Команды

### Разработка

```bash
# Запустить миграцию БД
npm run db:setup

# Или вручную:
npm run db:generate   # Сгенерировать Prisma Client
npm run db:push       # Применить схему к БД
npx prisma db seed    # Заполнить тестовыми данными
```

### Просмотр БД

```bash
# GUI (Prisma Studio)
npx prisma studio
# Откроется: http://localhost:5555
```

### Сборка Production

```bash
npm run build
# Скрипт автоматически настроит БД перед сборкой
```

### Запуск Production

```bash
npm start
# Приложение подключится к prisma/dev.db
```

---

## 🔧 Обновление Модели БД

### 1. Измените `prisma/schema.prisma`

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  displayName String
  // ... новые поля
}
```

### 2. Примените Изменения

```bash
npm run db:push
```

### 3. Проверьте

```bash
npx prisma studio
```

---

## 📦 Миграция на PostgreSQL (опционально)

Если в будущем захотите перейти на PostgreSQL:

### 1. Измените `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Обновите `.env.local`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/balloo?schema=public"
```

### 3. Создайте БД в PostgreSQL

```bash
createdb balloo
```

### 4. Примените Миграции

```bash
npm run db:generate
npm run db:migrate
```

**Prisma автоматически конвертирует схему!**

---

## 🛡 Резервное Копирование

### Создание Бэкапа

```bash
# Остановите приложение
npm stop

# Скопируйте файл БД
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)

# Запустите приложение
npm start
```

### Восстановление

```bash
# Остановите приложение
npm stop

# Скопируйте бэкап обратно
cp prisma/dev.db.backup.20240101 prisma/dev.db

# Запустите приложение
npm start
```

---

## 🔍 Проверка Работоспособности

### 1. Проверьте Файл БД

```bash
ls -lh prisma/dev.db
# Должен быть ~100 KB - 10 MB в зависимости от данных
```

### 2. Проверьте Через Prisma Studio

```bash
npx prisma studio
# Откройте таблицы и проверьте данные
```

### 3. Проверьте Через API

```bash
# Регистрация тестового пользователя
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "displayName": "Тест"
  }'
```

### 4. Проверьте Логи

```bash
# Запустите приложение
npm run dev

# В логах должно быть:
# "Prisma Client generated"
# "Database connected"
```

---

## ⚠️ Важные Замечания

### 1. Не Коммитьте Файл БД

```gitignore
prisma/*.db
*.sqlite
```

### 2. Не Коммитьте .env.local

```gitignore
.env.local
```

### 3. Ограничения SQLite

| Ограничение | Значение |
|-------------|----------|
| **Макс. размер БД** | 140 TB |
| **Макс. пользователей** | ~100K активных |
| **Параллельные записи** | 1 (блокировка на запись) |
| **Производительность** | Отлично для read-heavy |

**Для Balloo Messenger это не проблема:**
- Чаты и сообщения — это read-heavy нагрузка
- Записи происходят только при отправке сообщений
- До 100K пользователей — более чем достаточно

---

## 🎉 Готово!

Ваша SQLite база данных настроена и готова к использованию!

### Следующие Шаги

1. **Запустите приложение:** `npm run dev`
2. **Откройте GUI:** `npx prisma studio`
3. **Создайте первого пользователя:** через `/register` или seed
4. **Проверьте API:** попробуйте войти в систему

---

## 📞 Troubleshooting

### Проблема: "Database locked"

**Решение:**
```bash
# Удалите файл БД и создайте заново
rm prisma/dev.db
npm run db:setup
```

### Проблема: "Table doesn't exist"

**Решение:**
```bash
# Пересоздайте БД
rm prisma/dev.db
npm run db:push
npx prisma db seed
```

### Проблема: "Cannot find module '@prisma/client'"

**Решение:**
```bash
# Переустановите зависимости
npm install
npm run db:generate
```

---

**Успешной работы с SQLite!** 🎈
