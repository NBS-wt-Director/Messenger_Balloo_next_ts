---
title: Branch Node Contract
description: Канонический контракт веток Balloo — production, alpha, working
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - contract
  - branches
  - canonical
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/BRANCH_TREE.md
  - SUMMARY_DOCS/nodes/ENV_PRODUCTION.md
  - SUMMARY_DOCS/nodes/ENV_ALPHA.md
  - SUMMARY_DOCS/nodes/ENV_WORKING.md
---

# 📋 BRANCH NODE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **спецификацию веток** Balloo для AI-кодогенерации и системной интеграции.

**Branch** = каноническая среда развертывания проекта, объединяющая набор узлов с общей стадией готовности и едиными правилами доступа.

---

## 📊 BRANCH DEFINITIONS

### 1. PRODUCTION BRANCH

```json
{
  "branchId": "production",
  "canonicalName": "Production",
  "rootDomain": "balloo.su",
  "purpose": "Стабильная production-среда для конечных пользователей",
  "targetAudience": "Публичные пользователи, клиенты",
  "accessLevel": "public",
  "releaseMaturity": "stable",
  "nodeCount": 11,
  "technicalNodesPolicy": "minimal",
  "status": "active"
}
```

#### Purpose

Production branch обеспечивает стабильный production-сервис для конечных пользователей.

#### Target Audience

- ✅ Публичные пользователи
- ✅ Клиенты Balloo
- ✅ Внешняя аудитория

#### Access Level

```yaml
access:
  type: public
  authentication:
    public_pages: not_required
    api_endpoints: required
    admin_panel: required
  rate_limiting: enabled
  geo_restrictions: none
```

#### Release Maturity

```yaml
maturity:
  level: stable
  breaking_changes: not_allowed
  feature_freeze: required_before_release
  testing_requirement: full_qa_cycle
  rollback_capability: required
```

#### Routing Rules

```yaml
routing:
  root_domain: balloo.su
  subdomain_pattern: "*.balloo.su"
  ssl_required: true
  hsts_enabled: true
  cdn_enabled: true
  load_balancing: multi-region
```

#### Domain Policy

```yaml
domains:
  required: true
  canonical:
    - balloo.su
    - "*.balloo.su"
  local_dev_allowed: false
  identity_preservation: true
```

#### Settings Policy

```yaml
settings:
  mutable_by: [admin, owner]
  audit_required: true
  override_allowed: false
  production_overrides: not_allowed
```

#### App Availability Rules

```yaml
apps:
  client_apps:
    - android
    - ios
    - windows
    - linux
    - macos
  web_apps:
    - balloo.su
    - apps.balloo.su
  availability: 99.9%_sla
```

#### Docs Availability Rules

```yaml
docs:
  public_docs: docs.balloo.su
  api_docs: api.balloo.su/docs
  availability: always_on
  indexing: allowed
```

#### Technical Nodes Policy

```yaml
technical_nodes:
  allowed: minimal
  nodes:
    - admin-production
    - workers-production
  public_access: false
  auth_required: true
```

---

### 2. ALPHA BRANCH

```json
{
  "branchId": "alpha",
  "canonicalName": "Alpha",
  "rootDomain": "alpha.balloo.su",
  "purpose": "Среда тестирования новых функций перед production",
  "targetAudience": "Тестировщики, QA, early adopters",
  "accessLevel": "limited",
  "releaseMaturity": "beta",
  "nodeCount": 3,
  "technicalNodesPolicy": "minimal",
  "status": "active"
}
```

#### Purpose

Alpha branch обеспечивает среду для тестирования новых функций перед production release.

#### Target Audience

- ✅ Тестировщики
- ✅ QA инженеры
- ✅ Early adopters
- ✅ Product team

#### Access Level

```yaml
access:
  type: limited
  authentication:
    all_pages: required
    invite_only: true
  rate_limiting: enabled
  geo_restrictions: none
```

#### Release Maturity

```yaml
maturity:
  level: beta
  breaking_changes: allowed_with_notice
  feature_freeze: not_required
  testing_requirement: qa_validation
  rollback_capability: recommended
```

#### Routing Rules

```yaml
routing:
  root_domain: alpha.balloo.su
  subdomain_pattern: "*.alpha.balloo.su"
  ssl_required: true
  hsts_enabled: true
  cdn_enabled: false
  load_balancing: single-region
```

#### Domain Policy

```yaml
domains:
  required: true
  canonical:
    - alpha.balloo.su
    - "*.alpha.balloo.su"
  local_dev_allowed: true
  identity_preservation: true
```

#### Settings Policy

```yaml
settings:
  mutable_by: [admin, devops, qa-lead]
  audit_required: true
  override_allowed: true
  alpha_overrides: allowed
```

#### App Availability Rules

