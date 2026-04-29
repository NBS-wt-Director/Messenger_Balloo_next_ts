#!/bin/bash

echo "=== ИСПРАВЛЕНИЕ СЕРВЕРА ==="

# 1. Удаляем __AuthPage.tsx (только на сервере)
echo "1. Удаляем __AuthPage.tsx..."
rm -f /home/balloo/Messenger_Balloo_next_ts/messenger/src/components/pages/__AuthPage.tsx

# 2. Проверяем что файл удалён
if [ ! -f /home/balloo/Messenger_Balloo_next_ts/messenger/src/components/pages/__AuthPage.tsx ]; then
    echo "✓ Файл __AuthPage.tsx удалён"
else
    echo "✗ Ошибка: файл __AuthPage.tsx всё ещё существует"
    exit 1
fi

# 3. Останавливаем приложение
echo "2. Останавливаем PM2..."
pm2 stop messenger-alpha

# 4. Очищаем кэш
echo "3. Очищаем кэш .next..."
rm -rf /home/balloo/Messenger_Balloo_next_ts/messenger/.next

# 5. Пересобираем
echo "4. Пересобираем проект..."
cd /home/balloo/Messenger_Balloo_next_ts/messenger
NODE_ENV=production npx next build

if [ $? -eq 0 ]; then
    echo "✓ Сборка успешна!"
    
    # 6. Запускаем
    echo "5. Запускаем приложение..."
    NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha" --update-env
    pm2 save
    
    echo "✓ Приложение запущено!"
    pm2 status
else
    echo "✗ Ошибка сборки! Проверяем ошибки..."
    exit 1
fi

echo "=== ГОТОВО ==="
