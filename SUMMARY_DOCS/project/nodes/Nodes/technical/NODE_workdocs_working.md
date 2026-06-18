---
title: Node workdocs.working.balloo.su
description: Технический узел рабочей документации Balloo — ядро SUMMARY_DOCS web presentation
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - technical-node
  - priority-1
  - working
  - docs
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/TechnicalNodeContract.md
  - SUMMARY_DOCS/nodes/contracts/NODE_CONTRACT_workdocs_working.md
---

# 📚 NODE: workdocs.working.balloo.su

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Priority 1 Technical Node  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

**workdocs.working.balloo.su** — технический узел рабочей документации Balloo.

**Primary Purpose:** Рабочая документация, md-файлы для разработчиков и AI, вывод документации как защищённого сайта.

---

## 📊 NODE IDENTITY

| Параметр | Значение |
|----------|----------|
| **Node ID** | `workdocs-working` |
| **Canonical Name** | `workdocs.working.balloo.su` |
| **Branch** | `working` |
| **Type** | `technical-docs` |
| **Priority** | `1` ⭐ |
| **Technical** | `true` |

---

## 🌐 DOMAIN & ROUTING

### Production Identity

```
workdocs.working.balloo.su
```

### Local Dev Identity

```
localhost:3210
http://localhost:3210
```

### Domain Policy

```yaml
domain_required: false
can_use_localhost: true
can_use_working_domain: true
production_identity_preserved: true
```

---

## 🔐 ACCESS & AUTH

### Allowed Users

- ✅ Developers
- ✅ AI agents
- ✅ Internal team members
- ❌ Public users

### Authentication

```yaml
auth:
  required: true
  method: password_protected
  session_management: true
  ai_agent_tokens: supported
```

---

## 📦 FUNCTIONAL SURFACE

### Core Functions

1. **SUMMARY_DOCS Web Presentation**
   - Отображение документации SUMMARY_DOCS как веб-сайта
   - Навигация по разделам
   - Поиск по документации

2. **Password-Protected Access**
   - Защита документации паролем
   - Session management
   - AI agent token support

3. **AI Doc Reading Core**
   - Интеграция с AI doc reader
   - Контекст для codegen
   - Связь с kpdegen

4. **Docs Context Assembly**
   - Сборка контекста для кодогенерации
   - Связь с contracts и state files
   - Обновление при изменениях

---

## ⚙️ SETTINGS SURFACE

### Settings Scopes

```yaml
settings:
  scopes:
    - node-level
    - docs-settings
  mutable_by: [docs-owner, admin]
  includes:
    - docs_theme
    - navigation_structure
    - access_control
    - ai_reading_config
```

### Key Settings

| Setting | Type | Description |
|---------|------|-------------|
| `docs.theme` | string | Documentation theme |
| `docs.navigation` | object | Navigation structure |
| `docs.access_control` | object | Access control rules |
| `docs.ai_reading` | boolean | AI reading enabled |
| `docs.password` | secret | Access password |

---

## 🔗 RELATIONS

### Relation to SUMMARY_DOCS

```yaml
relation:
  type: source-of-truth
  direction: bidirectional
  sync: automatic
  summary_docs: canonical_source
  workdocs: web_presentation
```

### Relation to AI Doc Reading

```yaml
relation:
  type: integration
  ai_reader: consumes_workdocs
  context_assembly: enabled
  codegen_context: provided
```

### Relation to Codegen

```yaml
relation:
  type: context_provider
  consumed_by: kpdegen-working
  provides: documentation_context
  triggers: contract_changes
```

### Related Nodes

- `docs-working` — Working docs (public)
- `kpdegen-working` — Codegen system (consumer)
- `nodes-switcher-working` — Version management

---

## 🏃 RUNTIME MODEL

### Local Dev Mode

```yaml
local_dev:
  identity: localhost:3210
  url: http://localhost:3210
  domain_required: false
  auth: optional
```

### Working Mode

```yaml
working:
  identity: workdocs.working.balloo.su
  url: https://workdocs.working.balloo.su
  domain_required: false
  auth: required
```

### Alpha/Production

```yaml
alpha: not_available
production: not_available
rationale: Technical node, working only
```

---

## 📁 FILE STRUCTURE

### Expected Structure

```
src/nodes/workdocs-working/
├── index.ts
├── routes.ts
├── handlers/
│   ├── docs.ts
│   ├── auth.ts
│   └── ai.ts
├── middleware/
│   ├── auth.ts
│   └── session.ts
├── config.ts
└── types.ts
```

### Config Files

```
config/nodes/
├── workdocs-working.dev.json
├── workdocs-working.working.json
└── workdocs-working.local.json
```

---

## 🤖 CODEGEN RELEVANCE

### Codegen Class

```
Class 1: Technical Core (Priority 1)
```

### Required Inputs

- `NODE_CONTRACT_workdocs_working.md`
- `NODE_SUMMARY_workdocs_working.md`
- `NODE_SETTINGS_MODEL.md`
- `NODE_RUNTIME_MODEL.md`

### Output Targets

- `src/nodes/workdocs-working/`
- `config/nodes/workdocs-working.*.json`
- `docs/nodes/workdocs-working-*.md`
- `infra/nodes/workdocs-working.*`

### Risk Level

```
Risk: Low
Rationale: Documentation node, isolated from production
```

---

## ✅ INVARIANTS

1. **source-of-truth relation to SUMMARY_DOCS** — SUMMARY_DOCS canonical
2. **password-protected docs presentation** — auth required
3. **relation to AI doc reading** — AI integration enabled
4. **relation to codegen context assembly** — context provider
5. **working branch only** — not in alpha/production
6. **domainRequired = false** — localhost OK
7. **production identity preserved** — logical identity maintained

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../NODETREE_INDEX.md) — Node tree index
- [TechnicalNodeContract.md](../../contracts/nodes/TechnicalNodeContract.md) — Technical contract
- [NODE_CONTRACT_workdocs_working.md](../contracts/NODE_CONTRACT_workdocs_working.md) — Node contract
- [NODE_CODEGEN_MODEL.md](../NODE_CODEGEN_MODEL.md) — Codegen model
- [NODE_SETTINGS_MODEL.md](../NODE_SETTINGS_MODEL.md) — Settings model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Priority 1 Technical Node  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
