---
title: Module Docgen Contract
description: Documentation generation rules for modules
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - module
  - docgen
  - documentation
  - contract
related_docs:
  - SUMMARY_DOCS/contracts/modules/ModuleContract.md
  - SUMMARY_DOCS/DOC_GENERATION_POLICY.md
  - SUMMARY_DOCS/modules/MODULE_INDEX.md
---

# 📝 MODULE DOCGEN CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот контракт определяет правила генерации документации для модулей.

**Primary Purpose:** Обеспечить консистентную генерацию документации на основе module contracts и module summaries.

---

## 1. ✅ DOCGEN REQUIREMENTS

### Обязательные документы для каждого модуля:

| Документ | Тип | Audience | Purpose |
|----------|-----|----------|---------|
| **MODULE_SUMMARY_&lt;id&gt;.md** | Human-readable | Developers, AI | Overview, quick reference |
| **MODULE_CONTRACT_&lt;id&gt;.md** | AI-readable | AI, Codegen | Formal specification |
| **MODULE_MANIFEST.json entry** | Machine-readable | Tools, Scripts | Registry, discovery |

### Optional документы:

| Документ | Тип | Audience | Purpose |
|----------|-----|----------|---------|
| **MODULE_API_&lt;id&gt;.md** | API docs | Developers | API reference |
| **MODULE_GUIDE_&lt;id&gt;.md** | Guide | Users | Usage guide |
| **MODULE_MIGRATION_&lt;id&gt;.md** | Migration | Developers | Migration path |

---

## 2. ✅ MODULE_SUMMARY STRUCTURE

### Минимальная структура:

```markdown
---
title: <Module Name> Summary
description: <One-line description>
moduleId: <module-id>
moduleType: <type>
status: <status>
---

# 🧩 MODULE SUMMARY: <Module Name>

## 1. Что это за модуль

<Description of module purpose>

## 2. Зачем он нужен

<Problem solved, value proposition>

## 3. Какого он типа

<Module type from ModuleTypesContract>

## 4. Где он живёт в repo

<Repository paths, package names>

## 5. Какие у него есть интерфейсы

<Public interfaces, endpoints, imports>

## 6. Где он проявляется в системе

<Node presence, domain exposure>

## 7. С чем он связан

<Dependencies, related modules>

## 8. Насколько он реализован

<Implementation status, evidence>

## 9. Почему он важен для AI/разработки

<Codegen relevance, docgen relevance>
```

---

## 3. ✅ MODULE_CONTRACT STRUCTURE

### Минимальная структура:

```markdown
---
title: <Module Name> Contract
description: <Formal specification>
moduleId: <module-id>
moduleType: <type>
version: <version>
---

# 🧩 MODULE CONTRACT: <Module Name>

## 1. Module Identity

- **moduleId:** <id>
- **moduleName:** <name>
- **moduleType:** <type>
- **moduleStatus:** <status>
- **authorityType:** <authority>

## 2. Purpose

- **Problem solved:** <problem>
- **Why module exists:** <rationale>
- **Scope:** <in-scope>
- **Out of scope:** <out-of-scope>

## 3. Artifacts

- **Code artifacts:** <code>
- **Doc artifacts:** <docs>
- **Contract artifacts:** <contracts>
- **Data artifacts:** <data>
- **Runtime artifacts:** <runtime>

## 4. Interfaces

- **Public interfaces:** <public>
- **Internal interfaces:** <internal>
- **Endpoint surface:** <endpoints>
- **Docs entrypoints:** <docs>

## 5. Placement

- **Repo placement:** <paths>
- **Node presence:** <nodes>
- **Domain exposure:** <domains>
- **Branch relevance:** <branches>

## 6. Dependencies

- **Depends on modules:** <upstream>
- **External dependencies:** <external>
- **Upstream contracts:** <contracts>
- **Downstream consumers:** <downstream>

## 7. Generation Relevance

- **Used for codegen:** <yes/no>
- **Used for docgen:** <yes/no>
- **Reconstruction value:** <value>
- **Audit value:** <value>

## 8. Evidence

- **Inferred from:** <sources>
- **Canonical docs:** <docs>
- **Related packages:** <packages>
- **Related apps:** <apps>
- **Related contracts:** <contracts>

## 9. Invariants

- **Required invariants:** <invariants>
- **Forbidden assumptions:** <forbidden>
- **Compatibility notes:** <compat>

## 10. Status Notes

- **Implementation status:** <status>
- **Migration notes:** <migration>
```

---

## 4. ✅ DOCGEN RULES

### Rule 1: Every Module MUST Have Summary + Contract

