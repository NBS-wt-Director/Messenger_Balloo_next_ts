---
title: Node Settings Contract
description: Канонический контракт настроек узлов Balloo — уровни, наследование, overrides
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - contract
  - settings
  - configuration
  - canonical
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/NODE_SETTINGS_MODEL.md
  - SUMMARY_DOCS/state/node-settings-map.json
  - SUMMARY_DOCS/nodes/technical/NODE_projectgeneralsettings_working.md
---

# 📋 NODE SETTINGS CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **спецификацию настроек** для всех узлов Balloo.

**Settings Surface** = совокупность конфигураций и переключателей, влияющих на поведение узла или связанных с ним узлов.

---

## 📊 SETTINGS HIERARCHY

### Levels

```
Level 1: PROJECT-GLOBAL    — projectgeneralsettings.working
Level 2: BRANCH-LEVEL      — ENV_PRODUCTION / ENV_ALPHA / ENV_WORKING
Level 3: NODE-LEVEL        — конкретный узел
Level 4: FEATURE-LEVEL     — feature flags, release toggles
Level 5: RUNTIME-LOCAL     — .env.local, process.env
Level 6: SECRET            — vault, secrets manager
Level 7: GENERATED         — kpdegen output
Level 8: DERIVED           — runtime calculations
```

### Inheritance

```
PROJECT-GLOBAL
    ↓ (inherits + can override)
BRANCH-LEVEL
    ↓ (inherits + can override)
NODE-LEVEL
    ↓ (inherits + can override)
FEATURE-LEVEL
    ↓ (inherits + can override)
RUNTIME-LOCAL
    ↓ (injected)
SECRET
    ↓ (computed)
GENERATED
    ↓ (computed)
DERIVED
```

---

## 🔑 CRITICAL PRINCIPLE

```yaml
principle: settings_source_of_truth
statement: projectgeneralsettings.working.balloo.su = canonical technical node for project-wide settings management in working environment
caveat: Но source of truth по структуре настроек должен быть в SUMMARY_DOCS/state и contracts, а не только в UI
enforcement:
  - UI manages settings
  - State files are source of truth
  - Contracts define structure
```

---

## 📋 SETTINGS DEFINITIONS

### 1. PROJECT-GLOBAL SETTINGS

```json
{
  "level": 1,
  "scope": "project-global",
  "authority": "projectgeneralsettings.working",
  "mutableBy": ["admin", "owner"],
  "auditRequired": true,
  "settings": {
    "project.name": {
      "type": "string",
      "default": "Balloo",
      "description": "Название проекта"
    },
    "project.version": {
      "type": "semver",
      "default": "3.1.0",
      "description": "Текущая версия проекта"
    },
    "project.branch": {
      "type": "enum",
      "values": ["production", "alpha", "working"],
      "description": "Активная ветка"
    },
    "project.timezone": {
      "type": "string",
      "default": "UTC",
      "description": "Default timezone"
    },
    "project.locale": {
      "type": "string",
      "default": "ru",
      "description": "Default locale"
    },
    "project.features.enabled": {
      "type": "array",
      "description": "Globally enabled features"
    },
    "project.features.disabled": {
      "type": "array",
      "description": "Globally disabled features"
    }
  }
}
```

### 2. BRANCH-LEVEL SETTINGS

```json
{
  "level": 2,
  "scope": "branch-level",
  "authority": "ENV_[BRANCH]",
  "mutableBy": ["admin", "devops"],
  "auditRequired": true,
  "settings": {
    "branch.id": {
      "type": "enum",
      "values": ["production", "alpha", "working"],
      "description": "ID ветки"
    },
    "branch.domain_root": {
      "type": "string",
      "description": "Root domain ветки"
    },
    "branch.access_level": {
      "type": "enum",
      "values": ["public", "limited", "internal"],
      "description": "Уровень доступа"
    },
    "branch.debug_enabled": {
      "type": "boolean",
      "default": false,
      "description": "Debug mode flag"
    },
    "branch.logging_level": {
      "type": "enum",
      "values": ["debug", "info", "warn", "error"],
      "description": "Log level"
    },
    "branch.rate_limits": {
      "type": "object",
      "description": "Rate limiting config"
    },
    "branch.feature_flags": {
      "type": "object",
      "description": "Branch-specific flags"
    }
  }
}
```

### 3. NODE-LEVEL SETTINGS

```json
{
  "level": 3,
  "scope": "node-level",
  "authority": "node_owner",
  "mutableBy": ["admin", "node-owner"],
  "auditRequired": false,
  "settings": {
    "node.id": {
      "type": "string",
      "description": "Node identifier"
    },
    "node.domain": {
      "type": "string",
      "description": "Node domain"
    },
    "node.port": {
      "type": "number",
      "description": "Runtime port"
    },
    "node.enabled": {
      "type": "boolean",
      "default": true,
      "description": "Node enabled flag"
    },
    "node.auth_required": {
      "type": "boolean",
      "description": "Auth requirement"
    },
    "node.rate_limit": {
      "type": "number",
      "description": "Node-specific rate limit"
    },
    "node.timeout_ms": {
      "type": "number",
      "description": "Request timeout"
    },
    "node.max_connections": {
      "type": "number",
      "description": "Max concurrent connections"
    }
  }
}
```

