---
title: Node Runtime Model
description: Каноническая модель runtime для узлов Balloo — local dev, working, alpha, production
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - runtime
  - environments
  - deployment
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/NodeEnvironmentContract.md
  - SUMMARY_DOCS/contracts/nodes/NodeRuntimeContract.md
  - SUMMARY_DOCS/state/node-runtime-map.json
---

# 🏃 NODE RUNTIME MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **каноническую модель runtime** для всех узлов Balloo.

**Node Environment Contract** = поведение узла в различных средах выполнения.

---

## 📊 ENVIRONMENT MODES

```
┌──────────────────────────────────────────────────────────────────┐
│                    RUNTIME ENVIRONMENT MODES                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ LOCAL / DEV  │  │   WORKING    │  │    ALPHA     │          │
│  │              │  │              │  │              │          │
│  │ localhost    │  │ working.     │  │ alpha.       │          │
│  │ no domains   │  │ balloo.su    │  │ balloo.su    │          │
│  │              │  │ (optional)   │  │ (required)   │          │
│  │ Developers   │  │ Internal     │  │ Testers      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐                                               │
│  │  PRODUCTION  │                                               │
│  │              │                                               │
│  │  balloo.su   │                                               │
│  │  (required)  │                                               │
│  │              │                                               │
│  │   Public     │                                               │
│  └──────────────┘                                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ LOCAL / DEV MODE

### Описание

Локальная разработка без реальных доменов.

### Critical Principle

```yaml
local_dev:
  domains_required: false
  localhost_only: true
  purpose: Development and testing
  audience: Developers
```

### Characteristics

| Parameter | Value |
|-----------|-------|
| **Domain Required** | ❌ No |
| **Routing** | localhost:PORT |
| **Access** | Local machine only |
| **Auth** | Optional / mocked |
| **SSL** | Not required |
| **Persistence** | Ephemeral / local DB |

### Port Allocation

| Branch | Port Range | Example |
|--------|------------|---------|
| Production (local) | 3000-3099 | localhost:3000 |
| Alpha (local) | 3100-3199 | localhost:3100 |
| Working (local) | 3200-3299 | localhost:3200 |
| API (all) | 4000-4199 | localhost:4000 |
| Codegen | 4200-4299 | localhost:4200 |
| Database | 5400-5499 | localhost:5432 |

### Local Dev Identity Mapping

```json
{
  "balloo.su": "localhost:3000",
  "api.balloo.su": "localhost:4000",
  "workdocs.working.balloo.su": "localhost:3210",
  "kpdegen.working.balloo.su": "localhost:4200",
  "database-working": "localhost:5432"
}
```

### Environment Variables

```bash
NODE_ENV=development
BALLOO_MODE=local
BALLOO_BRANCH=working
DOMAIN_REQUIRED=false
LOCALHOST_ONLY=true
```

---

## 🔧 WORKING MODE

### Описание

Среда разработки и интеграции с опциональными доменами.

### Critical Principle

```yaml
working:
  domains_required: false
  can_use_localhost: true
  can_use_working_domain: true
  purpose: Development integration and testing
  audience: Internal developers
```

### Characteristics

| Parameter | Value |
|-----------|-------|
| **Domain Required** | ❌ No (optional) |
| **Routing** | localhost:PORT или working.balloo.su |
| **Access** | Internal + Developers |
| **Auth** | Required |
| **SSL** | Recommended |
| **Persistence** | Working DB |

### Runtime Options

#### Option A: Localhost Routing

```yaml
working_localhost:
  base_url: http://localhost:3200
  api_url: http://localhost:4100
  workdocs_url: http://localhost:3210
  kpdegen_url: http://localhost:4200
```

#### Option B: Domain Routing

```yaml
working_domain:
  base_url: https://working.balloo.su
  api_url: https://api.working.balloo.su
  workdocs_url: https://workdocs.working.balloo.su
  kpdegen_url: https://kpdegen.working.balloo.su
```

### Environment Variables

```bash
NODE_ENV=development
BALLOO_MODE=working
BALLOO_BRANCH=working
DOMAIN_REQUIRED=false
WORKING_DOMAIN=working.balloo.su
```

---

## 🔬 ALPHA MODE

### Описание

Среда тестирования с alpha доменами.

### Critical Principle

```yaml
alpha:
  domains_required: true
  alpha_domains: true
  purpose: Pre-production testing
  audience: Testers, QA, early adopters
```

### Characteristics

| Parameter | Value |
|-----------|-------|
| **Domain Required** | ✅ Yes (alpha) |
| **Routing** | alpha.balloo.su, *.alpha.balloo.su |
| **Access** | Limited (testers, QA) |
| **Auth** | Required |
| **SSL** | Required |
| **Persistence** | Alpha DB |

### Domain Routing

```yaml
alpha:
  base_url: https://alpha.balloo.su
  apps_url: https://apps.alpha.balloo.su
  2commands_url: https://2commands.alpha.balloo.su
```

### Environment Variables

```bash
NODE_ENV=staging
BALLOO_MODE=alpha
BALLOO_BRANCH=alpha
DOMAIN_REQUIRED=true
ALPHA_DOMAIN=alpha.balloo.su
```

---

## 🏭 PRODUCTION MODE

### Описание

Production среда с canonical production доменами.

### Critical Principle

```yaml
production:
  domains_required: true
  canonical_domains: true
  purpose: Stable production service
  audience: Public users
