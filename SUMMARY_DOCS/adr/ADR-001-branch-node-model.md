---
title: 'ADR-001: Branch-Node Model'
description: Трёхветочная модель сред (production/alpha/working) с узлами как основными единицами
status: active
date: 2026-06-13
author: Koda (NLP-Core-Team)
tags:
  - architecture
  - branches
  - nodes
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/BRANCH_TREE.md
  - SUMMARY_DOCS/contracts/nodes/BranchNodeContract.md
---

# ADR-001: Branch-Node Model

**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## Status

✅ **Active** — Принято и действует

---

## Context

Требуется каноническая модель внешней формы системы Balloo для:
- AI-кодогенерации
- Системной интеграции
- Release management
- Documentation generation

Без единой модели:
- AI не понимает архитектуру
- Код генерируется инконсистентно
- Release process неформализован

---

## Decision

Принята **Branch-Node Model**:

### 1. Three Branches

```
production — стабильная production-среда (balloo.su)
alpha      — среда тестирования (alpha.balloo.su)
working    — среда разработки (working.balloo.su)
```

### 2. Nodes as Primary Units

```
Node = публично или внутренне доступная функциональная точка системы
Каждый узел имеет:
- identity (nodeId)
- branch binding
- domain binding (optional for working/dev)
- functional surface
- settings surface
- runtime mapping
```

### 3. Node Types

```
- public-root    (balloo.su, alpha.balloo.su, working.balloo.su)
- api            (api.balloo.su, api.working.balloo.su)
- storage        (files.balloo.su, files.working.balloo.su)
- docs           (docs.balloo.su, docs.working.balloo.su)
- admin          (admin.balloo.su, admin.working.balloo.su)
- technical-*    (workdocs, nodes-switcher, kpdegen, projectgeneralsettings)
- family         (client-apps)
```

---

## Consequences

### Positive

- ✅ AI понимает архитектуру через contracts
- ✅ Codegen консистентен для всех узлов
- ✅ Release flow формализован (working → alpha → production)
- ✅ Documentation структурирована по узлам

### Negative

- ⚠️ Требует поддержания документации в актуальном состоянии
- ⚠️ Initial setup overhead для каждого узла

---

## References

- [BRANCH_TREE.md](../nodes/BRANCH_TREE.md)
- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md)
- [BranchNodeContract.md](../contracts/nodes/BranchNodeContract.md)

---

**ADR-001 | Status: Active | Date: 2026-06-13**
