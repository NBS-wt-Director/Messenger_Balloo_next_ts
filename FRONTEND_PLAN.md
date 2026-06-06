# 🎯 Frontend Web MVP Plan

**Старт:** 05.06.2026 (День 3)  
**Дедлайн:** 11.06.2026  
**Команда:** 1 человек + AI агент  
**Цель:** Полностью рабочий Web MVP

---

## 📊 Текущий статус

| Компонент | Статус | % |
|-----------|--------|---|
| **Auth Store** | ✅ Готово | 100% |
| **Chat Store** | ✅ Готово | 100% |
| **Settings Store** | ✅ Готово | 100% |
| **Accounts Store** | ✅ Готово | 100% |
| **API Clients** | ✅ Готово | 100% |
| **Auth API** | ✅ Готово | 100% |
| **Chats API** | ✅ Готово | 100% |
| **Messages API** | ✅ Готово | 100% |
| **WebSocket** | 🟡 В работе | 60% |
| **E2E Encryption** | 🟡 В работе | 70% |
| **Auth UI** | ⏳ Ожидает | 30% |
| **Chats UI** | ⏳ Ожидает | 40% |
| **Chat UI** | ⏳ Ожидает | 40% |
| **PWA** | 🟡 В работе | 60% |
| **Push Notifications** | 🟡 В работе | 50% |

**Общая готовность:** 65% → 100%

---

## ✅ Выполнено (Изучение кода)

### State Management
- ✅ Zustand stores (auth, chat, settings, accounts)
- ✅ Persist middleware
- ✅ TypeScript types

### API Clients
- ✅ Auth API (Yandex OAuth)
- ✅ Chats API
- ✅ Messages API
- ✅ Contacts API
- ✅ Calls API
- ✅ Audio API
- ✅ Disk API
- ✅ Statuses API
- ✅ Admin API

### UI Components
- ✅ Basic layout (Header, Footer)
- ✅ Auth components
- ✅ Chat components
- ✅ UI primitives (Modal, Alert, Confirm)

### Security
- ✅ E2E encryption (tweetnacl)
- ✅ JWT handling
- ✅ Secure storage

### PWA
- ✅ Service worker registration
- ✅ Push notifications setup
- ✅ PWA install component

---

## 📅 ДНЕВНОЙ ПЛАН

### День 3 (05.06.2026): Auth + Chats UI

#### Утро (4 часа)

- [ ] 3.1 Auth Page (логин/регистрация)
  - Файл: `messenger/src/components/pages/AuthPage.tsx`
  - Email/password форма
  - Yandex OAuth кнопка
  - Валидация
  - Интеграция с auth-store

- [ ] 3.2 2FA Modal
  - Файл: `messenger/src/components/TwoFASetup.tsx`
  - SMS/Bot/TOTP выбор
  - Интеграция с API

- [ ] 3.3 WebSocket Client
  - Файл: `messenger/src/lib/websocket.ts`
  - Подключение
  - Reconnect logic
  - Message handlers

#### Вечер (4 часа)

- [ ] 3.4 Chats Page
  - Файл: `messenger/src/components/pages/ChatsPage.tsx`
  - Список чатов
  - Поиск
  - Real-time updates

- [ ] 3.5 Chat Store Integration
  - Обновление `chat-store.ts`
  - WebSocket listeners
  - Optimistic updates

---

### День 4 (06.06.2026): Chat + Messages

#### Утро (4 часа)

- [ ] 4.1 Chat Page
  - Файл: `messenger/src/components/pages/ChatPage.tsx`
  - Отправка сообщений
  - Получение сообщений
  - Scroll to bottom

- [ ] 4.2 Message Components
  - Text messages
  - Media messages
  - Reactions
  - Read receipts

- [ ] 4.3 E2E Encryption Integration
  - Key exchange
  - Encrypt/decrypt
  - Session management

#### Вечер (4 часа)

