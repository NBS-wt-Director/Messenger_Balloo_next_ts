# 🚀 ПОЛНАЯ ИНСТРУКЦИЯ ПО ДЕПЛОЮ Balloo Messenger

## 📋 ПРЕДВАРИТЕЛЬНАЯ ПРОВЕРКА (ЛОКАЛЬНО)

### 1. Проверка изменений
```bash
cd ~/Messenger_Balloo_next_ts

git status
git diff
```

### 2. Проверка .env файлов
```bash
# Проверить .env.production
cat messenger/.env.production

# Убедиться что есть:
# SMTP_USER=balloo.Messenger@yandex.ru
# SMTP_PASS=gouewuqhsufqsbgu
# DATABASE_URL="file:./data/app.db"
```

### 3. Локальная сборка (ОБЯЗАТЕЛЬНО!)
```bash
cd messenger
npm install
NODE_ENV=production npm run build

# Если есть ошибки - исправить перед деплоем!
```

---

## 📤 ШАГ 1: ЗАГРУЗКА НА GIT (ЛОКАЛЬНО)

```bash
cd ~/Messenger_Balloo_next_ts

# Добавить все изменения
git add .

# Коммит
git commit -m "feat: email верификация + SMTP + обновление версии 01.06.2026"

# Пуш на удалённый репозиторий
git push origin main
# или: git push origin master
```

---

## 🔌 ШАГ 2: ПОДКЛЮЧЕНИЕ К СЕРВЕРУ

```bash
# SSH подключение
ssh root@31.128.37.165

# Ввести пароль
```

---

## 📥 ШАГ 3: ОБОБНОВЛЕНИЕ КОДА НА СЕРВЕРЕ

```bash
# Перейти в проект
cd ~/Messenger_Balloo_next_ts

# Обновить код с Git
git pull origin main
# или: git pull origin master

# Проверить обновления
git log --oneline -5
```

---

## 📦 ШАГ 4: УСТАНОВКА ЗАВИСИМОСТЕЙ

```bash
# Перейти в папку messenger
cd messenger

# Очистка (если были проблемы)
rm -rf node_modules package-lock.json

# Установка зависимостей
npm install

# Проверить nodemailer
npm list nodemailer
# Должно показать: nodemailer@6.9.x
```

---

## 💾 ШАГ 5: ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ

### 5.1 Создать папку data
```bash
mkdir -p data
ls -lh data/
```

### 5.2 Запустить инициализацию БД
```bash
node scripts/init-db.js
```

**Ожидаемый вывод:**
```
✓ База данных инициализирована успешно
✓ Путь к БД: /root/Messenger_Balloo_next_ts/messenger/data/app.db
✓ Таблиц: 18
  - User
  - Chat
  - ChatMember
  - Message
  - VerificationCode
  - ...
✓ Создан системный чат новостей
✓ Создаём тестового пользователя...
✓ Пользователь создан: admin@test.com
✓ Номер пользователя: #1
✓ Баланс баллов: 5000
✓ РОЛЬ: СУПЕР-АДМИН (первый пользователь!)
✓ Инициализация завершена
```

### 5.3 Проверить таблицы
```bash
sqlite3 data/app.db ".tables"
# Должно показать: User Chat ChatMember Message VerificationCode ...

sqlite3 data/app.db "PRAGMA table_info(User);"
# Проверить что есть поля: emailVerified, points, userNumber, avatarHistory

sqlite3 data/app.db "PRAGMA table_info(VerificationCode);"
# Проверить структуру таблицы
```

### 5.4 Проверить пользователя
```bash
sqlite3 data/app.db "SELECT id, email, displayName, adminRoles, userNumber, points FROM User;"
# Должен быть: admin@test.com с adminRoles=["superadmin"]
```

---

## ⚙️ ШАГ 6: ПРОВЕРКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ

```bash
# Проверить .env.production
cat .env.production

# Убедиться что есть:
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=balloo.Messenger@yandex.ru
SMTP_PASS=gouewuqhsufqsbgu
DATABASE_URL="file:./data/app.db"
FRONTEND_URL=https://alpha.balloo.su
```

---

## 🔨 ШАГ 7: СБОРКА ПРИЛОЖЕНИЯ

```bash
# Очистить старую сборку
rm -rf .next

# Production сборка
NODE_ENV=production npm run build

# Ожидать завершения (2-5 минут)

# Проверить сборку
ls -lh .next/
```

---

## 🚀 ШАГ 8: ЗАПУСК PM2

### 8.1 Остановить старое приложение (если есть)
```bash
pm2 stop messenger-alpha 2>/dev/null || true
pm2 delete messenger-alpha 2>/dev/null || true
```

### 8.2 Запустить новое приложение
```bash
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha"
```

### 8.3 Сохранить список процессов
```bash
pm2 save
```

### 8.4 Настроить автозапуск
```bash
pm2 startup
# Скопировать команду из вывода и выполнить её
```

---

## 📊 ШАГ 9: ПРОВЕРКА РАБОТЫ

### 9.1 Статус PM2
```bash
pm2 status
pm2 list
```

### 9.2 Логи приложения
```bash
pm2 logs messenger-alpha --lines 50

# Искать:
# ✓ Все таблицы созданы успешно
# ✓ База данных инициализирована
# - Ошибки компиляции
```

