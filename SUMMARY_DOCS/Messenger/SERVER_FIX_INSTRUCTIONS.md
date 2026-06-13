# === ИНСТРУКЦИЯ ДЛЯ СЕРВЕРА ===

## ПРОБЛЕМА:
Сборка падает на файле `__AuthPage.tsx` который существует только на сервере.

## РЕШЕНИЕ:

### 1. УДАЛИТЬ __AuthPage.tsx
```bash
cd ~/Messenger_Balloo_next_ts/messenger
rm -f src/components/pages/__AuthPage.tsx
```

### 2. ПЕРЕСОБРАТЬ ПРИЛОЖЕНИЕ
```bash
cd ~/Messenger_Balloo_next_ts/messenger

# Остановить PM2
pm2 stop messenger-alpha

# Очистить кэш
rm -rf .next

# Пересобрать
NODE_ENV=production npx next build

# Запустить
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha" --update-env

# Сохранить
pm2 save

# Проверить
pm2 status
pm2 logs messenger-alpha --lines 20
```

### 3. ЕСТЬ ЛИ ОШИБКИ?
Если сборка прошла успешно - сообщения должны работать через Prisma.

Если есть другие ошибки - скопируй их сюда.
