# 🚀 Инструкция по деплою Balloo Messenger

**Email:** i@o8eryuhtin.ru  
**Сервер:** alpha.balloo.su

---

## 📋 Предварительные требования

- Ubuntu/Debian server
- Node.js 20.x
- PM2
- Nginx
- Git

---

## ⚡ Автоматический деплой (рекомендуется)

```bash
cd ~/Messenger_Balloo_next_ts && bash messenger/deploy-and-fix.sh
```

Скрипт выполняет:
1. git pull
2. npm install
3. Инициализация SQLite (автоматически при первом запуске)
4. next build
5. pm2 restart
6. nginx reload

---

## 🔧 Ручной деплой

### Шаг 1: Подключение

```bash
ssh balloo@31.128.37.165
cd ~/Messenger_Balloo_next_ts
```

### Шаг 2: Обновление кода

```bash
git pull origin main
```

### Шаг 3: Установка зависимостей

```bash
cd messenger
npm install --production
```

### Шаг 4: Сборка

```bash
pm2 stop messenger-alpha || true
rm -rf .next
NODE_ENV=production npx next build
```

### Шаг 5: Запуск

```bash
NODE_ENV=production pm2 start "npx next start -p 3000" --name messenger-alpha --update-env
pm2 save
```

### Шаг 6: Nginx

```bash
sudo systemctl reload nginx
```

---

## ✅ Проверка

```bash
# Статус PM2
pm2 status messenger-alpha

# Логи
pm2 logs messenger-alpha --lines 20

# Доступность
curl https://alpha.balloo.su
```

---

## 🔍 Диагностика

### Проблемы и решения

**Ошибка: Нет системных чатов**
```bash
cd messenger
npx ts-node scripts/createSystemChats.ts user-id
```

**Ошибка: Сборка не работает**
```bash
rm -rf .next node_modules
npm install --production
npm run build
```

**Ошибка: Порт 3000 занят**
```bash
lsof -i :3000
sudo kill -9 PID
```

---

## 📊 Мониторинг

```bash
# Статус
pm2 status

# Логи в реальном времени
pm2 logs messenger-alpha

# Статистика
pm2 show messenger-alpha

# Ресурсы
pm2 monit
```

---

**Поддержка:** i@o8eryuhtin.ru