### 9.3 Проверка API
```bash
# Проверить что сервер отвечает
curl -I http://localhost:3000

# Проверить API версий
curl http://localhost:3000/api/versions

# Проверка регистрации (ТЕСТ!)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-deploy@balloo.su",
    "password": "Test1234!",
    "displayName": "Test Deploy"
  }'
```

**Ожидаемый вывод:**
```json
{
  "success": true,
  "user": {...},
  "systemChats": {...},
  "requiresVerification": true,
  "emailMasked": "tes***@balloo.su",
  "codeHint": "солнце-месяц-звезда..."
}
```

### 9.4 Проверить код в логах
```bash
pm2 logs messenger-alpha | grep "Verification code"
# Должен показать код: [Email] CODE: солнце-месяц-звезда-небо-земля-вода-огонь
```

### 9.5 Проверить БД
```bash
sqlite3 data/app.db "SELECT id, email, displayName, userNumber, points, emailVerified FROM User ORDER BY userNumber LIMIT 5;"
```

---

## 🌐 ШАГ 10: NGINX НАСТРОЙКА (ЕСЛИ ИСПОЛЬЗУЕТСЯ)

### 10.1 Проверить конфиг
```bash
cat /etc/nginx/sites-enabled/balloo.su
```

### 10.2 Если нужно - создать конфиг
```bash
nano /etc/nginx/sites-available/balloo.su
```

**Пример конфигурации:**
```nginx
server {
    listen 80;
    server_name alpha.balloo.su;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 10.3 Активировать
```bash
ln -s /etc/nginx/sites-available/balloo.su /etc/nginx/sites-enabled/
nginx -t
nginx -s reload
```

---

## 🔒 ШАГ 11: SSL СЕРТИФИКАТ (LET'S ENCRYPT)

```bash
# Установить certbot
apt update
apt install certbot python3-certbot-nginx

# Получить сертификат
certbot --nginx -d alpha.balloo.su

# Проверить автообновление
certbot renew --dry-run
```

---

## 🧪 ШАГ 12: ФИНАЛЬНОЕ ТЕСТИРОВАНИЕ

### 12.1 Регистрация через браузер
```
Открыть: https://alpha.balloo.su
Зарегистрировать нового пользователя
Проверить модальное окно верификации
```

### 12.2 Проверка email
```bash
# Если SMTP настроен - проверить почту:
# balloo.Messenger@yandex.ru
# Должно прийти письмо с кодом

# Или посмотреть в логах:
pm2 logs messenger-alpha | grep -i "verification code"
```

### 12.3 Проверка верификации
```bash
# Получить код из лога или email
# Затем проверить:
curl -X POST http://localhost:3000/api/auth/verification/verify \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-xxx",
    "code": "солнце-месяц-звезда-небо-земля-вода-огонь"
  }'
```

---

## ✅ ЧЕК-ЛИСТ ДЕПЛОЯ

### Перед деплоем (локально):
- [ ] `git status` показывает ожидаемые изменения
- [ ] `npm run build` проходит без ошибок
- [ ] `.env.production` содержит SMTP_USER=balloo.Messenger@yandex.ru
- [ ] Git репозиторий обновлён (`git push`)

### На сервере:
- [ ] `git pull` выполнен успешно
- [ ] `npm install` завершён без ошибок
- [ ] `node scripts/init-db.js` выполнился успешно
- [ ] Таблица VerificationCode создана
- [ ] Пользователь admin@test.com создан
- [ ] `NODE_ENV=production npm run build` завершён
- [ ] PM2 процесс запущен (`pm2 status`)
- [ ] `pm2 logs` не содержит критических ошибок
- [ ] `curl http://localhost:3000/api/versions` работает
- [ ] Регистрация работает
- [ ] Email верификация работает (код показан в логах)

### После деплоя:
- [ ] Сайт доступен по HTTPS
- [ ] SSL сертификат валиден
- [ ] Nginx работает (`nginx -t`)
- [ ] PM2 автозапуск настроен (`pm2 startup`)
- [ ] Логи ротируются (`pm2 logrotate`)

---

## 🐛 УСТРАНЕНИЕ ПРОБЛЕМ

### Проблема: PM2 процесс упал
```bash
pm2 logs messenger-alpha --lines 100
pm2 restart messenger-alpha
pm2 save
```

### Проблема: Ошибки сборки
```bash
rm -rf .next node_modules
npm install
NODE_ENV=production npm run build
pm2 restart messenger-alpha
```

### Проблема: База данных не открывается
```bash
chmod 660 data/app.db
ls -lh data/
sqlite3 data/app.db "PRAGMA journal_mode = WAL;"
```

### Проблема: Таблица VerificationCode не создана
```bash
# Пересоздать БД (ОСТОРОЖНО! Удаляет все данные!)
rm -f data/app.db data/app.db-wal data/app.db-shm
node scripts/init-db.js
pm2 restart messenger-alpha
```

### Проблема: Email не отправляется
```bash
# Проверить SMTP
cat .env.production | grep SMTP

# Код будет показан в логах (если SMTP не работает):
pm2 logs messenger-alpha | grep "Verification code"
```

---

## 📞 КОНТАКТЫ

**Разработчик:** Оберюхтин-Кравец Иван Анатольевич  
**Email:** balloo.Messenger@yandex.ru  
**Сервер:** 31.128.37.165:3000  
**Домен:** alpha.balloo.su  
**Дата:** 2026-06-01

---

**Версия инструкции:** 2.0  
**Статус:** ✅ Готово к деплою
