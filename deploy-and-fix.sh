#!/bin/bash
# deploy-and-fix.sh - Скрипт для деплоя и исправления системных чатов
# Запуск: bash deploy-and-fix.sh

set -e  # Выход при ошибке

echo "🚀 Начато деплоя Balloo Messenger..."

cd "$(dirname "$0")"

# 1. Обновление кода
echo ""
echo "=== 1. Обновление кода ==="
git pull origin main

# 2. Установка зависимостей
echo ""
echo "=== 2. Установка зависимостей ==="
npm install --production

# 3. Применение миграций БД
echo ""
echo "=== 3. Применение миграций БД ==="
npx prisma migrate deploy

# 4. Запуск fix-скрипта
echo ""
echo "=== 4. Исправление системных чатов ==="
node deploy-fix.js

# 5. Пересборка приложения
echo ""
echo "=== 5. Пересборка приложения ==="
rm -rf .next
NODE_ENV=production npx next build

# 6. Перезапуск PM2
echo ""
echo "=== 6. Перезапуск PM2 ==="
pm2 stop messenger-alpha || true
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha" --update-env
pm2 save

# 7. Перезагрузка Nginx
echo ""
echo "=== 7. Перезагрузка Nginx ==="
sudo systemctl reload nginx

# 8. Статус
echo ""
echo "=== 8. Статус ==="
pm2 status messenger-alpha
pm2 logs messenger-alpha --lines 10

echo ""
echo "✨ Деплой завершен успешно!"
echo "🌐 Приложение доступно по адресу: https://alpha.balloo.su"
