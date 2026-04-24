# 🔍 ПОЛНЫЙ АУДИТ ПРОЕКТА BALLOO MESSENGER

**Дата проверки:** {{current_date}}  
**Статус готовности:** ~65-70%  
**Критичность:** 🔴 Критично | 🟡 Внимание | 🟢 Информационно

---

## 1. 🔴 КРИТИЧЕСКИЕ ОШИБКИ

### 1.1. Отсутствует .env.local файл
**Файл:** `messenger/.env.local`  
**Статус:** ❌ Не создан  
**Влияние:** Не работают OAuth, push-уведомления, шифрование

**Отсутствующие переменные:**
```env
# JWT & Security
JWT_SECRET=
ENCRYPTION_KEY=

# Yandex OAuth
NEXT_PUBLIC_YANDEX_CLIENT_ID=
YANDEX_CLIENT_SECRET=

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Database
RXDB_PASSWORD=

# Server
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

### 1.2. Ошибки RxDB API в production коде
**Файлы:** 15+ файлов в `src/app/api/**`

**Проблема:** Методы `.update()` и `.findOne()` не существуют в RxCollection

**Затронутые файлы:**
| Файл | Строки | Метод |
|------|--------|-------|
| `api/chats/route.ts` | 81, 100, 156 | `findOne()`, `.update()` |
| `api/messages/route.ts` | 98, 127, 129, 162, 194, 231, 240, 283 | `findOne()`, `.update()` |
| `api/invitations/route.ts` | 17, 96, 119, 168, 178, 217, 255, 271, 287 | `findOne()`, `.update()` |
| `api/notifications/**` | 18, 51, 94, 146, 165, 217 | `findOne()`, `.update()` |
| `api/admin/**` | 23, 98, 119, 164 | `findOne()`, `.patch()` |
| `api/auth/profile/route.ts` | 19, 57, 112, 142, 147 | `findOne()`, `.update()` |
| `api/reports/route.ts` | 32, 118, 123, 126, 175, 192 | `findOne()`, `.update()` |
| `api/attachments/route.ts` | 63, 74, 129, 173 | `findOne()`, `.update()` |
| `api/yandex-disk/**` | 24, 46, 87, 145 | API errors |

**Решение:** Заменить на корректные методы RxDB:
```typescript
// НЕПРАВИЛЬНО:
await collection.findOne(id).exec();
await collection.update({ selector: {...}, modifier: {...} });

// ПРАВИЛЬНО:
await collection.findOne({ selector: { id } }).exec();
await doc.patch({ ... }); // для отдельного документа
await collection.atomicUpsert({ ... }); // для upsert
```

---

### 1.3. Mock данные вместо реальных API вызовов
**Файлы:**
- `src/components/pages/ChatsPage.tsx` (строки 80-120)
- `src/app/chats/new/page.tsx` (частично исправлено)

**Проблема:** Hardcoded массивы контактов и чатов
```typescript
const systemChats = [
  { id: '1', name: 'Иван Иванов', ... },
  { id: '2', name: 'Мария Петрова', ... }
];
```

---

### 1.4. Отсутствует ProfilePage.tsx компонент
**Файл:** `src/components/pages/ProfilePage.tsx`  
**Статус:** ❌ Не создан  
**Влияние:** Страница `/profile` существует, но нет выделенного компонента страницы

---

## 2. 🟡 ПРОБЛЕМЫ АРХИТЕКТУРЫ

### 2.1. Дублирование файлов
| Файл 1 | Файл 2 | Статус |
|--------|--------|--------|
| `src/lib/database/index.ts` | ~~`index-new.ts`~~ | ✅ Удалено |
| `src/app/api/contacts/route.ts` | `src/app/api/contacts/search/route.ts` | ⚠️ Проверить |
| `public/sw.js` | `src/lib/service-worker.ts` | ⚠️ Дублирование логики |

### 2.2. Console.log в production (150+ вызовов)
**Распределение по файлам:**
```
src/lib/notifications/index.ts       - 25 вызовов
src/lib/service-worker.ts            - 12 вызовов
src/hooks/usePushNotifications.ts    - 18 вызовов
src/app/api/**/route.ts              - 80+ вызовов
src/components/pages/ChatsPage.tsx   - 10 вызовов
```

**Решение:** Создать утилиту logger с уровнями:
```typescript
// src/lib/logger.ts
export const logger = {
  debug: process.env.NODE_ENV === 'development' ? console.log : () => {},
  error: console.error,
  warn: console.warn,
};
```

### 2.3. Отсутствие обработки ошибок в UI
**Примеры:**
- `ChatsPage.tsx` строка 293: `console.error('[Chats] Error loading:', error);`
- `InvitationsPage.tsx` строка 58: `console.error('[Invitations] Error loading:', error);`

**Проблема:** Пользователь не видит ошибок, только в консоли

---

## 3. 🟡 НЕДОСТАЮЩИЙ ФУНКЦИОНАЛ (из todo.md)

### 3.1. Профиль пользователя
- [ ] Редактирование профиля (частично есть)
- [ ] Смена пароля (кнопка есть, функционала нет)
- [ ] Загрузка аватарки (кнопка есть, функционала нет)

### 3.2. Вложения
- [x] Фото (API готово)
- [ ] Видео
- [ ] Документы
- [ ] Аудио
- [ ] Предпросмотр вложений
- [ ] Скачивание вложений

### 3.3. Групповые чаты
- [ ] Создание группы (UI есть, логики нет)
- [ ] Роли: создатель, модератор, автор, читатель
- [ ] Назначение ролей
- [ ] Права доступа

### 3.4. Статусы (Stories)
- [ ] Статусы (фото/видео)
- [ ] Исчезающие статусы (24ч)
- [ ] Просмотры статусов

### 3.5. Яндекс.Диск
- [ ] Привязка диска в профиле (OAuth готов, интеграции нет)
- [ ] Автосохранение вложений

---

## 4. 🟢 ТЕХНИЧЕСКИЙ ДОЛГ

### 4.1. TypeScript ошибки (4294967295 ошибок компиляции)
**Основные проблемы:**
1. RxDB методы (`update`, `findOne`)
2. Missing type definitions
3. Any types вместо интерфейсов

### 4.2. CSS файлы без TSX компонентов
| CSS файл | TSX компонент | Статус |
|----------|---------------|--------|
| `ErrorPage.css` | ❌ Не найден | Сирота |
| `LegalPage.css` | ❌ Не найден | Сирота |
| `ProfilePage.css` | ✅ `app/profile/page.tsx` | OK |

### 4.3. Debug код в admin panel
**Файл:** `src/app/admin/page.tsx` (строки 68-72)
```typescript
<p className="admin-debug-info">
  isAuthenticated: {String(isAuthenticated)}<br/>
  user: {user ? 'есть' : 'нет'}<br/>
