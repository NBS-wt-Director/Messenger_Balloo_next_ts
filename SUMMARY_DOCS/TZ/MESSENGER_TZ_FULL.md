# 📋 Техническое задание: Messenger (Next.js Web App)

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** App Balloo Messenger  
**Версия:** 1.0.0  
**Фреймворк:** Next.js 15 (App Router)  
**Язык:** TypeScript  
**UI:** React 19 + Tailwind CSS 3  
**Состояние:** Zustand 5  
**Иконки:** Lucide React  
**Валидация:** Zod  
**Пакеты:** pnpm workspace (monorepo)  

## 2. АРХИТЕКТУРА

### 2.1 Структура проекта
```
messenger/
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── (auth)/    # Страницы авторизации
│   │   ├── (chat)/    # Основные чаты
│   │   ├── settings/  # Настройки
│   │   ├── sessions/  # Сессии устройств
│   │   └── layout.tsx # Главный layout
│   ├── components/    # React компоненты
│   ├── hooks/         # Кастомные хуки
│   ├── lib/           # Утилиты
│   ├── store/         # Zustand stores
│   ├── types/         # TypeScript типы
│   └── styles/        # Global styles
├── public/            # Static assets
├── next.config.js
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

### 2.2 Порты
- **Dev:** 3000
- **Prod:** 3000
- **API URL:** http://api:3001 (docker) / http://localhost:3001

## 3. СТРАНИЦЫ

### 3.1 Аутентификация `/auth/login`
- Форма логина (email/username + password)
- 2FA verification
- Яндекс OAuth кнопка
- Запомнить устройство
- Forgot password link

### 3.2 Аутентификация `/auth/register`
- Регистрация (username, email, password)
- Подтверждение email
- Privacy policy checkbox

### 3.3 Основные чаты `/chat`
- Список чатов (sidebar)
- Окно сообщений
- Поиск по чатам
- Создание нового чата
- Индикатор набора текста
- Статус сообщений (sent, delivered, read)
- Эмодзи picker
- Attachment upload

### 3.4 Настройки `/settings`
- Профиль пользователя
- Настройки аккаунта
- Настройки безопасности (2FA, password)
- Настройки уведомлений
- Настройки темы (dark/light/russia)
- Язык интерфейса
- Экспорт/удаление данных

### 3.5 Сессии `/sessions`
- Список активных сессий
- Текущая сессия (отметка)
- Завершение сессий
- Device info (browser, OS, IP)
- Last active time

## 4. КОМПОНЕНТЫ

### 4.1 Core UI (packages/core-ui)
```typescript
// components/ui/
Button.tsx      // primary/secondary/ghost variants
Modal.tsx       // с overlay и backdrop
Alert.tsx       // success/error/warning/info
Card.tsx        // с padding и variant
Input.tsx       // с label и error state
StatusBadge.tsx // online/offline/last-seen
```

### 4.2 Chat Components
```typescript
// components/chat/
ChatList.tsx        // Список чатов
ChatWindow.tsx      // Окно сообщений
MessageBubble.tsx   // Пузырёк сообщения
MessageInput.tsx    // Поле ввода + attachment
TypingIndicator.tsx // Индикатор набора
AttachmentPreview.tsx // Preview файлов
```

### 4.3 Auth Components
```typescript
// components/auth/
LoginForm.tsx       // Форма входа
RegisterForm.tsx    // Форма регистрации
TwoFAModal.tsx      // 2FA verification
YandexLogin.tsx     // Яндекс OAuth
```

### 4.4 Settings Components
```typescript
// components/settings/
ProfileForm.tsx     // Редактирование профиля
SecuritySettings.tsx // 2FA, password
NotificationSettings.tsx // Push, email, SMS
ThemeSettings.tsx   // Dark/light/russia theme
LanguageSettings.tsx // i18n
```

## 5. СОСТОЯНИЕ (Zustand)

### 5.1 Auth Store
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}
```

### 5.2 Chat Store
```typescript
interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId) => Promise<void>;
  sendMessage: (content, files?) => Promise<void>;
  joinChat: (chatId) => void;
  leaveChat: (chatId) => void;
}
```

### 5.3 WebSocket Store
```typescript
interface WebSocketState {
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribeToChat: (chatId) => void;
  onMessage: (callback) => void;
  onTyping: (callback) => void;
}
```

### 5.4 Settings Store
```typescript
interface SettingsState {
  theme: 'dark' | 'light' | 'russia';
  language: 'ru' | 'en';
  notifications: {
    push: boolean;
    email: boolean;
    sound: boolean;
  };
  setTheme: (theme) => void;
  setLanguage: (lang) => void;
  updateNotifications: (data) => void;
}
```

