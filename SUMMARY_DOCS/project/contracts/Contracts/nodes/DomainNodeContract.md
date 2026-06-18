---
title: Domain Node Contract
description: Канонический контракт доменных привязок узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - contract
  - domains
  - routing
  - canonical
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/DOMAIN_TREE.md
  - SUMMARY_DOCS/nodes/NODE_RUNTIME_MODEL.md
  - SUMMARY_DOCS/state/domain-tree.json
---

# 📋 DOMAIN NODE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **спецификацию доменных привязок** для узлов Balloo.

**Domain-bearing node** = узел, имеющий собственный production или environment-specific hostname/path binding.

---

## 📊 DOMAIN BINDING MODEL

### Schema

```json
{
  "nodeId": "string",
  "canonicalName": "string",
  "branch": "production|alpha|working",
  "domainBinding": {
    "production": {
      "domain": "string | null",
      "required": boolean,
      "canonical": "string"
    },
    "alpha": {
      "domain": "string | null",
      "required": boolean,
      "canonical": "string"
    },
    "working": {
      "domain": "string | null",
      "required": boolean,
      "canonical": "string"
    },
    "localDev": {
      "identity": "string",
      "port": number,
      "domainRequired": false
    }
  }
}
```

---

## 🔑 CRITICAL PRINCIPLES

### 1. Dev Mode Without Domains

```yaml
principle: dev_without_domains
statement: dev mode MUST NOT require real public domains
rationale: Local development should not depend on DNS configuration
enforcement:
  - localDevRequiredDomain = false для всех узлов
  - localhost routing available
  - internal hostnames supported
```

### 2. Production Mode With Domains

```yaml
principle: prod_with_domains
statement: prod mode MUST use canonical assigned production domains
rationale: Production identity requires stable, public domains
enforcement:
  - productionDomainRequired = true для production узлов
  - SSL/TLS required
  - DNS configuration mandatory
```

### 3. Alpha Mode With Domains

```yaml
principle: alpha_with_domains
statement: alpha SHOULD use assigned alpha domains
rationale: Alpha testing requires isolated environment
enforcement:
  - alphaDomainRequired = true для alpha узлов
  - Separate from production
  - Limited access
```

### 4. Working Mode Flexibility

```yaml
principle: working_flexibility
statement: working MAY run via localhost, ports, local host aliases or internal routing
rationale: Development needs flexibility
enforcement:
  - localDevAllowed = true
  - domainOptional = true
  - localhost ports assigned
```

### 5. Production Identity Preservation

```yaml
principle: identity_preservation
statement: production identity узла не теряется даже если dev запускается локально
rationale: Logical identity is separate from runtime target
enforcement:
  - logicalNodeId preserved in all modes
  - canonicalName documented
  - mapping maintained
```

---

## 🏭 PRODUCTION DOMAIN BINDINGS

### Root Domain

```json
{
  "nodeId": "balloo-production-root",
  "canonicalName": "balloo.su",
  "branch": "production",
  "domainBinding": {
    "production": {
      "domain": "balloo.su",
      "required": true,
      "canonical": "balloo.su"
    },
    "localDev": {
      "identity": "localhost",
      "port": 3000,
      "domainRequired": false
    }
  }
}
```

### API Domains

```json
{
  "nodeId": "api-production",
  "canonicalName": "api.balloo.su",
  "branch": "production",
  "domainBinding": {
    "production": {
      "domain": "api.balloo.su",
      "required": true,
      "canonical": "api.balloo.su"
    },
    "localDev": {
      "identity": "localhost",
      "port": 4000,
      "domainRequired": false
    }
  }
}
```

### Version-Scoped Domain (AI API)

```json
{
  "nodeId": "ai-api-production",
  "canonicalName": "ai.api.balloo.su",
  "branch": "production",
  "domainBinding": {
    "production": {
      "domain": "ai.api.balloo.su",
      "required": true,
      "canonical": "ai.api.balloo.su",
      "versionScoped": "4.*",
      "status": "planned"
    },
    "localDev": {
      "identity": "localhost",
      "port": 4001,
      "domainRequired": false
    }
  }
}
```

---

## 🔬 ALPHA DOMAIN BINDINGS

### Root Domain

```json
{
  "nodeId": "alpha-root",
  "canonicalName": "alpha.balloo.su",
  "branch": "alpha",
  "domainBinding": {
    "alpha": {
      "domain": "alpha.balloo.su",
      "required": true,
      "canonical": "alpha.balloo.su"
    },
    "localDev": {
      "identity": "localhost",
      "port": 3100,
      "domainRequired": false
    }
  }
}
```

---

## 🔧 WORKING DOMAIN BINDINGS

### Technical Nodes (Priority 1)

