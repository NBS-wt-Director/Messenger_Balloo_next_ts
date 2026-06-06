# App Balloo Admin Portal

Админ-панель для управления мессенджером App Balloo с корпоративным чатом и техподдержкой.

## 🚀 Быстрый старт

### Установка

```bash
cd admin-portal
npm install
```

### Настройка

```bash
cp .env.local.example .env.local
```

Отредактируйте `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
```

### Запуск

```bash
# Разработка
npm run dev

# Продакшен
npm run build
npm start
```

Админка запустится на `http://localhost:3002`

---

## 📁 Структура

```
admin-portal/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx          # Главная админки
│   │   ├── login/
│   │   │   └── page.tsx          # Страница входа
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Глобальные стили
│   ├── components/
│   │   ├── InternalChat.tsx       # Корпоративный чат
│   │   └── Support.tsx            # Техподдержка
│   ├── lib/
│   │   └── api-client.ts          # API клиент
│   └── stores/
│       └── auth-store.ts          # Auth store
├── .env.local.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Функционал

### 1. Дашборд
- Общая статистика (пользователи, чаты, сообщения, админы)
- Системная информация

### 2. Управление пользователями
- Просмотр списка пользователей
- Поиск и фильтрация
- Управление ролями (admin/super-admin)
- Блокировка/разблокировка
- Сброс пароля
- Управление сессиями и устройствами
- Управление E2E ключами

### 3. Управление чатами
- Просмотр всех чатов
- Детали чата (участники, статистика)
- Удаление чатов

### 4. Управление сообщениями
- Глобальный поиск сообщений
- Удаление сообщений

### 5. **Корпоративный чат NBS w-t** ⭐
- Создание неудаляемых групп
- Управление участниками
- Доступно только из админки
- Только для сотрудников с правами администратора

### 6. **Техподдержка** ⭐
- Система тикетов
- Приоритеты (high/medium/low)
- Статусы (open/in-progress/resolved/closed)
- Назначение исполнителей
- Общение с пользователем
- История сообщений

### 7. Управление версиями
- CRUD версий приложений
- Force update
- Release notes

### 8. Настройки системы
- Системная информация
- Записи звонков
- Очистка старых данных

---

## 🔐 Безопасность

- JWT аутентификация
- Проверка прав администратора
- Role-based access control
- Все запросы защищены

---

## 🎨 Дизайн

Дизайн основан на messenger:
- Тёмная тема по умолчанию
- Tailwind CSS
- Lucide React иконки
- Responsive layout
- Sidebar navigation

---

## 🔌 API Endpoints

Админка использует следующие эндпоинты из API:

### Auth
- `POST /api/v1/auth/login` - Вход

### Admin
- `GET /api/v1/auth/me` - Данные текущего пользователя
- `GET /api/v1/admin/analytics` - Аналитика
- `GET /api/v1/admin/users` - Список пользователей
- `PUT /api/v1/admin/users/:id/role` - Изменить роль
- `DELETE /api/v1/admin/users/:id` - Заблокировать
- `GET /api/v1/admin/chats` - Список чатов
- `GET /api/v1/admin/messages/search` - Поиск сообщений
- `GET /api/v1/admin/versions` - Версии

### Internal Chat (NBS w-t)
- `GET /api/v1/admin/internal-chat/groups` - Группы
- `POST /api/v1/admin/internal-chat/groups` - Создать группу
- `POST /api/v1/admin/internal-chat/groups/:id/members` - Добавить участников
- `DELETE /api/v1/admin/internal-chat/groups/:id/members/:userId` - Удалить участника

### Support
- `GET /api/v1/admin/support/tickets` - Тикеты
- `POST /api/v1/admin/support/tickets` - Создать тикет
- `GET /api/v1/admin/support/tickets/:id` - Детали тикета
- `PUT /api/v1/admin/support/tickets/:id` - Обновить тикет
- `POST /api/v1/admin/support/tickets/:id/messages` - Сообщение
- `GET /api/v1/admin/support/staff` - Сотрудники техподдержки

---

## 🔄 Интеграция с Settings

Админка использует `@app-balloo/settings` для общих настроек:

```typescript
import { getSettings } from '@app-balloo/settings';

const settings = getSettings('web');
```

---

## 📝 Роли

| Роль | Доступ |
|------|--------|
| **Admin** | Просмотр, управление пользователями, чатами, сообщениями |
| **Super-admin** | Все права + создание корпоративных групп + управление правами |
| **Support** | Доступ к модулю техподдержки |

---

## 🚀 Деплой

### Production build

```bash
npm run build
npm start
```

### Environment variables

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.balloo.su/api/v1
NEXT_PUBLIC_ADMIN_URL=https://admin.balloo.su
```

---

## 📞 Поддержка

NLP-Core-Team - App Balloo Project
