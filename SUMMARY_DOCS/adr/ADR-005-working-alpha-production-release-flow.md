---
title: 'ADR-005: Working → Alpha → Production Release Flow'
description: Трёхстадийный release flow: working (dev) → alpha (testing) → production (stable)
status: active
date: 2026-06-13
author: Koda (NLP-Core-Team)
tags:
  - architecture
  - release
  - branches
  - workflow
related_docs:
  - SUMMARY_DOCS/nodes/BRANCH_TREE.md
  - SUMMARY_DOCS/contracts/nodes/NodeReleaseContract.md
---

# ADR-005: Working → Alpha → Production Release Flow

**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## Status

✅ **Active** — Принято и действует

---

## Context

Проблема:
- Требуется формализованный release process
- Узлы должны двигаться через staging environments
- Без формального flow возможны production issues
- Technical nodes только в working

Требуется:
- Определить release stages
- Формализовать transition criteria
- Specify node availability per branch

---

## Decision

Принят **Three-Stage Release Flow**:

### 1. Release Stages

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│ WORKING  │ ───► │  ALPHA   │ ───► │PRODUCTION│
│          │      │          │      │          │
│ Develop  │      │  Test    │      │ Release  │
│ Integrate│      │ Validate │      │  Stable  │
│  (15)    │      │   (3)    │      │   (11)   │
└──────────┘      └──────────┘      └──────────┘
```

### 2. Transition Criteria

#### Working → Alpha

```yaml
requirements:
  - feature_complete: true
  - ci_cd_passed: true
  - docs_updated: true
approval:
  - tech_lead
  - product_owner
```

#### Alpha → Production

```yaml
requirements:
  - qa_approved: true
  - no_critical_bugs: true
  - performance_tests_passed: true
  - security_review: true
approval:
  - tech_lead
  - product_owner
  - security
```

### 3. Node Availability

| Node Type | Working | Alpha | Production |
|-----------|---------|-------|------------|
| Technical (priority 1) | ✅ | ❌ | ❌ |
| Working nodes | ✅ | ❌ | ❌ |
| Alpha nodes | ✅ | ✅ | ❌ |
| Production nodes | ✅ | ✅ | ✅ |

### 4. Technical Nodes Working-Only

```
workdocs-working
nodes-switcher-working
kpdegen-working
projectgeneralsettings-working
database-working

Эти узлы ТОЛЬКО в working branch.
Не двигаются в alpha или production.
```

---

## Consequences

### Positive

- ✅ Clear release path for all nodes
- ✅ Quality gates at each stage
- ✅ Technical nodes isolated to working
- ✅ Production stability protected

### Negative

- ⚠️ Slower release cycle (3 stages)
- ⚠️ Requires coordination between teams

---

## References

- [BRANCH_TREE.md](../nodes/BRANCH_TREE.md)
- [NodeReleaseContract.md](../contracts/nodes/NodeReleaseContract.md)
- [TECHNICAL_NODES_PRIORITY.md](../nodes/technical/TECHNICAL_NODES_PRIORITY.md)

---

**ADR-005 | Status: Active | Date: 2026-06-13**
