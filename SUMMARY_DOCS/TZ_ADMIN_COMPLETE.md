# ТЕХНИЧЕСКОЕ ЗАДАНИЕ: ADMIN PORTAL (Next.js Admin Dashboard)

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** Balloo Admin Portal  
**Версия:** 1.0.0  
**Стек:** Next.js 15, React 19, TypeScript, TailwindCSS, PostgreSQL  
**Порт:** 3002  
**URL:** http://localhost:3002  
**Docker Image:** app_balloo-admin-portal  
**Статус:** ⚠️ Требуется сборка и настройка

## 2. АРХИТЕКТУРА

### 2.1 Структура проекта
```
admin-portal/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx          # Страница входа админа
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Главная панель
│   │   ├── users/
│   │   │   ├── page.tsx          # Список пользователей
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Профиль пользователя
│   │   ├── messages/
│   │   │   └── page.tsx          # Мониторинг сообщений
│   │   ├── analytics/
│   │   │   └── page.tsx          # Аналитика
│   │   ├── settings/
│   │   │   └── page.tsx          # Настройки системы
│   │   ├── layout.tsx            # Admin layout
│   │   └── page.tsx              # Redirect to /dashboard
│   ├── components/
│   │   ├── ui/                   # Базовые UI
│   │   ├── dashboard/            # Компоненты дашборда
│   │   ├── users/                # Компоненты пользователей
│   │   └── charts/               # Графики
│   ├── lib/
│   │   ├── api.ts                # API клиент
│   │   └── utils.ts              # Утилиты
│   ├── stores/
│   │   ├── authStore.ts          # Store авторизации
│   │   └── dashboardStore.ts     # Store дашборда
│   └── types/
│       └── index.ts              # Типы
├── public/
├── next.config.js
├── tailwind.config.js
└── package.json
```

### 2.2 Зависимости
```json
{
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "axios": "^1.16.1",
    "recharts": "^2.12.0",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.460.0",
    "zustand": "^5.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.7"
  }
}
```

## 3. UI КОМПОНЕНТЫ

### 3.1 Login Page
**Файл:** `src/app/login/page.tsx`

**Элементы:**
- **Логотип:** 64x64px, центр
- **Заголовок:** "Admin Portal", 32px
- **Admin Key Input:**
  - placeholder: "Admin Key"
  - type: "password"
  - width: 100%, max-width: 400px
- **Кнопка "Войти":**
  - text: "Войти"
  - background: #1F2937 (dark)
  - color: #FFFFFF

**Логика:**
1. Проверка admin key
2. POST /api/v1/admin/auth
3. Сохранение admin token
4. Редирект на /dashboard

### 3.2 Dashboard Page
**Файл:** `src/app/dashboard/page.tsx`

**Структура:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] Admin Portal        [Notifications]  [Admin] ▼ │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┬───────────────────────────────────────┐│
│  │  Sidebar    │  Dashboard Content                    ││
│  │             │                                       ││
│  │  📊 Stats   │  ┌─────────┐ ┌─────────┐             ││
│  │  👥 Users   │  │ Users   │ │ Messages│             ││
│  │  💬 Messages│  │ 12,345  │ │ 456,789 │             ││
│  │  📈 Analytics│ │         │ │         │             ││
│  │  ⚙️ Settings│  │ ────    │ │ ────    │             ││
│  │             │  │ +5%     │ │ +12%    │             ││
│  │             │  └─────────┘ └─────────┘             ││
│  │             │                                       ││
│  │             │  ┌─────────────────────────────────┐  ││
│  │             │  │ Activity Chart (Line)           │  ││
│  │             │  │                                  │  ││
│  │             │  └─────────────────────────────────┘  ││
│  │             │                                       ││
│  │             │  ┌─────────────────────────────────┐  ││
│  │             │  │ Recent Users Table              │  ││
│  │             │  │ ──────────────────────────────  │  ││
│  │             │  └─────────────────────────────────┘  ││
│  └─────────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Sidebar:**
- **Width:** 240px
- **Background:** #1F2937 (dark)
- **Menu Items:**
  - Иконка + текст
  - padding: 12px 16px
  - hover: #374151
  - active: #4F46E5
  - color: #FFFFFF

**Stats Cards:**
- **Users Card:**
  - background: #FFFFFF
  - border-radius: 8px
  - padding: 24px
  - shadow: 0 1px 3px rgba(0,0,0,0.1)
  - **Icon:** 👥 (blue)
  - **Title:** "Total Users"
  - **Value:** 12,345 (32px, bold)
  - **Change:** +5% (green)
- **Messages Card:** аналогично
- **Online Users Card:** аналогично
- **Storage Used Card:** аналогично

**Activity Chart:**
- **Type:** Line chart (recharts)
- **Data:** messages per day (last 30 days)
- **Color:** #4F46E5
- **Grid:** light gray
- **Tooltip:** dark theme

**Recent Users Table:**
- **Columns:** Name, Email, Status, Created, Actions
- **Rows:** 10 latest users
- **Status Badge:** Active/Inactive/Banned
- **Actions:** View, Edit, Ban
- **Pagination:** 10 items per page

### 3.3 Users Page
**Файл:** `src/app/users/page.tsx`

**Элементы:**
- **Заголовок:** "Управление пользователями", 24px
- **Search Input:**
  - placeholder: "Поиск по email/имени..."
  - width: 300px