```json
{
  "nodeId": "workdocs-working",
  "canonicalName": "workdocs.working.balloo.su",
  "branch": "working",
  "domainBinding": {
    "working": {
      "domain": "workdocs.working.balloo.su",
      "required": false,
      "canonical": "workdocs.working.balloo.su"
    },
    "localDev": {
      "identity": "localhost",
      "port": 3210,
      "domainRequired": false
    }
  },
  "priority": 1,
  "technical": true
}
```

### Database (No Domain)

```json
{
  "nodeId": "database-working",
  "canonicalName": "database-working",
  "branch": "working",
  "domainBinding": {
    "working": {
      "domain": null,
      "required": false,
      "canonical": null,
      "note": "Technical runtime node, no public domain"
    },
    "localDev": {
      "identity": "localhost",
      "port": 5432,
      "domainRequired": false
    }
  },
  "priority": 1,
  "technical": true
}
```

---

## 🗺️ DOMAIN-TO-NODE MAPPING

### Production Mapping

| Domain | Node ID | Required |
|--------|---------|----------|
| balloo.su | balloo-production-root | Yes |
| api.balloo.su | api-production | Yes |
| ai.api.balloo.su | ai-api-production | Yes (v4.*) |
| files.balloo.su | files-production | Yes |
| docs.balloo.su | docs-production | Yes |
| future.balloo.su | future-production | Yes |
| admin.balloo.su | admin-production | Yes |
| workers.balloo.su | workers-production | Yes |
| abaut.balloo.su | abaut-production | Yes |
| apps.balloo.su | apps-production | Yes |

### Alpha Mapping

| Domain | Node ID | Required |
|--------|---------|----------|
| alpha.balloo.su | alpha-root | Yes |
| apps.alpha.balloo.su | apps-alpha | Yes |
| 2commands.alpha.balloo.su | 2commands-alpha | Yes |

### Working Mapping

| Domain | Node ID | Required |
|--------|---------|----------|
| working.balloo.su | working-root | No |
| api.working.balloo.su | api-working | No |
| files.working.balloo.su | files-working | No |
| docs.working.balloo.su | docs-working | No |
| workdocs.working.balloo.su | workdocs-working | No |
| nodes-switcher.working.balloo.su | nodes-switcher-working | No |
| kpdegen.working.balloo.su | kpdegen-working | No |
| projectgeneralsettings.working.balloo.su | projectgeneralsettings-working | No |

---

## 🖥️ LOCAL DEV EQUIVALENTS

### Port Allocation

| Branch | Port Range | Example Nodes |
|--------|------------|---------------|
| Production (local) | 3000-3099 | balloo.su → :3000 |
| Alpha (local) | 3100-3199 | alpha.balloo.su → :3100 |
| Working (local) | 3200-3299 | working.balloo.su → :3200 |
| API (all) | 4000-4199 | api.* → :4000/:4100 |
| Codegen | 4200-4299 | kpdegen → :4200 |
| Database | 5400-5499 | database → :5432 |

### Local Dev Identity Schema

```json
{
  "logicalNodeId": "string",
  "canonicalDomain": "string | null",
  "localDevIdentity": {
    "host": "localhost",
    "port": number,
    "protocol": "http",
    "url": "string"
  }
}
```

---

## 🔀 ROUTING RULES

### Production Routing

```yaml
production_routing:
  dns_required: true
  ssl_required: true
  load_balancer: required
  cdn: recommended
  hsts: enabled
  redirect_http_to_https: true
```

### Alpha Routing

```yaml
alpha_routing:
  dns_required: true
  ssl_required: true
  load_balancer: optional
  cdn: not_required
  hsts: enabled
  access_control: limited
```

### Working Routing

```yaml
working_routing:
  dns_required: false
  ssl_required: recommended
  load_balancer: not_required
  cdn: not_required
  hsts: optional
  localhost_allowed: true
  internal_routing: true
```

### Local Dev Routing

```yaml
local_dev_routing:
  dns_required: false
  ssl_required: false
  load_balancer: not_required
  cdn: not_required
  localhost_only: true
  port_based: true
```

---

## ✅ CRITICAL INVARIANTS

1. **dev mode MUST NOT require real public domains**
2. **prod mode MUST use canonical assigned production domains**
3. **alpha SHOULD use assigned alpha domains**
4. **working MAY run via localhost, ports, local host aliases**
5. **production identity узла не теряется при local dev**
6. **logicalNodeId preserved across all environments**
7. **canonicalName documented for all nodes**
8. **port conflicts prevented**
9. **client-apps family has no domain**
10. **database-working has no domain**

---

## 📖 RELATED DOCUMENTS

- [DOMAIN_TREE.md](../../nodes/DOMAIN_TREE.md) — Domain tree documentation
- [NODE_RUNTIME_MODEL.md](../../nodes/NODE_RUNTIME_MODEL.md) — Runtime model
- [domain-tree.json](../../state/domain-tree.json) — Domain state
- [BranchNodeContract.md](./BranchNodeContract.md) — Branch definitions
- [NodeRoutingContract.md](./NodeRoutingContract.md) — Routing rules

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
