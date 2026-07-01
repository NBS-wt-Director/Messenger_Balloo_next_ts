# 📚 Теория кода рендеринга узла

**Назначение:** Документирование архитектуры и принципов работы  
**Версия:** v5.0  
**Дата:** 2026-07-02  

⚠️ **Это теоретическая документация. Код находится в `core/` и `static/`.**

---

## 🏗️ Архитектура рендеринга

### Компоненты системы

```
┌─────────────────────────────────────────────────────────┐
│                    Клиент (Браузер)                      │
│  ┌─────────────────────────────────────────────────┐    │
│  │  static/app.js                                   │    │
│  │  - Загрузка разделов через API                   │    │
│  │  - Рендеринг данных в HTML                       │    │
│  │  - Навигация между разделами                     │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ HTTP
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Сервер (Node.js)                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  core/server.js                                  │    │
│  │  - HTTP сервер (порт 3440)                       │    │
│  │  - Чтение JSON с диска (без кеширования)         │    │
│  │  - Внедрение данных в HTML                       │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  data/{section}/main.json                        │    │
│  │  - Данные разделов                               │    │
│  │  - Формат: JSON                                  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 📄 Server (core/server.js)

### Назначение

HTTP-сервер для рендеринга документации на лету.

### Принципы работы

1. **Без кеширования** — каждый запрос читает JSON с диска
   - Преимущество: всегда актуальные данные
   - Недостаток: немного медленнее (но незаметно для пользователя)

2. **RESTful API** — 3 основных endpoint:
   - `GET /` — главная страница
   - `GET /api/sections` — список разделов
   - `GET /api/data/{id}` — данные раздела

3. **Внедрение данных** — сервер вставляет JSON в HTML
   - Через `<script>window.SECTION_DATA = {...}</script>`
   - Клиент читает из `window.SECTION_DATA`

### Структура запроса

```
Запрос: GET /api/data/overview

1. Получить section_id из URL
2. Прочитать data/overview/main.json
3. Распарсить JSON
4. Вернуть JSON клиенту

Ответ: 200 OK
{
  "title": "📊 Обзор проекта",
  "version": "v5.0",
  ...
}
```

### Обработка ошибок

```
Если файл не найден:
→ Вернуть 404 с { "error": "Section not found" }

Если JSON невалиден:
→ Вернуть 500 с { "error": "Invalid JSON" }

Если файл статический:
→ Вернуть файл с правильным MIME-type
```

---

## 🎨 Client (static/app.js)

### Назначение

Клиентское приложение для загрузки и отображения данных.

### Жизненный цикл

```
1. DOMContentLoaded
   ↓
2. init()
   ├─ loadSections() → GET /api/sections
   ├─ renderNavigation() → кнопки разделов
   └─ openSection(first) → GET /api/data/{id}
   ↓
3. renderSection(sectionId, data)
   ├─ Выбрать рендерер по типу раздела
   ├─ Сгенерировать HTML
   └─ Вставить в #contentArea
```

### Рендереры

Для каждого типа раздела — своя функция рендеринга:

| Раздел | Рендерер | Формат вывода |
|--------|----------|---------------|
| `overview` | `renderOverview()` | Score-карты + summary |
| `problems` | `renderProblems()` | Карточки проблем |
| `functions` | `renderFunctions()` | Таблица функций |
| `nodes` | `renderNodes()` | Таблица узлов |
| `screens` | `renderScreens()` | Таблица экранов |
| `message_features_v1` | `renderMessage_features_v1()` | Карточки функций |
| `message_system_v1` | `renderMessage_system_v1()` | Карточки + таблицы |
| ... | ... | ... |

### Пример рендерера

```javascript
function renderOverview(data) {
  // 1. Извлечь данные
  const v1 = data.scores_v1;
  const v2 = data.scores_v2;
  
  // 2. Сгенерировать HTML
  return `
    <h2>${data.title}</h2>
    <div class="score-card">
      ${scoreFields.map(f => `
        <div class="score-item">
          <div class="score-value">${v1[f.key]}</div>
          <div class="score-label">${f.label}</div>
        </div>
      `).join('')}
    </div>
  `;
}
```

---

## 📐 JSON Schema (schemas/*.json)

### Назначение

Валидация структуры JSON-данных разделов.

### Преимущества

1. **Раннее обнаружение ошибок** — валидация перед сохранением
2. **Документация структуры** — схема описывает ожидаемые поля
3. **AI-friendly** — ИИ понимает формат данных

### Пример структуры схемы

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Message Features V1 Schema",
  "type": "object",
  "required": ["title", "version", "features"],
  "properties": {
    "title": { "type": "string", "minLength": 5 },
    "version": { "type": "string", "pattern": "^v\\d+\\.\\d+$" },
    "features": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["id", "name", "priority"],
        "properties": {
          "id": { "type": "string", "pattern": "^MESG-\\d+" },
          "name": { "type": "string" },
          "priority": { "type": "string", "enum": ["P0", "P1", "P2"] }
        }
      }
    }
  }
}
```

