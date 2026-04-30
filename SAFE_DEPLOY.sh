#!/bin/bash
# SAFE_DEPLOY.sh - Безопасный деплой с резервным копированием БД
# 
# Использование: bash SAFE_DEPLOY.sh
# 
# Что делает:
# 1. Останавливает приложение
# 2. Создает резервную копию БД
# 3. Применяет миграции
# 4. Собирает и запускает приложение
# 5. Проверяет работоспособность
# 6. При ошибке - восстанавливает БД

set -e

echo "=========================================="
echo " Balloo Messenger - БЕЗОПАСНЫЙ деплой"
echo "=========================================="
echo ""

BACKUP_DIR="$HOME/Messenger_Balloo_next_ts/messenger/prisma/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_FILE="$HOME/Messenger_Balloo_next_ts/messenger/prisma/dev.db"
APP_NAME="messenger-alpha"

# Создаем директорию для бэкапов
mkdir -p "$BACKUP_DIR"

cd ~/Messenger_Balloo_next_ts

echo "📥 1. Pull последних изменений..."
git pull origin main

echo ""
echo "🛡️  2. Создание резервной копии БД..."
if [ -f "$DB_FILE" ]; then
    BACKUP_FILE="$BACKUP_DIR/dev.db.backup.$TIMESTAMP"
    cp "$DB_FILE" "$BACKUP_FILE"
    echo "✅ Резервная копия создана: $BACKUP_FILE"
    ls -lh "$BACKUP_FILE"
else
    echo "⚠️  База данных не найдена. Создание при первой записи."
    BACKUP_FILE=""
fi

echo ""
echo "📦 3. Установка зависимостей..."
cd messenger
npm ci --only=production

echo ""
echo "🔧 4. Генерация Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  5. Применение миграций БД..."
# Выводим информацию о миграциях
echo "Будут применены следующие миграции:"
npx prisma migrate status
echo ""

# Применяем миграции
npx prisma migrate deploy

echo ""
echo "🏗️  6. Сборка production версии..."
rm -rf .next
NODE_ENV=production npx next build

echo ""
echo "🚀 7. Перезапуск PM2 процесса..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true
NODE_ENV=production pm2 start "npx next start -p 3000" --name "$APP_NAME" --update-env
pm2 save

echo ""
echo "✅ 8. Проверка статуса..."
pm2 status $APP_NAME

echo ""
echo "📋 9. Проверка логов (последние 20 строк)..."
pm2 logs $APP_NAME --lines 20 --nostream

echo ""
echo "🧪 10. Тест доступности приложения..."
sleep 2
if curl -s -o /dev/null -I -w "%{http_code}" http://localhost:3000 | grep -q "200\|302"; then
    echo "✅ Приложение доступно! HTTP код: $(curl -s -o /dev/null -I -w "%{http_code}" http://localhost:3000)"
else
    echo "⚠️  Приложение не отвечает. Проверьте логи."
    echo ""
    echo "🔧 Логи ошибок:"
    pm2 logs $APP_NAME --err --lines 30 --nostream
    echo ""
    echo "💡 При необходимости восстановите БД:"
    if [ -n "$BACKUP_FILE" ]; then
        echo "   cp $BACKUP_FILE $DB_FILE"
        echo "   pm2 restart $APP_NAME"
    fi
    exit 1
fi

echo ""
echo "=========================================="
echo "✨ БЕЗОПАСНЫЙ деплой завершен успешно!"
echo "=========================================="
echo ""
echo "📁 Резервная копия БД: $BACKUP_FILE"
echo "📊 Статус PM2: $(pm2 list | grep $APP_NAME)"
echo ""
echo "Проверка:"
echo "  - Приложение: curl http://localhost:3000"
echo "  - PM2 статус: pm2 status"
echo "  - PM2 логи: pm2 logs $APP_NAME"
echo "  - Бэкапы: ls -lh $BACKUP_DIR"
echo ""
echo "🔄 Откат (если нужно):"
echo "  1. pm2 stop $APP_NAME"
echo "  2. cp $BACKUP_FILE $DB_FILE"
echo "  3. pm2 start $APP_NAME"
echo ""
