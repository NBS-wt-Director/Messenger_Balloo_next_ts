---
title: Node Settings Model
description: Каноническая модель настроек узлов Balloo — уровни, наследование, overrides
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - settings
  - configuration
  - canonical
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/NodeSettingsContract.md
  - SUMMARY_DOCS/state/node-settings-map.json
---

# ⚙️ NODE SETTINGS MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **каноническую модель настроек** для всех узлов Balloo.

**Settings Surface** = совокупность конфигураций и переключателей, влияющих на поведение узла или связанных с ним узлов.

---

## 📊 УРОВНИ НАСТРОЕК

```
┌─────────────────────────────────────────────────────────┐
│              SETTINGS HIERARCHY                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Level 1: PROJECT-GLOBAL                                 │
│  └── Общие настройки всего проекта                       │
│       └─ projectgeneralsettings.working ⭐              │
│                                                          │
│  Level 2: BRANCH-LEVEL                                   │
│  └── Настройки конкретной ветки (prod/alpha/working)    │
│       └─ ENV_PRODUCTION / ENV_ALPHA / ENV_WORKING       │
│                                                          │
│  Level 3: NODE-LEVEL                                     │
│  └── Настройки конкретного узла                          │
│       └─ api.balloo.su, files.working, etc.             │
│                                                          │
│  Level 4: FEATURE-LEVEL                                  │
│  └── Feature flags и release toggles                     │
│       └─ feature flags, beta toggles                    │
│                                                          │
│  Level 5: RUNTIME-LOCAL                                  │
│  └── Локальные runtime overrides                         │
│       └─ .env.local, process.env                        │
│                                                          │
│  Level 6: SECRET                                         │
│  └── Секретные настройки (tokens, keys, passwords)       │
│       └─ Vault, secrets manager, .env.secret            │
│                                                          │
│  Level 7: GENERATED                                      │
│  └── Сгенерированные настройки (codegen output)          │
│       └─ kpdegen output, auto-generated configs         │
│                                                          │
│  Level 8: DERIVED                                        │
│  └── Вычисленные настройки (derived from other levels)   │
│       └─ runtime calculations, dynamic values           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ УРОВЕНЬ 1: PROJECT-GLOBAL

### Описание

Глобальные настройки всего проекта Balloo.

### Источник

**Canonical Source:** `projectgeneralsettings.working.balloo.su`

### Примеры настроек

| Setting | Type | Description |
|---------|------|-------------|
| `project.name` | string | Название проекта |
| `project.version` | semver | Текущая версия проекта |
| `project.branch` | enum | Активная ветка (production/alpha/working) |
| `project.timezone` | string | Default timezone |
| `project.locale` | string | Default locale |
| `project.features.enabled` | array | Globally enabled features |
| `project.features.disabled` | array | Globally disabled features |

### Наследование

```
PROJECT-GLOBAL
    ↓
    BRANCH-LEVEL (может переопределить)
    ↓
    NODE-LEVEL (может переопределить)
```

### Override Rules

```yaml
project_global:
  mutable_by: [admin, owner]
  override_allowed: true
  override_levels: [branch, node]
  audit_required: true
```

---

## 🌿 УРОВЕНЬ 2: BRANCH-LEVEL

### Описание

Настройки конкретной ветки (production, alpha, working).

### Источники

- `ENV_PRODUCTION.md` — production settings
- `ENV_ALPHA.md` — alpha settings
- `ENV_WORKING.md` — working settings

### Примеры настроек

| Setting | Type | Description |
|---------|------|-------------|
| `branch.id` | enum | production / alpha / working |
| `branch.domain_root` | string | Root domain ветки |
| `branch.access_level` | enum | public / limited / internal |
| `branch.debug_enabled` | boolean | Debug mode flag |
| `branch.logging_level` | enum | debug / info / warn / error |
| `branch.rate_limits` | object | Rate limiting config |
| `branch.feature_flags` | object | Branch-specific flags |

### Наследование

```
PROJECT-GLOBAL
    ↓
    BRANCH-LEVEL (inherits + can override project-global)
    ↓
    NODE-LEVEL
```

### Override Rules

```yaml
branch_level:
  mutable_by: [admin, devops]
  override_allowed: true
  override_levels: [node]
  audit_required: true
  branch_isolation: true
```

---

## 🔧 УРОВЕНЬ 3: NODE-LEVEL

### Описание

Настройки конкретного узла.

### Источники

- Node contract (`NODE_CONTRACT_<node-id>.md`)
- Node summary (`NODE_SUMMARY_<node-id>.md`)
- `node-settings-map.json`

### Примеры настроек (для api.working.balloo.su)

| Setting | Type | Description |
|---------|------|-------------|
| `node.id` | string | Node identifier |
| `node.domain` | string | Node domain |
| `node.port` | number | Runtime port |
| `node.enabled` | boolean | Node enabled flag |
| `node.auth_required` | boolean | Auth requirement |
| `node.rate_limit` | number | Node-specific rate limit |
| `node.timeout_ms` | number | Request timeout |
| `node.max_connections` | number | Max concurrent connections |

### Наследование

```
PROJECT-GLOBAL
    ↓
    BRANCH-LEVEL
    ↓
    NODE-LEVEL (inherits + can override branch)
    ↓
    FEATURE-LEVEL
