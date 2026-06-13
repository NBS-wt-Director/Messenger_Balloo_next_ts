# Balloo Platform Documentation Site

**Версия:** 1.0.0  
**Статус:** ✅ Active  
**Дата:** 2026-06-12

---

## 🎯 Описание

Исполняемый сайт документации Balloo Platform на основе Markdown файлов.

### Особенности

- ✅ **Markdown-based** — Все страницы из .md файлов
- ✅ **Динамическая навигация** — Автоматическая генерация меню
- ✅ **Реактивный дизайн** — Адаптивная верстка
- ✅ **Hot Reload** — Автоматическое обновление при изменении MD
- ✅ **Категории** — Contracts, Nodes, Modules, Tree, History

---

## 🚀 Быстрый старт

### Установка

```bash
# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Откройте http://localhost:3010

### Сборка для production

```bash
# Build
npm run build

# Запустить production сервер
npm run start
```

---

## 📁 Структура

```
SUMMARY_DOCS/
├── src/
│   ├── pages/
│   │   ├── index.tsx              # Главная страница
│   │   ├── _app.tsx               # App wrapper
│   │   ├── page/
│   │   │   └── [slug].tsx         # Страница документа
│   │   └── category/
│   │       └── [categoryName].tsx # Страница категории
│   ├── components/
│   │   ├── Header.tsx             # Шапка
│   │   ├── Footer.tsx             # Подвал
│   │   ├── Sidebar.tsx            # Боковая панель
│   │   └── MarkdownRenderer.tsx   # Рендерер Markdown
│   ├── lib/
│   │   └── posts.ts               # Утилиты для MD
│   └── styles/
│       └── globals.css            # Глобальные стили
├── public/                        # Статические файлы
├── package.json
├── tsconfig.json
├── next.config.js
└── .gitignore
```

---

## 📄 Документы

### Основные страницы

| Страница | Путь | Описание |
|----------|------|----------|
| INDEX | / | Главная страница |
| Monorepo_readme | /page/Monorepo_readme | README |
| TZ | /page/TZ | Техническое задание |
| Featurys | /page/Featurys | Функции |
| Release_plan | /page/Release_plan | План релиза |
| Realease_calendare | /page/Realease_calendare | Календарь |
| To_clean | /page/To_clean | Очистка |
| Errors | /page/Errors | Ошибки |
| Monorepo_structure | /page/Monorepo_structure | Структура |

### Категории

| Категория | Путь | Описание |
|-----------|------|----------|
| Contracts | /category/Contracts | Контракты |
| Nodes | /category/Nodes | Узлы |
| Modules | /category/Modules | Модули |
| Tree | /category/Tree | Ветки |
| history_tickets | /category/history_tickets | Тикеты |

---

## 🎨 Дизайн

### Цветовая схема

- **Primary:** #1a1a2e (темно-синий)
- **Accent:** #e94560 (красный)
- **Background:** #f5f5f5 (светло-серый)
- **Text:** #333 (тёмный)

### Компоненты

- **Header:** Шапка с логотипом и навигацией
- **Sidebar:** Боковая панель с документами
- **Footer:** Подвал с версией и копирайтом
- **MarkdownRenderer:** Рендеринг Markdown контента

---

## 🔧 Конфигурация

### Ports

- **Dev:** 3010
- **Production:** 3010

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://api.balloo.ru
```

---

## 📊 Команды

```bash
# Dev режим с hot reload
npm run dev

# Build для production
npm run build

# Production сервер
npm run start

# Linting
npm run lint
```

---

## 🔄 Обновление документов

Документы обновляются автоматически при изменении .md файлов:

1. Измените .md файл в `../SUMMARY_DOCS/`
2. Сохраните
3. Страница обновится автоматически (dev mode)

---

## 🎯 Интеграция

### Добавление нового документа

1. Создайте .md файл в `../SUMMARY_DOCS/`
2. Добавьте frontmatter:
```markdown
---
title: "Название"
version: "1.0.0"
date: "2026-06-12"
status: "✅ Active"
---
```
3. Страница будет доступна автоматически

### Добавление категории

1. Создайте директорию в `../SUMMARY_DOCS/`
2. Добавьте .md файлы
3. Категория появится в навигации

---

## 📈 Статистика

- **Страниц:** 9 основных + 5 категорий
- **Компонентов:** 4
- **Страниц динамических:** 2 (page/[slug], category/[category])
- **MD файлов:** 9+

---

*Создано: 2026-06-12*  
*Версия: 1.0.0*  
*Статус: ✅ Active*
