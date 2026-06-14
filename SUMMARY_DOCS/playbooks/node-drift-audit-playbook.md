---
title: Node Drift Audit Playbook
description: Инструкции по аудиту дрейфа между docs, config и runtime для узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - audit
  - drift
  - playbook
  - canonical
related_docs:
  - SUMMARY_DOCS/state/node-doc-health.json
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
  - SUMMARY_DOCS/adr/ADR-004-summary-docs-as-node-source-of-truth.md
---

# 🔍 NODE DRIFT AUDIT PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот playbook описывает workflow **аудита дрейфа** между documentation, configuration и runtime для узлов Balloo.

**Цель:** Обнаружить и предотвратить truth drift между docs, config и runtime.

---

## 📊 DRIFT TYPES

### 1. Docs ↔ Config Drift

```
Documentation says one thing, config says another.

Example:
- NODETREE_MANIFEST.json: productionDomainRequired = true
- Actual config: productionDomainRequired = false
```

### 2. Config ↔ Runtime Drift

```
Config says one thing, runtime does another.

Example:
- Config: domain = working.balloo.su
- Runtime: domain = localhost:3200
```

### 3. Branch Mapping Drift

```
Production/alpha/working mappings are inconsistent.

Example:
- Working node mapped to production domain
- Production node missing from production branch
```

### 4. Local Dev ↔ Prod Domain Drift

```
Local dev started depending on production domains.

Example:
- Local dev requires balloo.su DNS
- Should use localhost:PORT only
```

---

## 🔍 AUDIT WORKFLOW

### Step 1: Load Source of Truth

```markdown
1. Прочитать SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
2. Прочитать SUMMARY_DOCS/state/*.json files
3. Прочитать SUMMARY_DOCS/contracts/nodes/*.md
```

### Step 2: Compare Docs vs Config

```markdown
1. Для каждого узла:
   - Сравнить nodeId в manifest vs config
   - Сравнить domain bindings
   - Сравнить settings scopes
   - Сравнить codegen priority

2. Зафиксировать mismatches:
   - Missing nodes in config
   - Extra nodes in config
   - Domain mismatches
   - Settings scope mismatches
```

### Step 3: Compare Config vs Runtime

```markdown
1. Для каждого узла:
   - Сравнить runtime target (config vs actual)
   - Сравнить port assignments
   - Сравнить auth requirements

2. Зафиксировать mismatches:
   - Wrong port
   - Missing auth
   - Domain required when shouldn't be
```

### Step 4: Check Branch Mappings

```markdown
1. Проверить что production nodes только в production
2. Проверить что working technical nodes только в working
3. Проверить что alpha nodes имеют alpha domains

2. Зафиксировать mismatches:
   - Working node in production branch
   - Production domain in working config
   - Missing alpha domain for alpha node
```

### Step 5: Check Local Dev Independence

```markdown
1. Проверить что localDevRequiredDomain = false для всех узлов
2. Проверить что localhost:PORT routing доступен
3. Проверить что нет dependencies на production domains

2. Зафиксировать mismatches:
   - Any node with localDevRequiredDomain = true
   - Missing localhost mapping
   - Production domain dependency in local dev
```

---

## 📋 AUDIT CHECKLIST

### Manifest Integrity

- [ ] All nodes in NODETREE_MANIFEST.json have corresponding contracts
- [ ] All nodes have summary docs
- [ ] All nodes have branch binding
- [ ] All nodes have domain binding (or null for no-domain nodes)
- [ ] All nodes have localDevIdentity

### State Files Consistency

- [ ] branch-tree.json matches NODETREE_MANIFEST.json branches
- [ ] domain-tree.json matches NODETREE_MANIFEST.json domains
- [ ] node-settings-map.json has entries for all nodes
- [ ] node-runtime-map.json has mappings for all nodes
- [ ] node-codegen-map.json has entries for all nodes
- [ ] node-priority-map.json has correct priorities

### Contract Compliance

- [ ] All Priority 1 technical nodes have full contracts
- [ ] All production nodes have contracts
- [ ] All alpha nodes have contracts
- [ ] Contracts match manifest entries

### Runtime Verification

- [ ] Local dev works without production domains
- [ ] Working branch can use localhost
- [ ] Production branch uses canonical domains
- [ ] No cross-branch dependencies

---

## 📊 NODE-DOC-HEALTH METRICS

### node-doc-health.json Schema

```json
{
  "totalNodes": 29,
  "documentedNodes": 29,
  "undocumentedNodes": 0,
  "nodesWithContracts": 29,
  "nodesWithSummaries": 29,
  "nodesWithSettingsModel": 29,
  "nodesWithRuntimeMap": 29,
  "nodesWithCodegenMap": 29,
  "nodesWithAccessRules": 29,
  "nodesWithDependencies": 29,
  "driftWarnings": [],
  "lastAuditAt": "2026-06-13T00:00:00Z"
}
```

---

## 🛠️ REMEDIATION

### If Drift Detected

1. **Identify source of truth** — SUMMARY_DOCS is canonical
2. **Update non-canonical sources** — config, runtime
3. **Document the fix** — Add to driftWarnings with resolution
4. **Re-run audit** — Verify drift resolved

### If Missing Documentation

1. **Create contract** — NODE_CONTRACT_<node-id>.md
2. **Create summary** — NODE_SUMMARY_<node-id>.md
3. **Update manifest** — Add summaryDoc and contractDoc paths
4. **Update state files** — Add missing entries

---

## 📖 RELATED DOCUMENTS

- [node-doc-health.json](../state/node-doc-health.json) — Health metrics
- [NODETREE_MANIFEST.json](../nodes/NODETREE_MANIFEST.json) — Node registry
- [ADR-004](../adr/ADR-004-summary-docs-as-node-source-of-truth.md) — Source of truth ADR

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
