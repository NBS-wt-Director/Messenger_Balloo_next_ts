---
title: Node kpdegen.working.balloo.su
description: Технический узел серверного кодогенератора Balloo — execution/control surface для codegen
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - technical-node
  - priority-1
  - working
  - codegen
  - automation
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/TechnicalNodeContract.md
  - SUMMARY_DOCS/nodes/contracts/NODE_CONTRACT_kpdegen_working.md
---

# 🤖 NODE: kpdegen.working.balloo.su

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Priority 1 Technical Node  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

**kpdegen.working.balloo.su** — технический узел серверного кодогенератора Balloo.

**Primary Purpose:** Серверный кодогенератор, execution/control surface для codegen.

---

## 📊 NODE IDENTITY

| Параметр | Значение |
|----------|----------|
| **Node ID** | `kpdegen-working` |
| **Canonical Name** | `kpdegen.working.balloo.su` |
| **Branch** | `working` |
| **Type** | `technical-codegen` |
| **Priority** | `1` ⭐ |
| **Technical** | `true` |

---

## 🌐 DOMAIN & ROUTING

### Production Identity

```
kpdegen.working.balloo.su
```

### Local Dev Identity

```
localhost:4200
http://localhost:4200
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
- ✅ AI agents
- ✅ System (automated)
- ❌ Public users

### Authentication

```yaml
auth:
  required: true
  method: api_token
  system_tokens: supported
  rate_limiting: per_token
```

---

## 📦 FUNCTIONAL SURFACE

### Core Functions

1. **Input Processing**
   - Чтение docs/contracts/state
   - Валидация входных данных
   - Сборка контекста

2. **Code Generation**
   - Генерация source code
   - Генерация type definitions
   - Генерация API handlers

3. **Config Generation**
   - Генерация environment configs
   - Генерация routing configs
   - Генерация deployment configs

4. **Docs Generation**
   - Генерация API docs
   - Генерация deployment docs
   - Генерация changelogs

5. **Safety Checks**
   - Pre-generation validation
   - Post-generation validation
   - Syntax and type checking

---

## ⚙️ SETTINGS SURFACE

### Settings Scopes

```yaml
settings:
  scopes:
    - node-level
    - codegen-settings
  mutable_by: [admin, system]
  includes:
    - codegen_templates
    - output_targets
    - safety_checks
    - scope_restrictions
```

### Key Settings

| Setting | Type | Description |
|---------|------|-------------|
| `codegen.templates` | object | Code generation templates |
| `codegen.output_targets` | array | Output file targets |
| `codegen.safety_checks` | object | Safety check config |
| `codegen.scope_restrictions` | object | Scope limitations |
| `codegen.rate_limit` | number | Requests per minute |

---

## 📥 INPUT DOCS/CONTRACTS/STATE

### Required Inputs

```yaml
inputs:
  contracts:
    - NODE_CONTRACT_*.md
    - MODULE_CONTRACT_*.md
    - BranchNodeContract.md
    - DomainNodeContract.md
    - TechnicalNodeContract.md
    - NodeSettingsContract.md
    - NodeEnvironmentContract.md
    - NodeReleaseContract.md
    - NodeRoutingContract.md
  
  state:
    - NODETREE_MANIFEST.json
    - node-settings-map.json
    - node-runtime-map.json
    - node-codegen-map.json
    - node-priority-map.json
    - branch-tree.json
    - domain-tree.json
  
  models:
    - NODE_SETTINGS_MODEL.md
    - NODE_RUNTIME_MODEL.md
    - NODE_CODEGEN_MODEL.md
```

---

## 📤 OUTPUT CODE/CONFIG/DOCS

### Code Outputs

```yaml
outputs:
  code:
    - source_files
    - type_definitions
    - api_handlers
    - route_definitions
```

### Config Outputs

```yaml
outputs:
  config:
    - environment_configs
    - routing_configs
    - deployment_configs
    - docker_configs
```

### Docs Outputs

```yaml
outputs:
  docs:
    - api_docs
    - deployment_docs
    - changelogs
    - release_notes
