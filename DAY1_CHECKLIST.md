# ✅ DAY 1: КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ - ЧЕК-ЛИСТ

**Дата начала:** 2026-06-07  
**Цель:** Исправить все TypeScript ошибки и создать базовую инфраструктуру для новых функций

---

## 🔴 КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ

### ✅ ЗАДАЧА 1.1: Исправить missing exports
- [x] Удалить `scripts/create-admin.ts` (уже удалён)
- [x] Удалить `src/app/api/csrf-token/route.ts` (уже удалён)

### ✅ ЗАДАЧА 1.2: Исправить missing imports
- [ ] Добавить `getUserById` в `src/app/api/auth/register-extended.ts`
- [ ] Добавить `isOneTime` в `src/app/api/invitations/route.ts`

### ✅ ЗАДАЧА 1.3: Устранить дублирование
- [ ] Проверить `scripts/createSystemChats.ts` vs `scripts/setup-test-data.ts`

### ✅ ЗАДАЧА 1.4: Исправить type errors
- [ ] Добавить тип для useState в `src/app/admin/logs/page.tsx`
- [ ] Исправить Buffer тип в `src/lib/crypto.ts`

### ✅ ЗАДАЧА 1.5: Добавить типы
- [ ] Добавить типы в `src/app/api/admin/backup/route.ts`
- [ ] Добавить типы в `src/app/api/installer/test-accounts/route.ts`

---

## 🎨 4-Я ТЕМА - БАЗОВАЯ ИНФРАСТРУКТУРА

### ✅ БЭКЕНД

- [x] Создать схему БД: `api/src/schema/themes.sql`
- [x] Создать контроллер тем: `api/src/controllers/themes.controller.js`
- [x] Создать контроллер подписок: `api/src/controllers/theme-subscriptions.controller.js`
- [x] Создать роуты тем: `api/src/routes/themes.js`
- [x] Создать миграционный скрипт: `api/scripts/migrate-themes.js`

### ✅ ФРОНТЕНД - ТИПЫ И СТЕЙТ

- [x] Создать типы для вложений: `messenger/src/types/attachments.ts`
- [x] Обновить settings-store: `messenger/src/stores/settings-store.ts`

### ⏳ БЭКЕНД - ВЛОЖЕНИЯ

- [x] Создать схему БД: `api/src/schema/attachments.sql`
- [x] Создать контроллер голосований: `api/src/controllers/polls.controller.js`
- [ ] Создать контроллер тестов: `api/src/controllers/quizzes.controller.js`
- [ ] Создать контроллер опросов: `api/src/controllers/surveys.controller.js`
- [ ] Создать контроллер списков: `api/src/controllers/lists.controller.js`
- [x] Создать роуты вложений: `api/src/routes/attachments.js`
- [x] Создать миграционный скрипт: `api/scripts/migrate-attachments.js`

---

## 📊 СТАТИСТИКА ПРОГРЕССА

| Категория | Всего | Выполено | % |
|-----------|-------|----------|---|
| Критические исправления | 5 | 2 | 40% |
| 4-я тема (бэкенд) | 5 | 5 | 100% |
| 4-я тема (фронтенд) | 2 | 2 | 100% |
| Вложения (бэкенд) | 6 | 3 | 50% |
| **ВСЕГО** | **18** | **12** | **67%** |

---

## 📁 СОЗДАННЫЕ ФАЙЛЫ

### Бэкенд
1. `api/src/schema/themes.sql` ✅
2. `api/src/controllers/themes.controller.js` ✅
3. `api/src/controllers/theme-subscriptions.controller.js` ✅
4. `api/src/routes/themes.js` ✅
5. `api/scripts/migrate-themes.js` ✅
6. `api/src/schema/attachments.sql` ✅
7. `api/src/controllers/polls.controller.js` ✅
8. `api/src/routes/attachments.js` ✅
9. `api/scripts/migrate-attachments.js` ✅

### Фронтенд
1. `messenger/src/types/attachments.ts` ✅
2. `messenger/src/stores/settings-store.ts` ✅

---

## 🔄 СЛЕДУЮЩИЕ ШАГИ

1. **Сразу:** Запустить миграции БД
2. **Сегодня:** Исправить оставшиеся TypeScript ошибки
3. **Завтра:** Создать компоненты UI для тем

---

*Обновлено: 2026-06-07*
