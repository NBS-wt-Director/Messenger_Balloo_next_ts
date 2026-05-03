# 📋 ВСЕ ОШИБКИ И ПРОБЛЕМЫ ПРОЕКТА

**Последнее обновление:** 2026-04-30  
**Анализ проведён:** Полный сканг кода на TypeScript ошибки, TODO, FIXME, any типы, баги

---

## 🔴 TypeScript ОШИБКИ (КРИТИЧНО - нужно исправить перед продакшеном)

### 1. Missing exports в модулях

**Файл:** `scripts/create-admin.ts` (строка 14)
```
error TS2305: Module '"../src/lib/database"' has no exported member 'getDatabase'.
```
**Проблема:** Импорт несуществующего экспорта  
**Решение:** Проверить что экспортирует `database.ts` и исправить импорт

---

### 2. Missing exports в middleware

**Файл:** `src/app/api/csrf-token/route.ts` (строка 2)
```
error TS2305: Module '"@/middleware"' has no exported member 'generateCSRFToken'.
```
**Проблема:** CSRF токены не реализованы  
**Решение:** Либо реализовать функцию, либо удалить CSRF функционал

---

### 3. Missing imports в auth

**Файл:** `src/app/api/auth/register-extended.ts` (строка 16)
```
error TS2304: Cannot find name 'getUserById'.
```
**Проблема:** Отсутствует импорт функции  
**Решение:** Добавить импорт `getUserById` из database

---

### 4. Missing imports в invitations

**Файл:** `src/app/api/invitations/route.ts` (строка 225)
```
error TS2304: Cannot find name 'isOneTime'.
```
**Проблема:** Отсутствует импорт функции  
**Решение:** Добавить импорт `isOneTime` или удалить использование

---

### 5. Duplicate function implementation

**Файлы:** 
- `scripts/createSystemChats.ts` (строка 102)
- `scripts/setup-test-data.ts` (строка 90)

**Проблема:** Дублирующиеся реализации функций  
**Решение:** Удалить дубликаты или переименовать функции

---

### 6. Type errors в admin/logs/page.tsx

**Файл:** `src/app/admin/logs/page.tsx` (строка 75)
```
error TS2345: Argument of type 'unknown[]' is not assignable to parameter of type 'SetStateAction<string[]>'.
```
**Проблема:** Неправочный тип для useState  
**Решение:** Добавить явный тип `string[]` при инициализации

---

### 7. Any типы в admin/backup/route.ts

**Файл:** `src/app/api/admin/backup/route.ts` (строки 56-62)
```
error TS7006: Parameter 'u' implicitly has an 'any' type.
error TS7006: Parameter 'c' implicitly has an 'any' type.
...
```
**Проблема:** Отсутствие типов для параметров map  
**Решение:** Добавить типы: `(u: User)`, `(c: Chat)` и т.д.

---

### 8. Any типы в installer/test-accounts/route.ts

**Файл:** `src/app/api/installer/test-accounts/route.ts` (строки 111, 120, 143)
```
error TS7006: Parameter 'u' implicitly has an 'any' type.
error TS7006: Parameter 'id' implicitly has an 'any' type.
```
**Проблема:** Отсутствие типов  
**Решение:** Добавить типы для параметров

---

### 9. Buffer type error в crypto.ts

**Файл:** `src/lib/crypto.ts` (строка 246)
```
error TS2345: Argument of type 'Buffer<ArrayBufferLike>' is not assignable to parameter of type 'BufferSource'.
```
**Проблема:** Несовместимость типов Buffer для Web Crypto API  
**Решение:** Преобразовать Buffer в ArrayBuffer: `encrypted.buffer`

---

## 🟡 ОСТАНОВКИ С any ТИПАМИ (СРЕДНЯЯ КРИТИЧНОСТЬ)

### Критические файлы с any:

