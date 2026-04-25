# 🔧 Balloo Shared

**Общие типы и утилиты для всех платформ**

---

## 📑 Содержание

1. [Обзор](#обзор)
2. [Установка](#установка)
3. [Типы](#типы)
4. [Утилиты Auth](#утилиты-auth)
5. [API Client](#api-client)
6. [Утилиты](#утилиты)

---

## Обзор

Пакет `@balloo/shared` содержит общие TypeScript типы, утилиты и функции для всех платформ Balloo.

### Статус: ✅ Готово (85%)

---

## Установка

```bash
npm install @balloo/shared
```

---

## Типы

### User

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Chat

```typescript
export interface Chat {
  id: string;
  name?: string;
  type: 'private' | 'group';
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Message

```typescript
export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'document';
  attachmentUrl?: string;
  senderId: string;
  chatId: string;
  createdAt: Date;
}
```

---

## Утилиты Auth

### Генерация токена

```typescript
import { generateToken } from '@balloo/shared';

const token = generateToken(user);
```

### Проверка токена

```typescript
import { verifyToken } from '@balloo/shared';

const user = verifyToken(token);
```

---

## API Client

```typescript
import { api } from '@balloo/shared';

// GET
const chats = await api.get('/api/chats');

// POST
const message = await api.post('/api/messages', {
  chatId: 'uuid',
  content: 'Hello'
});
```

---

## Утилиты

### Форматирование времени

```typescript
import { formatTime } from '@balloo/shared';

const time = formatTime(new Date()); // "12:34"
```

### Валидация email

```typescript
import { validateEmail } from '@balloo/shared';

const isValid = validateEmail('user@example.com'); // true
```

---

**Balloo Shared - Единый источник истины!** 🔧
