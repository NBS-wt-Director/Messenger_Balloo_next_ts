---
title: Node Release Contract
description: Канонический контракт релизов узлов Balloo — working → alpha → production flow
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - contract
  - releases
  - rollout
  - canonical
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/BRANCH_TREE.md
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
  - SUMMARY_DOCS/nodes/technical/NODE_nodes_switcher_working.md
---

# 📋 NODE RELEASE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **спецификацию релизов** для всех узлов Balloo.

**Release Flow** = как узлы движутся через working → alpha → production.

---

## 📊 RELEASE FLOW

### Overview

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│ WORKING  │ ───► │  ALPHA   │ ───► │PRODUCTION│
│          │      │          │      │          │
│ Develop  │      │  Test    │      │ Release  │
│ Integrate│      │ Validate │      │  Stable  │
│  (15)    │      │   (3)    │      │   (11)   │
└──────────┘      └──────────┘      └──────────┘
```

### Release Stages

| Stage | Branch | Nodes | Purpose |
|-------|--------|-------|---------|
| 1 | working | 15 | Development & Integration |
| 2 | alpha | 3 | Testing & Validation |
| 3 | production | 11 | Stable Release |

---

## 🔄 NODE TRANSITIONS

### Working → Alpha

```yaml
transition:
  from: working
  to: alpha
  requirements:
    - feature_complete: true
    - ci_cd_passed: true
    - docs_updated: true
    - working_tests_passed: true
  approval:
    - tech_lead
    - product_owner
  automation:
    - nodes_switcher_triggered: true
    - version_tagged: true
```

### Alpha → Production

```yaml
transition:
  from: alpha
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
  automation:
    - nodes_switcher_triggered: true
    - version_tagged: true
    - release_notes_generated: true
```

---

## 📋 NODE AVAILABILITY BY BRANCH

### Nodes Only in Working

```yaml
working_only:
  - workdocs-working ⭐
  - nodes-switcher-working ⭐
  - kpdegen-working ⭐
  - projectgeneralsettings-working ⭐
  - database-working ⭐
  - pilot-future-working
rationale: Technical nodes for development and automation
```

### Nodes with Alpha Analogs

```yaml
with_alpha:
  - working-root → alpha-root
  - apps-working → apps-alpha
  - future-working → 2commands-alpha (experimental)
mapping:
  working.balloo.su → alpha.balloo.su
  apps.working.balloo.su → apps.alpha.balloo.su
```

### Nodes Only Production-Facing

```yaml
production_only:
  - client-apps-family (android, ios, windows, linux, macos)
  - docs-production (public docs)
  - abaut-production (public about)
rationale: Public-facing content and client apps
```

---

## ✅ REQUIRED NODES FOR RELEASE

### Mandatory Production Nodes

```yaml
mandatory_for_production_release:
  - balloo-production-root
  - api-production
  - files-production
  - admin-production
rationale: Core functionality required for production
```

### Optional Production Nodes

```yaml
optional_for_production_release:
  - ai-api-production (v4.*, planned)
  - future-production
  - workers-production
rationale: Enhanced features, can be deferred
```

### Technical Priority Nodes

```yaml
priority_1_technical:
  - workdocs-working ⭐
  - nodes-switcher-working ⭐
  - kpdegen-working ⭐
  - projectgeneralsettings-working ⭐
  - database-working ⭐
rationale: Enable automation and codegen
```

---

## 🎯 AUTOMATION PRIORITY

### Priority 1: Technical Working Nodes

```yaml
priority: 1
nodes:
  - workdocs-working
  - nodes-switcher-working
  - kpdegen-working
  - projectgeneralsettings-working
  - database-working
automation_focus:
  - codegen_enabled: true
  - full_contract_spec: true
  - config_generation: all_environments
  - docs_generation: required
  - infrastructure_as_code: required
```

### Priority 2: Other Working Nodes

```yaml
priority: 2
nodes:
  - api-working
  - files-working
  - docs-working
  - admin-working
  - workers-working
  - apps-working
automation_focus:
  - codegen_enabled: true
  - config_generation: working_and_prod
  - docs_generation: basic
```

### Priority 3: Alpha Nodes

```yaml
priority: 3
nodes:
  - alpha-root
  - apps-alpha
  - 2commands-alpha
automation_focus:
  - config_generation: from_working
  - minimal_code_changes: true
  - testing_focused: true
```

### Priority 4: Production Public Nodes

```yaml
priority: 4
nodes:
  - All production nodes
automation_focus:
  - stable_code: true
  - production_config: required
  - full_docs: required
  - production_iac: required
```

---

## 📊 RELEASE STATUS TRACKING

### Node Release Status Schema

```json
{
  "nodeId": "api-working",
  "releaseStatus": {
    "working": {
      "status": "active",
      "version": "3.1.0",
      "lastUpdated": "2026-06-13T10:00:00Z"
    },
    "alpha": {
      "status": "not_applicable",
      "note": "Node not deployed to alpha"
    },
    "production": {
      "status": "deployed",
      "version": "3.0.5",
      "lastUpdated": "2026-06-10T15:00:00Z"
    }
  }
}
```

### Version Tracking

```yaml
version_tracking:
  enabled: true
  managed_by: nodes-switcher-working
  semantic_versioning: true
  changelog_required: true
  rollback_support: true
```

---

## 🔀 ROLLOVER MANAGEMENT

### Rollout Control

```yaml
rollout:
  managed_by: nodes-switcher-working
  strategies:
    - blue_green
    - canary
    - phased
  requirements:
    - health_checks: passed
    - compatibility_checks: passed
    - rollback_plan: defined
```

### Compatibility Checks

```yaml
compatibility:
  pre_deploy:
    - api_compatibility: checked
    - database_migrations: reviewed
    - config_compatibility: validated
  post_deploy:
    - smoke_tests: passed
    - monitoring: enabled
    - alerting: configured
```

---

## ✅ CRITICAL INVARIANTS

1. **Release flow**: working → alpha → production
2. **Technical nodes only in working** — workdocs, nodes-switcher, kpdegen, projectgeneralsettings, database
3. **Alpha has limited nodes** — only testing-focused
4. **Production has stable nodes** — only tested and approved
5. **Priority 1 technical nodes** — highest automation priority
6. **Version tracking required** — nodes-switcher manages
7. **Rollback capability** — required for production
8. **Compatibility checks** — mandatory before deploy

---

## 📖 RELATED DOCUMENTS

- [BRANCH_TREE.md](../../nodes/BRANCH_TREE.md) — Branch tree documentation
- [NODETREE_MANIFEST.json](../../nodes/NODETREE_MANIFEST.json) — Node registry
- [NODE_nodes_switcher_working.md](../../nodes/technical/NODE_nodes_switcher_working.md) — Rollout control node
- [NODE_CODEGEN_MODEL.md](../../nodes/NODE_CODEGEN_MODEL.md) — Codegen model
- [NodeRoutingContract.md](./NodeRoutingContract.md) — Routing rules

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
