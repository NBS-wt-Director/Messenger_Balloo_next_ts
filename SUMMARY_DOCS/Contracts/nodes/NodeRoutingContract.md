---
title: Node Routing Contract
description: Канонический контракт routing для узлов Balloo — domain/subdomain/path mapping, local routing
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - contract
  - routing
  - domains
  - canonical
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/DOMAIN_TREE.md
  - SUMMARY_DOCS/nodes/NODE_RUNTIME_MODEL.md
  - SUMMARY_DOCS/state/domain-tree.json
---

# 📋 NODE ROUTING CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **спецификацию routing** для всех узлов Balloo.

**Routing** = mapping от node identity к domain/subdomain/path в различных средах.

---

## 🔑 CRITICAL PRINCIPLES

### 1. Node Identity vs Route Identity

```yaml
principle: identity_separation
statement: node identity ≠ route identity
rationale: Logical node identity is separate from runtime routing
enforcement:
  - nodeId: logical identifier (persistent)
  - routeIdentity: environment-specific (variable)
  - mapping: maintained in state files
```

### 2. Domain/Subdomain/Path Mapping

```yaml
principle: domain_mapping
statement: domains/subdomains/paths map to nodes
rationale: Routing surface defined by domain structure
enforcement:
  - root_domain: branch root
  - subdomain: node identifier
  - path: resource identifier
```

### 3. Local Routing Without Domains

```yaml
principle: local_routing
statement: local routing in dev without domains
rationale: Development should not require DNS
enforcement:
  - localhost:PORT routing
  - internal hostnames supported
  - port-based identity
```

### 4. Production Routing By Canonical Hostnames

```yaml
principle: production_routing
statement: production routing by canonical hostnames
rationale: Production requires stable, public domains
enforcement:
  - balloo.su root
  - *.balloo.su subdomains
  - SSL/TLS required
```

### 5. Multiple Nodes in One Runtime

```yaml
principle: multi_node_runtime
statement: возможность нескольких узлов в одном runtime при разном routing
rationale: Efficient resource utilization
enforcement:
  - port differentiation
  - path-based routing
  - virtual hosts
```

### 6. No Working/Prod Mixing

```yaml
principle: environment_isolation
statement: правила недопущения смешения working/prod
rationale: Environment isolation critical for stability
enforcement:
  - separate domains
  - separate databases
  - separate credentials
  - no cross-environment calls
```

---

## 📊 ROUTING MODEL

### Schema

```json
{
  "nodeId": "string",
  "canonicalName": "string",
  "routing": {
    "production": {
      "domain": "string",
      "subdomain": "string | null",
      "path": "string | null",
      "port": "number | null",
      "protocol": "https"
    },
    "alpha": {
      "domain": "string",
      "subdomain": "string | null",
      "path": "string | null",
      "port": "number | null",
      "protocol": "https"
    },
    "working": {
      "domain": "string | null",
      "subdomain": "string | null",
      "path": "string | null",
      "port": "number",
      "protocol": "http | https"
    },
    "localDev": {
      "host": "localhost",
      "port": "number",
      "protocol": "http"
    }
  }
}
```

---

## 🏭 PRODUCTION ROUTING

### Root Domain Routing

```yaml
production:
  root_domain: balloo.su
  routing:
    balloo.su:
      nodeId: balloo-production-root
      type: root
      port: 443
    www.balloo.su:
      nodeId: balloo-production-root
      type: redirect
      redirect_to: balloo.su
```

### Subdomain Routing

```yaml
production_subdomains:
  api.balloo.su:
    nodeId: api-production
    type: api_gateway
    port: 443
  ai.api.balloo.su:
    nodeId: ai-api-production
    type: api_gateway
    port: 443
    versionScoped: 4.*
    status: planned
  files.balloo.su:
    nodeId: files-production
    type: storage
    port: 443
  docs.balloo.su:
    nodeId: docs-production
    type: docs_site
    port: 443
  admin.balloo.su:
    nodeId: admin-production
    type: admin_panel
    port: 443
  workers.balloo.su:
    nodeId: workers-production
    type: workers
    port: 443
  abaut.balloo.su:
    nodeId: abaut-production
    type: info_site
    port: 443
  apps.balloo.su:
    nodeId: apps-production
    type: apps_portal
    port: 443
```

### Path-Based Routing (Optional)

```yaml
production_paths:
  balloo.su/api/*:
    nodeId: api-production
    type: path_routing
  balloo.su/docs/*:
    nodeId: docs-production
    type: path_routing
```

---

## 🔬 ALPHA ROUTING

### Root Domain Routing

```yaml
alpha:
  root_domain: alpha.balloo.su
  routing:
    alpha.balloo.su:
      nodeId: alpha-root
      type: root
      port: 443
```

### Subdomain Routing

```yaml
alpha_subdomains:
  apps.alpha.balloo.su:
    nodeId: apps-alpha
    type: apps_portal
    port: 443
  2commands.alpha.balloo.su:
    nodeId: 2commands-alpha
    type: experimental
    port: 443
```

---

## 🔧 WORKING ROUTING

