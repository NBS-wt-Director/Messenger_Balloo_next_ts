
# 🎈 Balloo Messenger

**Email:** i@o8eryuhtin.ru  
**Версия:** 2.0.0  
**Сайт:** https://alpha.balloo.su

---

## 📱 О проекте

Balloo Messenger - современный мессенджер с шифрованием, мультиязычностью и PWA поддержкой.

### Основные функции

- ✅ 3-режимный поиск (чаты/сообщения/глобальный)
- ✅ Системные чаты (заметки/техподдержка/новости)
- ✅ Профиль с телефоном и онлайн статусом
- ✅ Автоматические контакты и семейные связи
- ✅ Prisma + SQLite
- ✅ Forward сообщений
- ✅ Закрепление чатов (до 15)
- ✅ Избранное для чатов
- ✅ PWA поддержка
- ✅ 13 языков интерфейса
- ✅ Тёмная/светлая тема

---

## 🚀 Быстрый старт

### Деплой

```bash
cd ~/Messenger_Balloo_next_ts && bash messenger/deploy-and-fix.sh
```

### Ручной деплой

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

---

## 📚 Документация

- [Полная документация](./docs/README.md)
- [Деплой](./docs/DEPLOYMENT.md)
- [API](./docs/API_DOCUMENTATION.md)

---

## 🛠 Стек

- **Frontend:** Next.js 14, React, TypeScript
- **Backend:** Next.js API Routes
- **Database:** SQLite + Prisma
- **Auth:** JWT
- **Styling:** Tailwind CSS

---

## 📁 Структура

```
messenger/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React компоненты
│   ├── lib/          # Утилиты
│   └── i18n/         # Мультиязычность
├── prisma/           # Schema БД
├── docs/             # Документация
├── versions.json     # История версий
└── deploy-*.sh       # Скрипты деплоя
```

---

## ✅ Проверка

```bash
pm2 status
pm2 logs messenger-alpha --lines 20
curl https://alpha.balloo.su
```

---

## 🔧 Скрипты

| Команда | Описание |
|---------|----------|
| `deploy-and-fix.sh` | Автоматический деплой |
| `deploy-fix.js` | Исправление системных чатов |
| `fix-system-chats.js` | Исправление для существующих пользователей |

---

## 📞 Поддержка

**Email:** i@o8eryuhtin.ru

---

## 📄 Лицензия

© 2025 NBS - web-tech. Все права защищены.
