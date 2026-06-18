---
title: Working Environment
description: Среда working для узлов Balloo — разработка, интеграция, автоматизация
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - environment
  - working
  - development
  - integration
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/nodes/BRANCH_TREE.md
  - SUMMARY_DOCS/contracts/nodes/BranchNodeContract.md
  - SUMMARY_DOCS/contracts/nodes/NodeEnvironmentContract.md
---

# 🔧 WORKING ENVIRONMENT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ описывает **working environment** для узлов Balloo.

**Working Branch** = среда разработки и интеграции.

---

## 📊 OVERVIEW

| Параметр | Значение |
|----------|----------|
| **Branch ID** | `working` |
| **Root Domain** | `working.balloo.su` (optional) |
| **Local Dev** | `localhost:32xx` |
| **Maturity** | Development |
| **Access** | Internal + Developers |
| **Node Count** | 15 |
| **Technical Nodes** | Priority 1 ⭐ |

---

## 🌿 DOMAIN POLICY

### Critical Principle

```yaml
working:
  domain_required: false
  can_use_localhost: true
  can_use_working_domain: true
  local_dev_allowed: true
  identity_preservation: true
```

### Working Domains (Optional)

```
working.balloo.su
api.working.balloo.su
files.working.balloo.su
docs.working.balloo.su
workdocs.working.balloo.su ⭐
nodes-switcher.working.balloo.su ⭐
kpdegen.working.balloo.su ⭐
projectgeneralsettings.working.balloo.su ⭐
```

### Local Dev Equivalents

```
localhost:3200 — working-root
localhost:3201 — docs-working
localhost:3210 — workdocs-working ⭐
localhost:3211 — nodes-switcher-working ⭐
localhost:3212 — projectgeneralsettings-working ⭐
localhost:4100 — api-working
localhost:4101 — files-working
localhost:4200 — kpdegen-working ⭐
localhost:5432 — database-working ⭐
```

---

## 📦 NODES IN WORKING

### Priority 1 Technical Nodes ⭐

| Node ID | Domain | Local Port | Purpose |
|---------|--------|------------|---------|
| workdocs-working | workdocs.working | 3210 | Documentation |
| nodes-switcher-working | nodes-switcher.working | 3211 | Version manager |
| kpdegen-working | kpdegen.working | 4200 | Code generator |
| projectgeneralsettings-working | projectgeneralsettings.working | 3212 | Settings |
| database-working | (none) | 5432 | Database |

### Priority 2 Working Nodes

| Node ID | Domain | Local Port | Purpose |
|---------|--------|------------|---------|
| working-root | working.balloo.su | 3200 | Root |
| api-working | api.working | 4100 | API |
| files-working | files.working | 4101 | Storage |
| docs-working | docs.working | 3201 | Docs |
| future-working | future.working | 3202 | Experimental |
| pilot-future-working | pilot-future.working | 3203 | Pilot |
| admin-working | admin.working | 3204 | Admin |
| workers-working | workers.working | 4102 | Workers |
| abaut-working | abaut.working | 3205 | About |
| apps-working | apps.working | 3206 | Apps |

---

## ⚙️ SETTINGS

### Branch-Level Settings

```yaml
branch:
  id: working
  domain_root: working.balloo.su
  access_level: internal
  debug_enabled: true
  logging_level: debug
  rate_limits:
    enabled: false  # Relaxed for development
  feature_flags:
    all_enabled: true  # All features available for testing
```

### Environment Variables

```bash
NODE_ENV=development
BALLOO_MODE=working
BALLOO_BRANCH=working
DOMAIN_REQUIRED=false
WORKING_DOMAIN=working.balloo.su
DEBUG=true
LOG_LEVEL=debug
```

---

## 🔐 ACCESS & AUTH

### Access Level

```yaml
access:
  type: internal
  audience:
    - developers
    - internal_team
    - ai_agents
  authentication:
    required: true
    method: token_or_password
  rate_limiting: relaxed
```

### Auth Requirements

| Node Type | Auth Required |
|-----------|---------------|
| Technical nodes | ✅ Yes |
| API nodes | ✅ Yes |
| Admin nodes | ✅ Yes |
| Public nodes | ✅ Yes (internal) |

---

## 🏃 RUNTIME BEHAVIOR

### Startup

```yaml
startup:
  order:
    1. database-working
    2. api-working
    3. workers-working
    4. technical_nodes
    5. public_nodes
  hot_reload: enabled
  fast_startup: true
```

### Logging

```yaml
logging:
  level: debug
  format: detailed
  output: console_and_file
  ai_readable: true
```

### Error Handling

```yaml
errors:
  display: detailed
  stack_traces: enabled
  debugging_tools: enabled
```

---

## 🔄 RELEASE FLOW

### Working → Alpha

```yaml
transition:
  to: alpha
  requirements:
    - feature_complete: true
    - ci_cd_passed: true
    - docs_updated: true
  approval:
    - tech_lead
    - product_owner
```

### Working → Production (via Alpha)

```yaml
transition:
  to: production
  requires_alpha: true
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

---

## 🤖 CODEGEN IN WORKING

### Codegen Priority

```
Priority 1: Technical nodes (workdocs, nodes-switcher, kpdegen, projectgeneralsettings, database)
Priority 2: Other working nodes (api, files, docs, admin, workers, apps)
```

### Codegen Inputs

- `NODE_CONTRACT_*.md` — Node contracts
- `NODETREE_MANIFEST.json` — Node registry
- `node-settings-map.json` — Settings
- `node-runtime-map.json` — Runtime mapping

### Codegen Outputs

- Source code
- Config files
- Documentation
- Infrastructure code

---

## ✅ INVARIANTS

1. **working/dev запускается локально и без обязательных доменов**
2. **working MAY run via localhost, ports, local host aliases**
3. **Технические узлы приоритет 1** — workdocs, nodes-switcher, kpdegen, projectgeneralsettings, database
4. **Production identity не теряется** — logical identity preserved
5. **Не смешивать working/prod** — environment isolation
6. **All features available** — для тестирования
7. **Relaxed rate limiting** — для разработки

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [BRANCH_TREE.md](./BRANCH_TREE.md) — Branch tree
- [ENV_ALPHA.md](./ENV_ALPHA.md) — Alpha environment
- [ENV_PRODUCTION.md](./ENV_PRODUCTION.md) — Production environment
- [NodeEnvironmentContract.md](../contracts/nodes/NodeEnvironmentContract.md) — Environment contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
