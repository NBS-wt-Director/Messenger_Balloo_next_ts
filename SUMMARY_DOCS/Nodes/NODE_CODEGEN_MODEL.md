---
title: Node Codegen Model
description: Каноническая модель кодогенерации для узлов Balloo — inputs, outputs, context, safety
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - codegen
  - kpdegen
  - automation
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/nodes/technical/NODE_kpdegen_working.md
  - SUMMARY_DOCS/contracts/nodes/NodeSettingsContract.md
  - SUMMARY_DOCS/state/node-codegen-map.json
---

# 🤖 NODE CODEGEN MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **каноническую модель кодогенерации** для всех узлов Balloo.

**Codegen Relevance** = степень необходимости данного узла для AI-кодогенерации, реконструкции, release management и doc generation.

---

## 📊 CODEGEN ARCHITECTURE

```
┌──────────────────────────────────────────────────────────────────┐
│                    CODEGEN PIPELINE                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   INPUTS    │    │  PROCESSING │    │   OUTPUTS   │         │
│  │             │    │             │    │             │         │
│  │ Contracts   │───►│   kpdegen   │───►│   Code      │         │
│  │ State files │    │  (working)  │    │   Config    │         │
│  │ Node docs   │    │             │    │   Docs      │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📥 REQUIRED INPUTS

### 1. Node Contracts

**Source:** `SUMMARY_DOCS/nodes/contracts/NODE_CONTRACT_<node-id>.md`

**Purpose:** AI-readable specifications для генерации узла.

**Required Fields:**
```markdown
- Node Identity
- Branch Binding
- Domain Binding
- Purpose
- Functional Surface
- Settings Surface
- Runtime Model
- Auth and Access
- Codegen Relevance
- Dependencies
- Related Modules
- Invariants
- Environment Behavior
- Release Role
```

### 2. Node Summaries

**Source:** `SUMMARY_DOCS/nodes/summary/NODE_SUMMARY_<node-id>.md`

**Purpose:** Human-readable context для понимания узла.

**Required Fields:**
```markdown
- Что это за узел
- Зачем он нужен
- Где он живёт в branch tree
- Как к нему обращаться в working/dev/prod
- Какие у него функции
- Какие у него настройки
- Почему он важен
```

### 3. State Files

**Sources:**
- `SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json` — Full node registry
- `SUMMARY_DOCS/state/branch-tree.json` — Branch definitions
- `SUMMARY_DOCS/state/domain-tree.json` — Domain mappings
- `SUMMARY_DOCS/state/node-settings-map.json` — Settings registry
- `SUMMARY_DOCS/state/node-runtime-map.json` — Runtime mappings
- `SUMMARY_DOCS/state/node-codegen-map.json` — Codegen relevance
- `SUMMARY_DOCS/state/node-priority-map.json` — Priority ordering

### 4. Model Documents

**Sources:**
- `SUMMARY_DOCS/nodes/NODE_SETTINGS_MODEL.md` — Settings hierarchy
- `SUMMARY_DOCS/nodes/NODE_RUNTIME_MODEL.md` — Runtime behavior
- `SUMMARY_DOCS/nodes/NODE_CODEGEN_MODEL.md` — This document

### 5. Branch/Environment Docs

**Sources:**
- `SUMMARY_DOCS/nodes/ENV_PRODUCTION.md`
- `SUMMARY_DOCS/nodes/ENV_ALPHA.md`
- `SUMMARY_DOCS/nodes/ENV_WORKING.md`

---

## 📤 OUTPUT TARGETS

### 1. Code Generation

**Target:** Source code files

**Examples:**
```
src/nodes/workdocs-working/
├── index.ts
├── routes.ts
├── handlers.ts
├── config.ts
└── types.ts
```

### 2. Config Generation

**Target:** Configuration files

**Examples:**
```
config/nodes/
├── workdocs-working.dev.json
├── workdocs-working.working.json
├── workdocs-working.alpha.json
└── workdocs-working.prod.json
```

### 3. Docs Generation

**Target:** Documentation files

**Examples:**
```
docs/nodes/
├── workdocs-working-api.md
├── workdocs-working-deployment.md
└── workdocs-working-settings.md
```

### 4. Infrastructure Generation

**Target:** IaC files

**Examples:**
```
infra/nodes/
├── workdocs-working.dockerfile
├── workdocs-working.k8s.yaml
└── workdocs-working.terraform.tf
```

---

## 🔄 CODEGEN CLASSES

### Class 1: Technical Core (Priority 1)

**Nodes:**
- workdocs-working
- nodes-switcher-working
- kpdegen-working
- projectgeneralsettings-working
- database-working

**Characteristics:**
- Full codegen support
- Config generation for all environments
- Docs generation required
- Infrastructure as code
- Safety checks mandatory

### Class 2: Working Nodes (Priority 2)

**Nodes:**
- api-working
- files-working
- docs-working
- admin-working
- workers-working
- apps-working

**Characteristics:**
- Code generation
- Config generation
- Basic docs
- Optional IaC

### Class 3: Alpha Nodes (Priority 3)

**Nodes:**
- alpha-root
- apps-alpha
- 2commands-alpha

**Characteristics:**
- Config generation from working
- Minimal code changes
- Testing-focused docs

### Class 4: Production Nodes (Priority 4)

**Nodes:**
- All production nodes

**Characteristics:**
- Stable code (no generation unless update)
- Production config generation
- Full docs
- Production IaC

---

## 🔍 CODEGEN OPERATIONS

### 1. Create New Node

**Trigger:** New node in NODETREE_MANIFEST.json

**Process:**
```
1. Read NODE_CONTRACT template
2. Generate NODE_CONTRACT_<node-id>.md
3. Generate NODE_SUMMARY_<node-id>.md
4. Generate source code skeleton
5. Generate config templates
6. Update NODETREE_MANIFEST.json
7. Update state files
```

**Safety Checks:**
- ✅ No duplicate node ID
- ✅ Valid branch assignment
- ✅ Valid domain (if required)
- ✅ Port not in use
- ✅ Dependencies exist

### 2. Update Existing Node

**Trigger:** Contract or settings change

**Process:**
```
1. Read existing NODE_CONTRACT
2. Compare with new spec
3. Generate diff
4. Apply code changes
5. Update config
6. Regenerate docs
7. Update state files
```

**Safety Checks:**
- ✅ Backward compatibility check
- ✅ Migration path defined
- ✅ Rollback plan exists
- ✅ No breaking changes without notice

### 3. Generate Local Runtime Config

**Trigger:** Local dev start

**Process:**
```
1. Read node runtime mapping
2. Generate localhost config
3. Set port assignments
4. Configure internal routing
5. Generate .env.local
```

**Output:**
```json
{
  "mode": "local_dev",
  "domainRequired": false,
  "nodes": {
    "workdocs-working": {
      "port": 3210,
      "url": "http://localhost:3210"
    }
  }
}
```

### 4. Generate Production Domain Config

**Trigger:** Production deployment

**Process:**
```
1. Read production domain bindings
2. Generate domain-specific config
3. Configure SSL/TLS
4. Set production routing
5. Generate production .env
```

**Output:**
```json
{
  "mode": "production",
  "domainRequired": true,
  "nodes": {
    "balloo-production-root": {
      "domain": "balloo.su",
      "url": "https://balloo.su",
      "ssl": true
    }
  }
}
```

---

## 🛡️ SAFETY CHECKS

### Pre-Generation Checks

```yaml
pre_generation:
  - validate_node_id_unique: true
  - validate_branch_exists: true
  - validate_domain_available: true
  - validate_port_available: true
  - validate_dependencies_exist: true
  - check_conflicts: true
