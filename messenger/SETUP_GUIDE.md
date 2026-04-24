# 🚀 Полная Инструкция по Настройке Balloo Messenger

## 📋 Содержание
1. [Необходимые Изображения](#1-необходимые-изображения)
2. [Конфигурационные Файлы](#2-конфигурационные-файлы)
3. [Установка Зависимостей](#3-установка-зависимостей)
4. [Запуск Разработки](#4-запуск-разработки)
5. [Сборка для Продакшена](#5-сборка-для-продакшена)
6. [Создание Администратора](#6-создание-администратора)
7. [Деплой](#7-деплой)

---

## 1. Необходимые Изображения

### 🎨 Обязательные Изображения

Создайте папку `messenger/public/` и добавьте следующие файлы:

| Файл | Размер | Формат | Описание | Где Используется |
|------|--------|--------|----------|------------------|
| `logo.png` | 200x200px или 400x400px | PNG с прозрачностью | Логотип приложения | Header, Footer, AuthPage |
| `mascot.png` | 100x100px или 200x200px | PNG с прозрачностью | Маскот (персонаж) | Бургер меню |

### 📱 PWA Иконки

Создайте папку `messenger/public/icons/` и добавьте иконки:

| Файл | Размер | Описание |
|------|--------|----------|
| `icon-72x72.png` | 72x72px | iOS домашний экран |
| `icon-96x96.png` | 96x96px | Android иконка |
| `icon-128x128.png` | 128x128px | Chrome Web Store |
| `icon-144x144.png` | 144x144px | Android TV |
| `icon-152x152.png` | 152x152px | iOS iPad |
| `icon-192x192.png` | 192x192px | Android/Windows |
| `icon-384x384.png` | 384x384px | Large Android |
| `icon-512x512.png` | 512x512px | Play Store |
| `badge-72x72.png` | 72x72px | Badge для уведомлений |

### 📄 Дополнительно (по желанию)

| Файл | Размер | Описание |
|------|--------|----------|
| `qr/support-qr.png` | 300x300px | QR-код для СБП |
| `avatars/developer.jpg` | 200x200px | Аватар разработчика |

### 🎨 Как Создать Изображения

**Вариант 1: Использовать Canva/Figma**
1. Создайте проект 400x400px
2. Используйте градиент: красный-белый-синий
3. Экспортируйте как PNG с прозрачностью

**Вариант 2: Использовать онлайн-генераторы**
- https://rebrandly.com/logo-generator
- https://canva.com/create/logos
- https://favicon.io

**Вариант 3: Заглушки (для начала)**
Если нет дизайнера, используйте простые цвета:
```bash
# Создать красный квадрат логотипа (Linux/Mac)
convert -size 400x400 xc:red -fill white -gravity center -pointsize 100 -annotate 0 "B" logo.png

# Или просто скачайте любой PNG и измените размер
```

---

## 2. Конфигурационные Файлы

### 🔐 .env.local

Создайте файл `messenger/.env.local`:

```env
# Сервер
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# JWT (сгенерируйте свой секрет!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-change-this

# Yandex Disk OAuth (если используете)
YANDEX_DISK_CLIENT_ID=your-client-id
YANDEX_DISK_CLIENT_SECRET=your-client-secret
YANDEX_DISK_REDIRECT_URI=http://localhost:3000/api/disk/callback

# Push Notifications
VAPID_PUBLIC_KEY=BFGoKqGSzSF5cWmoIOfuvK661RqX4sr4r61Neab9y3BZkw0rJtnNbi5VkOtwBMmumC-HhtANH-Se0Of9ectF3C4
VAPID_PRIVATE_KEY=Oous2uOoHCs_oC-Sce4XovUxBJGyQw_mJ8bCBFusmjI

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60

# Production (для продакшена)
# NODE_ENV=production
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
# NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### ⚙️ config.json

Файл уже создан, но **обязательно измените**:

```json
{
  "auth": {
    "jwtSecret": "ВАШ-УНИКАЛЬНЫЙ-SECRET-минимум-32-символа",
    "admin": {
      "superAdminEmail": "admin@ваш-домен.ru",
      "defaultAdminPassword": "СложныйПароль123!"
    }
  },
  "app": {
    "url": "https://ваш-домен.ru"
  }
}
```

⚠️ **ВАЖНО:** Измените `jwtSecret` перед деплоем!

---

## 3. Установка Зависимостей

```bash
cd messenger

# Установка всех пакетов
npm install

# Или если используете yarn
yarn install

# Или если используете pnpm
pnpm install
```

---

## 4. Запуск Разработки

```bash
# Запуск dev сервера
npm run dev

# Откройте http://localhost:3000
```

### 🔧 Тестовые Данные

```bash
# Создать тестовые данные в БД
npm run setup-test-data

# Создать супер-админа
npm run create-admin
```

### 👤 Тестовые Пользователи (по умолчанию)

| Email | Пароль | Роль |
|-------|--------|------|
| admin@balloo.ru | Admin123! | SuperAdmin |
| user1@balloo.ru | User123! | User |
| user2@balloo.ru | User123! | User |
| user3@balloo.ru | User123! | User |

---

## 5. Сборка для Продакшена

```bash
# Проверка типов
npx tsc --noEmit

# Линтинг
npm run lint

# Сборка
npm run build

# Запуск production сервера
npm start
```

### 📊 Размер Сборки

```
Route (app)                                 Size  First Load JS
├ ○ /                                    2.58 kB         142 kB
├ ○ /chats                               9.36 kB         149 kB
├ ○ /admin                               10.5 kB         114 kB
├ ○ /features                            5.18 kB         145 kB
└ ○ /support                             4.45 kB         144 kB
```

**Общий размер:** ~234 MB (с node_modules)  
**Строк кода:** ~24,632 TS/TSX

---

## 6. Создание Администратора

После первого запуска выполните:

```bash
# Создаст супер-админа с данными из config.json
npm run create-admin
```

Или вручную:

1. Зарегистрируйтесь на сайте
2. Откройте базу данных (IndexedDB)
3. Найдите пользователя в `users` коллекции
4. Установите `isAdmin: true` и `isSuperAdmin: true`

---

## 7. Деплой

### 🌐 Варианты Деплоя

#### Vercel (Рекомендуется)

```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

**Конфиг `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev"
}
```

#### Railway

1. Подключите GitHub репозиторий
2. Добавьте переменные окружения
3. Деплой автоматически

#### Собственный Сервер (VPS)

```bash
# На сервере
cd /var/www/balloo
npm install --production
npm run build

# Запуск через PM2
pm2 start npm --name "balloo" -- start

# Или через systemd
sudo systemctl start balloo
```

### 🔒 Безопасность перед Деплоем

1. **Измените JWT_SECRET** в `config.json`
2. **Измените пароль админа** в `config.json`
3. **Добавьте `.env.local`** в `.gitignore`
4. **Включите HTTPS** (обязательно!)
5. **Настройте CORS** (если нужно)
6. **Проверьте config.json** - нет ли там секретов

---

## ✅ Чеклист Перед Релизом

- [ ] Добавлены изображения: `logo.png`, `mascot.png`
- [ ] Добавлены PWA иконки в `public/icons/`
- [ ] Создан `.env.local` с правильными значениями
- [ ] Изменен `jwtSecret` в `config.json`
- [ ] Изменен пароль админа в `config.json`
- [ ] `.env.local` добавлен в `.gitignore`
- [ ] Сборка проходит без ошибок (`npm run build`)
- [ ] TypeScript без ошибок (`npx tsc --noEmit`)
- [ ] HTTPS включен на продакшене
- [ ] База данных инициализирована
- [ ] Создан администратор

---

## 🆘 Частые Проблемы

### ❌ "Module not found"

```bash
# Очистите кэш и переустановите
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Database not initialized"

```bash
# Перезапустите сервер
npm run dev
# База инициализируется автоматически
```

### ❌ "Cannot read property of null"

```bash
# Проверьте .env.local существует
# Проверьте config.json валиден
cat config.json | jq .
```

### ❌ "Build failed"

```bash
# Проверьте типы
npx tsc --noEmit

# Посмотрите ошибку
npm run build 2>&1 | head -50
```

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `npm run dev`
2. Проверьте TypeScript: `npx tsc --noEmit`
3. Очистите кэш: `rm -rf .next`
4. Пересоберите: `npm run build`

---

## 📚 Дополнительные Ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [RxDB Documentation](https://rxdb.info/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Готово!** Ваш мессенджер готов к работе 🎉
