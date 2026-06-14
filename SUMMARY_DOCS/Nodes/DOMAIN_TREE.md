---
title: Domain Tree
description: Каноническое дерево доменов Balloo — root domains, subdomains, local dev equivalents
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - domains
  - subdomains
  - routing
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
  - SUMMARY_DOCS/nodes/BRANCH_TREE.md
  - SUMMARY_DOCS/contracts/nodes/DomainNodeContract.md
---

# 🌐 DOMAIN TREE

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует **каноническое дерево доменов** Balloo.

**Domain-bearing node** = узел, имеющий собственный production или environment-specific hostname/path binding.

---

## 📊 ОБЗОР ДОМЕНОВ

```
┌──────────────────────────────────────────────────────────────────┐
│                      BALLOO DOMAIN TREE                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PRODUCTION (balloo.su)          WORKING (working.balloo.su)     │
│  ┌─────────────────────┐         ┌─────────────────────┐        │
│  │ balloo.su           │         │ working.balloo.su   │        │
│  │ ├─ api              │         │ ├─ api              │        │
│  │ ├─ ai.api (v4.*)    │         │ ├─ files            │        │
│  │ ├─ files            │         │ ├─ docs             │        │
│  │ ├─ docs             │         │ ├─ future           │        │
│  │ ├─ future           │         │ ├─ pilot-future     │        │
│  │ ├─ admin            │         │ ├─ admin            │        │
│  │ ├─ workers          │         │ ├─ workers          │        │
│  │ ├─ abaut            │         │ ├─ abaut            │        │
│  │ ├─ apps             │         │ ├─ apps             │        │
│  │ └─ (client-apps)    │         │ ├─ workdocs ⭐      │        │
│  └─────────────────────┘         │ ├─ nodes-switcher ⭐│        │
│                                  │ ├─ kpdegen ⭐       │        │
│  ALPHA (alpha.balloo.su)         │ ├─ projectgeneral...│        │
│  ┌─────────────────────┐         │ └─ database (no)    │        │
│  │ alpha.balloo.su     │         └─────────────────────┘        │
│  │ ├─ apps             │                                          │
│  │ └─ 2commands        │         ⭐ = Priority 1 Technical       │
│  └─────────────────────┘                                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🏭 PRODUCTION DOMAINS

### Root Domain

| Domain | Node ID | Type | Status |
|--------|---------|------|--------|
| `balloo.su` | balloo-production-root | public-root | Active |

### API Subdomains

| Domain | Node ID | Type | Status |
|--------|---------|------|--------|
| `api.balloo.su` | api-production | api | Active |
| `ai.api.balloo.su` | ai-api-production | api-ai | Planned (v4.*) |

### Service Subdomains

| Domain | Node ID | Type | Status |
|--------|---------|------|--------|
| `files.balloo.su` | files-production | storage | Active |
| `docs.balloo.su` | docs-production | docs | Active |
| `admin.balloo.su` | admin-production | admin | Active |
| `workers.balloo.su` | workers-production | workers | Active |

### Content Subdomains

| Domain | Node ID | Type | Status |
|--------|---------|------|--------|
| `future.balloo.su` | future-production | experimental | Planned |
| `abaut.balloo.su` | abaut-production | info | Active |
| `apps.balloo.su` | apps-production | apps-portal | Active |

### Client Apps (No Domain)

| Platform | Node ID | Type | Status |
|----------|---------|------|--------|
| Android | client-apps-family | mobile | Active |
| iOS | client-apps-family | mobile | Active |
| Windows | client-apps-family | desktop | Active |
| Linux | client-apps-family | desktop | Active |
| macOS | client-apps-family | desktop | Active |

---

## 🔬 ALPHA DOMAINS

### Root Domain

| Domain | Node ID | Type | Status |
|--------|---------|------|--------|
| `alpha.balloo.su` | alpha-root | public-root | Active |

### Alpha Subdomains

| Domain | Node ID | Type | Status |
|--------|---------|------|--------|
| `apps.alpha.balloo.su` | apps-alpha | apps-portal | Active |
| `2commands.alpha.balloo.su` | 2commands-alpha | experimental | Active |

---

## 🔧 WORKING DOMAINS

### Root Domain

| Domain | Node ID | Type | Status |
|--------|---------|------|--------|
| `working.balloo.su` | working-root | public-root | Active |

### Working Subdomains

| Domain | Node ID | Type | Priority |
|--------|---------|------|----------|
| `api.working.balloo.su` | api-working | api | 2 |
| `files.working.balloo.su` | files-working | storage | 2 |
| `docs.working.balloo.su` | docs-working | docs | 2 |
| `future.working.balloo.su` | future-working | experimental | 2 |
| `pilot-future.working.balloo.su` | pilot-future-working | experimental | 2 |
| `admin.working.balloo.su` | admin-working | admin | 2 |
| `workers.working.balloo.su` | workers-working | workers | 2 |
| `abaut.working.balloo.su` | abaut-working | info | 2 |
| `apps.working.balloo.su` | apps-working | apps-portal | 2 |

### Technical Subdomains (Priority 1) ⭐

| Domain | Node ID | Type | Priority |
|--------|---------|------|----------|
| `workdocs.working.balloo.su` | workdocs-working | technical-docs | 1 ⭐ |
| `nodes-switcher.working.balloo.su` | nodes-switcher-working | technical-orchestration | 1 ⭐ |
| `kpdegen.working.balloo.su` | kpdegen-working | technical-codegen | 1 ⭐ |
| `projectgeneralsettings.working.balloo.su` | projectgeneralsettings-working | technical-settings | 1 ⭐ |

### Technical Runtime (No Domain)

| Identity | Node ID | Type | Priority |
|----------|---------|------|----------|
| `localhost:5432` | database-working | technical-runtime | 1 ⭐ |

---

## 🖥️ LOCAL DEV MAPPING

### Critical Principle

```
✅ dev mode MUST NOT require real public domains
✅ working MAY run via localhost, ports, local host aliases or internal routing
✅ production identity узла не теряется даже если dev запускается локально
```

### Production Nodes — Local Dev Equivalents

| Production Domain | Local Dev Identity | Port |
|-------------------|-------------------|------|
| balloo.su | localhost | 3000 |
| api.balloo.su | localhost | 4000 |
| ai.api.balloo.su | localhost | 4001 |
| files.balloo.su | localhost | 4002 |
| docs.balloo.su | localhost | 3001 |
| future.balloo.su | localhost | 3002 |
| admin.balloo.su | localhost | 3003 |
| workers.balloo.su | localhost | 4003 |
| abaut.balloo.su | localhost | 3004 |
| apps.balloo.su | localhost | 3005 |

### Alpha Nodes — Local Dev Equivalents

| Alpha Domain | Local Dev Identity | Port |
|--------------|-------------------|------|
| alpha.balloo.su | localhost | 3100 |
| apps.alpha.balloo.su | localhost | 3101 |
| 2commands.alpha.balloo.su | localhost | 3102 |

### Working Nodes — Local Dev Equivalents

| Working Domain | Local Dev Identity | Port |
|----------------|-------------------|------|
| working.balloo.su | localhost | 3200 |
| api.working.balloo.su | localhost | 4100 |
| files.working.balloo.su | localhost | 4101 |
| docs.working.balloo.su | localhost | 3201 |
| future.working.balloo.su | localhost | 3202 |
| pilot-future.working.balloo.su | localhost | 3203 |
| admin.working.balloo.su | localhost | 3204 |
| workers.working.balloo.su | localhost | 4102 |
| abaut.working.balloo.su | localhost | 3205 |
| apps.working.balloo.su | localhost | 3206 |
| workdocs.working.balloo.su | localhost | 3210 |
| nodes-switcher.working.balloo.su | localhost | 3211 |
| kpdegen.working.balloo.su | localhost | 4200 |
| projectgeneralsettings.working.balloo.su | localhost | 3212 |
| database-working | localhost | 5432 |

---

## 🔑 DOMAIN POLICY RULES

### Production Mode

```yaml
production:
  domain_required: true
  canonical_domains:
    - balloo.su
    - "*.balloo.su"
  local_dev_allowed: false
  identity_preservation: true
