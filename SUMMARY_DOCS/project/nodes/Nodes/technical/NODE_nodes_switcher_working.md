---
title: Node nodes-switcher.working.balloo.su
description: Технический узел менеджера версий узлов Balloo — rollout control, version registry
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - technical-node
  - priority-1
  - working
  - orchestration
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/TechnicalNodeContract.md
  - SUMMARY_DOCS/nodes/contracts/NODE_CONTRACT_nodes_switcher_working.md
---

# 🔄 NODE: nodes-switcher.working.balloo.su

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Priority 1 Technical Node  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

**nodes-switcher.working.balloo.su** — технический узел менеджера версий узлов Balloo.

**Primary Purpose:** Отслеживание версий узлов, менеджер обновлений, переключение версий узлов.

---

## 📊 NODE IDENTITY

| Параметр | Значение |
|----------|----------|
| **Node ID** | `nodes-switcher-working` |
| **Canonical Name** | `nodes-switcher.working.balloo.su` |
| **Branch** | `working` |
| **Type** | `technical-orchestration` |
| **Priority** | `1` ⭐ |
| **Technical** | `true` |

---

## 🌐 DOMAIN & ROUTING

### Production Identity

```
nodes-switcher.working.balloo.su
```

### Local Dev Identity

```
localhost:3211
http://localhost:3211
```

### Domain Policy

```yaml
domain_required: false
can_use_localhost: true
can_use_working_domain: true
production_identity_preserved: true
```

---

## 🔐 ACCESS & AUTH

### Allowed Users

- ✅ Developers
- ✅ DevOps
- ✅ Admin
- ❌ Public users

### Authentication

```yaml
auth:
  required: true
  method: token_based
  role_based_access: true
  audit_logging: enabled
```

---

## 📦 FUNCTIONAL SURFACE

### Core Functions

1. **Node Version Registry**
   - Реестр версий всех узлов
   - Отслеживание изменений
   - История версий

2. **Rollout Control**
   - Управление развертыванием
   - Phased rollout
   - Canary deployments
   - Rollback support

3. **Compatibility Checks**
   - Проверка совместимости версий
   - Dependency validation
   - Breaking changes detection

4. **Update Orchestration Role**
   - Оркестрация обновлений узлов
   - Координация с kpdegen
   - Health checks

---

## ⚙️ SETTINGS SURFACE

### Settings Scopes

```yaml
settings:
  scopes:
    - node-level
    - version-registry
    - rollout-control
  mutable_by: [devops, admin]
  includes:
    - version.registry
    - rollout.strategy
    - compatibility.checks
    - health.checks
```

### Key Settings

| Setting | Type | Description |
|---------|------|-------------|
| `version.registry` | object | Version registry config |
| `rollout.strategy` | enum | blue_green / canary / phased |
| `compatibility.checks` | boolean | Enable compatibility checks |
| `health.checks.enabled` | boolean | Enable health checks |
| `rollback.auto` | boolean | Auto rollback on failure |

---

## 🔗 RELATIONS

### Relation to Codegen

```yaml
relation:
  type: trigger
  triggers: node_version_changes
  coordinates: with_kpdegen
  validates: compatibility_before_deploy
```

### Relation to Docs

```yaml
relation:
  type: documentation
  version_documentation: auto_generated
  changelog: maintained
  release_notes: generated
```

### Relation to Rollout

```yaml
relation:
  type: orchestration
  role: primary_orchestrator
  compatibility_checks: required
  rollback_support: enabled
  phased_rollout: supported
```

### Related Nodes

- `kpdegen-working` — Codegen system (coordinates)
- `projectgeneralsettings-working` — Settings (consumer)
- `workdocs-working` — Docs (updates)

---

## 🏃 RUNTIME MODEL

### Local Dev Mode

```yaml
local_dev:
  identity: localhost:3211
  url: http://localhost:3211
  domain_required: false
  auth: optional
```

### Working Mode

```yaml
working:
  identity: nodes-switcher.working.balloo.su
  url: https://nodes-switcher.working.balloo.su
  domain_required: false
  auth: required
```

### Alpha/Production

```yaml
alpha: not_available
production: not_available
rationale: Technical node, working only
```

---

## 📁 FILE STRUCTURE

### Expected Structure

```
src/nodes/nodes-switcher-working/
├── index.ts
├── routes.ts
├── handlers/
│   ├── versions.ts
│   ├── rollout.ts
│   ├── compatibility.ts
│   └── health.ts
├── services/
│   ├── version-registry.ts
│   ├── rollout-manager.ts
│   └── compatibility-checker.ts
├── config.ts
└── types.ts
```

### Config Files

```
config/nodes/
├── nodes-switcher-working.dev.json
├── nodes-switcher-working.working.json
└── nodes-switcher-working.local.json
```

---

## 🤖 CODEGEN RELEVANCE

### Codegen Class

```
Class 1: Technical Core (Priority 1)
```

### Required Inputs

- `NODE_CONTRACT_nodes_switcher_working.md`
- `NODE_SUMMARY_nodes_switcher_working.md`
- `NODE_SETTINGS_MODEL.md`
- `NODE_RUNTIME_MODEL.md`
- `NODE_RELEASE_CONTRACT.md`

### Output Targets

- `src/nodes/nodes-switcher-working/`
- `config/nodes/nodes-switcher-working.*.json`
- `docs/nodes/nodes-switcher-working-*.md`
- `infra/nodes/nodes-switcher-working.*`

### Risk Level

```
Risk: Medium
Rationale: Orchestration node, affects deployments
```

---

## ✅ INVARIANTS

1. **node version registry** — central version tracking
2. **rollout control** — deployment orchestration
3. **compatibility checks** — required before deploy
4. **update orchestration role** — coordinates updates
5. **working branch only** — not in alpha/production
6. **domainRequired = false** — localhost OK
7. **production identity preserved** — logical identity maintained

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../NODETREE_INDEX.md) — Node tree index
- [TechnicalNodeContract.md](../../contracts/nodes/TechnicalNodeContract.md) — Technical contract
- [NODE_CONTRACT_nodes_switcher_working.md](../contracts/NODE_CONTRACT_nodes_switcher_working.md) — Node contract
- [NODE_CODEGEN_MODEL.md](../NODE_CODEGEN_MODEL.md) — Codegen model
- [NodeReleaseContract.md](../../contracts/nodes/NodeReleaseContract.md) — Release contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Priority 1 Technical Node  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
