# 🔄 Обновление миграции

**Дата:** 2024-01-01  
**Статус:** ~70% выполнено  

---

## ✅ Выполнено сегодня

### 1. Обновлены компоненты Auth (100%)

**Обновлённые файлы:**
- `messenger/src/stores/auth-store.ts` - async logout с API вызовом
- `messenger/src/components/AccountSwitcher.tsx` - async logout
- `messenger/src/components/Header.tsx` - async logout
- `messenger/src/app/profile/page.tsx` - async logout

### 2. Созданы API Wrappers (100%)

**Новые файлы:**
```
messenger/src/api/chats.ts      ✅ (13 методов)
messenger/src/api/messages.ts   ✅ (7 методов)
messenger/src/api/contacts.ts   ✅ (8 методов)
```

**Методы Wrappers:**

| Module | Methods |
|--------|---------|
| **Chats** | getChats, getChatById, createChat, updateChat, togglePin, toggleFavorite, clearChat, deleteChat, markAsRead, sendTyping, getChatMembers, addMember, removeMember |
| **Messages** | getMessages, sendMessage, editMessage, deleteMessage, addReaction, removeReaction, markMessageAsRead |
| **Contacts** | getContacts, addContact, removeContact, toggleFavoriteContact, toggleBlockContact, getContactRequests, sendContactRequest, handleContactRequest |

### 3. Обновлён ChatsPage (70%)

**Заменено fetch на API wrappers:**
- ✅ `loadChats()` → `getChats()`
- ✅ `handleChatAction('pin')` → `togglePin()`
- ✅ `handleChatAction('favorite')` → `toggleFavorite()`
- ✅ `handleChatAction('clear')` → `clearChat()`
- ✅ `handleChatAction('block')` → `contactsApi.toggleBlock()`

**Осталось заменить:**
- ⏳ `handleSearchMessages()` - поиск по сообщениям
- ⏳ `handleGlobalSearch()` - глобальный поиск
- ⏳ `handleChatSearch()` - поиск по чатам
- ⏳ submitReport() - отправка жалоб

---

## 📊 Общий прогресс

| Категория | Прогресс | Статус |
|-----------|----------|--------|
| **Инфраструктура** | 100% | ✅ Готово |
| **Auth** | 100% | ✅ Готово |
| **API Wrappers** | 100% | ✅ Готово |
| **ChatsPage** | 70% | ⏳ В процессе |
| **ChatPage (messages)** | 0% | ⏳ TODO |
| **Admin Panel** | 0% | ⏳ TODO |
| **Удаление API Routes** | 0% | ⏳ TODO |
| **ИТОГО** | **~70%** | |

---

## 📋 Следующие шаги

### Сегодня (День 1 - завершение)

1. **Завершить ChatsPage:**
   - Заменить поиск на API wrappers
   - Заменить submitReport на API

2. **Тестирование:**
   - Запустить API сервер
   - Протестировать ChatsPage

### Завтра (День 2)

3. **Обновить ChatPage (сообщения):**
   ```typescript
   import { getMessages, sendMessage, editMessage, deleteMessage } from '@/api/messages';
   ```

4. **Обновить Admin Panel:**
   - Создать `adminApi` wrapper
   - Заменить fetch вызовы

### День 3

5. **Остальные страницы:**
   - Features, Pages, Invitations

6. **WebSocket переключение:**
   ```typescript
   const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
   ```

### День 4

7. **Тестирование UI:**
   - Регистрация/логин
   - Создание чатов
   - Отправка сообщений
   - Уведомления

### День 5

8. **Удаление Next.js API Routes:**
   ```bash
   rm -rf messenger/src/app/api/
   rm messenger/src/lib/email.js
   rm messenger/src/lib/verification-code.js
   rm messenger/src/lib/database.js
   ```

9. **Финальное тестирование**

---

## 🎯 Пример использования API Wrappers

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

### Стало (API wrappers):

```typescript
import { getChats, togglePin } from '@/api/chats';

const loadChats = async () => {
  const result = await getChats();
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
- [x] Wrappers для chats/messages/contacts созданы
- [x] ChatsPage частично обновлён (70%)
- [ ] ChatsPage полностью обновлён
- [ ] ChatPage (messages) обновлён
- [ ] Admin panel обновлена
- [ ] WebSocket переключен
- [ ] Next.js API Routes удалены
- [ ] Все тесты пройдены

---

**NLP-Core-Team** - App Balloo Project
