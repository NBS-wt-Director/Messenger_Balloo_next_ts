 # Админ-панель App Balloo - Руководство по запуску

## 🚀 Быстрый старт

### 1. Установить зависимости

```bash
cd settings
npm install
npm run build

cd ../api
npm install

cd ../admin-portal
npm install
npm install ../settings
```

### 2. Настроить окружение

**admin-portal/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
```

**api/.env:**
```env
PORT=3001
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### 3. Запустить сервисы

**С терминала 1 (API):**
```bash
cd api
npm run dev
```

**С терминала 2 (Admin Portal):**
```bash
cd admin-portal
npm run dev
```

### 4. Открыть админку

- **API:** http://localhost:3001
- **Admin Portal:** http://localhost:3002
- **Login:** http://localhost:3002/login

---

## 🔐 Вход в админку

Для входа нужны права администратора.

**Создать супер-админа (первый запуск):**

```javascript
// В базе данных выполнить:
UPDATE users 
SET isAdmin = 1, isSuperAdmin = 1, adminRoles = '["director"]'
WHERE email = 'admin@example.com';
```

**Или через API:**
```bash
curl -X PUT http://localhost:3001/api/v1/admin/users/{userId}/role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isAdmin": true, "isSuperAdmin": true, "adminRoles": ["director"]}'
```

---

## 📁 Структура проекта

```
admin-portal/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx          # Главная админки
│   │   ├── login/
│   │   │   └── page.tsx          # Страница входа
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Стили
│   ├── components/
│   │   ├── Users.tsx              # Управление пользователями
│   │   ├── Chats.tsx              # Управление чатами
│   │   ├── InternalChat.tsx       # Корпоративный чат NBS w-t
│   │   ├── Support.tsx            # Техподдержка
│   │   └── Versions.tsx           # Управление версиями
│   ├── lib/
│   │   └── api-client.ts          # API клиент
│   └── stores/
│       └── auth-store.ts          # Auth store
└── ...config files
```

---

## 🎯 Функционал админки

### 1. Дашборд
- Общая статистика (пользователи, чаты, сообщения)
- Активные пользователи за сегодня
- Новые пользователи за сегодня

### 2. Пользователи
- Просмотр списка (поиск, фильтрация)
- Управление правами (Admin/SuperAdmin)
- Назначение ролей (support, moderator, manager)
- Блокировка пользователей
- Управление сессиями и устройствами
- Управление E2E ключами

### 3. Чаты
- Просмотр всех чатов
- Фильтрация по типу (личный/группа/корпоративная)
- Удаление чатов
- **Защита от удаления корпоративных групп**

### 4. Корпоративный чат NBS w-t ⭐
- Создание неудаляемых групп (только super-admin)
- Управление участниками
- Только для сотрудников с правами администратора
- P2P и групповые чаты

### 5. Техподдержка ⭐
- Система тикетов (CRUD)
- Приоритеты: high/medium/low
- Статусы: open/in-progress/resolved/closed
- Назначение исполнителей
- Общение с пользователем
- Фильтрация по статусу и приоритету

### 6. Версии приложений
- CRUD версий
- Force update
- Release notes
- Поддержка платформ: Android, iOS, Web, Desktop

---

## 🔌 API Endpoints

### Internal Chat (NBS w-t)
```
GET    /api/v1/admin/internal-chat/groups          - Получить группы
POST   /api/v1/admin/internal-chat/groups          - Создать группу
POST   /api/v1/admin/internal-chat/groups/:id/members - Добавить участников
DELETE /api/v1/admin/internal-chat/groups/:id/members/:userId - Удалить участника
```

### Support
```
GET    /api/v1/admin/support/tickets                - Получить тикеты
GET    /api/v1/admin/support/tickets/:id            - Детали тикета
POST   /api/v1/admin/support/tickets                - Создать тикет
PUT    /api/v1/admin/support/tickets/:id            - Обновить тикет
POST   /api/v1/admin/support/tickets/:id/messages   - Добавить сообщение
GET    /api/v1/admin/support/staff                  - Получить сотрудников
```

### Админ (общие)
```
GET    /api/v1/admin/users                          - Список пользователей
PUT    /api/v1/admin/users/:id/role                 - Изменить роль
DELETE /api/v1/admin/users/:id                      - Заблокировать
GET    /api/v1/admin/chats                          - Список чатов
DELETE /api/v1/admin/chats/:id                      - Удалить чат
GET    /api/v1/admin/analytics                      - Аналитика
GET    /api/v1/admin/versions                       - Версии
```

---

## 🛡️ Безопасность

- JWT аутентификация
- Middleware `requireAdmin` проверяет права администратора
- SuperAdmin может назначать других SuperAdmin'ов
- Корпоративные группы неудаляемы (защита на уровне API)

---

## 🧪 Тестирование

```bash
# TypeScript проверка
npm run typecheck

# Линтер
npm run lint

# Build
npm run build
```

---

## 📦 Production деплой

```bash
# Build
cd admin-portal
npm run build

# Start
npm start
```

**Environment variables для production:**
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.balloo.su/api/v1
NEXT_PUBLIC_ADMIN_URL=https://admin.balloo.su
```

---

## 🐛 Известные проблемы

- Нет WebSocket для real-time обновлений (опционально)
- Нет email уведомлений для тикетов (опционально)

---

## 📞 Поддержка

NLP-Core-Team - App Balloo Project