```

### Characteristics

| Parameter | Value |
|-----------|-------|
| **Domain Required** | ✅ Yes (production) |
| **Routing** | balloo.su, *.balloo.su |
| **Access** | Public + Authenticated |
| **Auth** | Required for protected endpoints |
| **SSL** | Required |
| **Persistence** | Production DB |

### Domain Routing

```yaml
production:
  base_url: https://balloo.su
  api_url: https://api.balloo.su
  ai_api_url: https://ai.api.balloo.su
  files_url: https://files.balloo.su
  docs_url: https://docs.balloo.su
  admin_url: https://admin.balloo.su
  workers_url: https://workers.balloo.su
  abaut_url: https://abaut.balloo.su
  apps_url: https://apps.balloo.su
```

### Environment Variables

```bash
NODE_ENV=production
BALLOO_MODE=production
BALLOO_BRANCH=production
DOMAIN_REQUIRED=true
PRODUCTION_DOMAIN=balloo.su
```

---

## 🗺️ LOGICAL IDENTITY → RUNTIME MAPPING

### Mapping Schema

```json
{
  "logicalNodeId": "workdocs-working",
  "canonicalName": "workdocs.working.balloo.su",
  "runtimeMapping": {
    "local_dev": {
      "identity": "localhost:3210",
      "domainRequired": false,
      "url": "http://localhost:3210"
    },
    "working": {
      "identity": "workdocs.working.balloo.su",
      "domainRequired": false,
      "url": "https://workdocs.working.balloo.su"
    },
    "alpha": {
      "identity": "N/A",
      "domainRequired": false,
      "url": "N/A",
      "note": "Node not available in alpha"
    },
    "production": {
      "identity": "N/A",
      "domainRequired": false,
      "url": "N/A",
      "note": "Node not available in production"
    }
  }
}
```

### Full Mapping Table

| Logical Node ID | Local Dev | Working | Alpha | Production |
|-----------------|-----------|---------|-------|------------|
| balloo-root | :3000 | working.balloo.su | alpha.balloo.su | balloo.su |
| api | :4000 | api.working | N/A | api.balloo.su |
| workdocs | :3210 | workdocs.working | N/A | N/A |
| nodes-switcher | :3211 | nodes-switcher.working | N/A | N/A |
| kpdegen | :4200 | kpdegen.working | N/A | N/A |
| projectgeneralsettings | :3212 | projectgeneralsettings.working | N/A | N/A |
| database-working | :5432 | database-working | N/A | N/A |

---

## 🔀 INTERNAL ROUTING

### Local Dev Internal Routing

```
┌─────────────────────────────────────────────────────────┐
│              LOCAL DEV ROUTING                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (3200) ──► API (4100) ──► Database (5432)    │
│       │                    │                             │
│       ▼                    ▼                             │
│  Workdocs (3210)    kpdegen (4200)                       │
│       │                    │                             │
│       ▼                    ▼                             │
│  nodes-switcher     projectgeneralsettings               │
│  (3211)             (3212)                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Working Domain Internal Routing

```
┌─────────────────────────────────────────────────────────┐
│            WORKING DOMAIN ROUTING                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  *.working.balloo.su ──► Internal Load Balancer         │
│                              │                           │
│         ┌────────────────────┼────────────────────┐     │
│         ▼                    ▼                    ▼     │
│   workdocs.working     api.working          kpdegen    │
│   .balloo.su:3210      .balloo.su:4100      .working   │
│                                               :4200    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Production Internal Routing

```
┌─────────────────────────────────────────────────────────┐
│           PRODUCTION DOMAIN ROUTING                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  *.balloo.su ──► Production Load Balancer               │
│                      │                                   │
│      ┌───────────────┼───────────────┐                  │
│      ▼               ▼               ▼                  │
│  balloo.su      api.balloo.su   files.balloo.su        │
│  :3000          :4000           :4002                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 CODEGEN REQUIREMENTS

### Codegen Must Generate

```yaml
codegen_requirements:
  domain_agnostic_dev_config: true
  domain_bound_prod_config: true
  logical_identity_preservation: true
  environment_specific_routing: true
  port_allocation: true
  internal_hostnames: true
```

### Dev Config Example

```json
{
  "mode": "local_dev",
  "domainRequired": false,
  "nodes": {
    "workdocs-working": {
      "logicalId": "workdocs-working",
      "runtimeTarget": "localhost:3210",
      "url": "http://localhost:3210"
    }
  }
}
```

### Prod Config Example

```json
{
  "mode": "production",
  "domainRequired": true,
  "nodes": {
    "balloo-production-root": {
      "logicalId": "balloo-production-root",
      "runtimeTarget": "balloo.su",
      "url": "https://balloo.su"
    }
  }
}
```

---

## ⚠️ CRITICAL INVARIANTS

1. **local/dev mode runs without real domains**
2. **production mode runs with canonical production domains**
3. **codegen MUST generate domain-agnostic dev config**
4. **codegen MUST generate domain-bound prod config**
5. **узлы должны иметь logical identity**
6. **узлы должны иметь environment-specific runtime mapping**
7. **production identity не теряется при local dev**
8. **working MAY run via localhost or working.balloo.su**
9. **alpha SHOULD use alpha.balloo.su**
10. **Не смешивать working/prod routing**

---

## 📖 RELATED DOCUMENTS

- [NodeEnvironmentContract.md](../contracts/nodes/NodeEnvironmentContract.md) — Environment contract spec
- [NodeRuntimeContract.md](../contracts/nodes/NodeRuntimeContract.md) — Runtime contract spec
- [node-runtime-map.json](../state/node-runtime-map.json) — Runtime mapping registry
- [ENV_WORKING.md](./ENV_WORKING.md) — Working environment details
- [ENV_PRODUCTION.md](./ENV_PRODUCTION.md) — Production environment details
- [DOMAIN_TREE.md](./DOMAIN_TREE.md) — Domain tree

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
