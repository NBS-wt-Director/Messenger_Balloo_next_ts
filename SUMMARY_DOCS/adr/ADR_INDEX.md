---
title: ADR Index
description: Индекс архитектурных решений по дереву узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - adr
  - architecture
  - decisions
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/BranchNodeContract.md
  - SUMMARY_DOCS/contracts/nodes/TechnicalNodeContract.md
---

# 📋 ADR INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **индекс архитектурных решений** (Architecture Decision Records) по дереву узлов Balloo.

**ADR (Architecture Decision Record)** = документ, фиксирующий одно архитектурное решение с контекстом, последствиями и статусом.

---

## 📊 ADR LIST

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](./ADR-001-branch-node-model.md) | Branch-Node Model | Active | 2026-06-13 |
| [ADR-002](./ADR-002-dev-without-domains-prod-with-domains.md) | Dev Without Domains / Prod With Domains | Active | 2026-06-13 |
| [ADR-003](./ADR-003-technical-nodes-first.md) | Technical Nodes First | Active | 2026-06-13 |
| [ADR-004](./ADR-004-summary-docs-as-node-source-of-truth.md) | SUMMARY_DOCS as Node Source of Truth | Active | 2026-06-13 |
| [ADR-005](./ADR-005-working-alpha-production-release-flow.md) | Working → Alpha → Production Release Flow | Active | 2026-06-13 |

---

## 🔄 ADR LIFECYCLE

### Status Values

| Status | Description |
|--------|-------------|
| **Proposed** | Решение предложено, не принято |
| **Active** | Решение принято и действует |
| **Superseded** | Решение заменено новым ADR |
| **Deprecated** | Решение устарело, не рекомендуется |
| **Archived** | Решение заархивировано (история) |

### Lifecycle Flow

```
Proposed ──► Active ──► Superseded ──► Archived
                │
                └──► Deprecated ──► Archived
```

---

## 📖 ADR TEMPLATE

```markdown
---
title: ADR-XXX: <Title>
description: <Short description>
status: proposed|active|superseded|deprecated|archived
date: YYYY-MM-DD
author: <Author>
---

# ADR-XXX: <Title>

## Status

<Current status>

## Context

<Описание контекста и проблемы>

## Decision

<Принятое решение>

## Consequences

### Positive

- <Positive consequence 1>
- <Positive consequence 2>

### Negative

- <Negative consequence 1>
- <Negative consequence 2>

## References

- <Related docs>
```

---

## 🔗 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md) — Node tree index
- [BRANCH_TREE.md](../nodes/BRANCH_TREE.md) — Branch tree
- [NODE_SETTINGS_MODEL.md](../nodes/NODE_SETTINGS_MODEL.md) — Settings model
- [NODE_RUNTIME_MODEL.md](../nodes/NODE_RUNTIME_MODEL.md) — Runtime model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