```

### Post-Generation Checks

```yaml
post_generation:
  - validate_generated_code_syntax: true
  - validate_config_json: true
  - validate_docs_links: true
  - run_linter: true
  - run_type_check: true
  - run_tests: true
```

### Deployment Checks

```yaml
deployment:
  - validate_environment_match: true
  - validate_secrets_present: true
  - validate_routing_config: true
  - health_check_ready: true
  - rollback_plan_exists: true
```

---

## 🎯 SCOPE RESTRICTIONS

### What Codegen CAN Do

- ✅ Generate new node scaffolding
- ✅ Update existing node code
- ✅ Generate configs for all environments
- ✅ Generate documentation
- ✅ Generate infrastructure code
- ✅ Update state files
- ✅ Validate changes

### What Codegen CANNOT Do

- ❌ Modify production without approval
- ❌ Change contracts without review
- ❌ Deploy without tests passing
- ❌ Modify secrets
- ❌ Change branch policies
- ❌ Override safety checks

---

## 🔗 RELATION TO MODULE CONTRACTS

### Node Contract vs Module Contract

| Aspect | Node Contract | Module Contract |
|--------|---------------|-----------------|
| **Scope** | External-facing unit | Logical code unit |
| **Focus** | Runtime, domain, routing | Code structure, API |
| **Generated** | App/Service skeleton | Library/Module code |
| **Environment** | Branch-specific | Environment-agnostic |

### Integration

```
Node Contract
    ↓
