# 🚀 Инструкция по деплою Balloo Messenger на Ubuntu Server

**Сервер:** Ubuntu 20.04+ / 22.04 LTS  
**Email:** i@o8eryuhtin.ru  
**Домен:** alpha.balloo.su

---

## 📋 Предварительные требования

### На сервере должна быть установлена:
- Node.js 20.x
- PM2
- Nginx
- Git

---

## ⚡ Быстрый деплой (1 команда)

```bash
cd ~/Messenger_Balloo_next_ts && bash messenger/deploy-and-fix.sh
```

---

## 🔧 Ручной деплой (пошагово)

### Шаг 1: Подключение к серверу

```bash
ssh balloo@31.128.37.165
```

### Шаг 2: Переход в директорию проекта

```bash
cd ~/Messenger_Balloo_next_ts
```

### Шаг 3: Обновление кода из Git

```bash
git pull origin main
```

### Шаг 4: Переход в папку messenger

```bash
cd messenger
```

### Шаг 5: Установка зависимостей

```bash
npm install --production
```

### Шаг 6: Остановка приложения PM2

```bash
pm2 stop messenger-alpha || true
```

### Шаг 7: Очистка предыдущей сборки

```bash
rm -rf .next
```

### Шаг 8: Создание переменной окружения

```bash
# Создаём .env.local если нет
cat > .env.local << EOF
NODE_ENV=production
ADMIN_EMAIL=i@o8eryuhtin.ru
ADMIN_PASSWORD=BallooAdmin2024!SecurePass#XyZ
ADMIN_DISPLAY_NAME=Balloo_father
ADMIN_FULL_NAME=Оберюхтин Иван Анатольевич
JWT_SECRET=$(openssl rand -hex 32)
VAPID_PRIVATE_KEY=$(openssl rand -base64 64)
EOF
```

### Шаг 9: Сборка приложения

```bash
NODE_ENV=production npx next build
```

### Шаг 10: Запуск приложения через PM2

```bash
NODE_ENV=production pm2 start "npx next start -p 3000" --name messenger-alpha --update-env
```

### Шаг 11: Сохранение списка процессов PM2

```bash
pm2 save
```

### Шаг 12: Перезагрузка Nginx

```bash
sudo systemctl reload nginx
```

---

## ✅ Проверка деплоя

### Статус PM2

```bash
pm2 status messenger-alpha
```

### Логи приложения

```bash
pm2 logs messenger-alpha --lines 20
```

### Проверка доступности

```bash
curl https://alpha.balloo.su
```

### Проверка базы данных

```bash
cd messenger
ls -la data/app.db
sqlite3 data/app.db ".tables"
```

---

## 🔍 Диагностика проблем

### Приложение не запускается

```bash
# Проверить статус
pm2 status messenger-alpha

# Посмотреть логи
pm2 logs messenger-alpha

# Проверить порт 3000
lsof -i :3000

# Удалить процесс на порту если есть
sudo kill -9 $(lsof -t -i:3000) || true
```

### Ошибка сборки

```bash
# Очистить cache
rm -rf .next node_modules

# Переустановить зависимости
npm install --production

# Пересобрать
NODE_ENV=production npx next build
```

### Ошибка базы данных

```bash
# Проверить файл БД
ls -la messenger/data/app.db

# Проверить таблицы
sqlite3 messenger/data/app.db ".tables"

# Проверить права доступа
chmod 755 messenger/data
chmod 644 messenger/data/app.db
```

### Ошибка 502 Bad Gateway (Nginx)

```bash
# Проверить статус PM2
pm2 status messenger-alpha

# Перезапустить приложение
pm2 restart messenger-alpha

# Проверить логи Nginx
sudo tail -f /var/log/nginx/error.log

# Перезагрузить Nginx
sudo systemctl reload nginx
```

---

## 📊 Мониторинг

### Статус всех процессов

```bash
pm2 status
```

### Мониторинг в реальном времени

```bash
pm2 monit
```

### Логи в реальном времени

```bash
pm2 logs messenger-alpha
```

### Статистика процесса

```bash
pm2 show messenger-alpha
```

### Использование ресурсов

```bash
pm2 list
```

---

## 🔐 Безопасность

### Проверка .gitignore

```bash
cd messenger
cat .gitignore | grep -E "config.json|.env|*.db"
```

### Генерация новых секретов

```bash
cd messenger
cat > .env.local << EOF
NODE_ENV=production
JWT_SECRET=$(openssl rand -hex 32)
VAPID_PRIVATE_KEY=$(openssl rand -base64 64)
ADMIN_PASSWORD=$(openssl rand -base64 12)
EOF
```

---

## 🔄 Откат на предыдущую версию

```bash
cd ~/Messenger_Balloo_next_ts

# Откат на последний коммит
git reset --hard HEAD~1

# Пересобрать
cd messenger
rm -rf .next
npm install --production
NODE_ENV=production npx next build

# Перезапустить
pm2 restart messenger-alpha
```

---

## 📝 Полезные команды

### Остановка приложения

```bash
pm2 stop messenger-alpha
```

### Запуск приложения

```bash
pm2 start messenger-alpha
```

### Перезапуск приложения

```bash
pm2 restart messenger-alpha
```

### Полная остановка PM2

```bash
pm2 stop all
```

### Удаление приложения из PM2

```bash
pm2 delete messenger-alpha
```

### Очистка логов PM2

```bash
pm2 flush
```

---

## 🎯 Рекомендации

1. **Автоматический перезапуск при падении:**
   ```bash
   pm2 startup
   pm2 save
   ```

2. **Логирование в файлы:**
   ```bash
   pm2 start "npx next start -p 3000" --name messenger-alpha --log /var/log/messenger-alpha.log
   ```

3. **Автоматическое обновление PM2:**
   ```bash
   npm install pm2@latest -g
   pm2 update
   ```

4. **Резервное копирование БД:**
   ```bash
   cp messenger/data/app.db messenger/data/app.db.backup.$(date +%Y%m%d)
   ```

---

**Поддержка:** i@o8eryuhtin.ru  
**Версия:** 1.0  
**Последнее обновление:** 2026-04-30
