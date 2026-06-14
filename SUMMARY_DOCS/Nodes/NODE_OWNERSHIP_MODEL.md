---
title: Node Ownership Model
description: Модель владения и ответственности за узлы Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - ownership
  - lifecycle
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/state/node-ownership-map.json
  - SUMMARY_DOCS/runbooks/RUNBOOK_INDEX.md
---

# 👤 NODE OWNERSHIP MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **модель владения и ответственности** для всех узлов Balloo.

**Цель:** Явно зафиксировать ownership для каждого узла.

---

## 📊 OWNERSHIP TYPES

### Owner Types

| Type | Description | Examples |
|------|-------------|----------|
| **creator** | Создатель узла | Original developer |
| **admin** | Администратор узла | System admin |
| **operator** | Оператор узла | DevOps team |
| **team** | Команда | API team, Docs team |
| **product** | Product owner | Product manager |

### Owner Roles

| Role | Responsibilities |
|------|------------------|
| **owner** | Ultimate responsibility |
| **maintainer** | Day-to-day maintenance |
| **contributor** | Can make changes |
| **consumer** | Uses the node |

---

## 📋 OWNERSHIP LIFECYCLE

### Lifecycle Stages

```
Creation ──► Active ──► Maintenance ──► Deprecation ──► Retirement
    │            │           │              │              │
    │            │           │              │              │
  assign      regular      updates       notify        archive
  owner      reviews                    users        docs
```

### Review Cadence

| Cadence | Description | Required For |
|---------|-------------|--------------|
| **weekly** | Еженедельный review | Priority-1 technical nodes |
| **monthly** | Ежемесячный review | Production nodes |
| **quarterly** | Квартальный review | Alpha nodes |
| **yearly** | Годовой review | All nodes |

---

## 🔒 PRIORITY-1 TECHNICAL NODES OWNERSHIP

### workdocs-working

```json
{
  "nodeId": "workdocs-working",
  "ownerType": "team",
  "ownerRole": "developers",
  "maintenanceResponsibility": "docs-team",
  "reviewCadence": "weekly",
  "docUpdateRequiredOnChange": true,
  "releaseApprovalRequired": true,
  "auditCriticality": "high"
}
```

### nodes-switcher-working

```json
{
  "nodeId": "nodes-switcher-working",
  "ownerType": "team",
  "ownerRole": "devops",
  "maintenanceResponsibility": "devops-team",
  "reviewCadence": "weekly",
  "docUpdateRequiredOnChange": true,
  "releaseApprovalRequired": true,
  "auditCriticality": "high"
}
```

### kpdegen-working

```json
{
  "nodeId": "kpdegen-working",
  "ownerType": "team",
  "ownerRole": "developers",
  "maintenanceResponsibility": "codegen-team",
  "reviewCadence": "weekly",
  "docUpdateRequiredOnChange": true,
  "releaseApprovalRequired": true,
  "auditCriticality": "high"
}
```

### projectgeneralsettings-working

```json
{
  "nodeId": "projectgeneralsettings-working",
  "ownerType": "team",
  "ownerRole": "admin",
  "maintenanceResponsibility": "admin-team",
  "reviewCadence": "weekly",
  "docUpdateRequiredOnChange": true,
  "releaseApprovalRequired": true,
  "auditCriticality": "critical"
}
```

### database-working

```json
{
  "nodeId": "database-working",
  "ownerType": "role",
  "ownerRole": "dba",
  "maintenanceResponsibility": "database-team",
  "reviewCadence": "weekly",
  "docUpdateRequiredOnChange": true,
  "releaseApprovalRequired": true,
  "auditCriticality": "critical"
}
```

---

## 🏭 PRODUCTION NODES OWNERSHIP (Excerpt)

### api-production

```json
{
  "nodeId": "api-production",
  "ownerType": "team",
  "ownerRole": "api-team",
  "maintenanceResponsibility": "api-team",
  "reviewCadence": "monthly",
  "docUpdateRequiredOnChange": true,
  "releaseApprovalRequired": true,
  "auditCriticality": "critical"
}
```

### docs-production

```json
{
  "nodeId": "docs-production",
  "ownerType": "team",
  "ownerRole": "docs-team",
  "maintenanceResponsibility": "docs-team",
  "reviewCadence": "monthly",
  "docUpdateRequiredOnChange": false,
  "releaseApprovalRequired": false,
  "auditCriticality": "low"
}
```

---

## 📐 OWNERSHIP MODEL SCHEMA

```typescript
interface NodeOwnershipModel {
  nodeId: string;
  ownerType: "creator" | "admin" | "operator" | "team" | "product";
  ownerRole: string;
  maintenanceResponsibility: string;
  reviewCadence: "weekly" | "monthly" | "quarterly" | "yearly";
  docUpdateRequiredOnChange: boolean;
  releaseApprovalRequired: boolean;
  auditCriticality: "low" | "medium" | "high" | "critical";
}
```

---

## ✅ CRITICAL INVARIANTS

1. **Все узлы имеют owner** — обязательно
2. **Priority-1 узлы имеют weekly review** — обязательно
3. **Doc update required для technical nodes** — обязательно
4. **Release approval для production** — обязательно
5. **Audit criticality зафиксирована** — для всех узлов

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [node-ownership-map.json](../state/node-ownership-map.json) — Ownership state
- [RUNBOOK_INDEX.md](../runbooks/RUNBOOK_INDEX.md) — Runbooks

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