```

---

## 🛡️ SAFETY CHECKS

### Pre-Generation

```yaml
pre_generation:
  - validate_inputs: true
  - check_conflicts: true
  - validate_dependencies: true
  - validate_node_id_unique: true
  - validate_branch_exists: true
  - validate_port_available: true
```

### Post-Generation

```yaml
post_generation:
  - syntax_validation: true
  - type_checking: true
  - linting: true
  - tests: true
  - validate_config_json: true
  - validate_docs_links: true
```

### Deployment

```yaml
deployment:
  - validate_environment_match: true
  - validate_secrets_present: true
  - validate_routing_config: true
  - health_check_ready: true
  - rollback_plan_exists: true
```

---

## 🔗 RELATIONS

### Relation to Module Contracts

```yaml
relation:
  type: reader
  reads: MODULE_CONTRACT_*.md
  generates: module_code
```

### Relation to Node Contracts

```yaml
relation:
  type: reader
  reads: NODE_CONTRACT_*.md
  generates: node_code
```

### Related Nodes

- `workdocs-working` — Docs (consumer)
- `nodes-switcher-working` — Version control (coordinates)
- `projectgeneralsettings-working` — Settings (consumer)

---

## 🏃 RUNTIME MODEL

### Local Dev Mode

```yaml
local_dev:
  identity: localhost:4200
  url: http://localhost:4200
  domain_required: false
  auth: optional
```

### Working Mode

```yaml
working:
  identity: kpdegen.working.balloo.su
  url: https://kpdegen.working.balloo.su
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
src/nodes/kpdegen-working/
├── index.ts
├── routes.ts
├── handlers/
│   ├── generate.ts
│   ├── validate.ts
│   └── deploy.ts
├── generators/
│   ├── code-generator.ts
│   ├── config-generator.ts
│   └── docs-generator.ts
├── validators/
│   ├── pre-generation.ts
│   └── post-generation.ts
├── templates/
│   ├── node-template/
│   ├── module-template/
│   └── config-template/
├── config.ts
└── types.ts
```

### Config Files

```
config/nodes/
├── kpdegen-working.dev.json
├── kpdegen-working.working.json
└── kpdegen-working.local.json
```

---

## 🤖 CODEGEN RELEVANCE

### Codegen Class

```
Class 1: Technical Core (Priority 1)
```

### Special Note

```
This IS the codegen system itself.
All other nodes are generated BY this node.
```

### Required Inputs

- `NODE_CONTRACT_kpdegen_working.md`
- `NODE_SUMMARY_kpdegen_working.md`
- `NODE_CODEGEN_MODEL.md`
- `NODE_SETTINGS_MODEL.md`

### Output Targets

- `src/nodes/kpdegen-working/`
- `config/nodes/kpdegen-working.*.json`
- `docs/nodes/kpdegen-working-*.md`
- `infra/nodes/kpdegen-working.*`

### Risk Level

```
Risk: High
Rationale: This is the codegen system, affects all generated code
```

---

## 🔒 SCOPE RESTRICTIONS

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

## ✅ INVARIANTS

1. **input docs/contracts/state** — reads all contracts
2. **output code/config/docs** — generates all outputs
3. **safety checks** — mandatory pre and post
4. **scope restrictions** — cannot deploy production
5. **relation to module contracts** — reads and generates
6. **relation to node contracts** — reads and generates
7. **working branch only** — not in alpha/production
8. **domainRequired = false** — localhost OK

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../NODETREE_INDEX.md) — Node tree index
- [TechnicalNodeContract.md](../../contracts/nodes/TechnicalNodeContract.md) — Technical contract
- [NODE_CONTRACT_kpdegen_working.md](../contracts/NODE_CONTRACT_kpdegen_working.md) — Node contract
- [NODE_CODEGEN_MODEL.md](../NODE_CODEGEN_MODEL.md) — Codegen model
- [codegen-playbook.md](../../playbooks/codegen-playbook.md) — Codegen instructions

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Priority 1 Technical Node  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
