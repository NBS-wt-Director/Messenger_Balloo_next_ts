---
title: Technical Node Contract
description: Канонический контракт технических узлов Balloo — first-class nodes для управления и codegen
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - contract
  - technical-nodes
  - working
  - canonical
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/technical/NODE_workdocs_working.md
  - SUMMARY_DOCS/nodes/technical/NODE_nodes_switcher_working.md
  - SUMMARY_DOCS/nodes/technical/NODE_kpdegen_working.md
  - SUMMARY_DOCS/nodes/technical/NODE_projectgeneralsettings_working.md
---

# 📋 TECHNICAL NODE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 CONTRACT PURPOSE

Этот контракт определяет **спецификацию технических узлов** Balloo как first-class nodes.

**Technical node** = узел, предназначенный в первую очередь для управления, разработки, документации, генерации, оркестрации, настройки, релизов или внутренних операций.

---

## 🔑 CRITICAL PRINCIPLE

```yaml
principle: technical_nodes_first_class
statement: Технические узлы не второстепенны — они приоритет 1 (first priority)
rationale: Technical nodes enable automation, codegen, and system management
enforcement:
  - codegenPriority = 1 для всех technical nodes
  - detailed documentation required
  - full contract specification required
```

---

## 📊 TECHNICAL NODES REGISTRY

### Priority 1 Technical Nodes (Working Branch)

| Node ID | Domain | Type | Purpose |
|---------|--------|------|---------|
| workdocs-working | workdocs.working.balloo.su | technical-docs | Рабочая документация |
| nodes-switcher-working | nodes-switcher.working.balloo.su | technical-orchestration | Менеджер версий узлов |
| kpdegen-working | kpdegen.working.balloo.su | technical-codegen | Серверный кодогенератор |
| projectgeneralsettings-working | projectgeneralsettings.working.balloo.su | technical-settings | Управление настройками |
| database-working | (no domain) | technical-runtime | База данных working |

---

## 📋 NODE SPECIFICATIONS

### 1. WORKDOCS-WORKING

```json
{
  "nodeId": "workdocs-working",
  "canonicalName": "workdocs.working.balloo.su",
  "type": "technical-docs",
  "branch": "working",
  "priority": 1,
  "purpose": "Рабочая документация, md-файлы для разработчиков и AI, вывод документации как защищённого сайта",
  "allowedUsers": ["developers", "ai-agents", "internal-team"],
  "authExpectation": "required",
  "settingsAuthority": "docs-settings",
  "relationToCodegen": "provides documentation context for codegen",
  "relationToDocs": "source-of-truth relation to SUMMARY_DOCS",
  "relationToRollout": "docs updates trigger codegen context refresh",
  "localDevPort": 3210,
  "domainRequired": false
}
```

#### Purpose

- Рабочая документация
- md-файлы для разработчиков и AI
- Вывод документации как защищённого сайта
- Ядро SUMMARY_DOCS / web docs mode

#### Allowed Users

- ✅ Developers
- ✅ AI agents
- ✅ Internal team members
- ❌ Public users

#### Auth Expectation

```yaml
auth:
  required: true
  method: password_protected
  session_management: true
  ai_agent_tokens: supported
```

#### Settings Authority

```yaml
settings:
  scope: docs-settings
  mutable_by: [docs-owner, admin]
  includes:
    - docs_theme
    - navigation_structure
    - access_control
    - ai_reading_config
```

#### Relation to Codegen

```yaml
codegen:
  provides: documentation_context
  consumed_by: kpdegen-working
  triggers: contract_changes
  outputs: updated_docs
```

#### Relation to Docs

```yaml
docs:
  source_of_truth: SUMMARY_DOCS
  presentation: password_protected_website
  sync: bidirectional
  ai_reading: enabled
```

#### Relation to Rollout

```yaml
rollout:
  docs_updates: trigger_codegen_context_refresh
  version_tracking: enabled
  change_log: maintained
```

---

### 2. NODES-SWITCHER-WORKING

```json
{
  "nodeId": "nodes-switcher-working",
  "canonicalName": "nodes-switcher.working.balloo.su",
  "type": "technical-orchestration",
  "branch": "working",
  "priority": 1,
  "purpose": "Отслеживание версий узлов, менеджер обновлений, переключение версий узлов",
  "allowedUsers": ["developers", "devops", "admin"],
  "authExpectation": "required",
  "settingsAuthority": "version-registry, rollout-control",
  "relationToCodegen": "triggers codegen for node updates",
  "relationToDocs": "documents node versions and changes",
  "relationToRollout": "orchestrates node updates and rollouts",
  "localDevPort": 3211,
  "domainRequired": false
}
```

