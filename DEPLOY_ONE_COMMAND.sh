#!/bin/bash
# DEPLOY_ONE_COMMAND.sh
# Однокомандная инструкция для деплоя Balloo Messenger
# 
# Использование: bash DEPLOY_ONE_COMMAND.sh
# Или скопировать команду ниже и выполнить на сервере

set -e  # Выход при ошибке

echo "=========================================="
echo " Balloo Messenger - Автоматический деплой"
echo "=========================================="
echo ""

# Переход в директорию проекта
cd ~/Messenger_Balloo_next_ts

echo "📥 1. Pull последних изменений..."
git pull origin main

echo ""
echo "📦 2. Установка зависимостей..."
cd messenger
npm ci --only=production

echo ""
echo "🔧 3. Генерация Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  4. Применение миграций БД..."
npx prisma migrate deploy

echo ""
echo "🏗️  5. Сборка production версии..."
rm -rf .next
NODE_ENV=production npx next build

echo ""
echo "🚀 6. Перезапуск PM2 процесса..."
pm2 stop messenger-alpha 2>/dev/null || true
pm2 delete messenger-alpha 2>/dev/null || true
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha" --update-env
pm2 save

echo ""
echo "✅ 7. Проверка статуса..."
pm2 status messenger-alpha

echo ""
echo "📋 8. Последние логи..."
pm2 logs messenger-alpha --lines 10 --nostream

echo ""
echo "=========================================="
echo "✨ Деплой завершен успешно!"
echo "=========================================="
echo ""
echo "Проверка:"
echo "  - Приложение: curl http://localhost:3000"
echo "  - PM2 статус: pm2 status"
echo "  - PM2 логи: pm2 logs messenger-alpha"
echo "  - Nginx: sudo systemctl status nginx"
echo ""