```

### Override Rules

```yaml
node_level:
  mutable_by: [admin, node-owner]
  override_allowed: true
  override_levels: [feature, runtime-local]
  audit_required: false
  node_isolation: true
```

---

## 🚩 УРОВЕНЬ 4: FEATURE-LEVEL

### Описание

Feature flags и release toggles.

### Источники

- `projectgeneralsettings.working.balloo.su` — central feature flags UI
- `nodes-switcher.working.balloo.su` — rollout control

### Примеры настроек

| Setting | Type | Description |
|---------|------|-------------|
| `features.ai_api.enabled` | boolean | AI API feature flag |
| `features.spifs_storage.enabled` | boolean | SPiFS storage flag |
| `features.premium_attachments.enabled` | boolean | Premium attachments |
| `releases.v4.rollout_percentage` | number | v4 rollout % |
| `releases.v4.target_branches` | array | Target branches for v4 |

### Наследование

```
PROJECT-GLOBAL
    ↓
    BRANCH-LEVEL
    ↓
    NODE-LEVEL
    ↓
    FEATURE-LEVEL (inherits + can override node)
    ↓
    RUNTIME-LOCAL
```

### Override Rules

```yaml
feature_level:
  mutable_by: [admin, product-owner]
  override_allowed: true
  override_levels: [runtime-local]
  audit_required: true
  rollout_control: true
```

---

## 🖥️ УРОВЕНЬ 5: RUNTIME-LOCAL

### Описание

Локальные runtime overrides (development, deployment-specific).

### Источники

- `.env.local`
- `.env.production`
- `.env.working`
- `process.env`
- Docker env vars

### Примеры настроек

| Setting | Type | Description |
|---------|------|-------------|
| `PORT` | number | Runtime port override |
| `NODE_ENV` | enum | development / production / test |
| `LOG_LEVEL` | enum | Runtime log level |
| `DEBUG` | boolean | Debug mode override |
| `HOST` | string | Bind host override |

### Наследование

```
PROJECT-GLOBAL
    ↓
    BRANCH-LEVEL
    ↓
    NODE-LEVEL
    ↓
    FEATURE-LEVEL
    ↓
    RUNTIME-LOCAL (inherits + can override all above for this runtime)
```

### Override Rules

```yaml
runtime_local:
  mutable_by: [devops, runtime]
  override_allowed: true
  override_levels: []
  audit_required: false
  ephemeral: true
```

---

## 🔐 УРОВЕНЬ 6: SECRET

### Описание

Секретные настройки (tokens, keys, passwords).

### Источники

- Vault / secrets manager
- `.env.secret` (не коммитится)
- Kubernetes secrets
- AWS Secrets Manager

### Примеры настроек

| Setting | Type | Description |
|---------|------|-------------|
| `secrets.database.password` | string | Database password |
| `secrets.api.keys.*` | string | API keys |
| `secrets.oauth.client_secret` | string | OAuth client secret |
| `secrets.jwt.private_key` | string | JWT signing key |
| `secrets.encryption.master_key` | string | Master encryption key |

### Наследование

```
Secrets НЕ наследуются явно
Inject-ятся в runtime через secrets manager
Доступ контролируется на уровне node/branch
```

### Security Rules

```yaml
secret:
  mutable_by: [admin, security-owner]
  override_allowed: false
  audit_required: true
  encryption_required: true
  never_log: true
  never_commit: true
```

---

## 🤖 УРОВЕНЬ 7: GENERATED

### Описание

Сгенерированные настройки (codegen output).

### Источники

- `kpdegen.working.balloo.su` — codegen output
- Auto-generated configs
- Build-time generation

### Примеры настроек

| Setting | Type | Description |
|---------|------|-------------|
| `generated.config.version` | string | Generated config version |
| `generated.codegen.timestamp` | timestamp | Codegen run timestamp |
| `generated.node.manifest_hash` | string | Manifest hash |
| `generated.routing.rules` | array | Auto-generated routing |

### Наследование

```
GENERED настройки не наследуются
Они вычисляются из других уровней
Записываются в runtime config
```

### Generation Rules

```yaml
generated:
  mutable_by: [codegen-system]
  override_allowed: false
  audit_required: true
  regeneration_trigger: [manifest-change, contract-change]
  source_of_truth: [contracts, state-files]
```

---

## 📐 УРОВЕНЬ 8: DERIVED

### Описание

Вычисленные настройки (derived from other levels).

### Источники

- Runtime calculations
- Dynamic value computation
- Aggregated settings

### Примеры настроек

| Setting | Type | Description |
|---------|------|-------------|
| `derived.effective_rate_limit` | number | Computed from branch + node |
| `derived.effective_timeout` | number | Computed timeout |
| `derived.feature_availability` | object | Computed feature state |
| `derived.routing_priority` | number | Computed routing priority |

### Вычисление

```
DERIVED = f(PROJECT-GLOBAL, BRANCH-LEVEL, NODE-LEVEL, FEATURE-LEVEL)
```

### Computation Rules

```yaml
derived:
  mutable_by: [runtime-system]
  override_allowed: false
  audit_required: false
  computation: dynamic
  caching: recommended