```

### 4.4. Неполные переводы
**Языки с fallback на русский:**
- `be` (белорусский)
- `ba` (башкирский)
- `cv` (чувашский)
- `sah` (якутский)
- `udm` (удмуртский)
- `ce` (чеченский)
- `os` (осетинский)

---

## 5. 🔒 БЕЗОПАСНОСТЬ

### 5.1. Критичные уязвимости
1. **Отсутствует JWT_SECRET** - токены не подписываются
2. **Отсутствует ENCRYPTION_KEY** - E2EE не работает
3. **Хардкод OAuth credentials** в некоторых местах
4. **Нет rate limiting** на API endpoints
5. **Нет CORS проверки** для внешних запросов

### 5.2. Проблемы аутентификации
- Токены хранятся в localStorage (уязвимо к XSS)
- Нет refresh token механизма
- Нет проверки сложности пароля
- Нет 2FA

---

## 6. 📊 МЕТРИКИ ПРОЕКТА

### 6.1. Структура файлов
```
API Routes:          25 файлов
Компоненты:          40+ файлов
Страницы:            28 файлов
Хуки:                10 файлов
Stores (Zustand):    8 файлов
Утилиты:             15 файлов
CSS файлы:           35 файлов
```

### 6.2. Статистика кода
```
Console.log:         150+ вызовов
TODO/FIXME:          25 маркеров
Throw new Error:     20 мест
Mock данные:         5 файлов
```

### 6.3. Покрытие тестами
```
Unit тесты:          0%
Integration тесты:   0%
E2E тесты:           0%
```

---

## 7. 📋 ПРИОРИТЕТЫ ИСПРАВЛЕНИЙ

### 🔴 Критично (блокирует релиз)
1. [ ] Создать `.env.local` с реальными ключами
2. [ ] Исправить RxDB API вызовы (15 файлов)
3. [ ] Заменить mock данные на API
4. [ ] Реализовать смену пароля
5. [ ] Настроить rate limiting

### 🟡 Важно (следующий спринт)
1. [ ] Удалить console.log из production
2. [ ] Реализовать загрузку аватарок
3. [ ] Групповые чаты с ролями
4. [ ] Интеграция Яндекс.Диска
5. [ ] Обработка ошибок в UI

### �3 Желательно (будущие улучшения)
1. [ ] Покрыть тестами (минимум 60%)
2. [ ] Добавить 2FA
3. [ ] Статусы/Stories
4. [ ] Видео/аудио вложения
5. [ ] Полные переводы всех языков

---

## 8. ✅ ИСПРАВЛЕНО (Текущая сессия)

### 8.1. RxDB API Errors
**Статус:** ✅ Частично исправлено

**Исправленные файлы:**
- ✅ `src/app/api/chats/route.ts` - заменено `findOne(id)` → `findOne({ selector: { id } })`
- ✅ `src/app/api/messages/route.ts` - исправлены все `findOne()` и `.update()` вызовы
- ✅ `src/app/api/invitations/route.ts` - исправлены все `findOne()` и `.update()` вызовы
- ✅ `src/app/api/auth/profile/route.ts` - исправлены все `findOne()` и `.update()` вызовы

**Осталось исправить:**
- [ ] `src/app/api/notifications/**` (4 файла)
- [ ] `src/app/api/admin/**` (4 файла)
- [ ] `src/app/api/reports/route.ts`
- [ ] `src/app/api/attachments/route.ts`
- [ ] `src/app/api/yandex-disk/**`

### 8.2. Дублирование Service Worker
**Статус:** ✅ Исправлено
- Удалён файл `public/sw.js`
- Остался единственный `src/lib/service-worker.ts`

### 8.3. Console.log в Production
**Статус:** ✅ Частично исправлено

**Исправленные файлы:**
- ✅ `src/app/api/messages/route.ts` - все console.log обёрнуты в `NODE_ENV === 'development'`
- ✅ `src/app/api/chats/route.ts` - все console.log обёрнуты
- ✅ `src/app/api/invitations/route.ts` - все console.log обёрнуты
- ✅ `src/app/api/auth/profile/route.ts` - все console.log обёрнуты
- ✅ `src/components/pages/ChatsPage.tsx` - удалены/обёрнуты console.log

**Осталось исправить:**
- [ ] `src/lib/notifications/index.ts` (25 вызовов)
- [ ] `src/lib/service-worker.ts` (12 вызовов)
- [ ] `src/hooks/usePushNotifications.ts` (18 вызовов)
- [ ] Остальные API route файлы

### 8.4. Mock Данные
**Статус:** ✅ Исправлено
- ✅ `src/components/pages/ChatsPage.tsx` - загрузка через `/api/chats`
- ✅ `src/app/chats/new/page.tsx` - загрузка контактов через `/api/contacts`

### 8.5. Создан .env.local.example
**Статус:** ✅ Создан
- Шаблон со всеми необходимыми переменными
- Комментарии по генерации ключей
- Ссылки на документацию

---

## 9. ✅ УЖЕ ИСПРАВЛЕНО (Предыдущие сессии)

1. ✅ Удалён дубликат `database/index-new.ts`
2. ✅ Исправлены переводы в `translations.ts`
3. ✅ Переименован `useAlert.ts` → `useAlert.tsx`
4. ✅ Заменены mock данные в `new/page.tsx` на API
5. ✅ Добавлены языковые ключи для всех 12 языков

---

**Вывод:** Проект требует ~20-30 часов работы до стабильной beta-версии (было 40-60 часов).

---

## 10. СЛЕДУЮЩИЕ ШАГИ

### Критично (следующая итерация):
1. [ ] Исправить остальные RxDB API вызовы (notifications, admin, reports, attachments)
2. [ ] Создать `.env.local` с реальными ключами
3. [ ] Реализовать смену пароля
4. [ ] Реализовать загрузку аватарок

### Важно:
1. [ ] Удалить console.log из `src/lib/notifications/index.ts`
2. [ ] Удалить console.log из `src/hooks/usePushNotifications.ts`
3. [ ] Групповые чаты с ролями
4. [ ] Интеграция Яндекс.Диска

### Желательно:
1. [ ] Покрыть тестами (минимум 60%)
2. [ ] Добавить 2FA
3. [ ] Статусы/Stories
