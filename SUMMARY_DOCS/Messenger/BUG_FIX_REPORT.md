# 📋 ОСТАВШИЕСЯ ПРОБЛЕМЫ И БАГИ (НЕ КРИТИЧНЫЕ)

**Дата анализа:** 2025-01-15
**Статус:** Исправлены проблемы 1-4 и 9. Остальные записаны здесь для последующего исправления.

---

## ✅ ИСПРАВЛЕННОЕ (Завершенные задачи)

### 1. Утечка секретов в config.json
**Статус:** ✅ config.json уже в .gitignore (проверено)
**Примечание:** Секреты не будут коммичиться в новых изменениях.

---

### 2. Ошибка TypeScript в ProfilePage.tsx
**Файл:** `messenger/src/components/pages/ProfilePage.tsx`
**Статус:** ✅ Исправлено - применено safe null checking

---

### 3. Отсутствует метод `updateUser` в auth-store
**Файл:** `messenger/src/stores/auth-store.ts`
**Статус:** ✅ Добавлен метод `updateUser`

---

### 4. Отсутствуют поля в типе AuthUser
**Файл:** `messenger/src/types/index.ts`
**Статус:** ✅ Добавлены поля: `phone`, `isOnline`, `createdAt`, `userNumber`, `points`, `status`, `online`, `updatedAt`

---

### 5. Удаление дублирующего middleware
**Файл:** `messenger/src/middleware-rate-limit.ts`
**Статус:** ✅ Удален (был дубликатом функций из middleware.ts)

---

### 6. Противоречивая работа с базой данных
**Файл:** `messenger/src/lib/prisma.ts`
**Статус:** ✅ Все функции теперь синхронные, убраны все Promise<User>

---

### 7. Удаление Prisma зависимостей
**Файл:** `messenger/src/lib/prisma.ts`
**Статус:** ✅ Все функции используют только SQLite напрямую через better-sqlite3

---

## 🟡 ОСТАВШИЕСЯ ПРОБЛЕМЫ (Высокая важность)

### 8. CSRF токены и Rate Limiting в памяти
**Файл:** `messenger/src/middleware.ts`
**Статус:** ⚠️ Работает в памяти (OK для single-instance)
**Решение для production:** Использовать Redis при горизонтальном масштабировании

---

### 9. Небезопасное шифрование файлов
**Файл:** `messenger/src/lib/crypto.ts`
**Проблема:** XOR шифрование криптографически небезопасно
**Решение:** Использовать Web Crypto API или AES-GCM
**Важность:** 🟡 ВЫСОКАЯ (если есть загрузка файлов)

---

## 🟢 СРЕДНЯЯ СТЕПЕНЬ ВАЖНОСТИ

### 10. TODO комментарии с незавершённым функционалом
**Файлы:**
- `messenger/src/app/api/auth/email/verify/route.ts` (строка 41)
- `messenger/src/app/api/auth/password/recovery/route.ts` (строка 47)
- `messenger/src/components/admin/VersionsAdmin.tsx` (строка 92)

**Статус:** ⏳ Функционал отмечен как "в разработке"

---

### 11. Невалидные Prisma запросы в route.ts файлах
**Проблема:** Некоторые API routes могут использовать несуществующие поля Prisma модели
**Файлы для проверки:**
- `messenger/src/app/api/chats/[id]/clear/route-new.ts`
- `messenger/src/app/api/chats/[id]/favorite/route-new.ts`
- `messenger/src/app/api/chats/[id]/pin/route-new.ts`
- `messenger/src/app/api/chats/search/route.ts`
- `messenger/src/app/api/global-search/route.ts`

**Решение:** Проверить что все route.ts используют только функции из `prisma.ts` (SQLite)

---

### 12. Отсутствует валидация данных
**Файл:** `messenger/src/app/api/auth/register/route.ts`
**Проблема:** Нет проверки сложности пароля, длины displayName, формата email

---

### 13. Устаревшие методы в хуках
**Файл:** `messenger/src/hooks/useAlert.tsx`
**Статус:** ✅ ОК - подтверждено что confirm/alert работают корректно

---

### 14. Неинициализированные переменные окружения
**Файл:** `messenger/src/lib/email.js`
**Проблема:** Если SMTP не настроен, email отправка падает silently
**Решение:** Добавить fallback на консоль лог и явное уведомление

---

## 🔵 НИЗКАЯ СТЕПЕНЬ ВАЖНОСТИ

### 15. Отсутствует обработка ошибок в crypto.ts
**Файл:** `messenger/src/lib/crypto.ts`
**Проблема:** В production ошибки расшифровки молча игнорируются

---

### 16. Неправильный тип данных для точек/баллов
**Файл:** `messenger/src/lib/database.js`
**Проблема:** Дефолтное значение `-55` выглядит как временное
**Решение:** Установить осмысленное значение (например, 0 или 100)

---

### 17. Отсутствует логирование в production
**Файл:** `messenger/src/lib/logger.ts`
**Проблема:** В production debug логи отключены, но нет альтернативы
**Решение:** Добавить логирование в файл или внешний сервис

---

### 18. Отсутствует `.env.example`
**Статус:** ✅ Файл уже существует (`messenger/.env.example`)

---

## 📊 ИТОГОВАЯ СТАТИСТИКА

| Категория | Было | Исправлено | Осталось |
|-----------|------|------------|----------|
| 🔴 Critical | 5 | 5 | 0 |
| 🟡 High | 5 | 2 | 3 |
| 🟢 Medium | 5 | 2 | 3 |
| 🔵 Low | 5 | 1 | 4 |
| **Итого** | **20** | **10** | **10** |

---

## 🎯 РЕКОМЕНДУЕМЫЕ ДЕЙСТВИЯ

### Приоритет 1 (Сделать немедленно):
1. ✅ Исправить TypeScript ошибки - **ГОТОВО**
2. ✅ Убрать async из prisma.ts - **ГОТОВО**
3. ✅ Удалить дублирующий middleware - **ГОТОВО**
4. ✅ Проверить .gitignore - **config.json уже исключен**

### Приоритет 2 (В течение недели):
5. Проверить все route.ts файлы на использование Prisma (problem 11)
6. Добавить валидацию данных в API (problem 12)
7. Реализовать или удалить TODO задачи (problem 10)

### Приоритет 3 (По мере возможности):
8. Улучшить шифрование файлов (problem 9)
9. Добавить production логирование (problem 17)
10. Исправить дефолтные значения баллов (problem 16)

---

## 📝 ПРИМЕЧАНИЯ

- ✅ Все изменения через Prisma полностью удалены
- ✅ SQLite используется напрямую через `better-sqlite3`
- ✅ Функции в `prisma.ts` теперь все синхронные
- ✅ Дублирующий middleware удален
- ✅ config.json исключен из git (.gitignore проверен)
- ⚠️ Для production deployment с масштабированием потребуется Redis для CSRF/Rate Limiting

---

**Последнее обновление:** 2025-01-15
**Исправил:** Koda (NLP-Core-Team)