```
✅ MODULE_SUMMARY_<id>.md — human-readable
✅ MODULE_CONTRACT_<id>.md — AI-readable
✅ Entry in MODULE_MANIFEST.json — machine-readable
```

### Rule 2: Inferred Modules MUST Be Marked

```
✅ inferred: true в MODULE_MANIFEST.json
✅ "Inferred" в moduleStatus
✅ Evidence source указан
✅ Implementation status ясен
```

### Rule 3: Relation Map SHOULD Exist

```
✅ MODULE_RELATIONS.json содержит связи
✅ Module-to-module dependencies
✅ Module-to-node mapping
✅ Module-to-domain mapping
```

### Rule 4: Conflicts Resolved in Favor of Canonical

```
✅ SUMMARY_DOCS canonical docs — source of truth
✅ Legacy scattered docs — deprecated
✅ Module contracts override legacy docs
```

---

## 5. ✅ DOCGEN WORKFLOW

```
1. Module Discovery
   ↓
2. Evidence Collection
   ↓
3. Module Classification
   ↓
4. MODULE_SUMMARY Generation
   ↓
5. MODULE_CONTRACT Generation
   ↓
6. MODULE_MANIFEST Update
   ↓
7. MODULE_RELATIONS Update
   ↓
8. MODULE_INDEX Update
   ↓
9. Web Reader Integration
```

---

## 6. ✅ DOCGEN METADATA

### Frontmatter Requirements:

```yaml
---
title: <string>           # Required
description: <string>     # Required
moduleId: <string>        # Required
moduleType: <string>      # Required
version: <string>         # Required
date: <YYYY-MM-DD>        # Required
author: <string>          # Required
status: <string>          # Required: active|planned|inferred|deprecated
audience: <string>        # Required: human|ai|both
tags: [<string>]          # Optional
related_docs: [<string>]  # Optional
---
```

### MODULE_MANIFEST.json Entry:

```json
{
  "moduleId": "<id>",
  "moduleName": "<name>",
  "moduleType": "<type>",
  "status": "<status>",
  "authorityType": "<authority>",
  "canonicalSummary": "SUMMARY_DOCS/modules/summary/MODULE_SUMMARY_<id>.md",
  "canonicalContract": "SUMMARY_DOCS/modules/contracts/MODULE_CONTRACT_<id>.md",
  "repoPaths": ["<path1>", "<path2>"],
  "relatedNodes": ["<node1>", "<node2>"],
  "relatedDomains": ["<domain1>"],
  "endpointCount": <number>,
  "usedForCodegen": <boolean>,
  "usedForDocgen": <boolean>,
  "inferred": <boolean>,
  "tags": ["<tag1>", "<tag2>"],
  "relatedModules": ["<module1>", "<module2>"]
}
```

---

## 7. ✅ DOCGEN QUALITY

### Quality Checklist:

- [ ] **Module identity clear** — moduleId, moduleName, moduleType
- [ ] **Purpose defined** — problem solved, value proposition
- [ ] **Boundaries clear** — scope, out of scope
- [ ] **Interfaces documented** — endpoints, imports, exports
- [ ] **Dependencies listed** — upstream, downstream
- [ ] **Evidence provided** — sources, references
- [ ] **Status marked** — active/inferred/planned
- [ ] **Authority defined** — source of truth
- [ ] **Codegen relevance** — used for codegen?
- [ ] **Docgen relevance** — used for docgen?

### Quality Rules:

```
✅ No hallucinated details
✅ Evidence-based claims only
✅ Inferred modules explicitly marked
✅ Implementation status accurate
✅ Dependencies verifiable
```

---

## 8. ✅ DOCGEN INTEGRATION

### Web Reader Integration:

```
✅ Module layer visible in navigation
✅ MODULE_INDEX.md accessible
✅ MODULE_SUMMARY_*.md renderable
✅ MODULE_CONTRACT_*.md renderable
✅ Filtering by module type
✅ Filtering by status
✅ Filtering by inferred/implemented
✅ Filtering by codegen relevance
```

### AI Integration:

```
✅ Module contracts AI-readable
✅ Module summaries human-readable
✅ MODULE_MANIFEST.json machine-readable
✅ MODULE_RELATIONS.json machine-readable
✅ Clear entrypoints for AI
```

---

## ✅ ACCEPTANCE CRITERIA

Контракт считается выполненным если:

1. ✅ Docgen requirements определены
2. ✅ MODULE_SUMMARY structure специфицирован
3. ✅ MODULE_CONTRACT structure специфицирован
4. ✅ Docgen rules зафиксированы
5. ✅ Docgen workflow описан
6. ✅ Docgen metadata определён
7. ✅ Docgen quality checklist создан
8. ✅ Docgen integration описана

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