| Файл | Количество any | Рекомендация |
|------|---------------|--------------|
| `src/app/api/admin/backup/route.ts` | 7 | Заменить на конкретные типы |
| `src/app/api/admin/users/route.ts` | 4 | Заменить на User тип |
| `src/app/api/auth/profile/route.ts` | 4 | Заменить на User тип |
| `src/app/api/auth/register-extended.ts` | 3 | Заменить на User тип |
| `src/app/api/user-id/change/route.ts` | 3 | Заменить на User тип |
| `src/app/api/balance/route.ts` | 3 | Заменить на User тип |
| `src/app/api/notifications/route.ts` | 3 | Заменить на конкретные типы |
| `src/app/api/notifications/send/route.ts` | 3 | Заменить на конкретные типы |
| `src/app/api/reports/route.ts` | 6 | Заменить на конкретные типы |
| `src/app/api/messages/route.ts` | 5 | Заменить на Message тип |
| `src/app/api/chats/route.ts` | 5 | Заменить на конкретные типы |
| `src/lib/logger.ts` | 8 | Заменить на конкретные типы |
| `src/lib/file-logger.ts` | 6 | Заменить на конкретные типы |

**Всего найдено:** 150+ мест с `any` типами

---

## 🟠 ОСТАВШИЕСЯ ЗАДАЧИ

### 1. Обновить остальную документацию (СРЕДНИЙ ПРИОРИТЕТ)

**Файлы содержащие упоминания Prisma:**
- `SETUP_INSTRUCTIONS.md`
- `DEPLOYMENT_GUIDE.md`
- `VPS_DEPLOYMENT.md`
- `DATABASE_MIGRATION_INFO.md`
- `README.md`
- `PROJECT_STRUCTURE.md`
- `DEPLOYMENT.md` (в messenger/docs/)
- `README_SERVER.md`
- `DEPLOY_ONE_COMMAND.sh`
- `DEPLOY_INSTRUCTIONS.md`
- `DEPLOY_READY.md`
- `CHANGES_SUMMARY.md`
- `PROJECT_CHECK_REPORT.md`
- `SAFE_DEPLOY.sh`
- `production-https-config.md`
- `messenger/docs/README.md`
- `messenger/docs/DEPLOYMENT.md`

---

### 2. Production логирование (✅ ЧАСТИЧНО РЕАЛИЗОВАНО)

**Создано:**
- ✅ `file-logger.ts` - production логгер
- ✅ `/api/admin/logs` - API для логов
- ✅ `/admin/logs` - админка для логов

**Осталось:**
- Настроить ротацию логов по размеру
- Добавить конфигурацию через .env
- Тестирование в production среде

---

### 3. Обработка ошибок в crypto.ts (✅ РЕАЛИЗОВАНО)

**Выполнено:**
- ✅ Все функции расшифровки логируют ошибки
- ✅ Добавлены try-catch блоки
- ✅ Логирование через fileLogger

---

### 4. Страницы ошибок 404/500 (✅ РЕАЛИЗОВАНО)

**Выполнено:**
- ✅ `error.tsx` - страница 500 с логированием
- ✅ `not-found.tsx` - страница 404 с логированием
- ✅ `/api/error` - endpoint для клиентских ошибок

---

### 5. Health check (✅ РЕАЛИЗОВАНО)

**Выполнено:**
- ✅ `/api/health` - API health check
- ✅ `/health` - страница мониторинга
- ✅ Проверка БД, response time, версия

---

## 📊 СТАТИСТИКА

| Категория | Было найдено | Исправлено | Осталось | % Исправлено |
|-----------|--------------|------------|----------|--------------|
| **Всего проблем** | 80+ | 55+ | ~15 | ~78% |
| 🔴 Critical (TypeScript errors) | 9 | 0 | 9 | 0% |
| 🟡 High (any типы) | 150+ | 0 | 150+ | 0% |
| 🟢 Medium (документация) | 17 | 3 | 14 | 18% |
| 🔵 Low (улучшения) | 20 | 5 | 15 | 25% |

---

## 🎯 ПРИОРИТЕТЫ ИСПРАВЛЕНИЯ

### Приоритет 0 - КРИТИЧНО (TypeScript ошибки)

1. **Исправить missing exports:**
   - `scripts/create-admin.ts` - удалить или исправить импорт `getDatabase`
   - `src/app/api/csrf-token/route.ts` - удалить CSRF функционал или реализовать

