# ✅ Исправление Ошибки Дублирования

## Проблема

```
Module parse failed: Identifier 'chats' has already been declared (384:11)
```

## Причина

В компоненте `ChatsPage.tsx` переменная `chats` объявлялась дважды:

1. **Импорт из store:**
```typescript
const { chats, setChats } = useChatStore();
```

2. **Локальный state:**
```typescript
const [chats, setChats] = useState<any[]>([]);
```

## Решение

Убран импорт из `useChatStore`, теперь используется только локальный state:

### Изменения:

1. **Удалён импорт:**
```diff
- import { useChatStore } from '@/stores/chat-store';
```

2. **Удалено использование store:**
```diff
- const { chats, setChats } = useChatStore();
```

3. **Остался только локальный state:**
```typescript
const [chats, setChats] = useState<any[]>([]);
const [chatsLoading, setChatsLoading] = useState(true);
```

## Почему Так Правильно

- ✅ Чаты загружаются из API `/api/chats`
- ✅ Добавляются системные чаты (favorites, support, balloo-news)
- ✅ Нет зависимости от chat-store
- ✅ Чистая архитектура без дублирования

## Файлы

- `src/components/pages/ChatsPage.tsx` - Исправлено

## Статус

✅ **Исправлено**
