---
title: Node projectgeneralsettings.working.balloo.su
description: Технический узел управления настройками проекта Balloo — central settings UI/surface
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - technical-node
  - priority-1
  - working
  - settings
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/TechnicalNodeContract.md
  - SUMMARY_DOCS/nodes/contracts/NODE_CONTRACT_projectgeneralsettings_working.md
---

# ⚙️ NODE: projectgeneralsettings.working.balloo.su

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Priority 1 Technical Node  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

**projectgeneralsettings.working.balloo.su** — технический узел управления настройками проекта Balloo.

**Primary Purpose:** Управление всеми настройками других узлов, central settings UI/surface.

---

## 📊 NODE IDENTITY

| Параметр | Значение |
|----------|----------|
| **Node ID** | `projectgeneralsettings-working` |
| **Canonical Name** | `projectgeneralsettings.working.balloo.su` |
| **Branch** | `working` |
| **Type** | `technical-settings` |
| **Priority** | `1` ⭐ |
| **Technical** | `true` |

---

## 🌐 DOMAIN & ROUTING

### Production Identity

```
projectgeneralsettings.working.balloo.su
```

### Local Dev Identity

```
localhost:3212
http://localhost:3212
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

- ✅ Admin
- ✅ Owner
- ✅ Product Owner
- ❌ Public users

### Authentication

```yaml
auth:
  required: true
  method: oauth_or_password
  role_based_access: true
  mfa_recommended: true
  audit_logging: enabled
```

---

## 📦 FUNCTIONAL SURFACE

### Core Functions

1. **Project Settings Authority**
   - Центральное управление настройками проекта
   - Project-global settings
   - Version management

2. **Node Settings Map**
   - Реестр настроек всех узлов
   - Наследование и overrides
   - Conflict resolution

3. **Global vs Node-Local Settings**
   - Управление иерархией настроек
   - Inheritance enforcement
   - Override tracking

4. **Feature Flags**
   - Центральное управление feature flags
   - Rollout control
   - A/B testing support

5. **Release Toggles**
   - Управление release toggles
   - Branch-specific toggles
   - Version-scoped toggles

6. **Tariffs/Features** (if applicable)
   - Tariff-based feature controls
   - Entitlement tracking

---

## ⚙️ SETTINGS SURFACE

### Settings Scopes

```yaml
settings:
  scopes:
    - project-global
    - branch-level
    - node-level
    - feature-level
  mutable_by: [admin, owner, product-owner]
  audit_required: true
  includes:
    - project.*
    - branch.*
    - node.*
    - features.*
    - releases.*
```

### Key Settings

| Setting | Type | Scope | Description |
|---------|------|-------|-------------|
| `project.name` | string | project-global | Название проекта |
| `project.version` | semver | project-global | Версия проекта |
| `branch.debug_enabled` | boolean | branch-level | Debug mode |
| `node.rate_limit` | number | node-level | Rate limit |
| `features.ai_api.enabled` | boolean | feature-level | AI API flag |
| `releases.v4.rollout_percentage` | number | feature-level | v4 rollout % |

---

## 🔗 RELATIONS

### Relation to Codegen

```yaml
relation:
  type: settings_provider
  provides: settings_for_codegen
  consumed_by: kpdegen-working
  includes:
    - project_settings
    - branch_settings
    - node_settings
    - feature_flags
```

### Relation to Docs

```yaml
relation:
  type: documentation
  settings_documented: in_contracts
  source_of_truth: SUMMARY_DOCS/state
  ui: management_surface
```

### Relation to Rollout

```yaml
relation:
  type: feature_control
  feature_flags: managed
  release_toggles: managed
  rollout_percentage: controlled
```

### Related Nodes

- `nodes-switcher-working` — Rollout (coordinates)
- `admin-working` — Admin panel (related)
- `kpdegen-working` — Codegen (settings consumer)

---

## 🏃 RUNTIME MODEL

### Local Dev Mode

```yaml
local_dev:
  identity: localhost:3212
  url: http://localhost:3212
  domain_required: false
  auth: optional
```

### Working Mode

```yaml
working:
  identity: projectgeneralsettings.working.balloo.su
  url: https://projectgeneralsettings.working.balloo.su
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
src/nodes/projectgeneralsettings-working/
├── index.ts
├── routes.ts
├── handlers/
│   ├── project.ts
│   ├── branch.ts
│   ├── node.ts
│   ├── features.ts
│   └── releases.ts
├── services/
│   ├── settings-manager.ts
│   ├── inheritance-resolver.ts
│   └── conflict-resolver.ts
├── middleware/
│   ├── auth.ts
│   └── audit.ts
├── config.ts
└── types.ts
```

### Config Files

```
config/nodes/
├── projectgeneralsettings-working.dev.json
├── projectgeneralsettings-working.working.json
└── projectgeneralsettings-working.local.json
```

---

## 🤖 CODEGEN RELEVANCE

### Codegen Class

```
Class 1: Technical Core (Priority 1)
```

### Required Inputs

- `NODE_CONTRACT_projectgeneralsettings_working.md`
- `NODE_SUMMARY_projectgeneralsettings_working.md`
- `NODE_SETTINGS_MODEL.md`
- `NODE_SETTINGS_CONTRACT.md`

### Output Targets

- `src/nodes/projectgeneralsettings-working/`
- `config/nodes/projectgeneralsettings-working.*.json`
- `docs/nodes/projectgeneralsettings-working-*.md`
- `infra/nodes/projectgeneralsettings-working.*`

### Risk Level

```
Risk: High
Rationale: Central settings authority, affects all nodes
```

---

## ⚠️ SOURCE OF TRUTH NOTE

```
⚠️ projectgeneralsettings.working — UI/surface для управления
⚠️ Но source of truth по структуре настроек должен быть в:
   - SUMMARY_DOCS/state/node-settings-map.json
   - SUMMARY_DOCS/contracts/nodes/NodeSettingsContract.md
   - Не только в UI
```

---

## ✅ INVARIANTS

1. **project settings authority** — central settings management
2. **node settings map** — registry of all node settings
3. **global vs node-local settings** — hierarchy management
4. **feature flags** — central feature flag management
5. **release toggles** — release control
6. **tariffs/features if applicable** — tariff-based controls
7. **working branch only** — not in alpha/production
8. **domainRequired = false** — localhost OK
9. **source of truth in state files** — not only in UI

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../NODETREE_INDEX.md) — Node tree index
- [TechnicalNodeContract.md](../../contracts/nodes/TechnicalNodeContract.md) — Technical contract
- [NODE_CONTRACT_projectgeneralsettings_working.md](../contracts/NODE_CONTRACT_projectgeneralsettings_working.md) — Node contract
- [NODE_SETTINGS_MODEL.md](../NODE_SETTINGS_MODEL.md) — Settings model
- [NodeSettingsContract.md](../../contracts/nodes/NodeSettingsContract.md) — Settings contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Priority 1 Technical Node  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
