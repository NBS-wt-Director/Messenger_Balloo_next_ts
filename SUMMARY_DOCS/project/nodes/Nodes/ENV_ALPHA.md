---
title: Alpha Environment
description: Среда alpha для узлов Balloo — тестирование, валидация, pre-production
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - environment
  - alpha
  - testing
  - pre-production
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/nodes/BRANCH_TREE.md
  - SUMMARY_DOCS/contracts/nodes/BranchNodeContract.md
  - SUMMARY_DOCS/contracts/nodes/NodeEnvironmentContract.md
---

# 🔬 ALPHA ENVIRONMENT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ описывает **alpha environment** для узлов Balloo.

**Alpha Branch** = среда тестирования новых функций перед production.

---

## 📊 OVERVIEW

| Параметр | Значение |
|----------|----------|
| **Branch ID** | `alpha` |
| **Root Domain** | `alpha.balloo.su` |
| **Local Dev** | `localhost:31xx` |
| **Maturity** | Beta |
| **Access** | Limited (testers, QA) |
| **Node Count** | 3 |
| **Technical Nodes** | Minimal |

---

## 🌿 DOMAIN POLICY

### Critical Principle

```yaml
alpha:
  domain_required: true
  alpha_domains: true
  can_use_localhost: true  # For local testing
  identity_preservation: true
```

### Alpha Domains

```
alpha.balloo.su
apps.alpha.balloo.su
2commands.alpha.balloo.su
```

### Local Dev Equivalents

```
localhost:3100 — alpha-root
localhost:3101 — apps-alpha
localhost:3102 — 2commands-alpha
```

---

## 📦 NODES IN ALPHA

| Node ID | Domain | Local Port | Purpose |
|---------|--------|------------|---------|
| alpha-root | alpha.balloo.su | 3100 | Root |
| apps-alpha | apps.alpha.balloo.su | 3101 | Apps portal |
| 2commands-alpha | 2commands.alpha.balloo.su | 3102 | Experimental |

---

## ⚙️ SETTINGS

### Branch-Level Settings

```yaml
branch:
  id: alpha
  domain_root: alpha.balloo.su
  access_level: limited
  debug_enabled: false
  logging_level: info
  rate_limits:
    enabled: true
  feature_flags:
    alpha_features: true
    production_features: false
```

### Environment Variables

```bash
NODE_ENV=staging
BALLOO_MODE=alpha
BALLOO_BRANCH=alpha
DOMAIN_REQUIRED=true
ALPHA_DOMAIN=alpha.balloo.su
DEBUG=false
LOG_LEVEL=info
```

---

## 🔐 ACCESS & AUTH

### Access Level

```yaml
access:
  type: limited
  audience:
    - testers
    - qa_engineers
    - early_adopters
    - product_team
  authentication:
    required: true
    method: invite_only
  rate_limiting: enabled
```

### Auth Requirements

| Node Type | Auth Required |
|-----------|---------------|
| All nodes | ✅ Yes |

---

## 🏃 RUNTIME BEHAVIOR

### Startup

```yaml
startup:
  order:
    1. alpha-root
    2. apps-alpha
    3. 2commands-alpha
  hot_reload: disabled
  optimized_startup: true
```

### Logging

```yaml
logging:
  level: info
  format: standard
  output: file_and_monitoring
  ai_readable: false
```

### Error Handling

```yaml
errors:
  display: standard
  stack_traces: logged_only
  debugging_tools: disabled
```

---

## 🔄 RELEASE FLOW

### Alpha → Production

```yaml
transition:
  to: production
  requirements:
    - qa_approved: true
    - no_critical_bugs: true
    - performance_tests_passed: true
    - security_review: true
    - alpha_tests_passed: true
  approval:
    - tech_lead
    - product_owner
    - security
```

### Working → Alpha

```yaml
transition:
  from: working
  requirements:
    - feature_complete: true
    - ci_cd_passed: true
    - docs_updated: true
    - working_tests_passed: true
  approval:
    - tech_lead
    - product_owner
```

---

## 🧪 TESTING IN ALPHA

### Test Types

```yaml
testing:
  types:
    - functional_tests
    - integration_tests
    - performance_tests
    - security_tests
    - user_acceptance_tests
  automation:
    ci_cd: enabled
    regression: enabled
```

### Feature Flags

```yaml
feature_flags:
  alpha_features: enabled
  production_features: disabled
  experimental: allowed
```

---

## ✅ INVARIANTS

1. **alpha SHOULD use assigned alpha domains**
2. **Ограниченный доступ** — testers, QA, early adopters
3. **Минимум технических узлов** — только необходимые для тестирования
4. **Production identity не теряется** — logical identity preserved
5. **Не смешивать alpha/prod** — environment isolation
6. **Feature flags для alpha** — alpha features only
7. **QA validation required** — перед production

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [BRANCH_TREE.md](./BRANCH_TREE.md) — Branch tree
- [ENV_WORKING.md](./ENV_WORKING.md) — Working environment
- [ENV_PRODUCTION.md](./ENV_PRODUCTION.md) — Production environment
- [NodeEnvironmentContract.md](../contracts/nodes/NodeEnvironmentContract.md) — Environment contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