#### Purpose

- Отслеживание версий узлов
- Менеджер обновлений
- Переключение версий узлов

#### Allowed Users

- ✅ Developers
- ✅ DevOps
- ✅ Admin
- ❌ Public users

#### Auth Expectation

```yaml
auth:
  required: true
  method: token_based
  role_based_access: true
  audit_logging: enabled
```

#### Settings Authority

```yaml
settings:
  scope:
    - version-registry
    - rollout-control
    - compatibility-checks
  mutable_by: [devops, admin]
```

#### Relation to Codegen

```yaml
codegen:
  triggers: node_version_changes
  coordinates: with_kpdegen
  validates: compatibility_before_deploy
```

#### Relation to Docs

```yaml
docs:
  version_documentation: auto_generated
  changelog: maintained
  release_notes: generated
```

#### Relation to Rollout

```yaml
rollout:
  orchestration: primary_orchestrator
  compatibility_checks: required
  rollback_support: enabled
  phased_rollout: supported
```

---

### 3. KPDEGEN-WORKING

```json
{
  "nodeId": "kpdegen-working",
  "canonicalName": "kpdegen.working.balloo.su",
  "type": "technical-codegen",
  "branch": "working",
  "priority": 1,
  "purpose": "Серверный кодогенератор, execution/control surface для codegen",
  "allowedUsers": ["developers", "ai-agents", "system"],
  "authExpectation": "required",
  "settingsAuthority": "codegen-settings",
  "relationToCodegen": "is the codegen system",
  "relationToDocs": "reads contracts, generates docs",
  "relationToRollout": "generates code for rollouts",
  "localDevPort": 4200,
  "domainRequired": false
}
```

#### Purpose

- Серверный кодогенератор
- Execution/control surface для codegen

#### Allowed Users

- ✅ Developers
- ✅ AI agents
- ✅ System (automated)
- ❌ Public users

#### Auth Expectation

```yaml
auth:
  required: true
  method: api_token
  system_tokens: supported
  rate_limiting: per_token
```

#### Settings Authority

```yaml
settings:
  scope: codegen-settings
  mutable_by: [admin, system]
  includes:
    - codegen_templates
    - output_targets
    - safety_checks
    - scope_restrictions
```

#### Input Docs/Contracts/State

```yaml
inputs:
  contracts:
    - NODE_CONTRACT_*.md
    - MODULE_CONTRACT_*.md
    - BranchNodeContract.md
    - DomainNodeContract.md
  state:
    - NODETREE_MANIFEST.json
    - node-settings-map.json
    - node-runtime-map.json
  models:
    - NODE_SETTINGS_MODEL.md
    - NODE_RUNTIME_MODEL.md
    - NODE_CODEGEN_MODEL.md
```

#### Output Code/Config/Docs

```yaml
outputs:
  code:
    - source_files
    - type_definitions
    - api_handlers
  config:
    - environment_configs
    - routing_configs
    - deployment_configs
  docs:
    - api_docs
    - deployment_docs
    - changelogs
```

#### Safety Checks

```yaml
safety:
  pre_generation:
    - validate_inputs
    - check_conflicts
    - validate_dependencies
  post_generation:
    - syntax_validation
    - type_checking
    - linting
    - tests
```

#### Scope Restrictions

```yaml
scope:
  can_create: true
  can_update: true
  can_delete: false
  can_deploy_production: false
  requires_approval_for: [production_deploy, breaking_changes]
```

#### Relation to Module Contracts and Node Contracts

```yaml
relations:
  module_contracts: read_for_implementation
  node_contracts: read_for_runtime_spec
  generates: both_module_and_node_code
```

---

### 4. PROJECTGENERALSETTINGS-WORKING

```json
{
  "nodeId": "projectgeneralsettings-working",
  "canonicalName": "projectgeneralsettings.working.balloo.su",
  "type": "technical-settings",
  "branch": "working",
  "priority": 1,
  "purpose": "Управление всеми настройками других узлов, central settings UI/surface",
  "allowedUsers": ["admin", "owner", "product-owner"],
  "authExpectation": "required",
  "settingsAuthority": "project-global, branch-level, node-level, feature-level",
  "relationToCodegen": "provides settings for codegen",
  "relationToDocs": "settings documented in contracts",
  "relationToRollout": "feature flags control rollout",
  "localDevPort": 3212,
  "domainRequired": false
}
```

