# 🔧 Настройка SQLite для Balloo Messenger

## ⚡ Быстрая Настройка (5 минут)

### 1. Установите Зависимости

```bash
cd messenger
npm install --legacy-peer-deps
```

**Примечание:** `--legacy-peer-deps` нужен из-за конфликта версий Prisma 7.x. Мы используем Prisma 6.11.0.

### 2. Создайте .env.local

```bash
cp .env.example .env.local
```

**Проверьте содержимое:**
```env
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Подготовьте Базу Данных

```bash
# Настройте схему
node scripts/migrate-sqlite.js
```

**Скрипт проверит:**
- ✅ Создан ли `.env.local`
- ✅ Настроен ли `DATABASE_URL` на SQLite
- ✅ Настроен ли `schema.prisma` на SQLite

### 4. Сгенерируйте Prisma Client

```bash
npm run db:generate
```

**Ожидаемый вывод:**
```
Prisma schema loaded from prisma/schema.prisma
Added output to prisma/client
Generated Prisma Client (v6.11.0)
```

### 5. Создайте Таблицы

```bash
npm run db:push
```

**Ожидаемый вывод:**
```
✔ Generated Prisma Client (v6.11.0)
✔ The database has been pushed to your SQLite database
```

**Файл БД создан:** `messenger/prisma/dev.db`

### 6. Заполните Тестовыми Данными

```bash
npm run db:seed
```

**Созданные пользователи:**
- Admin: `admin@balloo.ru` / `BallooAdmin2024!SecurePass#XyZ`
- Test: `test@balloo.ru` / `TestUser123!`

### 7. Запустите Приложение

```bash
npm run dev
```

**Готово!** 🎉

---

## 📊 Структура Базы Данных

**16 таблиц в одном файле `prisma/dev.db`:**

| Таблица | Описание |
|---------|----------|
| User | Пользователи (email, пароль, имя) |
| Chat | Чаты (личные, групповые) |
| Message | Сообщения (текст, медиа) |
| ChatMember | Участники чатов (роли) |
| Invitation | Пригласительные коды |
| Contact | Контакты пользователей |
| Notification | Уведомления |
| Report | Жалобы на контент |
| Feature | Предложения функций |
| FeatureVote | Голоса за функции |
| Page | Страницы контента (Support, About) |
| FamilyRelation | Семейные связи |
| MessageReaction | Реакции на сообщения |
| ChatFavorite | Избранные чаты |
| ChatPinned | Закреплённые чаты |
| InvitationUse | Использование приглашений |

---

## 🛠 Команды

### Разработка

```bash
# Настройка БД
node scripts/migrate-sqlite.js

# Генерация Prisma Client
npm run db:generate

# Применить схему
npm run db:push

# GUI для просмотра БД
npm run db:studio
# Откроется: http://localhost:5555

# Тестовые данные
npm run db:seed
```

### Production

```bash
# Сборка (включает генерацию Prisma Client)
npm run build

# Запуск
npm start

# PM2 (для сервера)
pm2 start npm --name "balloo" -- start
```

---

## 🔍 Проверка Работоспособности

### 1. Проверьте Файл БД

```bash
ls -lh prisma/dev.db
# Должен быть ~100 KB - 10 MB в зависимости от данных
```

### 2. Откройте Prisma Studio

```bash
npm run db:studio
```

Откроется GUI в браузере для просмотра и редактирования данных.

### 3. Проверьте API

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

---

## 🔄 Обновление Модели БД

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

### 3. Пересоздайте Prisma Client

```bash
npm run db:generate
```

### 4. Проверьте

```bash
npm run db:studio
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
npm run db:push
```

**Prisma автоматически конвертирует схему!**

---

## 💾 Резервное Копирование

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

### 4. Prisma Версия

Используется **Prisma 6.11.0** (не 7.x).

Если у вас Prisma 7.x:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 🔧 Troubleshooting

### Проблема: "Error validating field"

**Решение:** Проверьте `schema.prisma` на наличие синтаксических ошибок.

### Проблема: "Database locked"

```bash
# Остановите приложение
npm stop

# Удалите и пересоздайте БД
rm prisma/dev.db
npm run db:push
npm run db:seed

# Запустите приложение
npm start
```

### Проблема: "Table doesn't exist"

```bash
# Пересоздайте БД
rm prisma/dev.db
npm run db:push
npx prisma db seed
```

### Проблема: "Cannot find module '@prisma/client'"

```bash
# Переустановите зависимости
npm install --legacy-peer-deps
npm run db:generate
```

### Проблема: Prisma 7.x вместо 6.x

```bash
# Удалите node_modules и переустановите
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Проверьте версию
npm list prisma
# Должно быть: prisma@6.11.0
```

---

## ✅ Готово!

Ваша SQLite база данных настроена и готова к использованию!

### Следующие Шаги

1. **Запустите приложение:** `npm run dev`
2. **Откройте GUI:** `npm run db:studio`
3. **Создайте первого пользователя:** через `/register` или seed
4. **Проверьте API:** попробуйте войти в систему

---

## 📞 Полезные Ссылки

- [Prisma Documentation](https://www.prisma.io/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Prisma Studio](https://www.prisma.io/studio)

---

**Успешной работы с SQLite!** 🎈
