---
title: Production Environment
description: Среда production для узлов Balloo — стабильный production-сервис
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - environment
  - production
  - stable
  - public
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/nodes/BRANCH_TREE.md
  - SUMMARY_DOCS/contracts/nodes/BranchNodeContract.md
  - SUMMARY_DOCS/contracts/nodes/NodeEnvironmentContract.md
---

# 🏭 PRODUCTION ENVIRONMENT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ описывает **production environment** для узлов Balloo.

**Production Branch** = стабильная production-среда для конечных пользователей.

---

## 📊 OVERVIEW

| Параметр | Значение |
|----------|----------|
| **Branch ID** | `production` |
| **Root Domain** | `balloo.su` |
| **Local Dev** | `localhost:30xx` (for local testing only) |
| **Maturity** | Stable |
| **Access** | Public + Authenticated |
| **Node Count** | 11 |
| **Technical Nodes** | Minimal |

---

## 🌿 DOMAIN POLICY

### Critical Principle

```yaml
production:
  domain_required: true
  canonical_domains: true
  local_dev_allowed: false  # For production deployment
  identity_preservation: true
```

### Production Domains

```
balloo.su
api.balloo.su
ai.api.balloo.su (v4.*, planned)
files.balloo.su
docs.balloo.su
future.balloo.su (planned)
admin.balloo.su
workers.balloo.su
abaut.balloo.su
apps.balloo.su
```

### Client Apps (No Domain)

```
client-apps-family:
  - android
  - ios
  - windows
  - linux
  - macos
```

---

## 📦 NODES IN PRODUCTION

### Public Nodes

| Node ID | Domain | Purpose |
|---------|--------|---------|
| balloo-production-root | balloo.su | Root |
| docs-production | docs.balloo.su | Documentation |
| future-production | future.balloo.su | Experimental (planned) |
| abaut-production | abaut.balloo.su | About |
| apps-production | apps.balloo.su | Apps portal |
| client-apps-family | (no domain) | Client apps |

### API/Service Nodes

| Node ID | Domain | Purpose |
|---------|--------|---------|
| api-production | api.balloo.su | API gateway |
| ai-api-production | ai.api.balloo.su | AI API (v4.*, planned) |
| files-production | files.balloo.su | Storage |

### Technical Nodes

| Node ID | Domain | Purpose |
|---------|--------|---------|
| admin-production | admin.balloo.su | Admin panel |
| workers-production | workers.balloo.su | Background workers |

---

## ⚙️ SETTINGS

### Branch-Level Settings

```yaml
branch:
  id: production
  domain_root: balloo.su
  access_level: public
  debug_enabled: false
  logging_level: warn  # Minimal logging in production
  rate_limits:
    enabled: true
    strict: true
  feature_flags:
    production_features: true
    experimental_features: false
```

### Environment Variables

```bash
NODE_ENV=production
BALLOO_MODE=production
BALLOO_BRANCH=production
DOMAIN_REQUIRED=true
PRODUCTION_DOMAIN=balloo.su
DEBUG=false
LOG_LEVEL=warn
```

---

## 🔐 ACCESS & AUTH

### Access Level

```yaml
access:
  type: public
  audience:
    - public_users
    - clients
    - external_audience
  authentication:
    public_pages: not_required
    api_endpoints: required
    admin_panel: required
  rate_limiting: strict
```

### Auth Requirements

| Node Type | Auth Required |
|-----------|---------------|
| Public pages | ❌ No |
| API endpoints | ✅ Yes |
| Admin panel | ✅ Yes |
| Workers | ✅ Yes (internal) |

---

## 🏃 RUNTIME BEHAVIOR

### Startup

```yaml
startup:
  order:
    1. database (production)
    2. api-production
    3. workers-production
    4. public_nodes
  hot_reload: disabled
  optimized_startup: true
  health_checks: required
```

### Logging

```yaml
logging:
  level: warn  # Only warnings and errors
  format: compact
  output: monitoring_system
  ai_readable: false
  pii_redaction: required
```

### Error Handling

```yaml
errors:
  display: minimal  # No stack traces to users
  stack_traces: logged_only
  debugging_tools: disabled
  alerting: enabled
```

---

## 🔄 RELEASE FLOW

### To Production (from Alpha)

```yaml
transition:
  from: alpha
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
  deployment:
    strategy: blue_green_or_canary
    rollback_plan: required
    monitoring: enhanced
```

### Production Stability

```yaml
stability:
  breaking_changes: not_allowed
  feature_freeze: required_before_release
  testing_requirement: full_qa_cycle
  rollback_capability: required
  sla: 99.9%
```

---

## 🛡️ SECURITY

### Security Requirements

```yaml
security:
  ssl_tls: required
  hsts: enabled
  cdn: recommended
  ddos_protection: enabled
  waf: enabled
  security_headers: required
  audit_logging: enabled
```

### Secrets Management

```yaml
secrets:
  management: vault_or_secrets_manager
  rotation: automated
  access: role_based
  audit: enabled
```

---

## ✅ INVARIANTS

1. **production mode MUST use canonical assigned production domains**
2. **Стабильная production-среда** — no breaking changes
3. **Публичный доступ** — public users
4. **Минимум технических узлов** — только admin и workers
5. **Production identity не теряется** — canonical domains
6. **Не смешивать prod/working** — strict environment isolation
7. **Security mandatory** — SSL, HSTS, WAF, etc.
8. **SLA 99.9%** — high availability required

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [BRANCH_TREE.md](./BRANCH_TREE.md) — Branch tree
- [ENV_WORKING.md](./ENV_WORKING.md) — Working environment
- [ENV_ALPHA.md](./ENV_ALPHA.md) — Alpha environment
- [NodeEnvironmentContract.md](../contracts/nodes/NodeEnvironmentContract.md) — Environment contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
