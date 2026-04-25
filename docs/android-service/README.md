# ⚙️ Balloo Android Service

**Node.js + Express сервис для SMS, Admin API и Push**

---

## 📑 Содержание

1. [Обзор](#обзор)
2. [Быстрый Старт](#быстрый-старт)
3. [API Endpoints](#api-endpoints)
4. [Структура](#структура)
5. [Конфигурация](#конфигурация)
6. [Деплой](#деплой)

---

## Обзор

Бэкенд сервис для Android функций: SMS рассылки, управление пользователями, push-уведомления.

### Статус: ✅ Готово (70%)

---

## Быстрый Старт

```bash
# 1. Установить зависимости
npm install

# 2. Настроить .env
cp .env.example .env

# 3. Запустить
npm run dev
# http://localhost:4000
```

---

## API Endpoints

### SMS

```
POST /api/sms/send
{
  "to": "+79991234567",
  "message": "Ваш код: 12345"
}
```

### Admin

```
GET /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
```

### Push

```
POST /api/push/send
{
  "userId": "uuid",
  "title": "Новое сообщение",
  "body": "От: Иван"
}
```

### Statistics

```
GET /api/stats
```

---

## Структура

```
android-service/
├── src/
│   ├── routes/          # Express routes
│   │   ├── sms.ts
│   │   ├── admin.ts
│   │   └── push.ts
│   ├── services/        # Business logic
│   │   ├── sms.ts
│   │   ├── firebase.ts
│   │   └── admin.ts
│   ├── middleware/      # Auth, validation
│   └── index.ts         # Entry point
├── config/              # Конфигурация
├── android/             # Android app (опционально)
└── package.json
```

---

## Конфигурация

**.env:**
```env
PORT=4000
NODE_ENV=development

# Firebase
FIREBASE_CREDENTIALS=...

# Twilio (SMS)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# JWT
JWT_SECRET=...
```

---

## Деплой

### VPS

```bash
# На сервере
cd /var/www/balloo/android-service
npm install --production
npm run build

# PM2
pm2 start npm --name balloo-service -- start
pm2 save
pm2 startup

# Nginx
server {
  listen 80;
  server_name api.balloo.ru;
  
  location / {
    proxy_pass http://localhost:4000;
  }
}
```

### Docker

```bash
# Build
docker build -t balloo-service .

# Run
docker run -p 4000:4000 --env-file .env balloo-service
```

---

## Известные Проблемы

- [ ] SMS limit Twilio не обрабатывается
- [ ] Firebase token refresh не оптимален

---

**Balloo Android Service - Мобильная связь под контролем!** ⚙️
