# 🎈 Balloo Messenger - Документация

**Email:** i@o8eryuhtin.ru  
**Версия:** 2.0.0  
**Дата:** 2025-01-XX

---

## 📚 Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Деплой](#деплой)
3. [Архитектура](#архитектура)
4. [API](#api)
5. [Функции](#функции)
6. [История версий](#история-версий)

---

## Быстрый старт

### Установка

```bash
cd ~/Messenger_Balloo_next_ts
git pull origin main
cd messenger
npm install --production
npx prisma migrate deploy
node deploy-fix.js
NODE_ENV=production npx next build
NODE_ENV=production pm2 start "npx next start -p 3000" --name messenger-alpha --update-env
pm2 save
sudo systemctl reload nginx
```

### Проверка

```bash
pm2 status
pm2 logs messenger-alpha --lines 20
curl https://alpha.balloo.su
```

---

## Деплой

Полная инструкция: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Автоматический деплой

```bash
bash deploy-and-fix.sh
```

### Ручной деплой

1. `git pull origin main`
2. `npm install --production`
3. `npx prisma migrate deploy`
4. `node deploy-fix.js`
5. `npm run build`
6. `pm2 restart messenger-alpha`
7. `sudo systemctl reload nginx`

---

## Архитектура

### Стек

- **Frontend:** Next.js 14, React, TypeScript
- **Backend:** Next.js API Routes
- **Database:** SQLite + Prisma ORM
- **Authentication:** JWT
- **Styling:** Tailwind CSS

### Структура проекта

```
messenger/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API Routes
│   │   ├── history/      # История версий
│   │   └── admin/        # Админ-панель
│   ├── components/       # React компоненты
│   ├── lib/             # Утилиты
│   └── i18n/            # Мультиязычность
├── prisma/              # Schema БД
├── versions.json        # История версий
└── docs/               # Документация
```

---

## API

### Основные endpoints

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | `/api/auth/profile` | Профиль пользователя |
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/chats` | Список чатов |
| POST | `/api/chats` | Создание чата |
| GET | `/api/messages` | Сообщения чата |
| POST | `/api/messages` | Отправка сообщения |
| GET | `/api/global-search` | Глобальный поиск |
| GET | `/api/versions` | Версии приложения |

Полная документация: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## Функции

### Реализовано в версии 2.0

- ✅ 3-режимный поиск (чаты/сообщения/глобальный)
- ✅ Системные чаты (заметки/техподдержка/новости)
- ✅ Профиль с телефоном и онлайн статусом
- ✅ Автоматические контакты и связи
- ✅ Prisma + SQLite
- ✅ Forward сообщений
- ✅ Закрепление чатов (до 15)
- ✅ PWA поддержка
- ✅ Мультиязычность (13 языков)
- ✅ Тёмная/светлая тема

---

## История версий

Полная история: [CHANGES.md](./CHANGES.md)

### 0.0.1 (2025-01-XX)

**Новые функции:**
- 3-режимный поиск
- Системные чаты
- Профиль с телефоном
- Авто-контакты

**Исправления:**
- SSL сертификат
- 502 Bad Gateway
- Сборка приложения

---

**Поддержка:** i@o8eryuhtin.ru
