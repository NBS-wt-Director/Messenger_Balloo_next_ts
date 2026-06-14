---
title: Documentation Generation Policy
description: Политика генерации документации AI-агентами
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
---

# 🤖 DOCUMENTATION GENERATION POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Активная политика  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует правила генерации новой документации AI-агентами.

**Primary Purpose:** Обеспечить консистентность и актуальность документации при AI-generated updates.

---

## 📖 AI WORKFLOW

### Порядок чтения (AI Entry Flow):

```
1. SUMMARY_DOCS/INDEX.md          # Overview структуры
2. SUMMARY_DOCS/MANIFEST.json     # Machine-readable индекс
3. SUMMARY_DOCS/summary/ROOT_SUMMARY_DOCS.md  # Системный overview
4. relevant contracts/            # Спецификации
5. relevant topology/             # Карты и схемы
6. relevant state/                # Конфигурация
```

### Порядок записи:

```
1. Создать документ в SUMMARY_DOCS/[category]/
2. Обновить MANIFEST.json
3. Обновить doc-state.json
4. Создать stub в legacy location (если был)
5. Обновить ROUTING.json
```

---

## ✅ ПРАВИЛА ГЕНЕРАЦИИ

### MUST (Обязательно):

- ✅ AI MUST читать INDEX.md перед генерацией
- ✅ AI MUST проверять MANIFEST.json на наличие дубликатов
- ✅ AI MUST записывать новую документацию только в SUMMARY_DOCS
- ✅ AI MUST использовать canonical paths в ссылках
- ✅ AI MUST обновлять MANIFEST.json после создания документа
- ✅ AI MUST обновлять doc-state.json после изменений

### MUST NOT (Запрещено):

- ❌ AI MUST NOT создавать документы вне SUMMARY_DOCS
- ❌ AI MUST NOT дублировать canonical документы
- ❌ AI MUST NOT использовать legacy paths в новых документах
- ❌ AI MUST NOT обновлять legacy документы вместо canonical
- ❌ AI MUST NOT создавать competing sources of truth

---

## 📁 DOCUMENT CATEGORIES

### Категории для AI-generated docs:

| Категория | Путь | AI Can Create |
|-----------|------|---------------|
| Contracts | `contracts/` | ✅ Yes (specs) |
| Summary | `summary/` | ✅ Yes (summaries) |
| Topology | `topology/` | ✅ Yes (maps) |
| Migrations | `migrations/` | ✅ Yes (guides) |
| Audits | `audits/` | ✅ Yes (reports) |
| Architecture | `architecture/` | ✅ Yes (overviews) |
| Playbooks | `playbooks/` | ✅ Yes (instructions) |
| Appendix | `appendix/` | ✅ Yes (reference) |

### Категории restricted для AI:

| Категория | Путь | AI Can Create | Требование |
|-----------|------|---------------|------------|
| State | `state/` | ⚠️ Review required | Human approval |
| Policies | `*.md` (root) | ⚠️ Review required | Human approval |

---

## 🔄 DOCUMENT LIFECYCLE

### Создание нового документа:

1. **Check MANIFEST** — убедиться что document_id уникален
2. **Choose category** — выбрать правильную категорию
3. **Create document** — создать в SUMMARY_DOCS/[category]/
4. **Add frontmatter** — добавить metadata
5. **Update MANIFEST** — добавить entry в MANIFEST.json
6. **Update doc-state** — обновить метаданные
7. **Create stub** — если был legacy документ

### Обновление документа:

1. **Read canonical** — прочитать canonical версию
2. **Make changes** — внести изменения
3. **Update version** — обновить version в frontmatter
4. **Update doc-state** — обновить last_modified_at
5. **Commit changes** — закоммитить с описанием

### Deprecation документа:

1. **Mark deprecated** — установить status: deprecated
2. **Move to deprecated/** — переместить в deprecated/
3. **Update MANIFEST** — обновить status
4. **Create redirect** — создать redirect stub
5. **Update ROUTING** — добавить mapping

---

## 📝 DOCUMENT FORMAT

### Frontmatter requirements:

```markdown
---
title: Document Title
description: Short description
version: 1.0.0
date: 2026-06-13
author: AI Agent Name
status: active|deprecated|generated
audience: human|ai|both
tags:
  - tag1
  - tag2
related_docs:
  - SUMMARY_DOCS/contracts/...
  - SUMMARY_DOCS/topology/...
---
```

### Content requirements:

- ✅ Clear purpose section
- ✅ Structured headings (H1, H2, H3)
- ✅ Human-readable explanations
- ✅ AI-parsable structure
- ✅ Cross-references к другим canonical docs
- ✅ No hardware-specific details (see NODE_DESCRIPTION_POLICY)

---

## 🔍 QUALITY CHECKS

### Перед записью документа:

```bash
# 1. Проверить уникальность
grep -r "title: Document Title" SUMMARY_DOCS/

# 2. Проверить категорию
ls SUMMARY_DOCS/[category]/

# 3. Проверить MANIFEST
cat SUMMARY_DOCS/MANIFEST.json | jq '.documents[] | select(.title == "Document Title")'
```

### После записи документа:

```bash
# 1. Валидировать MANIFEST
node scripts/validate-manifest.js

# 2. Обновить doc-state
node scripts/update-doc-state.js

# 3. Проверить ссылки
node scripts/check-links.js
```

---

## 🎯 AI CONTEXT PACKAGE

### При генерации документации AI должен включать:

1. **INDEX.md** — общая структура
2. **MANIFEST.json** — список документов
3. **Relevant contracts** — спецификации
4. **Relevant topology** — карты
5. **Relevant state** — конфигурация

### Пример context package:

```json
{
  "entry_point": "SUMMARY_DOCS/INDEX.md",
  "manifest": "SUMMARY_DOCS/MANIFEST.json",
  "category": "contracts",
  "related_docs": [
    "SUMMARY_DOCS/contracts/NodeTreeContract.md",
    "SUMMARY_DOCS/topology/NETWORK_MAP.md"
  ],
  "state_files": [
    "SUMMARY_DOCS/state/node-tree.json"
  ]
}
```

---

## ✅ КРИТЕРИИ ПРИЁМКИ

AI-generated документация считается соответствующей политике если:

1. ✅ Создана в SUMMARY_DOCS/[category]/
2. ✅ Имеет правильный frontmatter
3. ✅ Добавлена в MANIFEST.json
4. ✅ Обновляет doc-state.json
5. ✅ Создан stub в legacy location (если был)
6. ✅ Нет дубликатов в других местах
7. ✅ Все ссылки на canonical paths

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active Policy  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