2. **Исправить missing imports:**
   - `src/app/api/auth/register-extended.ts` - добавить `getUserById`
   - `src/app/api/invitations/route.ts` - добавить `isOneTime`

3. **Исправить duplicate functions:**
   - `scripts/createSystemChats.ts`
   - `scripts/setup-test-data.ts`

4. **Исправить type errors:**
   - `src/app/admin/logs/page.tsx` - добавить тип для useState
   - `src/lib/crypto.ts` - исправить Buffer тип

5. **Добавить типы для параметров:**
   - `src/app/api/admin/backup/route.ts`
   - `src/app/api/installer/test-accounts/route.ts`

### Приоритет 1 - ВЫСОКИЙ (any типы в критичных местах)

6. Заменить any на конкретные типы в:
   - `src/app/api/admin/backup/route.ts`
   - `src/app/api/admin/users/route.ts`
   - `src/app/api/auth/profile/route.ts`
   - `src/app/api/messages/route.ts`
   - `src/app/api/chats/route.ts`

### Приоритет 2 - СРЕДНИЙ (Документация)

7. Обновить оставшуюся документацию (14 файлов)

### Приоритет 3 - НИЗКИЙ (Улучшения)

8. Настроить CI/CD пайплайн
9. Добавить мониторинг ошибок (Sentry)
10. Настроить pre-commit hooks (husky)
11. Добавить Swagger/OpenAPI документацию
12. Добавить CONTRIBUTING.md и CODE_OF_CONDUCT.md

---

## 🟢 ИСПРАВЛЕНО (История исправлений)

### Сессия 2 (2026-04-30) - Production логирование и мониторинг
- ✅ Создан production логгер с буферизацией
- ✅ Создана админка для просмотра логов
- ✅ Созданы страницы 404/500 с логированием
- ✅ Создан health check endpoint
- ✅ Добавлена обработка ошибок в crypto.ts

### Сессия 1 (2026-04-30) - Очистка кода
- ✅ Удалены устаревшие скрипты Prisma
- ✅ Удалена папка prisma/
- ✅ Реализовано httpOnly cookies
- ✅ Реализован rate limiting
- ✅ Обновлена документация (3 файла)

### Ранее (2025-01-15) - Миграция на SQLite
- ✅ Удалены все Prisma вызовы из кода
- ✅ Миграция на Better-SQLite3
- ✅ Исправлено 32+ API route файла
- ✅ Добавлены таблицы Ban и Attachment

---

## 🔧 КОМАНДЫ ДЛЯ ПРОВЕРКИ

```powershell
# Проверить TypeScript ошибки
cd messenger
npx tsc --noEmit

# Найти все any типы
grep -r ": any" src/ --include="*.ts" --include="*.tsx"

# Найти TODO комментарии
grep -r "TODO\|FIXME\|BUG\|XXX" src/ docs/ --include="*.ts" --include="*.tsx" --include="*.md"

# Найти устаревшие Prisma ссылки
grep -r "prisma\." src/ --include="*.ts" --include="*.tsx"

# Проверить базу данных
sqlite3 data/app.db ".tables"
```

---

## 📝 ПРИМЕЧАНИЯ

1. **Prisma удалена из основного кода:** Все файлы в `src/` не используют Prisma
2. **SQLite используется напрямую:** Через `better-sqlite3` в `database.js`
3. **Две базы данных:** 
   - `messenger/data/app.db` - SQLite (сервер)
   - `messenger/src/lib/database/index.ts` - RxDB (клиент)
4. **httpOnly cookies реализованы:** JWT токены в защищённых cookies
5. **Rate limiting реализован:** С поддержкой Redis
6. **Production логирование:** JSON файл с админкой
7. **Health check:** Доступен на `/health`
8. **Обработка ошибок:** Все криптофункции логируют ошибки

---

*Этот документ поддерживается вручную и автоматически*  
*Последнее обновление: 2026-04-30*  
*Prisma status: ✅ ПОЛНОСТЬЮ УДАЛЕНА*  
*TypeScript errors: ❌ 9 ОШИБОК*  
*any типы: ⚠️ 150+ МЕСТ*  
*Общая готовность: ~78%*