```

### Alpha Mode

```yaml
alpha:
  domain_required: true
  canonical_domains:
    - alpha.balloo.su
    - "*.alpha.balloo.su"
  local_dev_allowed: true
  identity_preservation: true
```

### Working Mode

```yaml
working:
  domain_required: false
  canonical_domains:
    - working.balloo.su
    - "*.working.balloo.su"
  local_dev_allowed: true
  localhost_ports: 3200-3299, 4100-4199, 4200-4299, 5432
  identity_preservation: true
```

### Local Dev Mode

```yaml
local_dev:
  domain_required: false
  localhost_only: true
  port_based_routing: true
  internal_hostnames:
    - localhost:PORT
    - host.docker.internal:PORT
  identity_preservation: true
```

---

## 🗺️ DOMAIN-TO-NODE MAPPING

### Production Branch

```json
{
  "balloo.su": "balloo-production-root",
  "api.balloo.su": "api-production",
  "ai.api.balloo.su": "ai-api-production",
  "files.balloo.su": "files-production",
  "docs.balloo.su": "docs-production",
  "future.balloo.su": "future-production",
  "admin.balloo.su": "admin-production",
  "workers.balloo.su": "workers-production",
  "abaut.balloo.su": "abaut-production",
  "apps.balloo.su": "apps-production"
}
```

### Alpha Branch

```json
{
  "alpha.balloo.su": "alpha-root",
  "apps.alpha.balloo.su": "apps-alpha",
  "2commands.alpha.balloo.su": "2commands-alpha"
}
```

### Working Branch

```json
{
  "working.balloo.su": "working-root",
  "api.working.balloo.su": "api-working",
  "files.working.balloo.su": "files-working",
  "docs.working.balloo.su": "docs-working",
  "future.working.balloo.su": "future-working",
  "pilot-future.working.balloo.su": "pilot-future-working",
  "admin.working.balloo.su": "admin-working",
  "workers.working.balloo.su": "workers-working",
  "abaut.working.balloo.su": "abaut-working",
  "apps.working.balloo.su": "apps-working",
  "workdocs.working.balloo.su": "workdocs-working",
  "nodes-switcher.working.balloo.su": "nodes-switcher-working",
  "kpdegen.working.balloo.su": "kpdegen-working",
  "projectgeneralsettings.working.balloo.su": "projectgeneralsettings-working"
}
```

---

## 🎯 SPECIAL CASES

### Client Apps Family

```
client-apps не имеют отдельного домена
зафиксированы как family node / platform node group
платформы: android, ios, windows, linux, macos
```

### Database Working

```
database-working — technical runtime node
не имеет публичного домена
локальный identity: localhost:5432
приоритет 1 для codegen
```

### AI API (Version-Scoped)

```
ai.api.balloo.su — capability from version 4.*
статус: planned
не считать active production функцией до 4.*
```

### SPiFS Storage

```
SPiFS — planned/proprietary storage model
не production решение без evidence
Yandex.Disk допустим как стратегия для 3.1.*
```

---

## ✅ CRITICAL INVARIANTS

1. **dev mode MUST NOT require real public domains**
2. **prod mode MUST use canonical assigned production domains**
3. **alpha SHOULD use assigned alpha domains**
4. **working MAY run via localhost, ports, local host aliases**
5. **production identity узла не теряется при local dev**
6. **Не выдумывать неозвученные домены**
7. **client-apps — family node без домена**
8. **database-working — technical node без домена**

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Главный индекс
- [NODETREE_MANIFEST.json](./NODETREE_MANIFEST.json) — Machine-readable registry
- [BRANCH_TREE.md](./BRANCH_TREE.md) — Дерево веток
- [DomainNodeContract.md](../contracts/nodes/DomainNodeContract.md) — Domain contract
- [NODE_RUNTIME_MODEL.md](./NODE_RUNTIME_MODEL.md) — Runtime model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
