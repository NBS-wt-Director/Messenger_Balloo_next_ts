# Balloo Messenger - Инструкции по настройке

## 📦 Быстрый старт

### 1. Установка зависимостей

```bash
# Корневая папка (опционально, для prettier и husky)
npm install

# Shared package
cd shared
npm install
npm run build

# Messenger (web)
cd ../messenger
npm install
npm run build

# Mobile (expo) - если нужно
cd ../mobile
npm install

# Android service - если нужно
cd ../android-service
npm install
npm run build
```

### 2. Настройка окружения

```bash
# Скопируйте .env.example в .env.local
cd messenger
cp .env.example .env.local

# Отредактируйте .env.local и заполните все обязательные поля
# См. раздел "Переменные окружения" ниже
```

### 3. Генерация секретов

```bash
# JWT Secret (минимум 32 символа)
openssl rand -base64 32

# Encryption Key (минимум 32 символа)
openssl rand -base64 32

# Вставьте полученные значения в .env.local
```

### 4. Инициализация базы данных

```bash
cd messenger

# Генерация Prisma Client
npx prisma generate

# Применение миграций (создаст БД если не существует)
npx prisma migrate dev

# Или для production:
npx prisma migrate deploy
```

### 5. Запуск в режиме разработки

```bash
# Messenger (web)
cd messenger
npm run dev
# Откроется на http://localhost:3000

# Shared (автопересборка не требуется, используйте npm run build после изменений)
cd shared
npm run build
```

## 🔧 Переменные окружения

### Обязательные

```env
# Адрес сервера
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# База данных
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret (минимум 32 символа)
JWT_SECRET=ваш-сгенерированный-секрет

# Encryption Key (минимум 32 символа)
ENCRYPTION_KEY=ваш-сгенерированный-ключ
```

### Опциональные

```env
# Yandex OAuth
YANDEX_CLIENT_ID=
YANDEX_CLIENT_SECRET=

# Push уведомления
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@ваш-домен.ru

# Email (SMTP)
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Режим работы
NODE_ENV=development
PORT=3000
```

## 📱 Запуск Mobile App (Expo)

```bash
cd mobile

# Установка зависимостей
npm install

# Запуск Metro bundler
npm start

# Для Android
npm run android

# Для iOS (только macOS)
npm run ios

# Для веба
npm run web
```

## 💻 Запуск Desktop App (Electron)

**Примечание:** Требуется настройка renderer компонента

```bash
cd desktop

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev

# Собрать для Windows
npm run build:win

# Собрать для macOS
npm run build:mac

# Собрать для Linux
npm run build:linux
```

## 🤖 Запуск Android Service

```bash
cd android-service

# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка
npm run build

# Production
npm run start
```

## 🧪 Запуск тестов

```bash
cd messenger

# Unit тесты
npm test

# Type checking
npm run typecheck  # если добавлено

# Linting
npm run lint
```

## 📦 Сборка для Production

```bash
cd messenger

# Сборка
npm run build

# Запуск production сервера
npm start
```

## 🔄 Миграции базы данных

```bash
cd messenger

# Создать новую миграцию
npx prisma migrate dev --name description_of_changes

# Применить миграции в production
npx prisma migrate deploy

# Открыть Prisma Studio (GUI для БД)
npx prisma studio

# Сбросить базу данных (ОПАСНО!)
npx prisma migrate reset
```

## 🐛 Устранение проблем

### Ошибка: Prisma Client не сгенерирован

```bash
cd messenger
npx prisma generate
```

### Ошибка: Миграции не применяются

```bash
cd messenger
# Удалить старую базу данных (если в разработке)
rm prisma/dev.db

# Перегенерировать Prisma Client
npx prisma generate

# Применить миграции заново
npx prisma migrate dev
```

### Ошибка: TypeScript ошибки при сборке

```bash
# Очистить кэш
rm -rf .next node_modules

# Переустановить зависимости
npm install

# Пересобрать
npm run build
```

### Ошибка: Port already in use

```bash
# Найти процесс на порту 3000
netstat -ano | findstr :3000

# Убить процесс (замените PID)
taskkill /PID <PID> /F

# Или используйте другой порт
PORT=3001 npm run dev
```

## 📊 Мониторинг и логирование

### Логи приложения

```bash
# Production логи
npm start > logs.txt 2>&1

# С вращением логов (рекомендуется)
npm install pm2 -g
pm2 start npm --name "balloo" -- start
pm2 logs
pm2 monit
```

### Мониторинг базы данных

```bash
# Открыть Prisma Studio
npx prisma studio

# Или используйте SQLite GUI:
# - DB Browser for SQLite
# - TablePlus
# - DataGrip
```

## 🚀 Деплой

### Vercel (рекомендуется для web)

```bash
# Установить Vercel CLI
npm install -g vercel

# Деплой
vercel

# Production деплой
vercel --prod
```

### Self-hosted (VPS)

```bash
# 1. Скопировать проект на сервер
# 2. Установить Node.js 20+
# 3. Установить зависимости
npm install --production

# 4. Сгенерировать Prisma Client
npx prisma generate

# 5. Применить миграции
npx prisma migrate deploy

# 6. Запустить с PM2
pm2 start npm --name "balloo" -- start
pm2 save
pm2 startup
```

### Docker

```bash
# Build
docker build -t balloo-messenger .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./prisma/dev.db" \
  -e JWT_SECRET=ваш-секрет \
  balloo-messenger
```

## 📝 Полезные команды

```bash
# Очистить все кэши
rm -rf node_modules .next dist

# Проверить зависимости
npm ls

# Обновить зависимости
npm update

# Проверить уязвимости
npm audit

# Исправить уязвимости
npm audit fix

# Проверить TypeScript
npx tsc --noEmit

# Форматирование кода
npx prettier --write .

# Linting
npm run lint
```

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи приложения
2. Проверьте версию Node.js (требуется >= 20)
3. Убедитесь, что все зависимости установлены
4. Проверьте переменные окружения
5. Обратитесь к NLP-Core-Team

---
*Документация обновляется по мере развития проекта*
