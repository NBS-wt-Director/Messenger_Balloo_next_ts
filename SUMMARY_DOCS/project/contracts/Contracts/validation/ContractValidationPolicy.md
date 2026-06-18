---
title: Contract Validation Policy
description: Политика валидации контрактов узлов и модулей Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - validation
  - contracts
  - policy
  - canonical
related_docs:
  - SUMMARY_DOCS/contracts/validation/NodeContractValidationChecklist.md
  - SUMMARY_DOCS/contracts/validation/ModuleContractValidationChecklist.md
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
---

# ✅ CONTRACT VALIDATION POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **политику валидации контрактов** для узлов и модулей Balloo.

**Цель:** Гарантировать что все контракты полны, консистентны и актуальны.

---

## 📋 VALIDATION REQUIREMENTS

### 1. New/Changed Node Contract

Каждый новый или изменённый node contract ДОЛЖЕН проверяться на:

- [ ] **Completeness** — все required sections present
- [ ] **Consistency** — нет противоречий внутри контракта
- [ ] **Manifest Alignment** — соответствует entry в NODETREE_MANIFEST.json
- [ ] **State Alignment** — соответствует state files
- [ ] **Branch Binding** — ветка указана корректно
- [ ] **Domain Binding** — домен указан корректно (или null)
- [ ] **Settings Surface** — settings scopes определены
- [ ] **Runtime Model** — runtime mapping определён
- [ ] **Access Rules** — access rules определены
- [ ] **Dependencies** — зависимости зафиксированы

### 2. Manifest/State Entry Validation

Каждая запись в manifest/state ДОЛЖНА проверяться на:

- [ ] **Schema Compliance** — соответствует JSON schema
- [ ] **Node Existence** — node существует в manifest
- [ ] **Branch Consistency** — branch соответствует node contract
- [ ] **Domain Consistency** — domain соответствует node contract
- [ ] **Settings Consistency** — settings scopes соответствуют contract

### 3. Breaking Changes

Breaking changes в node identity/domain binding/settings surface ТРЕБУЮТ:

- [ ] **Explicit Documentation** — явно задокументировано в contract
- [ ] **Manifest Update** — NODETREE_MANIFEST.json обновлён
- [ ] **State Update** — state files обновлены
- [ ] **Runbook Update** — runbook обновлён (если есть)
- [ ] **Health Model Update** — health model обновлён (если есть)
- [ ] **Ownership Update** — ownership metadata обновлён (если нужно)

### 4. Version-Scoped Capabilities

Version-scoped capabilities НЕ МОГУТ silently become active без:

- [ ] **Matrix Update** — NODE_CAPABILITY_MATRIX.md обновлён
- [ ] **Contract Update** — contract обновлён с новой версией
- [ ] **State Update** — node-capability-map.json обновлён
- [ ] **Evidence** — evidence реализации предоставлено

---

## 🔍 VALIDATION WORKFLOW

### Pre-Commit Validation

```bash
# 1. Validate contract structure
node scripts/validate-contract.js --contract NODE_CONTRACT_<node-id>.md

# 2. Validate manifest
node scripts/validate-manifest.js --schema node-manifest.schema.json

# 3. Validate state files
node scripts/validate-state.js --state state/

# 4. Check for drift
node scripts/check-drift.js
```

### Post-Commit Validation

```bash
# 1. Run full validation suite
node scripts/full-validation.js

# 2. Generate validation report
node scripts/generate-validation-report.js

# 3. Update node-doc-health.json
node scripts/update-doc-health.js
```

---

## 📊 VALIDATION SEVERITY

| Severity | Description | Action |
|----------|-------------|--------|
| **Critical** | Contract invalid, manifest broken | Block commit |
| **High** | Missing required sections | Fix before merge |
| **Medium** | Inconsistent state | Fix in PR |
| **Low** | Minor issues | Fix in next sprint |

---

## ✅ VALIDATION CHECKLISTS

### Node Contract Validation

См. [NodeContractValidationChecklist.md](./NodeContractValidationChecklist.md)

### Module Contract Validation

См. [ModuleContractValidationChecklist.md](./ModuleContractValidationChecklist.md)

---

## 🔗 RELATED DOCUMENTS

- [NodeContractValidationChecklist.md](./NodeContractValidationChecklist.md) — Node validation checklist
- [ModuleContractValidationChecklist.md](./ModuleContractValidationChecklist.md) — Module validation checklist
- [node-doc-health.json](../state/node-doc-health.json) — Health metrics
- [canonical-node-doc-update-playbook.md](../playbooks/canonical-node-doc-update-playbook.md) — Update playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