### 4. FEATURE-LEVEL SETTINGS

```json
{
  "level": 4,
  "scope": "feature-level",
  "authority": "projectgeneralsettings.working",
  "mutableBy": ["admin", "product-owner"],
  "auditRequired": true,
  "settings": {
    "features.ai_api.enabled": {
      "type": "boolean",
      "default": false,
      "versionScoped": "4.*",
      "description": "AI API feature flag"
    },
    "features.spifs_storage.enabled": {
      "type": "boolean",
      "default": false,
      "status": "planned",
      "description": "SPiFS storage flag"
    },
    "features.premium_attachments.enabled": {
      "type": "boolean",
      "description": "Premium attachments"
    },
    "releases.v4.rollout_percentage": {
      "type": "number",
      "min": 0,
      "max": 100,
      "description": "v4 rollout %"
    },
    "releases.v4.target_branches": {
      "type": "array",
      "description": "Target branches for v4"
    }
  }
}
```

### 5. RUNTIME-LOCAL SETTINGS

```json
{
  "level": 5,
  "scope": "runtime-local",
  "authority": "runtime_environment",
  "mutableBy": ["devops", "runtime"],
  "auditRequired": false,
  "ephemeral": true,
  "settings": {
    "PORT": {
      "type": "number",
      "description": "Runtime port override"
    },
    "NODE_ENV": {
      "type": "enum",
      "values": ["development", "production", "test"],
      "description": "Runtime environment"
    },
    "LOG_LEVEL": {
      "type": "enum",
      "values": ["debug", "info", "warn", "error"],
      "description": "Runtime log level"
    },
    "DEBUG": {
      "type": "boolean",
      "description": "Debug mode override"
    },
    "HOST": {
      "type": "string",
      "description": "Bind host override"
    }
  }
}
```

### 6. SECRET SETTINGS

```json
{
  "level": 6,
  "scope": "secret",
  "authority": "secrets_manager",
  "mutableBy": ["admin", "security-owner"],
  "auditRequired": true,
  "encryptionRequired": true,
  "neverLog": true,
  "neverCommit": true,
  "settings": {
    "secrets.database.password": {
      "type": "string",
      "description": "Database password"
    },
    "secrets.api.keys.*": {
      "type": "string",
      "description": "API keys"
    },
    "secrets.oauth.client_secret": {
      "type": "string",
      "description": "OAuth client secret"
    },
    "secrets.jwt.private_key": {
      "type": "string",
      "description": "JWT signing key"
    },
    "secrets.encryption.master_key": {
      "type": "string",
      "description": "Master encryption key"
    }
  }
}
```

### 7. GENERATED SETTINGS

```json
{
  "level": 7,
  "scope": "generated",
  "authority": "codegen_system",
  "mutableBy": ["codegen-system"],
  "auditRequired": true,
  "settings": {
    "generated.config.version": {
      "type": "string",
      "description": "Generated config version"
    },
    "generated.codegen.timestamp": {
      "type": "timestamp",
      "description": "Codegen run timestamp"
    },
    "generated.node.manifest_hash": {
      "type": "string",
      "description": "Manifest hash"
    },
    "generated.routing.rules": {
      "type": "array",
      "description": "Auto-generated routing"
    }
  }
}
```

### 8. DERIVED SETTINGS

```json
{
  "level": 8,
  "scope": "derived",
  "authority": "runtime_system",
  "mutableBy": ["runtime-system"],
  "auditRequired": false,
  "computation": "dynamic",
  "settings": {
    "derived.effective_rate_limit": {
      "type": "number",
      "description": "Computed from branch + node"
    },
    "derived.effective_timeout": {
      "type": "number",
      "description": "Computed timeout"
    },
    "derived.feature_availability": {
      "type": "object",
      "description": "Computed feature state"
    },
    "derived.routing_priority": {
      "type": "number",
      "description": "Computed routing priority"
    }
  }
}
```

---

## 🔄 OVERRIDE RULES

### Priority Order (Highest to Lowest)

1. **RUNTIME-LOCAL** (highest)
2. **FEATURE-LEVEL**
3. **NODE-LEVEL**
4. **BRANCH-LEVEL**
5. **PROJECT-GLOBAL** (lowest)

### Conflict Resolution

```yaml
conflict_resolution:
  strategy: lowest_level_wins
  exceptions:
    - secrets_always_injected
    - generated_always_recomputed
    - derived_always_recalculated
  logging: required_for_overrides
  audit: required_for_L1_L4_overrides
```

### Example

```yaml
# Project global
project.rate_limit: 1000

# Branch override (working)
branch.rate_limit: 500

# Node override (api-working)
node.rate_limit: 200

# Runtime local
runtime.rate_limit: 100

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

- [NODE_SETTINGS_MODEL.md](../../nodes/NODE_SETTINGS_MODEL.md) — Settings model documentation
- [node-settings-map.json](../../state/node-settings-map.json) — Settings registry
- [NODE_projectgeneralsettings_working.md](../../nodes/technical/NODE_projectgeneralsettings_working.md) — Settings authority node
- [NODE_CODEGEN_MODEL.md](../../nodes/NODE_CODEGEN_MODEL.md) — Codegen model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