## 6. WEBSOCKET (Socket.IO)

### 6.1 Подключение
```typescript
const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});
```

### 6.2 События (Client → Server)
```typescript
socket.emit('join_chat', chatId);
socket.emit('leave_chat', chatId);
socket.emit('message', { content, files });
socket.emit('typing', { chatId, isTyping });
socket.emit('read', { messageId });
```

### 6.3 События (Server → Client)
```typescript
socket.on('message', (data) => { ... });
socket.on('typing', (data) => { ... });
socket.on('chat_updated', (data) => { ... });
socket.on('disconnect', () => { ... });
socket.on('reconnect', () => { ... });
```

## 7. API ИНТЕГРАЦИЯ

### 7.1 HTTP Client
```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  return response.json();
}
```

### 7.2 Эндпоинты
```typescript
const api = {
  auth: {
    login: () => apiRequest('/api/v1/auth/login'),
    register: () => apiRequest('/api/v1/auth/register'),
    logout: () => apiRequest('/api/v1/auth/logout'),
    refresh: () => apiRequest('/api/v1/auth/refresh'),
  },
  users: {
    getMe: () => apiRequest('/api/v1/users/me'),
    update: () => apiRequest('/api/v1/users/me', { method: 'PUT' }),
    uploadAvatar: () => apiRequest('/api/v1/users/avatar', { method: 'POST' }),
  },
  chats: {
    list: () => apiRequest('/api/v1/chats'),
    get: (id) => apiRequest(`/api/v1/chats/${id}`),
    create: () => apiRequest('/api/v1/chats', { method: 'POST' }),
    messages: (id) => apiRequest(`/api/v1/chats/${id}/messages`),
    send: (id) => apiRequest(`/api/v1/chats/${id}/messages`, { method: 'POST' }),
  },
  notifications: {
    list: () => apiRequest('/api/v1/notifications'),
    read: (id) => apiRequest(`/api/v1/notifications/${id}`, { method: 'PUT' }),
  },
};
```

## 8. КОНФИГУРАЦИЯ

### 8.1 Environment Variables
```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=http://api:3001
NEXT_PUBLIC_WS_URL=ws://api:3001
```

### 8.2 next.config.js
```javascript
module.exports = {
  reactStrictMode: true,
  distDir: '.next',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.yandex.net' },
      { protocol: 'https', hostname: 'avatars.yandex.net' },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      '@balloo/core-ui': path.resolve(__dirname, '../packages/core-ui'),
      '@balloo/core-theme': path.resolve(__dirname, '../packages/core-theme'),
    };
    return config;
  },
};
```

### 8.3 tailwind.config.ts
```typescript
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6C5CE7', light: '#A29BFE', dark: '#4834D4' },
        secondary: { DEFAULT: '#00CEC9', light: '#81ECEC', dark: '#00B894' },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

## 9. ТЕМЫ (core-theme)

### 9.1 Preset Themes
```typescript
const PRESET_THEMES = {
  dark: { /* dark theme colors */ },
  light: { /* light theme colors */ },
  russia: { /* russian flag theme */ },
};

// Использование
import { useThemeStore } from '@balloo/core-theme';
const { theme, setTheme } = useThemeStore();
```

## 10. БЕЗОПАСНОСТЬ

- JWT tokens in httpOnly cookies
- CSRF protection
- XSS protection (React default)
- Content Security Policy
- HTTPS only (prod)
- Rate limiting (API side)
- Input validation (Zod)

## 11. DOCKER

### 11.1 Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
RUN addgroup -S nodejs && adduser -S nodejs
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["node", "server.js"]
```

### 11.2 docker-compose.yml (фрагмент)
```yaml
messenger:
  build: ./messenger
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=production
    - NEXT_PUBLIC_API_URL=http://api:3001
    - NEXT_PUBLIC_WS_URL=ws://api:3001
  depends_on:
    - api
  networks:
    - balloo-network
```

## 12. ТЕКУЩИЙ СТАТУС

✅ **Реализовано:**
- Next.js 15 App Router
- Auth pages (login/register)
- Chat list component
- Message bubble component
- Settings page (profile, security)
- Sessions page
- Theme system (dark/light/russia)
- Zustand stores (auth, chat, settings)
- WebSocket connection (Socket.IO)
- API integration layer
- Tailwind CSS styling
- Docker build

⚠️ **Частично:**
- Full chat window (needs backend messages)
- File upload (needs API)
- Push notifications (needs VAPID keys)
- i18n (partial)

❌ **Не реализовано:**
- Full emoji picker
- Voice messages
- Video calls
- Group chat features
- Message search
- Archive chats
- Muted chats

---

**Дата создания:** 2026-06-23  
**Версия документа:** 1.0