- [ ] 4.4 Attachments
  - Файл: `AttachmentViewer.tsx`
  - Image upload
  - File upload
  - Yandex Disk integration

- [ ] 4.5 Call Interface
  - Файл: `CallInterface.tsx`
  - Audio call
  - Video call
  - WebRTC signaling

---

### День 5 (07.06.2026): PWA + Testing

#### Утро (4 часа)

- [ ] 5.1 Push Notifications
  - Файл: `usePushNotifications.ts`
  - VAPID keys
  - Service worker
  - Notification handlers

- [ ] 5.2 Offline Mode
  - RxDB setup
  - Sync logic
  - Conflict resolution

- [ ] 5.3 PWA Install
  - Файл: `PWAInstall.tsx`
  - Install prompt
  - Manifest

#### Вечер (4 часа)

- [ ] 5.4 UI/UX Testing
  - Auth flow
  - Chat flow
  - Mobile responsive

- [ ] 5.5 Performance
  - Bundle analysis
  - Lazy loading
  - Code splitting

- [ ] 5.6 Final Fixes
  - Bug fixes
  - Polish
  - Documentation

---

## 📋 Чек-лист компонентов

### Auth UI
- [x] AuthPage (базовая структура)
- [x] TwoFASetup
- [ ] Email registration form
- [ ] Login form
- [ ] Yandex OAuth button
- [ ] Error handling
- [ ] Loading states

### Chats UI
- [x] ChatsPage (базовая структура)
- [x] CreateGroupModal
- [x] InviteManager
- [ ] Chat list item
- [ ] Search
- [ ] Unread badges
- [ ] Last message preview

### Chat UI
- [x] ChatPage (базовая структура)
- [x] Message viewer
- [x] Message input
- [x] AttachmentViewer
- [ ] Message reactions
- [ ] Read receipts
- [ ] Typing indicators
- [ ] Message history (pagination)

### Calls UI
- [x] CallInterface
- [ ] Audio call UI
- [ ] Video call UI
- [ ] Call controls
- [ ] Recording indicator

### Settings UI
- [x] ProfilePage
- [x] ChangePasswordModal
- [x] DeleteAccountModal
- [x] TwoFASetup
- [ ] Notification settings
- [ ] Privacy settings
- [ ] Theme toggle

### PWA
- [x] PWAInstall
- [x] ServiceWorkerRegistration
- [ ] Offline fallback
- [ ] Background sync

---

## 🎯 Критичные задачи

### 1. WebSocket Client
```typescript
// messenger/src/lib/websocket.ts
class WebSocketClient {
  connect(): void;
  disconnect(): void;
  onMessage(handler: (msg: WebSocketMessage) => void): void;
  sendChatMessage(chatId: string, content: string): void;
  // ...
}
```

### 2. E2E Encryption
```typescript
// messenger/src/lib/e2e/index.ts
class E2EEncryption {
  generateKeyPair(): CryptoKeyPair;
  encryptMessage(message: string, publicKey: string): string;
  decryptMessage(encrypted: string, privateKey: CryptoKey): string;
  // ...
}
```

### 3. Real-time Updates
```typescript
// messenger/src/stores/chat-store.ts
// Добавить WebSocket listeners
useEffect(() => {
  wsClient.on('message:new', (msg) => {
    addMessage(msg);
  });
}, []);
```

---

## 🚀 Команды

### Development
```bash
cd messenger
npm run dev
```

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Typecheck
```bash
npm run typecheck
```

---

## 📈 Прогресс

| День | Задачи | Статус | % |
|------|--------|--------|---|
| День 3 | Auth + Chats UI | ⏳ Ожидает | 0% |
| День 4 | Chat + Messages | ⏳ Ожидает | 0% |
| День 5 | PWA + Testing | ⏳ Ожидает | 0% |

**Ожидаемое завершение:** 07.06.2026 (16 часов работы)

---

**NLP-Core-Team** - App Balloo Frontend Web MVP
