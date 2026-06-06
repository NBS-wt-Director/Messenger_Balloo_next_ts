 # 🔄 Миграция Messenger на внешний API

**Дата:** 2024-01-01  
**Статус:** В процессе  

---

## 📊 Текущий статус

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| **Настройки (settings/)** | ✅ Готово | Централизованные конфиги |
| **API Client** | ✅ Готово | messenger/src/api/client.ts |
| **Environment (messenger)** | ✅ Готово | USE_NEW_API=true |
| **Environment (api)** | ✅ Готово | .env.local создан |
| **Environment (admin)** | ⏳ TODO | Нужно обновить |
| **Переключение endpoints** | ⏳ TODO | Следующий шаг |
| **Удаление Next.js API** | ⏳ TODO | После тестирования |

---

## 📁 Созданные файлы

```
settings/src/config.ts              ✅ (+API, Messenger, Admin конфиги)
messenger/.env.local                ✅ (USE_NEW_API=true)
messenger/src/api/client.ts         ✅ (Полный API клиент)
api/.env.local                      ✅ (Конфиг API сервера)
```

---

## ⚙️ Конфигурация

### 1. Messenger (.env.local)

```env
# Переключение на новый внешний API
USE_NEW_API=true

# API сервер
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Frontend
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
```

### 2. API Server (.env.local)

```env
PORT=3001
API_URL=http://localhost:3001
MESSENGER_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002
```

### 3. Admin Portal (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
```

---

## 🚀 Запуск

### Шаг 1: Запустить API сервер

```bash
cd api
npm install
npm run dev
# http://localhost:3001/api/v1/health → 200 OK
```

### Шаг 2: Запустить Messenger

```bash
cd messenger
npm install
npm run dev
# http://localhost:3000
```

### Шаг 3: Запустить Admin Portal

```bash
cd admin-portal
npm install
npm run dev
# http://localhost:3002
```

---

## 🔄 План миграции

### Этап 1: Настройка окружения (✅ Выполнено)

- [x] Обновить settings/config.ts
- [x] Создать api/.env.local
- [x] Обновить messenger/.env.local
- [x] Создать API клиент

### Этап 2: Обновление Admin Portal (📅 День 1)

```bash
cd admin-portal
# Обновить .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Этап 3: Тестирование API (📅 День 1-2)

**Тесты через Postman:**
```
GET http://localhost:3001/api/v1/health
POST http://localhost:3001/api/v1/auth/register
POST http://localhost:3001/api/v1/auth/login
GET http://localhost:3001/api/v1/chats
GET http://localhost:3001/api/v1/notifications
```

### Этап 4: Переключение Messenger endpoints (📅 День 2-3)

**Файлы для обновления:**
```
messenger/src/lib/api/
├── auth.ts          → Использовать authApi из client.ts
├── chats.ts         → Использовать chatsApi из client.ts
├── messages.ts      → Использовать messagesApi из client.ts
├── users.ts         → Использовать usersApi из client.ts
└── ...
```

**Пример:**
```typescript
// Было (Next.js API Routes)
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// Стало (внешний API)
import { authApi } from '@/api/client';
const response = await authApi.login(email, password);
```

### Этап 5: Переключение WebSocket (📅 День 3)

```typescript
// Было
const ws = new WebSocket('ws://localhost:3000');

// Стало
const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
```

### Этап 6: Тестирование (📅 День 4)

**Функциональные тесты:**
- [ ] Регистрация/Вход
- [ ] Создание чатов
- [ ] Отправка сообщений
- [ ] Загрузка файлов
- [ ] Уведомления
- [ ] Контакты
- [ ] Пригласительные
- [ ] Admin panel

### Этап 7: Удаление Next.js API Routes (📅 День 5)

```bash
# Удалить серверную часть из messenger
rm -rf messenger/src/app/api/
rm messenger/src/lib/email.js
rm messenger/src/lib/verification-code.js
rm messenger/src/lib/database.js

# Оставить только фронтенд
messenger/src/lib/database/  # Только RxDB (IndexedDB)
messenger/src/api/           # API клиент
```

---

## 🧪 Тестирование

### Health Check

```bash
curl http://localhost:3001/api/v1/health
# {"status":"ok","timestamp":"..."}
```

### Регистрация

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@balloo.ru","password":"Test1234!","displayName":"Test User"}'
```

### Логин

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@balloo.ru","password":"Test1234!"}'
```

### Получить чаты

```bash
curl http://localhost:3001/api/v1/chats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Заметки

### Feature Flag

Для плавного перехода можно использовать feature flag:

```env
# .env.local
USE_NEW_API=true  # false = использовать Next.js API Routes
```

### Откат

Если что-то пошло не так:

```env
USE_NEW_API=false
```

Messenger автоматически переключится на Next.js API Routes.

---

## ✅ Критерии завершения

- [x] Настройки централизованы в settings/
- [x] API клиент создан
- [x] Environment файлы обновлены
- [ ] Admin Portal переключен
- [ ] Messenger переключен
- [ ] WebSocket переключен
- [ ] Все тесты пройдены
- [ ] Next.js API Routes удалены

---

## 🎯 Следующие шаги

1. **Сегодня:** Обновить admin-portal/.env.local
2. **Завтра:** Тестирование API через Postman
3. **Послезавтра:** Переключение auth endpoints в messenger
4. **День 4:** Переключение chats/messages
5. **День 5:** Удаление Next.js API Routes

---

**NLP-Core-Team** - App Balloo Project