- **Filter Buttons:**
  - Все / Активные / Заблокированные / Новые
- **Table:**
  - **Columns:**
    - Avatar (40x40px)
    - Name (14px)
    - Email (14px)
    - Status (badge)
    - Created (12px)
    - Actions (buttons)
  - **Pagination:** 20 items per page
  - **Sortable:** name, email, created
- **User Actions:**
  - **View:** modal с деталями
  - **Edit:** inline edit
  - **Ban:** confirm dialog
  - **Delete:** confirm dialog

**User Detail Modal:**
- **Profile Info:**
  - Avatar (80x80px)
  - Name (20px)
  - Email (14px)
  - Phone (14px)
  - Created (14px)
  - Last Active (14px)
- **Stats:**
  - Messages sent: X
  - Conversations: X
  - Storage used: X MB
- **Actions:**
  - Edit Profile
  - Change Role
  - Ban/Unban
  - Delete User

### 3.4 Messages Page
**Файл:** `src/app/messages/page.tsx`

**Элементы:**
- **Заголовок:** "Мониторинг сообщений", 24px
- **Filters:**
  - Date range picker
  - Conversation type
  - Message type
- **Table:**
  - **Columns:**
    - ID (12px, monospace)
    - Conversation (14px)
    - Sender (14px)
    - Type (badge)
    - Content (14px, truncated)
    - Created (12px)
    - Encrypted (icon)
  - **Pagination:** 50 items per page
- **Message Detail:**
  - Full content
  - Metadata
  - Encryption status

### 3.5 Analytics Page
**Файл:** `src/app/analytics/page.tsx`

**Виджеты:**
1. **User Growth (Line Chart):**
   - New users per day/week/month
   - Active users per day/week/month
2. **Message Volume (Bar Chart):**
   - Messages per day
   - By type (text/image/video)
3. **Storage Usage (Pie Chart):**
   - By type (images/videos/files)
4. **Top Conversations (Table):**
   - Most active conversations
   - Message count
5. **User Retention (Line Chart):**
   - Day 1, 7, 30 retention
6. **Geographic Distribution (Map):**
   - Users by country/city

### 3.6 Settings Page
**Файл:** `src/app/settings/page.tsx`

**Секции:**
1. **System:**
   - Maintenance Mode Toggle
   - Registration Toggle
   - SMS Toggle
   - File Upload Limit
2. **Email:**
   - SMTP Host
   - SMTP Port
   - SMTP User
   - SMTP Password
   - Test Email Button
3. **Yandex:**
   - Client ID
   - Client Secret
   - Disk Client ID
   - Disk Client Secret
   - Test Connection Button
4. **Database:**
   - Connection String
   - Pool Size
   - Test Connection Button
5. **Redis:**
   - Host
   - Port
   - Password
   - Test Connection Button

## 4. API ENDPOINTS

### 4.1 Authentication
- **POST** `/api/v1/admin/auth` - Вход админа
- **POST** `/api/v1/admin/logout` - Выход

### 4.2 Dashboard
- **GET** `/api/v1/admin/stats` - Статистика
- **GET** `/api/v1/admin/activity` - Активность

### 4.3 Users
- **GET** `/api/v1/admin/users` - Список пользователей
- **GET** `/api/v1/admin/users/:id` - Профиль
- **PUT** `/api/v1/admin/users/:id` - Обновить
- **DELETE** `/api/v1/admin/users/:id` - Удалить
- **PUT** `/api/v1/admin/users/:id/ban` - Заблокировать

### 4.4 Messages
- **GET** `/api/v1/admin/messages` - Список сообщений
- **GET** `/api/v1/admin/messages/:id` - Детали

### 4.5 Analytics
- **GET** `/api/v1/admin/analytics/users` - Аналитика пользователей
- **GET** `/api/v1/admin/analytics/messages` - Аналитика сообщений
- **GET** `/api/v1/admin/analytics/storage` - Аналитика хранилища

## 5. БЕЗОПАСНОСТЬ

### 5.1 Авторизация
- **Admin Key:** отдельный ключ для админа
- **Token:** JWT с ролью admin
- **IP Whitelist:** опционально

### 5.2 Роли
- **Super Admin:** полный доступ
- **Admin:** управление пользователями
- **Moderator:** просмотр сообщений

### 5.3 Audit Log
- Все действия логируются
- Кто, что, когда
- IP адрес

## 6. КОНФИГУРАЦИЯ

### 6.1 Переменные окружения
```bash
NODE_ENV=production
PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3001
ADMIN_KEY=<ключ_админа>
```

## 7. DEPLOY

### 7.1 Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3002
CMD ["npm", "start"]
```

### 7.2 Docker Compose
```yaml
admin-portal:
  build: ./admin-portal
  ports:
    - "3002:3002"
  environment:
    - NEXT_PUBLIC_API_URL=http://api:3001
  depends_on:
    - api
  restart: unless-stopped
```

## 8. МОНИТОРИНГ

### 8.1 Health Check
- **Endpoint:** /health
- **Параметры:** status, timestamp

### 8.2 Metrics
- Количество пользователей
- Количество сообщений
- Активность за 24 часа
- Использование хранилища

---

**Статус:** ⚠️ Требуется сборка и настройка  
**Последнее обновление:** 2026-06-23