### Root Domain Routing (Optional)

```yaml
working:
  root_domain: working.balloo.su
  routing:
    working.balloo.su:
      nodeId: working-root
      type: root
      port: 443
      optional: true
```

### Subdomain Routing (Optional)

```yaml
working_subdomains:
  api.working.balloo.su:
    nodeId: api-working
    type: api_gateway
    port: 443
    optional: true
  workdocs.working.balloo.su:
    nodeId: workdocs-working
    type: technical_docs
    port: 443
    optional: true
  nodes-switcher.working.balloo.su:
    nodeId: nodes-switcher-working
    type: technical_orchestration
    port: 443
    optional: true
  kpdegen.working.balloo.su:
    nodeId: kpdegen-working
    type: technical_codegen
    port: 443
    optional: true
  projectgeneralsettings.working.balloo.su:
    nodeId: projectgeneralsettings-working
    type: technical_settings
    port: 443
    optional: true
```

### Localhost Routing (Default)

```yaml
working_localhost:
  working-root: localhost:3200
  api-working: localhost:4100
  files-working: localhost:4101
  docs-working: localhost:3201
  workdocs-working: localhost:3210
  nodes-switcher-working: localhost:3211
  kpdegen-working: localhost:4200
  projectgeneralsettings-working: localhost:3212
  database-working: localhost:5432
```

---

## 🖥️ LOCAL DEV ROUTING

### Port-Based Routing

```yaml
local_dev:
  routing_type: port_based
  host: localhost
  protocol: http
  
  port_allocation:
    # Production nodes (local)
    balloo-production-root: 3000
    api-production: 4000
    ai-api-production: 4001
    files-production: 4002
    docs-production: 3001
    future-production: 3002
    admin-production: 3003
    workers-production: 4003
    abaut-production: 3004
    apps-production: 3005
    
    # Alpha nodes (local)
    alpha-root: 3100
    apps-alpha: 3101
    2commands-alpha: 3102
    
    # Working nodes (local)
    working-root: 3200
    api-working: 4100
    files-working: 4101
    docs-working: 3201
    future-working: 3202
    pilot-future-working: 3203
    admin-working: 3204
    workers-working: 4102
    abaut-working: 3205
    apps-working: 3206
    workdocs-working: 3210
    nodes-switcher-working: 3211
    kpdegen-working: 4200
    projectgeneralsettings-working: 3212
    database-working: 5432
```

### Internal Hostnames

```yaml
internal_hostnames:
  # Docker environment
  host.docker.internal: localhost
  
  # Custom hostnames (optional)
  balloo.local: 127.0.0.1
  working.balloo.local: 127.0.0.1
  api.working.balloo.local: 127.0.0.1
```

---

## 🔀 MULTI-NODE RUNTIME

### Same Runtime, Different Routing

```yaml
multi_node_runtime:
  scenario: multiple nodes on same server
  differentiation:
    - by_port: true
    - by_subdomain: true
    - by_path: true
  
  example:
    server: working-server-1
    nodes:
      - nodeId: workdocs-working
        port: 3210
        subdomain: workdocs.working
      - nodeId: nodes-switcher-working
        port: 3211
        subdomain: nodes-switcher.working
      - nodeId: kpdegen-working
        port: 4200
        subdomain: kpdegen.working
```

---

## ⚠️ ENVIRONMENT ISOLATION

### No Working/Prod Mixing

```yaml
isolation_rules:
  working_to_production:
    allowed: false
    reason: Environment isolation critical
  
  production_to_working:
    allowed: false
    reason: Production must not depend on working
  
  alpha_isolation:
    from_production: true
    from_working: true
  
  exceptions:
    - none
```

### Separate Resources

```yaml
separate_resources:
  domains:
    production: balloo.su
    alpha: alpha.balloo.su
    working: working.balloo.su (optional)
  
  databases:
    production: production_db
    alpha: alpha_db
    working: working_db
  
  credentials:
    production: production_secrets
    alpha: alpha_secrets
    working: working_secrets
  
  networks:
    production: production_vpc
    alpha: alpha_vpc
    working: working_vpc
```

---

## ✅ CRITICAL INVARIANTS

1. **node identity vs route identity** — separated
2. **domain/subdomain/path mapping** — defined for all nodes
3. **local routing in dev without domains** — localhost:PORT
4. **production routing by canonical hostnames** — balloo.su
5. **multiple nodes in one runtime** — supported via port/path
6. **no working/prod mixing** — strict isolation
7. **port conflicts prevented** — allocation managed
8. **internal hostnames supported** — for local dev

---

## 📖 RELATED DOCUMENTS

- [DOMAIN_TREE.md](../../nodes/DOMAIN_TREE.md) — Domain tree documentation
- [NODE_RUNTIME_MODEL.md](../../nodes/NODE_RUNTIME_MODEL.md) — Runtime model
- [domain-tree.json](../../state/domain-tree.json) — Domain state
- [NodeEnvironmentContract.md](./NodeEnvironmentContract.md) — Environment contract
- [NodeReleaseContract.md](./NodeReleaseContract.md) — Release contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
