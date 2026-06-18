---
title: Node Environment Contract
description: Канонический контракт сред выполнения узлов Balloo — local/dev, working, alpha, production
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - contract
  - environments
  - runtime
  - canonical
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/NODE_RUNTIME_MODEL.md
  - SUMMARY_DOCS/nodes/ENV_WORKING.md
  - SUMMARY_DOCS/nodes/ENV_ALPHA.md
  - SUMMARY_DOCS/nodes/ENV_PRODUCTION.md
---

# 📋 NODE ENVIRONMENT CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **спецификацию сред выполнения** для всех узлов Balloo.

**Node Environment** = поведение узла в различных средах выполнения (local/dev, working, alpha, production).

---

## 📊 ENVIRONMENT MODES

### Overview

| Mode | Domain Required | Audience | Purpose |
|------|-----------------|----------|---------|
| local/dev | ❌ No | Developers | Development and testing |
| working | ❌ No (optional) | Internal | Integration and automation |
| alpha | ✅ Yes (alpha) | Testers | Pre-production testing |
| production | ✅ Yes (production) | Public | Stable production service |

---

## 🔑 CRITICAL PRINCIPLES

### 1. Local/Dev Mode Without Domains

```yaml
principle: local_dev_without_domains
statement: local/dev mode runs without real domains
rationale: Local development should not depend on DNS configuration
enforcement:
  - localDevRequiredDomain = false для всех узлов
  - localhost routing available
  - port-based identity
```

### 2. Working Mode Flexibility

```yaml
principle: working_flexibility
statement: working mode runs with optional domains
rationale: Development integration needs flexibility
enforcement:
  - can use localhost or working.balloo.su
  - internal routing supported
  - domain not required
```

### 3. Alpha Mode With Domains

```yaml
principle: alpha_with_domains
statement: alpha mode runs with assigned alpha domains
rationale: Alpha testing requires isolated environment
enforcement:
  - alpha.balloo.su required
  - separate from production
  - limited access
```

### 4. Production Mode With Domains

```yaml
principle: production_with_domains
statement: production mode runs with canonical production domains
rationale: Production identity requires stable, public domains
enforcement:
  - balloo.su required
  - SSL/TLS mandatory
  - public accessibility
```

### 5. Codegen Domain Agnosticism

```yaml
principle: codegen_domain_agnosticism
statement: codegen MUST generate domain-agnostic dev config and domain-bound prod config
rationale: Different environments have different domain requirements
enforcement:
  - dev config: localhost ports
  - prod config: canonical domains
  - same logical identity
```

### 6. Logical Identity Preservation

```yaml
principle: logical_identity_preservation
statement: узлы должны иметь logical identity и environment-specific runtime mapping
rationale: Logical identity is separate from runtime target
enforcement:
  - nodeId preserved across environments
  - canonicalName documented
  - runtime mapping maintained
```

---

## 🖥️ LOCAL/DEV MODE SPECIFICATION

### Environment Definition

```json
{
  "mode": "local_dev",
  "domainRequired": false,
  "audience": "developers",
  "purpose": "Development and testing",
  "characteristics": {
    "routing": "localhost:PORT",
    "access": "local_machine_only",
    "auth": "optional_or_mocked",
    "ssl": "not_required",
    "persistence": "ephemeral_or_local_db"
  }
}
```

### Port Allocation

| Branch | Port Range | Examples |
|--------|------------|----------|
| Production (local) | 3000-3099 | :3000, :3001 |
| Alpha (local) | 3100-3199 | :3100, :3101 |
| Working (local) | 3200-3299 | :3200, :3210 |
| API (all) | 4000-4199 | :4000, :4100 |
| Codegen | 4200-4299 | :4200 |
| Database | 5400-5499 | :5432 |

### Environment Variables

```bash
NODE_ENV=development
BALLOO_MODE=local
BALLOO_BRANCH=working
DOMAIN_REQUIRED=false
LOCALHOST_ONLY=true
```

### Behavior

```yaml
behavior:
  startup: fast
  logging: verbose
  hot_reload: enabled
  error_display: detailed
  mocks: allowed
  external_services: mocked_or_local
```

---

## 🔧 WORKING MODE SPECIFICATION

### Environment Definition

```json
{
  "mode": "working",
  "domainRequired": false,
  "audience": "internal_developers",
  "purpose": "Development integration and automation",
  "characteristics": {
    "routing": "localhost:PORT or working.balloo.su",
    "access": "internal_team",
    "auth": "required",
    "ssl": "recommended",
    "persistence": "working_db"
  }
}
```

### Runtime Options

#### Option A: Localhost

```yaml
working_localhost:
  base_url: http://localhost:3200
  api_url: http://localhost:4100
  workdocs_url: http://localhost:3210
  kpdegen_url: http://localhost:4200
```

#### Option B: Domain

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

### Behavior

```yaml
behavior:
  startup: normal
  logging: info
  hot_reload: enabled
  error_display: detailed
  technical_nodes: enabled
  codegen: enabled
```

---

## 🔬 ALPHA MODE SPECIFICATION

### Environment Definition

```json
{
  "mode": "alpha",
  "domainRequired": true,
  "domainType": "alpha",
  "audience": "testers_qa",
  "purpose": "Pre-production testing",
  "characteristics": {
    "routing": "alpha.balloo.su, *.alpha.balloo.su",
    "access": "limited_testers",
    "auth": "required",
    "ssl": "required",
    "persistence": "alpha_db"
  }
}
```

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

### Behavior

```yaml
behavior:
  startup: normal
  logging: info
  hot_reload: disabled
  error_display: standard
  feature_flags: alpha_enabled
  analytics: alpha_tracking
```

---

## 🏭 PRODUCTION MODE SPECIFICATION

### Environment Definition

```json
{
  "mode": "production",
  "domainRequired": true,
  "domainType": "production",
  "audience": "public",
  "purpose": "Stable production service",
  "characteristics": {
    "routing": "balloo.su, *.balloo.su",
    "access": "public_authenticated",
    "auth": "required_for_protected",
    "ssl": "required",
    "persistence": "production_db"
  }
}
```

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

### Behavior

```yaml
behavior:
  startup: optimized
  logging: warn_or_error
  hot_reload: disabled
  error_display: minimal
  caching: enabled
  cdn: enabled
  monitoring: full
  alerting: enabled
```

---

## 🗺️ ENVIRONMENT MAPPING

### Node Environment Mapping Schema

```json
{
  "nodeId": "workdocs-working",
  "environments": {
    "local_dev": {
      "available": true,
      "identity": "localhost:3210",
      "url": "http://localhost:3210",
      "domainRequired": false
    },
    "working": {
      "available": true,
      "identity": "workdocs.working.balloo.su",
      "url": "https://workdocs.working.balloo.su",
      "domainRequired": false
    },
    "alpha": {
      "available": false,
      "note": "Node not available in alpha"
    },
    "production": {
      "available": false,
      "note": "Node not available in production"
    }
  }
}
```

---

## ✅ CRITICAL INVARIANTS

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

- [NODE_RUNTIME_MODEL.md](../../nodes/NODE_RUNTIME_MODEL.md) — Runtime model documentation
- [ENV_WORKING.md](../../nodes/ENV_WORKING.md) — Working environment details
- [ENV_ALPHA.md](../../nodes/ENV_ALPHA.md) — Alpha environment details
- [ENV_PRODUCTION.md](../../nodes/ENV_PRODUCTION.md) — Production environment details
- [NodeRoutingContract.md](./NodeRoutingContract.md) — Routing rules

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
