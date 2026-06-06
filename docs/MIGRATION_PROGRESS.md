# 🔄 Прогресс миграции на внешний API

**Дата:** 2024-01-01  
**Статус:** ~60% выполнено  

---

## ✅ Выполнено

### 1. Инфраструктура (100%)

- [x] Централизованные настройки (`settings/src/config.ts`)
- [x] API клиент (`messenger/src/api/client.ts`)
- [x] Environment файлы (api, messenger, admin-portal)
- [x] axios установлен в messenger

### 2. Auth (100%)

- [x] `authApi` в API клиенте
- [x] `AuthPage.tsx` использует новый API
- [x] Обновлён `auth-store.ts` с async logout
- [x] Logout вызывает API (`authApi.logout()`)

**Обновлённые компоненты:**
- `messenger/src/stores/auth-store.ts` - async logout с API вызовом
- `messenger/src/components/AccountSwitcher.tsx` - async logout
- `messenger/src/components/Header.tsx` - async logout
- `messenger/src/app/profile/page.tsx` - async logout

### 3. Chats API Wrapper (100%)

**Создано:** `messenger/src/api/chats.ts`

**Методы:**
- `getChats()` - Получить список чатов
- `getChatById()` - Получить чат по ID
- `createChat()` - Создать чат
- `updateChat()` - Обновить чат
- `togglePin()` - Закрепить/открепить
- `toggleFavorite()` - Избранное
- `clearChat()` - Очистить чат
- `deleteChat()` - Удалить чат
- `markAsRead()` - Пометить как прочитанный
- `sendTyping()` - Сигнал "печатает"
- `getChatMembers()` - Участники
- `addMember()` - Добавить участника
- `removeMember()` - Удалить участника

### 4. Messages API Wrapper (100%)

**Создано:** `messenger/src/api/messages.ts`

**Методы:**
- `getMessages()` - Получить сообщения
- `sendMessage()` - Отправить сообщение
- `editMessage()` - Редактировать
- `deleteMessage()` - Удалить
- `addReaction()` - Добавить реакцию
- `removeReaction()` - Удалить реакцию
- `markMessageAsRead()` - Прочитано

### 5. Notifications, Contacts, Invitations (✅ В API клиенте)

Эти модули уже есть в `messenger/src/api/client.ts`:
- `notificationsApi` - 6 методов
- `contactsApi` - 8 методов
- `invitationsApi` - 6 методов
- `featuresApi` - 4 метода
- `pagesApi` - 2 метода
- `yandexApi` - 9 методов

---

## ⏳ В процессе

### 1. Обновление компонентов (30%)

**Нужно заменить fetch на API wrappers:**

| Компонент | Fetch вызовы | Статус |
|-----------|--------------|--------|
| `ChatsPage.tsx` | `/api/chats`, `/api/chats/*/pin`, etc. | ⏳ TODO |
| `ChatPage.tsx` (messages) | `/api/chats/*/messages` | ⏳ TODO |
| `AdminPage.tsx` | `/api/admin/*` | ⏳ TODO |
| `FeaturesPage.tsx` | `/api/features` | ⏳ TODO |
| `About pages` | `/api/pages` | ⏳ TODO |

### 2. Удаление Next.js API Routes (0%)

```bash
# Планируется к удалению:
messenger/src/app/api/           # Все Next.js API Routes
messenger/src/lib/email.js
messenger/src/lib/verification-code.js
messenger/src/lib/database.js
```

---

## 📊 Общая готовность

| Категория | Прогресс |
|-----------|----------|
| **Инфраструктура** | 100% ✅ |
| **Auth** | 100% ✅ |
| **Chats/Messages Wrappers** | 100% ✅ |
| **Компоненты** | 30% ⏳ |
| **Удаление API Routes** | 0% ⏳ |
| **Тестирование** | 0% ⏳ |
| **ИТОГО** | **~60%** |

---

## 📋 Следующие шаги

### День 1 (Сегодня)

1. **Запустить API сервер**
   ```bash
   cd api
   npm install
   npm run dev
   ```

2. **Тестирование через Postman**
   - `/api/v1/health`
   - `/api/v1/auth/login`
   - `/api/v1/chats`

3. **Обновить ChatsPage.tsx**
   - Заменить `fetch('/api/chats')` на `getChats()`
   - Заменить `fetch('/api/chats/*/pin')` на `togglePin()`
   - Заменить `fetch('/api/chats/*/favorite')` на `toggleFavorite()`

### День 2

4. **Обновить ChatPage.tsx (сообщения)**
   - Заменить `fetch('/api/chats/*/messages')` на `getMessages()`
   - Заменить `post('/api/chats/*/messages')` на `sendMessage()`
   - Заменить реакции на `addReaction()`, `removeReaction()`

5. **Обновить AdminPage.tsx**
   - Заменить fetch на API клиент
   - Использовать `adminApi` (нужно создать wrapper)

### День 3

6. **Обновить остальные страницы**
   - Features, Pages, Contacts, Invitations

7. **Тестирование UI**
   - Регистрация/логин
   - Создание чатов
   - Отправка сообщений
   - Уведомления

### День 4

8. **WebSocket переключение**
   ```typescript
   // Было
   const ws = new WebSocket('ws://localhost:3000');
   
   // Стало
   const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
   ```

9. **Очистка кода**

### День 5

10. **Удаление Next.js API Routes**
    ```bash
    rm -rf messenger/src/app/api/
    rm messenger/src/lib/email.js
    rm messenger/src/lib/verification-code.js
    rm messenger/src/lib/database.js
    ```

11. **Финальное тестирование**

---

## 🧪 Пример обновления компонента

### Было (fetch):

```typescript
const loadChats = async () => {
  const response = await fetch('/api/chats?userId=' + userId);
  const data = await response.json();
  setChats(data.chats);
};

const handlePin = async (chatId: string) => {
  await fetch(`/api/chats/${chatId}/pin`, {
    method: 'POST',
    body: JSON.stringify({ userId, pinned: true })
  });
};
```

### Стало (API wrapper):

```typescript
import { getChats, togglePin } from '@/api/chats';

const loadChats = async () => {
  const result = await getChats(userId);
  if (result.success) {
    setChats(result.chats);
  }
};

const handlePin = async (chatId: string) => {
  const result = await togglePin(chatId);
  if (result.success) {
    loadChats(); // Перезагрузить список
  }
};
```

---

## ✅ Критерии завершения

- [x] API клиент создан
- [x] Auth работает через внешний API
- [x] Wrappers для chats/messages созданы
- [ ] ChatsPage обновлён
- [ ] ChatPage (messages) обновлён
- [ ] Admin panel обновлена
- [ ] WebSocket переключен
- [ ] Next.js API Routes удалены
- [ ] Все тесты пройдены

---

**NLP-Core-Team** - App Balloo Project
