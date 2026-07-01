# ТЕХНИЧЕСКОЕ ЗАДАНИЕ: MESSENGER NODE (Next.js Web App)

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** Secure Messenger (Balloo Messenger)  
**Версия:** 1.0.0  
**Стек:** Next.js 15, React 19, TypeScript, TailwindCSS, PostgreSQL  
**Порт:** 3000  
**URL:** http://localhost:3000  
**Docker Image:** app_balloo-messenger  
**Статус:** ⚠️ Сборка требует доработки (проблемы с пакетами @balloo/*)

## 2. АРХИТЕКТУРА

### 2.1 Структура проекта
```
messenger/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx          # Страница входа
│   │   ├── register/
│   │   │   └── page.tsx          # Страница регистрации
│   │   ├── chat/
│   │   │   └── page.tsx          # Основной чат
│   │   ├── settings/
│   │   │   └── page.tsx          # Настройки
│   │   ├── sessions/
│   │   │   └── page.tsx          # Активные сессии
│   │   ├── layout.tsx            # Главный layout
│   │   └── page.tsx              # Home redirect
│   ├── components/
│   │   ├── ui/                   # Базовые UI компоненты
│   │   ├── chat/                 # Компоненты чата
│   │   ├── auth/                 # Компоненты авторизации
│   │   └── layout/               # Layout компоненты
│   ├── lib/
│   │   ├── api.ts                # API клиент
│   │   ├── websocket.ts          # WebSocket клиент
│   │   ├── crypto.ts             # E2E шифрование
│   │   └── utils.ts              # Утилиты
│   ├── hooks/
│   │   ├── useAuth.ts            # Хук авторизации
│   │   ├── useChat.ts            # Хук чата
│   │   └── useWebSocket.ts       # Хук WebSocket
│   ├── stores/
│   │   ├── authStore.ts          # Store авторизации
│   │   ├── chatStore.ts          # Store чата
│   │   └── settingsStore.ts      # Store настроек
│   └── types/
│       ├── index.ts              # Типы
│       └── api.ts                # API типы
├── public/                       # Статические файлы
├── next.config.js                # Конфигурация Next.js
├── tailwind.config.ts            # TailwindCSS
├── tsconfig.json
└── package.json
```

### 2.2 Зависимости
```json
{
  "dependencies": {
    "@balloo/core-theme": "file:../packages/core-theme",
    "@balloo/core-ui": "file:../packages/core-ui",
    "@balloo/core-brand": "file:../packages/core-brand",
    "axios": "^1.16.1",
    "bcryptjs": "^3.0.3",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "ioredis": "^5.10.1",
    "jose": "^5.9.0",
    "lokijs": "^1.5.12",
    "lucide-react": "^0.460.0",
    "next": "^15.1.0",
    "nodemailer": "^6.10.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sql.js": "^1.1.0",
    "tweetnacl": "^1.0.3",
    "tweetnacl-util": "^0.15.1",
    "web-push": "^3.6.7",
    "yandex-disk": "^0.0.6",
    "zod": "^3.23.8",
    "zustand": "^5.0.0"
  }
}
```

## 3. UI КОМПОНЕНТЫ

### 3.1 Login Page
**Файл:** `src/app/login/page.tsx`

**Элементы:**
- **Логотип:** 64x64px, центр, цвет #4F46E5
- **Заголовок:** "Balloo Messenger", 32px, h1
- **Email Input:**
  - placeholder: "Email"
  - type: "email"
  - required: true
  - width: 100%, max-width: 400px
  - border: 1px solid #E5E7EB
  - border-radius: 8px
  - padding: 12px 16px
- **Password Input:**
  - placeholder: "Пароль"
  - type: "password"
  - required: true
  - width: 100%, max-width: 400px
  - border: 1px solid #E5E7EB
  - border-radius: 8px
  - padding: 12px 16px
- **Кнопка "Войти":**
  - text: "Войти"
  - width: 100%, max-width: 400px
  - height: 44px
  - background: #4F46E5
  - color: #FFFFFF
  - border-radius: 8px
  - font-weight: 600
  - hover: #4338CA
- **Ссылка "Забыли пароль?":**
  - text: "Забыли пароль?"
  - color: #4F46E5
  - size: 14px
- **Ссылка "Регистрация":**
  - text: "Нет аккаунта? Регистрация"
  - color: #4F46E5
  - size: 14px

**Логика:**
1. Валидация email (regex)
2. Валидация пароля (min 8 chars)
3. POST /api/v1/auth/login
4. Сохранение JWT в localStorage
5. Редирект на /chat

### 3.2 Register Page
**Файл:** `src/app/register/page.tsx`

**Элементы:**
- **Логотип:** 64x64px, центр
- **Заголовок:** "Регистрация", 32px, h1
- **Display Name Input:**
  - placeholder: "Имя"
  - width: 100%, max-width: 400px
- **Email Input:** как в login
- **Password Input:**
  - placeholder: "Пароль"
  - min: 8 символов
  - required: true
- **Confirm Password Input:**
  - placeholder: "Подтвердите пароль"
  - required: true
  - должен совпадать с паролем
- **Кнопка "Зарегистрироваться":**
  - text: "Зарегистрироваться"
  - аналогично кнопке "Войти"

**Логика:**
1. Валидация всех полей
2. Проверка совпадения паролей
3. POST /api/v1/auth/register
4. Сохранение JWT
5. Редирект на /chat

### 3.3 Chat Page
**Файл:** `src/app/chat/page.tsx`

**Структура:**
```
┌─────────────────────────────────────────────────┐
│  [Logo] Balloo          [Search]  [Settings]   │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Conversations│  │ Message Area            │  │
│  │             │  │                         │  │
│  │ - User 1    │  │ [Messages]              │  │
│  │ - User 2    │  │                         │  │
│  │ - Group     │  │                         │  │
│  │             │  │                         │  │
│  │             │  │                         │  │
│  └─────────────┘  └─────────────────────────┘  │
│                 [Input] [Send]                  │
└─────────────────────────────────────────────────┘
```

**Левая панель (Conversations):**
- **Width:** 320px
- **Background:** #FFFFFF
- **Border-right:** 1px solid #E5E7EB
- **Search Input:**
  - placeholder: "Поиск..."
  - width: 100%
  - padding: 8px 12px
  - margin-bottom: 16px
- **Conversation Item:**
  - height: 64px
  - padding: 12px
  - hover: #F3F4F6
  - active: #EEF2FF
  - **Avatar:** 40x40px, border-radius: 50%
  - **Name:** 14px, font-weight: 500
  - **Last Message:** 12px, color: #6B7280
  - **Time:** 12px, color: #9CA3AF
  - **Unread Badge:** background: #4F46E5, color: #FFFFFF, border-radius: 50%

**Правая панель (Messages):**
- **Header:**
  - height: 64px
  - padding: 0 24px
  - **Avatar:** 40x40px
  - **Name:** 16px, font-weight: 600
  - **Status:** 12px, color: #10B981 (online)
- **Messages Area:**
  - overflow-y: auto
  - padding: 24px
  - **Message Bubble (outgoing):**
    - background: #4F46E5
    - color: #FFFFFF
    - border-radius: 16px 16px 4px 16px
    - padding: 12px 16px
    - max-width: 60%
    - margin-left: auto
  - **Message Bubble (incoming):**
    - background: #F3F4F6
    - color: #1F2937
    - border-radius: 16px 16px 16px 4px
    - padding: 12px 16px
    - max-width: 60%
  - **Timestamp:** 10px, color: #9CA3AF
  - **Read Indicator:** ✓ или ✓✓ (blue)
- **Input Area:**
  - height: 64px
  - padding: 0 24px
  - **Text Input:**
    - width: 100%
    - height: 40px
    - border: 1px solid #E5E7EB
    - border-radius: 20px
    - padding: 0 16px
  - **Send Button:**
    - width: 40px, height: 40px
    - border-radius: 50%
    - background: #4F46E5
    - icon: send (lucide-react)
  - **Attach Button:**
    - width: 40px, height: 40px
    - border-radius: 50%
    - background: transparent
    - icon: paperclip

### 3.4 Settings Page
**Файл:** `src/app/settings/page.tsx`

**Секции:**
1. **Profile:**
   - Display Name Input
   - Avatar Upload
   - Phone Input
   - Bio Textarea
   - Save Button

2. **Security:**
   - Change Password
   - Current Password Input
   - New Password Input
   - Confirm Password Input
   - Save Button

3. **Notifications:**
   - Toggle: Push Notifications
   - Toggle: Sound Notifications
   - Toggle: Email Notifications
   - Toggle: SMS Notifications

4. **Privacy:**
   - Toggle: Online Status
   - Toggle: Read Receipts
   - Toggle: Typing Indicators
   - Toggle: Last Seen

5. **Appearance:**
   - Theme Selector: Dark/Light/Russia
   - Font Size: Small/Medium/Large
   - Chat Width: Compact/Comfortable/Spacious

6. **Storage:**
   - Storage Used: X MB
   - Clear Cache Button
   - Download All Data Button

### 3.5 Sessions Page
**Файл:** `src/app/sessions/page.tsx`

**Элементы:**
- **Заголовок:** "Активные сессии", 24px
- **Список сессий:**
  - **Session Item:**
    - Device Name: 16px
    - Location: 14px, color: #6B7280
    - Last Active: 14px, color: #6B7280
    - Current: badge "Текущая"
    - **Revoke Button:**
      - text: "Завершить"
      - color: #EF4444
      - hover: #DC2626

## 4. СОСТОЯНИЕ (Zustand Stores)

### 4.1 authStore
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}
```

### 4.2 chatStore
```typescript
interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, type: string) => Promise<void>;
  selectConversation: (id: string) => void;
}
```

### 4.3 settingsStore
```typescript
interface SettingsState {
  theme: 'dark' | 'light' | 'russia';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
  updateTheme: (theme: string) => void;
  updateNotifications: (settings: NotificationSettings) => void;
  updatePrivacy: (settings: PrivacySettings) => void;
}
```

## 5. WEB SOCKET

### 5.1 Подключение
```typescript
const ws = new WebSocket('ws://localhost:3001', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### 5.2 События
- **connect:** соединение установлено
- **message:** новое сообщение
- **typing:** пользователь печатает
- **read:** сообщение прочитано
- **call:** входящий звонок
- **call:accepted:** звонок принят
- **call:ended:** звонок завершен
- **conversation:new:** новый диалог
- **conversation:updated:** диалог обновлен
- **user:status:** статус пользователя изменен

## 6. ШИФРОВАНИЕ (E2E)

### 6.1 Алгоритм
- **Библиотека:** tweetnacl + tweetnacl-util
- **Ключи:** Ed25519 (генерация на клиенте)
- **Шифрование:** NaCl secretbox
- **Хеширование:** SHA-256 для хешей ключей

### 6.2 Процесс
1. Генерация пары ключей при регистрации
2. Публичный ключ отправляется на сервер
3. Приватный ключ хранится локально
4. Сообщения шифруются публичным ключом получателя
5. Расшифровка приватным ключом отправителя

## 7. КОНФИГУРАЦИЯ

### 7.1 Переменные окружения
```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
DATABASE_URL=postgresql://...
REDIS_HOST=redis
REDIS_PORT=6379
```

### 7.2 Next.js Config
```javascript
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  trailingSlash: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: '*.yandex.net' },
      { protocol: 'https', hostname: 'avatars.yandex.net' }
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      '@balloo/core-ui': path.resolve(__dirname, '../packages/core-ui'),
      '@balloo/core-theme': path.resolve(__dirname, '../packages/core-theme'),
      '@balloo/core-brand': path.resolve(__dirname, '../packages/core-brand'),
    };
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  }
};
```

## 8. TAILWINDCSS

### 8.1 Конфигурация
```javascript
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#7C3AED',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
```

## 9. ТЕСТЫ

### 9.1 Jest
- **Фреймворк:** Jest 30
- **Testing Library:** @testing-library/react 16
- **Покрытие:** components, hooks, stores
- **Запуск:** `npm test`

### 9.2 E2E
- **Планируется:** Playwright
- **Тесты:** login, register, chat, settings

## 10. DEPLOY

### 10.1 Docker
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
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### 10.2 Docker Compose
```yaml
messenger:
  build: ./messenger
  ports:
    - "3000:3000"
  environment:
    - NEXT_PUBLIC_API_URL=http://api:3001
    - NEXT_PUBLIC_WS_URL=ws://api:3001
  depends_on:
    - api
  restart: unless-stopped
```

## 11. PWA

### 11.1 Manifest
- **name:** Balloo Messenger
- **short_name:** Balloo
- **description:** Secure messenger with E2E encryption
- **icons:** 192x192, 512x512
- **theme_color:** #4F46E5
- **background_color:** #FFFFFF
- **display:** standalone

### 11.2 Service Worker
- **Кэширование:** статические файлы
- **Offline:** кэш сообщений
- **Push:** web-push для уведомлений

---

**Статус:** ⚠️ Сборка требует доработки (проблемы с пакетами @balloo/*)  
**Последнее обновление:** 2026-06-23
