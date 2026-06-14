---
title: 'ADR-004: SUMMARY_DOCS as Node Source of Truth'
description: SUMMARY_DOCS/nodes — канонический source-of-truth для дерева узлов, не UI
status: active
date: 2026-06-13
author: Koda (NLP-Core-Team)
tags:
  - architecture
  - documentation
  - source-of-truth
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/NodeSettingsContract.md
---

# ADR-004: SUMMARY_DOCS as Node Source of Truth

**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## Status

✅ **Active** — Принято и действует

---

## Context

Проблема:
- UI (projectgeneralsettings.working) может изменяться
- Runtime config может drift от документации
- AI нужен стабильный source of truth
- Codegen требует консистентных specifications

Требуется:
- Определить canonical source of truth для node tree
- Отделить source of truth от UI
- Обеспечить AI-readable contracts

---

## Decision

Принято правило **SUMMARY_DOCS as Node Source of Truth**:

### 1. Canonical Sources

```
SUMMARY_DOCS/nodes/NODETREE_INDEX.md      — entry point
SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json — machine-readable registry
SUMMARY_DOCS/contracts/nodes/*.md         — AI-readable contracts
SUMMARY_DOCS/state/*.json                 — state files
```

### 2. UI Role

```
projectgeneralsettings.working.balloo.su:
  — UI/surface для управления
  — НЕ единственный source of truth
  — Должен синхронизироваться с SUMMARY_DOCS
```

### 3. Source of Truth Hierarchy

```
Level 1 (Canonical): SUMMARY_DOCS contracts & state
Level 2 (Generated):  Codegen output from contracts
Level 3 (Runtime):    Actual runtime config (should match Level 1)
Level 4 (UI):         Management surface (reflects Level 1)
```

### 4. Drift Prevention

```
- Любые изменения сначала в SUMMARY_DOCS
- Затем codegen обновляет runtime
- UI синхронизируется с state files
- Audit проверяет consistency
```

---

## Consequences

### Positive

- ✅ Stable source of truth for AI
- ✅ Codegen has canonical specifications
- ✅ Documentation drives implementation
- ✅ Drift can be detected and audited

### Negative

- ⚠️ Requires discipline to update docs first
- ⚠️ UI may lag behind canonical docs

---

## References

- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md)
- [NodeSettingsContract.md](../contracts/nodes/NodeSettingsContract.md)
- [node-drift-audit-playbook.md](../playbooks/node-drift-audit-playbook.md)

---

**ADR-004 | Status: Active | Date: 2026-06-13**
