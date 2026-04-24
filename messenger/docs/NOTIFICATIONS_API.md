# API Уведомлений - Balloo Messenger

## Обзор

Система уведомлений Balloo использует Web Push API для отправки push-уведомлений пользователям. Система работает через Service Worker и поддерживает следующие функции:

- Push-уведомления в фоновом режиме
- Клик по уведомлению открывает соответствующий чат
- Фоновая синхронизация сообщений
- Управление подписками

## API Endpoints

### 1. Сохранение токена

**POST** `/api/notifications/token`

Сохраняет токен подписки пользователя для отправки уведомлений.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "platform": "web",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token saved successfully",
  "savedAt": 1234567890000
}
```

### 2. Удаление токена

**DELETE** `/api/notifications/token`

Удаляет токен подписки (при отписке от уведомлений).

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token removed successfully"
}
```

### 3. Отправка уведомления

**POST** `/api/notifications/send`

Отправляет уведомление пользователю.

**Request Body:**
```json
{
  "userId": "user123",
  "title": "Новое сообщение",
  "body": "Иван: Привет, как дела?",
  "icon": "/icon-192x192.png",
  "badge": "/badge-72x72.png",
  "url": "/chats/chat1",
  "tag": "message-chat1",
  "data": {
    "chatId": "chat1",
    "messageId": "msg456"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Уведомление отправлено",
  "sentAt": 1234567890000,
  "recipients": 1
}
```

## Клиентская библиотека

### Импорт

```typescript
import { NotificationManager, useNotifications } from '@/lib/notifications';
```

### NotificationManager

Класс для управления уведомлениями.

#### Методы

**isSupported(): Promise<boolean>**
- Проверка поддержки уведомлений браузером

**requestPermission(): Promise<boolean>**
- Запрос разрешения на уведомления

**registerServiceWorker(): Promise<ServiceWorkerRegistration>**
- Регистрация Service Worker

**subscribeToPush(vapidPublicKey: string): Promise<PushSubscription>**
- Подписка на push-уведомления

**unsubscribeFromPush(): Promise<boolean>**
- Отписка от push-уведомлений

**getActiveSubscription(): Promise<PushSubscription | null>**
- Получение активной подписки

**sendTokenToServer(token: string, userId: string): Promise<void>**
- Отправка токена на сервер

**removeTokenFromServer(token: string): Promise<void>**
- Удаление токена с сервера

**showNotification(title: string, options?: NotificationOptions): Notification | null**
- Показ уведомления

**getStatus(): Promise<{ supported: boolean; permission: string; subscribed: boolean }>**
- Получение статуса уведомлений

### useNotifications Hook

React hook для работы с уведомлениями.

**Возвращает:**
```typescript
{
  status: {
    supported: boolean;
    permission: NotificationPermission;
    subscribed: boolean;
  };
  loading: boolean;
  subscribe: (vapidPublicKey?: string) => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  refreshStatus: () => Promise<void>;
  isSupported: boolean;
  hasPermission: boolean;
  isSubscribed: boolean;
}
```

**Пример использования:**
```typescript
function MyComponent() {
  const { status, subscribe, isSubscribed } = useNotifications();
  
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  
  const handleSubscribe = async () => {
    if (!isSubscribed) {
      await subscribe(vapidPublicKey);
    }
  };
  
  return (
    <button onClick={handleSubscribe}>
      {isSubscribed ? 'Уведомления включены' : 'Включить уведомления'}
    </button>
  );
}
```

## Service Worker

Service Worker обрабатывает push-уведомления и фоновую синхронизацию.

### События

**push**
- Обработка входящих push-уведомлений
- Показ уведомления пользователю

**notificationclick**
- Обработка клика по уведомлению
- Открытие соответствующей страницы

**sync**
- Фоновая синхронизация данных
- Событие 'send-messages' для синхронизации сообщений

### Пример push-уведомления

```json
{
  "title": "Новое сообщение",
  "body": "Иван: Привет, как дела?",
  "icon": "/icon-192x192.png",
  "badge": "/badge-72x72.png",
  "image": "/media/image.jpg",
  "url": "/chats/chat1",
  "tag": "message-chat1",
  "requireInteraction": false,
  "actions": [
    { "action": "open", "title": "Открыть" },
    { "action": "close", "title": "Закрыть" }
  ],
  "vibrate": [200, 100, 200],
  "silent": false
}
```

## Настройка

### 1. VAPID Keys

Сгенерируйте VAPID ключи для Web Push:

```bash
npx web-push generate-vapid-keys
```

Добавьте в `.env.local`:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=ваш_публичный_ключ
VAPID_PRIVATE_KEY=ваш_приватный_ключ
```

### 2. Service Worker

Service Worker автоматически регистрируется при загрузке приложения. Файл находится в `/public/sw.js`.

### 3. Manifest

Добавьте иконки для уведомлений в `public/manifest.json`:
```json
{
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Интеграция с базой данных

Для хранения токенов пользователей используйте RxDB:

```typescript
// Schema для токенов
const notificationTokenSchema = {
  version: 0,
  type: 'object',
  properties: {
    userId: { type: 'string', primary: true },
    tokens: {
      type: 'object',
      properties: {
        web: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            platform: { type: 'string' },
            createdAt: { type: 'number' },
            expiresAt: { type: 'number' }
          }
        }
      }
    }
  }
};

// Сохранение токена
await accountsCollection.update({
  selector: { id: userId },
  modifier: {
    $set: {
      'notificationTokens.web': {
        token,
        platform: 'web',
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
      }
    }
  }
});
```

## Примеры использования

### Отправка уведомления при новом сообщении

```typescript
// В компоненте чата
import { NotificationManager } from '@/lib/notifications';

async function onNewMessage(chatId: string, message: Message) {
  const manager = NotificationManager.getInstance();
  
  // Получаем токены участников чата
  const userTokens = await getUserTokensForChat(chatId);
  
  // Отправляем уведомление
  for (const token of userTokens) {
    await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: token.userId,
        title: `Новое сообщение от ${message.senderName}`,
        body: message.content.substring(0, 100),
        url: `/chats/${chatId}`,
        tag: `message-${chatId}`
      })
    });
  }
}
```

### Отображение уведомлений в UI

```typescript
import { NotificationManager } from '@/components/NotificationManager';

function Header() {
  return (
    <header>
      <h1>Balloo</h1>
      <NotificationManager />
    </header>
  );
}
```

## Отладка

### Проверка Service Worker

```javascript
// В консоли браузера
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});
```

### Проверка подписки

```javascript
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(subscription => {
    console.log('Push Subscription:', subscription);
  });
});
```

### Логирование

В Service Worker включено детальное логирование:
- `[SW] Installing...`
- `[SW] Activating...`
- `[SW] Received push:`
- `[SW] Notification click:`
- `[SW] Sync event:`

## Ограничения

1. **Браузеры**: Поддерживается в Chrome, Firefox, Edge, Opera. Safari требует дополнительную настройку.
2. **HTTPS**: Push-уведомления работают только на HTTPS (кроме localhost).
3. **Фоновый режим**: Уведомления работают даже когда вкладка закрыта.
4. **Лимиты**: Максимальный размер payload - 4KB.

## Будущие улучшения

- [ ] Интеграция с Firebase Cloud Messaging
- [ ] Групповые уведомления
- [ ] Настройка типов уведомлений (только важные/все)
- [ ] Исчезающие уведомления
- [ ] Звуки уведомлений
- [ ] Вибрация на мобильных устройствах
