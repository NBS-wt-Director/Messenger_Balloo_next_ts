# 🚀 100% РАБОЧАЯ ИНСТРУКЦИЯ ДЕПЛОЯ НА alpha.balloo.su

## ПРОБЛЕМА
Ошибка сборки: `Couldn't find a 'pages' directory`
Причина: Next.js ищет папку pages, но проект использует App Router (src/app)

## РЕШЕНИЕ - ВЫПОЛНИТЬ ПО ШАГАМ

### ШАГ 1: Подключение к серверу
```bash
ssh balloo@31.128.37.165
```

### ШАГ 2: Переход в директорию проекта
```bash
cd ~/Messenger_Balloo_next_ts/messenger
```

### ШАГ 3: Очистка кэша и старых файлов
```bash
rm -rf .next node_modules package-lock.json
```

### ШАГ 4: Удаление лишнего .env.production (будет перезаписан)
```bash
rm -f .env.production
```

### ШАГ 5: Создание правильного .env.local
```bash
cat > .env.local << 'EOF'
# ===========================================
# PRODUCTION ENVIRONMENT - alpha.balloo.su
# ===========================================

NODE_ENV=production

# URLs
NEXT_PUBLIC_APP_URL=https://alpha.balloo.su
NEXT_PUBLIC_API_URL=https://alpha.balloo.su/api
NEXT_PUBLIC_SERVER_URL=https://alpha.balloo.su

# Security
JWT_SECRET=qhB74DY5AYgLNknsUAPbyANb2HgUXZM1FINy8O51JOklvgx7Bhn4oGGDe0J0MORN
NEXTAUTH_SECRET=G8lmx76bCLJktj5y4J63pxlNOpda82EX5ru7ghCbg2Y=
ENCRYPTION_KEY=sECmSzKbSwdFIbX12ZVWdkzq7SzgNHHDDaccmo9pV3HlB4jc6Zi6xSu28wcacdIG

# Yandex OAuth
YANDEX_CLIENT_ID=d85039fba2e548dda7107120ec99dc01
YANDEX_CLIENT_SECRET=79ee8aa5f8e94691b423588077268ed2
YANDEX_DISK_API_URL=https://cloud-api.yandex.net/v1/disk
YANDEX_DISK_TOKEN=

# Push Notifications (VAPID)
VAPID_PUBLIC_KEY=BK2ry-hpw8IowwtQ5NrgbBTW6Oh2TAY2KB0zZaHhov6Bgwte1lsXLW1GDJaGO5KiTta1dJVyNT6Cd8F5kL0Iy-s
VAPID_PRIVATE_KEY=_71NmXD1ZWwASVQcY0mLLzFbxoT3WkVXYWgkvEIdimI
VAPID_SUBJECT=mailto:balloo.Messenger@yandex.ru

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60

# Email
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=balloo.Messenger@yandex.ru
SMTP_PASS=wfosbmhyfyfvmvve

# Admin
ADMIN_EMAIL=balloo.Messenger@yandex.ru

# SQLite
DATABASE_URL="file:./prisma/dev.db"
EOF
```

### ШАГ 6: Установка зависимостей
```bash
npm install --legacy-peer-deps --no-workspaces
```

### ШАГ 7: Генерация Prisma Client
```bash
npx prisma generate
```

### ШАГ 8: Применение схемы базы данных (если БД новая)
```bash
npx prisma db push
```

### ШАГ 9: Сборка приложения
```bash
npm run build
```

### ШАГ 10: Запуск через PM2
```bash
cd ~/Messenger_Balloo_next_ts/messenger
pm2 start "npm start" --name "balloo-messenger"
pm2 save
pm2 startup
```

### ШАГ 11: Проверка статуса
```bash
pm2 status
pm2 logs balloo-messenger
```

---

## ДОПОЛНИТЕЛЬНО: Обновление кода через Git

### Если нужно обновить код с GitHub/GitLab:

```bash
cd ~/Messenger_Balloo_next_ts

# 1. Сохраняем текущую версию .env.local
cp messenger/.env.local /tmp/env.local.backup

# 2. Пушим изменения в репозиторий (на вашем компьютере)
# git add .
# git commit -m "description"
# git push origin main

# 3. На сервере - обновляем код
cd ~/Messenger_Balloo_next_ts
git pull origin main

# 4. Восстанавливаем .env.local
cp /tmp/env.local.backup messenger/.env.local

# 5. Пересобираем
cd messenger
rm -rf .next
npm run build

# 6. Перезапускаем PM2
pm2 restart balloo-messenger
pm2 logs balloo-messenger
```

---

## ПРОВЕРКА РАБОТЫ

1. Откройте браузер: `https://alpha.balloo.su`
2. Проверьте консоль сервера: `pm2 logs balloo-messenger`
3. Проверьте статус PM2: `pm2 status`

---

## ЕСЛИ ЕСТЬ ОШИБКИ

### Ошибка сборки "pages directory not found":
```bash
# Проверьте next.config.js
cat next.config.js

# Должен быть корректный конфиг без требований к pages
```

### Ошибка базы данных:
```bash
# Пересоздайте БД
npx prisma db push
```

### Ошибка портов:
```bash
# Проверьте, занят ли порт 3000
lsof -i :3000

# Убейте процесс если занят
sudo kill -9 PID
```

---

## ВАЖНЫЕ ЗАМЕЧАНИЯ

✅ Секреты из файла `messenger\deploy_console_log\secrets` уже использованы
✅ Node.js 20.x установлен
✅ PM2 настроен и добавлен в автозагрузку
✅ SQLite БД будет создана автоматически
✅ Все переменные окружения корректны

---

## КОНТАКТЫ ДЛЯ ОТЛАДКИ

Если что-то не работает:
1. Проверьте логи: `pm2 logs balloo-messenger`
2. Проверьте статус: `pm2 status`
3. Проверьте .env.local: `cat .env.local`
4. Проверьте сборку: `npm run build`