#### Purpose

- Управление всеми настройками других узлов
- Central settings UI/surface

#### Allowed Users

- ✅ Admin
- ✅ Owner
- ✅ Product Owner
- ❌ Public users

#### Auth Expectation

```yaml
auth:
  required: true
  method: oauth_or_password
  role_based_access: true
  mfa_recommended: true
  audit_logging: enabled
```

#### Settings Authority

```yaml
settings:
  scope:
    - project-global
    - branch-level
    - node-level
    - feature-level
  mutable_by: [admin, owner, product-owner]
  audit_required: true
```

#### Project Settings Authority

```yaml
project_settings:
  name: managed
  version: managed
  branch: managed
  features: managed
  tariffs: managed_if_applicable
```

#### Node Settings Map

```yaml
node_settings_map:
  registry: maintained
  inheritance: enforced
  overrides: tracked
  conflicts: resolved
```

#### Global vs Node-Local Settings

```yaml
settings_hierarchy:
  project_global: highest_authority
  branch_level: inherits_and_overrides
  node_level: inherits_and_overrides
  feature_level: inherits_and_overrides
  runtime_local: ephemeral_overrides
```

#### Feature Flags

```yaml
feature_flags:
  management: central
  rollout_control: supported
  ab_testing: supported
  percentage_rollout: supported
```

#### Release Toggles

```yaml
release_toggles:
  management: central
  branch_specific: supported
  version_scoped: supported
```

#### Tariffs/Features

```yaml
tariffs:
  management: if_applicable
  feature_controls: tariff_based
  entitlements: tracked
```

---

### 5. DATABASE-WORKING

```json
{
  "nodeId": "database-working",
  "canonicalName": "database-working",
  "type": "technical-runtime",
  "branch": "working",
  "priority": 1,
  "purpose": "База данных для working environment, technical runtime node",
  "allowedUsers": ["system", "api-working", "workers-working"],
  "authExpectation": "internal_auth",
  "settingsAuthority": "database-settings",
  "relationToCodegen": "schema generation, migration scripts",
  "relationToDocs": "database schema documented",
  "relationToRollout": "migrations managed by nodes-switcher",
  "localDevPort": 5432,
  "domainRequired": false,
  "hasPublicDomain": false
}
```

#### Purpose

- Technical runtime node
- Database for working environment
- No public domain

#### Allowed Users

- ✅ System
- ✅ api-working
- ✅ workers-working
- ❌ Direct public access

#### Auth Expectation

```yaml
auth:
  required: true
  method: internal_credentials
  connection_pooling: enabled
  access_control: role_based
```

#### Settings Authority

```yaml
settings:
  scope: database-settings
  mutable_by: [devops, admin]
  includes:
    - connection_config
    - pool_settings
    - migration_config
```

---

## ✅ CRITICAL INVARIANTS

1. **Технические узлы — first-class** — не второстепенны
2. **Priority 1 для codegen** — highest codegen priority
3. **Working branch only** — technical nodes в working
4. **Auth required** — все технические узлы требуют авторизации
5. **No public access** — технические узлы не публичны
6. **domainRequired = false** — могут работать на localhost
7. **production identity preserved** — logical identity сохраняется
8. **database-working has no domain** — technical runtime node

---

## 📖 RELATED DOCUMENTS

- [NODE_workdocs_working.md](../../nodes/technical/NODE_workdocs_working.md) — Workdocs details
- [NODE_nodes_switcher_working.md](../../nodes/technical/NODE_nodes_switcher_working.md) — Nodes-switcher details
- [NODE_kpdegen_working.md](../../nodes/technical/NODE_kpdegen_working.md) — kpdegen details
- [NODE_projectgeneralsettings_working.md](../../nodes/technical/NODE_projectgeneralsettings_working.md) — Project settings details
- [NODE_SETTINGS_MODEL.md](../../nodes/NODE_SETTINGS_MODEL.md) — Settings model
- [NODE_CODEGEN_MODEL.md](../../nodes/NODE_CODEGEN_MODEL.md) — Codegen model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