```

---

## 🔄 INHERITANCE MODEL

### Full Inheritance Chain

```
┌─────────────────────┐
│  PROJECT-GLOBAL     │ ← Level 1 (base)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   BRANCH-LEVEL      │ ← Level 2 (inherits L1, can override)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│    NODE-LEVEL       │ ← Level 3 (inherits L1+L2, can override)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   FEATURE-LEVEL     │ ← Level 4 (inherits L1-L3, can override)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  RUNTIME-LOCAL      │ ← Level 5 (inherits L1-L4, can override)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│     SECRET          │ ← Level 6 (injected, not inherited)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│    GENERATED        │ ← Level 7 (computed from contracts)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│     DERIVED         │ ← Level 8 (computed at runtime)
└─────────────────────┘
```

### Inheritance Rules

```yaml
inheritance:
  direction: top-down
  override_direction: bottom-up
  conflict_resolution: lowest-wins
  audit_trail: required-for-L1-L4
  caching: recommended-for-derived
```

---

## ⚔️ CONFLICT RESOLUTION

### Priority Order (Highest to Lowest)

1. **RUNTIME-LOCAL** (highest — most specific)
2. **FEATURE-LEVEL**
3. **NODE-LEVEL**
4. **BRANCH-LEVEL**
5. **PROJECT-GLOBAL** (lowest — most general)

### Resolution Rules

```yaml
conflict_resolution:
  strategy: lowest-level-wins
  exception: secrets-always-injected
  exception: generated-always-recomputed
  exception: derived-always-recalculated
  logging: required-for-overrides
  audit: required-for-L1-L4-overrides
```

### Example

```yaml
# Project global
project:
  rate_limit: 1000

# Branch override (working)
branch:
  rate_limit: 500  # ← overrides project

# Node override (api-working)
node:
  rate_limit: 200  # ← overrides branch

# Runtime local
runtime:
  rate_limit: 100  # ← overrides node (HIGHEST PRIORITY)

# Effective value: 100
```

---

## 🔍 AUDITABILITY

### Audit Requirements

| Level | Audit Required | Logged By |
|-------|---------------|-----------|
| PROJECT-GLOBAL | ✅ Yes | Admin actions |
| BRANCH-LEVEL | ✅ Yes | DevOps actions |
| NODE-LEVEL | ❌ No (recommended) | Node owner |
| FEATURE-LEVEL | ✅ Yes | Product owner |
| RUNTIME-LOCAL | ❌ No | Ephemeral |
| SECRET | ✅ Yes | Security system |
| GENERATED | ✅ Yes | Codegen system |
| DERIVED | ❌ No | Computed |

### Audit Log Schema

```json
{
  "timestamp": "2026-06-13T10:00:00Z",
  "level": "PROJECT-GLOBAL",
  "setting": "project.name",
  "old_value": "Balloo Old",
  "new_value": "Balloo",
  "changed_by": "admin-user-id",
  "reason": "Rebranding"
}
```

---

## 🎯 PROJECTGENERALSETTINGS.WORKING

### Canonical Settings Authority

`projectgeneralsettings.working.balloo.su` — **canonical technical node** для управления настройками проекта.

### Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Project settings authority | Central source for project-global settings |
| Node settings map | Registry of all node-level settings |
| Global vs node-local | Manages inheritance and overrides |
| Feature flags | Central feature flag management |
| Release toggles | Release control and rollout |
| Tariffs/features | Tariff-based feature controls (if applicable) |

### Relation to Source of Truth

```
⚠️ projectgeneralsettings.working — UI/surface для управления
⚠️ Но source of truth по структуре настроек должен быть в:
   - SUMMARY_DOCS/state/node-settings-map.json
   - SUMMARY_DOCS/contracts/nodes/NodeSettingsContract.md
   - Не только в UI
```

---

## ✅ CRITICAL INVARIANTS

1. **Наследование top-down** — от project-global к runtime-local
2. **Override bottom-up** — runtime-local имеет высший приоритет
3. **Secrets не коммитятся** — всегда через secrets manager
4. **Generated вычисляются** — из contracts и state files
5. **Derived динамические** — recalculated at runtime
6. **Audit для L1-L4** — обязательный audit trail
7. **projectgeneralsettings.working** — canonical UI, не единственный source of truth

---

## 📖 RELATED DOCUMENTS

- [NodeSettingsContract.md](../contracts/nodes/NodeSettingsContract.md) — Settings contract spec
- [node-settings-map.json](../state/node-settings-map.json) — Settings registry
- [NODE_CODEGEN_MODEL.md](./NODE_CODEGEN_MODEL.md) — Codegen model
- [ENV_WORKING.md](./ENV_WORKING.md) — Working environment settings
- [NODE_workdocs_working.md](./technical/NODE_workdocs_working.md) — Workdocs technical node

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