Defines runtime requirements
    ↓
Module Contract
    ↓
Defines implementation
    ↓
kpdegen generates both
```

---

## 🔗 RELATION TO NODE CONTRACTS

### Node Contract Hierarchy

```
BranchNodeContract (branch rules)
    ↓
DomainNodeContract (domain bindings)
    ↓
TechnicalNodeContract (technical nodes)
    ↓
NodeSettingsContract (settings model)
    ↓
NodeEnvironmentContract (environment behavior)
    ↓
NodeReleaseContract (release flow)
    ↓
NodeRoutingContract (routing rules)
    ↓
NODE_CONTRACT_<node-id>.md (specific node)
```

---

## 📊 CODEGEN RELEVANCE SCORING

### Priority Levels

| Priority | Description | Nodes |
|----------|-------------|-------|
| **1** | Technical core (working) | workdocs, nodes-switcher, kpdegen, projectgeneralsettings, database-working |
| **2** | Other working nodes | api, files, docs, admin, workers, apps |
| **3** | Alpha nodes | alpha-root, apps-alpha, 2commands-alpha |
| **4** | Production public nodes | All production nodes |

### Scoring Factors

```yaml
scoring_factors:
  codegen_dependency: weight=30
  automation_value: weight=25
  documentation_central: weight=20
  settings_authority: weight=15
  release_criticality: weight=10
```

---

## ✅ CRITICAL INVARIANTS

1. **kpdegen читает contracts** — source of truth
2. **как собирается контекст** — из contracts + state files
3. **какие настройки обязательны** — из NODE_SETTINGS_MODEL
4. **как отличить create vs update** — по наличию в manifest
5. **как генерировать local config** — domain-agnostic
6. **как генерировать prod config** — domain-bound
7. **safety checks обязательны** — pre и post generation
8. **scope restrictions соблюдаются** — нельзя модифицировать production без approval

---

## 📖 RELATED DOCUMENTS

- [NODE_kpdegen_working.md](./technical/NODE_kpdegen_working.md) — kpdegen technical node
- [NODE_CODEGEN_POLICY.md](./NODE_CODEGEN_POLICY.md) — Codegen policy
- [node-codegen-map.json](../state/node-codegen-map.json) — Codegen relevance map
- [NODETREE_MANIFEST.json](./NODETREE_MANIFEST.json) — Node registry
- [codegen-playbook.md](../playbooks/codegen-playbook.md) — Codegen instructions

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
