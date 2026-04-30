# 🚀 Balloo Messenger - Инструкция для деплоя на production сервер

## ⚡ Однокомандный деплой (рекомендуется)

На сервере выполните:

```bash
bash <(curl -s https://raw.githubusercontent.com/NBS-wt-Director/Messenger_Balloo_next_ts/main/DEPLOY_ONE_COMMAND.sh)
```

Или скопируйте и выполните команду ниже вручную.

---

## 📋 Ручной деплой (по шагам)

### 1. Обновление кода

```bash
cd ~/Messenger_Balloo_next_ts
git pull origin main
```

### 2. Установка зависимостей

```bash
cd messenger
npm ci --only=production
```

### 3. Генерация Prisma Client

```bash
npx prisma generate
```

### 4. Применение миграций БД

```bash
npx prisma migrate deploy
```

### 5. Сборка production версии

```bash
rm -rf .next
NODE_ENV=production npx next build
```

### 6. Перезапуск PM2

```bash
pm2 stop messenger-alpha 2>/dev/null || true
pm2 delete messenger-alpha 2>/dev/null || true
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha" --update-env
pm2 save
```

### 7. Проверка

```bash
pm2 status messenger-alpha
pm2 logs messenger-alpha --lines 20
curl http://localhost:3000
sudo systemctl status nginx
```

---

## 🔧 Полная команда для копирования

Скопируйте и выполните на сервере:

```bash
cd ~/Messenger_Balloo_next_ts && git pull origin main && cd messenger && npm ci --only=production && npx prisma generate && npx prisma migrate deploy && rm -rf .next && NODE_ENV=production npx next build && pm2 stop messenger-alpha 2>/dev/null; pm2 delete messenger-alpha 2>/dev/null; NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha" --update-env && pm2 save && pm2 status && pm2 logs messenger-alpha --lines 10 --nostream
```

---

## 🔍 Проверка после деплоя

### Статус приложения

```bash
pm2 status
```

Ожидаемый результат: `messenger-alpha` должен быть `online`

### Логи приложения

```bash
pm2 logs messenger-alpha --lines 20
```

Искать строки:
- ✅ `✓ Ready in XXXXms`
- ❌ Ошибки и исключения

### Доступность приложения

```bash
curl -I http://localhost:3000
```

Ожидаемый результат: `HTTP/1.1 200 OK`

### Проверка через nginx

```bash
curl -I https://alpha.balloo.su
```

Ожидаемый результат: `HTTP/2 200`

### Статус nginx

```bash
sudo systemctl status nginx
sudo nginx -t
```

---

## 🛠️ Устранение проблем

### Приложение не запускается

```bash
# Проверка логов
pm2 logs messenger-alpha --err --lines 50

# Перезапуск
pm2 restart messenger-alpha

# Проверка порта
netstat -tlnp | grep 3000
```

### Ошибки базы данных

```bash
# Проверка DATABASE_URL
cat .env | grep DATABASE_URL

# Перегенерация Prisma
npx prisma generate
npx prisma migrate deploy

# Проверка файла БД
ls -la prisma/dev.db
```

### Ошибки сборки

```bash
# Очистка кэша
rm -rf .next node_modules
npm ci --only=production
npx prisma generate
NODE_ENV=production npx next build
```

### PM2 не сохраняет процесс

```bash
# Сохранение
pm2 save

# Автоматический запуск при старте системы
pm2 startup
# Выполнить команду, которая выводится
```

---

## 📊 Мониторинг

### Просмотр ресурсов

```bash
pm2 monit
```

### Обновление приложения

```bash
pm2 reload messenger-alpha
```

### Просмотр логов в реальном времени

```bash
pm2 logs messenger-alpha --lines 100 --nostream
```

---

## 🔐 Перед деплоем - ОБЯЗАТЕЛЬНО

### 1. Проверка переменных окружения

```bash
# Проверка .env.production
cat .env.production

# Должны быть заполнены:
# - DATABASE_URL
# - JWT_SECRET (минимум 32 символа)
# - ENCRYPTION_KEY (минимум 32 символа)
# - NEXT_PUBLIC_SERVER_URL
```

### 2. Генерация секретов (если нужно)

```bash
# На локальной машине
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # ENCRYPTION_KEY

# Добавить в .env.production на сервере
nano .env.production
```

### 3. Проверка перед деплоем

```bash
node scripts/pre-deploy-check.js
```

---

## 📝 Чеклист деплоя

- [ ] Secrets сгенерированы и добавлены в .env.production
- [ ] DATABASE_URL настроен
- [ ] npm ci выполнен успешно
- [ ] Prisma migrations применены
- [ ] Сборка прошла без ошибок
- [ ] PM2 процесс запущен (status: online)
- [ ] Логи не содержат критических ошибок
- [ ] Приложение доступно через http://localhost:3000
- [ ] Приложение доступно через https://alpha.balloo.su
- [ ] Nginx работает корректно

---

## 🔄 Автоматический деплой (CI/CD)

Для автоматического деплоя при push в main:

### GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd messenger
          npm ci
      
      - name: Build
        run: |
          cd messenger
          npx prisma generate
          npm run build
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd ~/Messenger_Balloo_next_ts
            bash DEPLOY_ONE_COMMAND.sh
```

---

## 📞 Поддержка

При проблемах проверьте:
1. Логи PM2: `pm2 logs messenger-alpha`
2. Логи nginx: `sudo tail -50 /var/log/nginx/error.log`
3. Статус БД: `ls -la prisma/dev.db`
4. Переменные окружения: `cat .env.production`

---

*Документация обновлена: 2025*