---

## 📊 Формат данных разделов

### Обязательные поля (все разделы)

```json
{
  "title": "string (мин. 5 символов)",
  "version": "string (формат vX.Y)",
  "date": "string (формат YYYY-MM-DD)",
  "description": "string (мин. 10 символов)",
  "status": "string (draft|in_review|complete|deprecated)"
}
```

### Рекомендуемые поля

```json
{
  "author": "string (по умолчанию NLP-Core-Team)",
  "location": "string (по умолчанию Ekaterinburg, Russia)",
  "source_files": ["array of strings"],
  "metrics": { "object" },
  "items": ["array of objects"],
  "summary": "string"
}
```

---

## 🔧 Расширение функциональности

### Добавление нового раздела

1. **Создать папку** `data/{section_id}/`
2. **Создать файл** `data/{section_id}/main.json`
3. **Добавить рендерер** в `static/app.js`:
   ```javascript
   function renderNewSection(data) {
     return `<h1>${data.title}</h1>...`;
   }
   ```
4. **Добавить в switch** `renderSection()`:
   ```javascript
   case 'new_section':
     return renderNewSection(data);
   ```
5. **Добавить иконку** в `getSectionIcon()`:
   ```javascript
   new_section: '🆕'
   ```

### Добавление новой JSON Schema

1. **Создать файл** `schemas/{name}.json`
2. **Описать структуру** по образцу
3. **Использовать для валидации** перед сохранением данных

---

## ⚠️ Ограничения и правила

### Запрещено

- ❌ Менять `core/server.js` (кроме критических багов)
- ❌ Менять `static/index.html` (структура)
- ❌ Использовать кеширование
- ❌ Хранить данные вне `data/{section}/main.json`

### Разрешено

- ✅ Добавлять новые разделы в `data/`
- ✅ Добавлять рендереры в `static/app.js`
- ✅ Добавлять JSON Schema в `schemas/`
- ✅ Создавать сессии в `sessions/`

---

## 🚀 Производительность

### Метрики

| Показатель | Значение |
|------------|----------|
| Время чтения JSON | <10ms |
| Время рендеринга | <50ms |
| Размер всех данных | ~500KB |
| Количество разделов | 34 |

### Оптимизации

1. **Минификация CSS/JS** — в production
2. **Ленивая загрузка** — рендер только активного раздела
3. **Делегирование событий** — одна обработка на контейнер

---

## 📝 Best Practices

### Для данных

1. **Валидируй JSON** перед сохранением
2. **Используй schema** для проверки структуры
3. **Добавляй version** при изменении формата
4. **Храни в UTF-8** для поддержки кириллицы

### Для рендереров

1. **Изолируй логику** — одна функция = один тип раздела
2. **Используй template strings** для читаемости
3. **Добавляй проверки** на наличие данных
4. **Стилизуй через CSS** классы, не inline

### для API

1. **Возвращай правильные коды** (200, 404, 500)
2. **Логируй запросы** для отладки
3. **Обрабатывай ошибки** gracefully
4. **Документируй endpoints** в README

---

*Это теоретическая документация. Код находится в `core/server.js` и `static/app.js`.*
