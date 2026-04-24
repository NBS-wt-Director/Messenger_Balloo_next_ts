# Обновление страниц и функционала

## 📋 Изменения

### 1. Страница "Поддержать проект" (`/support`)
- ✅ Приём поддержки через СБП (Сбербанк)
- ✅ Номер телефона: `+7 (999) 123-45-67`
- ✅ Получатель: Иван Оберюхтин
- ✅ Кнопка копирования номера
- ✅ Секция для QR-кода (ожидает изображения)
- ✅ Динамический контент из БД

### 2. Страница "О компании" (`/about-company`)
- ✅ Информация о разработчике-одиночке
- ✅ Иван Оберюхтин, Екатеринбург
- ✅ Деятельность: тренируется, тренирует, пишет на React/Next.js
- ✅ Секция с технологиями
- ✅ Принципы проекта (приватность, производительность, независимость, открытость)
- ✅ Динамический контент из БД

### 3. Страница "О Balloo" (`/about-balloo`)
- ✅ Все встроенные функции мессенджера (10 карточек)
- ✅ Секция предложений от пользователей
- ✅ Голосование за функции
- ✅ Форма предложения новой функции (для авторизованных)
- ✅ Фильтрация по статусам (completed, planned, in-progress, pending)
- ✅ Динамический контент из БД + функции из коллекции features

### 4. Админ-панель
- ✅ Новая секция "Функции и страницы"
- ✅ Управление предложениями функций:
  - Изменение статуса (pending/planned/in-progress/completed/rejected)
  - Заметки администратора
  - Удаление предложений
- ✅ Управление страницами:
  - Редактирование заголовков и контента
  - Просмотр страниц

### 5. API Endpoints

**`POST /api/features`** - Предложить новую функцию
```json
{
  "title": "Тёмная тема",
  "description": "Нужна тёмная тема для ночного использования",
  "category": "ui",
  "userId": "user123",
  "userName": "Иван"
}
```

**`GET /api/features?status=completed`** - Получить функции
- Параметры: `status` (pending/planned/in-progress/completed/rejected/all)

**`PATCH /api/features`** - Обновить функцию (админ)
```json
{
  "featureId": "feat_123",
  "updates": {
    "status": "planned",
    "adminNote": "Добавим в следующем релизе"
  }
}
```

**`DELETE /api/features?featureId=feat_123`** - Удалить функцию (админ)

**`POST /api/pages`** - Создать/обновить страницу (админ)
```json
{
  "slug": "support",
  "title": "Поддержать проект",
  "content": "Описание",
  "sections": [...],
  "metadata": {}
}
```

**`GET /api/pages?slug=support`** - Получить страницу

## 🗄️ Коллекции NoDB

### `pages`
```typescript
{
  id: string;          // slug страницы
  title: string;
  content: string;
  sections: PageSection[];
  metadata: any;
  isActive: boolean;
  updatedAt: number;
}
```

### `features`
```typescript
{
  id: string;
  title: string;
  description: string;
  category: string;     // general/ui/security/performance
  status: string;       // pending/planned/in-progress/completed/rejected
  votes: number;
  createdBy: string;    // userId
  createdByName: string;
  createdAt: number;
  adminNote?: string;
}
```

## 🚀 Инициализация данных

### Вариант 1: Скрипт
```bash
# Запустите сервер в одном терминале
npm run dev

# В другом терминале выполните инициализацию
node scripts/init-data.mjs
```

### Вариант 2: Вручную через API
Используйте Postman/curl для отправки POST-запросов на `/api/pages` и `/api/features`

### Вариант 3: Через админку
1. Зайдите в `/admin`
2. Перейдите в "Функции и страницы"
3. Создайте страницы и функции через UI

## 📁 Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `src/app/support/page.tsx` | Полностью переработана: СБП, QR, копирование |
| `src/app/about-company/page.tsx` | Полностью переработана: разработчик, технологии |
| `src/app/about-balloo/page.tsx` | Полностью переработана: функции + предложения |
| `src/app/admin/page.tsx` | Добавлена секция "Функции и страницы" |
| `src/app/admin/features-section.tsx` | **Новый**: UI управления функциями |
| `src/lib/database/index.ts` | Добавлены коллекции pages & features |
| `src/app/api/pages/route.ts` | **Новый**: API для страниц |
| `src/app/api/features/route.ts` | **Новый**: API для функций |
| `scripts/init-data.mjs` | **Новый**: Скрипт инициализации |

## ✅ Сборка

```bash
npm run build
# ✓ Build completed successfully
```

## 🎯 Готово

- Страницы рендерятся из БД с дефолтными значениями
- Пользователи могут предлагать функции
- Админ может управлять статусами функций
- Админ может редактировать контент страниц
- Все данные хранятся в NoDB