```yaml
apps:
  client_apps:
    - android (alpha builds)
    - ios (testflight)
  web_apps:
    - alpha.balloo.su
    - apps.alpha.balloo.su
  availability: best_effort
```

#### Docs Availability Rules

```yaml
docs:
  public_docs: not_indexed
  api_docs: alpha.balloo.su/docs
  availability: during_testing
  indexing: not_allowed
```

#### Technical Nodes Policy

```yaml
technical_nodes:
  allowed: minimal
  nodes: []
  public_access: false
  auth_required: true
```

---

### 3. WORKING BRANCH

```json
{
  "branchId": "working",
  "canonicalName": "Working",
  "rootDomain": "working.balloo.su",
  "purpose": "Среда разработки и интеграции",
  "targetAudience": "Разработчики, внутренняя команда",
  "accessLevel": "internal",
  "releaseMaturity": "development",
  "nodeCount": 15,
  "technicalNodesPolicy": "priority_1",
  "status": "active"
}
```

#### Purpose

Working branch обеспечивает среду для разработки, интеграции и автоматизации.

#### Target Audience

- ✅ Разработчики
- ✅ Внутренняя команда
- ✅ AI codegen systems
- ✅ DevOps

#### Access Level

```yaml
access:
  type: internal
  authentication:
    all_pages: required
    team_only: true
  rate_limiting: relaxed
  geo_restrictions: none
```

#### Release Maturity

```yaml
maturity:
  level: development
  breaking_changes: allowed
  feature_freeze: not_required
  testing_requirement: ci_cd
  rollback_capability: optional
```

#### Routing Rules

```yaml
routing:
  root_domain: working.balloo.su
  subdomain_pattern: "*.working.balloo.su"
  ssl_required: recommended
  hsts_enabled: false
  cdn_enabled: false
  load_balancing: local
```

#### Domain Policy

```yaml
domains:
  required: false
  canonical:
    - working.balloo.su
    - "*.working.balloo.su"
  local_dev_allowed: true
  localhost_routing: true
  identity_preservation: true
```

#### Settings Policy

```yaml
settings:
  mutable_by: [admin, devops, developers]
  audit_required: false
  override_allowed: true
  working_overrides: allowed
```

#### App Availability Rules

```yaml
apps:
  client_apps:
    - development_builds
  web_apps:
    - working.balloo.su
    - localhost:32xx
  availability: development_hours
```

#### Docs Availability Rules

```yaml
docs:
  public_docs: workdocs.working.balloo.su (protected)
  api_docs: localhost:4100/docs
  availability: always_on_internal
  indexing: not_allowed
```

#### Technical Nodes Policy

```yaml
technical_nodes:
  allowed: priority_1
  nodes:
    - workdocs-working ⭐
    - nodes-switcher-working ⭐
    - kpdegen-working ⭐
    - projectgeneralsettings-working ⭐
    - database-working ⭐
  public_access: false
  auth_required: true
  codegen_priority: highest
```

---

## 🔄 BRANCH TRANSITIONS

### Release Flow

```
WORKING ──► ALPHA ──► PRODUCTION
  │           │           │
  │           │           │
  ▼           ▼           ▼
Develop     Test        Release
(15 nodes)  (3 nodes)   (11 nodes)
```

### Transition Rules

```yaml
transitions:
  working_to_alpha:
    requirements:
      - feature_complete
      - ci_cd_passed
      - docs_updated
    approval: [tech-lead, product-owner]
    
  alpha_to_production:
    requirements:
      - qa_approved
      - no_critical_bugs
      - performance_tests_passed
      - security_review
    approval: [tech-lead, product-owner, security]
```

---

## ✅ CRITICAL INVARIANTS

1. **Production stability** — production branch всегда stable
2. **Alpha isolation** — alpha отделена от production
3. **Working flexibility** — working позволяет active development
4. **Domain policy** — production требует домены, working не требует
5. **Technical nodes** — working имеет priority 1 technical nodes
6. **Access control** — каждая ветка имеет свой access level
7. **Release flow** — working → alpha → production
8. **Identity preservation** — production identity не теряется

---

## 📖 RELATED DOCUMENTS

- [BRANCH_TREE.md](../../nodes/BRANCH_TREE.md) — Branch tree documentation
- [ENV_PRODUCTION.md](../../nodes/ENV_PRODUCTION.md) — Production environment
- [ENV_ALPHA.md](../../nodes/ENV_ALPHA.md) — Alpha environment
- [ENV_WORKING.md](../../nodes/ENV_WORKING.md) — Working environment
- [DomainNodeContract.md](./DomainNodeContract.md) — Domain bindings
- [NODETREE_MANIFEST.json](../../nodes/NODETREE_MANIFEST.json) — Node registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
