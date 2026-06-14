---
title: Documentation Web Reader Policy
description: Политика web-интерфейса для чтения документации
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
---

# 🌐 DOCUMENTATION WEB READER POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Активная политика  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует требования к web-интерфейсу для чтения документации из SUMMARY_DOCS.

**Primary Purpose:** Обеспечить единый интерфейс для чтения всей документации проекта.

---

## 📖 WEB READER REQUIREMENTS

### MUST (Обязательно):

- ✅ Web reader MUST читать SUMMARY_DOCS как root
- ✅ Web reader MUST строить navigation tree по директориям
- ✅ Web reader MUST читать MANIFEST.json для metadata
- ✅ Web reader MUST открывать документы по path
- ✅ Web reader MUST открывать документы по id
- ✅ Web reader MUST показывать active/deprecated/generated statuses
- ✅ Web reader MUST использовать INDEX.md как landing page
- ✅ Web reader MUST использовать ROOT_SUMMARY_DOCS.md как overview

### SHOULD (Желательно):

- ⭐ Web reader SHOULD показывать related_docs
- ⭐ Web reader SHOULD поддерживать backlinks
- ⭐ Web reader SHOULD поддерживать поиск по title/path/tags
- ⭐ Web reader SHOULD показывать breadcrumb navigation
- ⭐ Web reader SHOULD поддерживать dark/light theme
- ⭐ Web reader SHOULD кэшировать документы

### MAY (Опционально):

- ⭕ Web reader MAY поддерживать редактирование (с авторизацией)
- ⭕ Web reader MAY поддерживать комментарии
- ⭕ Web reader MAY поддерживать export (PDF, HTML)

---

## 🏗️ ARCHITECTURE

### Data flow:

```
SUMMARY_DOCS/
├── INDEX.md ──────────→ Landing page
├── MANIFEST.json ─────→ Navigation tree
├── ROUTING.json ──────→ Path resolution
├── [category]/
│   └── [document].md ─→ Content rendering
└── state/
    └── doc-state.json → Metadata
```

### Component structure:

```
Web Reader
├── Header (logo, search, theme toggle)
├── Sidebar (navigation tree from MANIFEST)
├── Main Content (markdown renderer)
│   ├── Document content
│   ├── Breadcrumbs
│   ├── Related docs
│   └── Status badge (active/deprecated/generated)
├── Footer (version, last updated)
└── Router (path resolution via ROUTING.json)
```

---

## 🎨 UI REQUIREMENTS

### Landing page (INDEX.md):

- Отображение INDEX.md content
- Navigation links по категориям
- Search bar
- Status overview (total docs, active, deprecated)

### Document page:

- Document content (rendered markdown)
- Breadcrumb navigation
- Status badge (active/deprecated/generated)
- Related docs sidebar
- Last updated timestamp
- Version information

### Navigation sidebar:

- Tree structure из MANIFEST.json
- Expandable categories
- Active document highlight
- Search/filter functionality

---

## 🔍 SEARCH REQUIREMENTS

### Search must support:

- **Full-text search** — по содержимому документов
- **Title search** — по заголовкам
- **Path search** — по путям файлов
- **Tag search** — по tags из frontmatter
- **Category filter** — фильтрация по категориям

### Search results:

- Document title
- Document path
- Category
- Snippet (matching text)
- Relevance score

---

## 🔄 ROUTING REQUIREMENTS

### Path resolution:

1. **Check canonical path** — SUMMARY_DOCS/[path]
2. **Check ROUTING.json** — legacy → canonical mapping
3. **Redirect if needed** — показать canonical document
4. **Show warning** — если это legacy path

### ROUTING.json format:

```json
{
  "routes": [
    {
      "legacy_path": "workdocs/node-contracts/NodeTreeContract.md",
      "canonical_path": "SUMMARY_DOCS/contracts/node-contracts/NodeTreeContract.md",
      "status": "deprecated",
      "redirect": true
    }
  ]
}
```

---

## 📊 STATUS INDICATORS

### Document statuses:

| Status | Badge | Description |
|--------|-------|-------------|
| active | 🟢 | Активный canonical документ |
| deprecated | 🟡 | Устаревший, есть замена |
| generated | 🔵 | Сгенерированный автоматически |
| draft | ⚪ | Черновик, не готов для production |

### Display rules:

- **Active** — показывать как обычный документ
- **Deprecated** — показывать warning с ссылкой на canonical
- **Generated** — показывать badge "generated"
- **Draft** — не показывать в navigation (только по прямой ссылке)

---

## 🔗 RELATED DOCS

### Display related docs:

- Из frontmatter `related_docs`
- Из MANIFEST.json `related_docs`
- Reverse backlinks (кто ссылается на этот документ)

### Related docs sidebar:

```markdown
## Related Documents

- [NodeTreeContract.md](...)
- [NodeRolesContract.md](...)
- [NETWORK_MAP.md](...)
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints:

- **Desktop:** > 1024px (full sidebar + content)
- **Tablet:** 768px - 1024px (collapsible sidebar)
- **Mobile:** < 768px (hamburger menu, stacked layout)

### Mobile requirements:

- Hamburger menu для navigation
- Swipe gestures для открытия sidebar
- Touch-friendly кнопки
- Readable font sizes (16px+)

---

## ⚡ PERFORMANCE

### Requirements:

- **Initial load:** < 2 seconds
- **Document load:** < 500ms (кэшированные)
- **Search:** < 1 second
- **Navigation:** Instant (client-side routing)

### Caching strategy:

- **MANIFEST.json** — кэш 5 минут
- **Documents** — кэш 1 час
- **ROUTING.json** — кэш 5 минут
- **Search index** — кэш 1 час

---

## 🔧 INTEGRATION

### API endpoints (если нужны):

```
GET /api/docs/INDEX.md              # Landing page
GET /api/docs/:path                 # Document by path
GET /api/docs/id/:id                # Document by id
GET /api/docs/search?q=query        # Search
GET /api/manifest                   # MANIFEST.json
GET /api/routing                    # ROUTING.json
```

### Events (для updates):

```javascript
// При открытии документа
emit('doc:opened', { path, id, category })

// При поиске
emit('doc:searched', { query, results_count })

// При навигации
emit('nav:navigated', { from, to, category })
```

---

## ✅ ACCEPTANCE CRITERIA

Web reader считается соответствующим политике если:

1. ✅ Читает SUMMARY_DOCS как root
2. ✅ Показывает INDEX.md как landing page
3. ✅ Строит navigation tree из MANIFEST.json
4. ✅ Открывает документы по path и id
5. ✅ Показывает active/deprecated/generated statuses
6. ✅ Поддерживает поиск по title/path/tags
7. ✅ Показывает related docs
8. ✅ Responsive design (desktop/tablet/mobile)
9. ✅ Использует ROUTING.json для legacy paths
10. ✅ Performance requirements met

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active Policy  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
