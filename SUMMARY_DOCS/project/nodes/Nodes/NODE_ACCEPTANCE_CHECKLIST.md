---
title: Node Acceptance Checklist
description: Чеклист приёмки документации для каждого узла Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - acceptance
  - checklist
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/state/node-doc-health.json
---

# ✅ NODE ACCEPTANCE CHECKLIST

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **чеклист приёмки** для каждого узла Balloo.

**Цель:** Гарантировать что каждый узел имеет полную документацию.

---

## 📋 CHECKLIST ITEMS

Для каждого узла проверить:

- [ ] **hasSummary** — Есть NODE_SUMMARY_<node-id>.md
- [ ] **hasContract** — Есть NODE_CONTRACT_<node-id>.md
- [ ] **hasManifestEntry** — Есть запись в NODETREE_MANIFEST.json
- [ ] **hasBranchBinding** — Привязка к ветке (production/alpha/working)
- [ ] **hasDomainBinding** — Доменная привязка (или null для no-domain nodes)
- [ ] **hasSettingsSurface** — Определены settings scopes
- [ ] **hasRuntimeModel** — Определён runtime для всех сред
- [ ] **hasCodegenRelevance** — Определён codegen priority
- [ ] **hasAccessRules** — Определены access rules
- [ ] **hasDependencies** — Определены зависимости
- [ ] **hasVersionCapabilities** — Определены capabilities по версиям
- [ ] **hasReleaseRole** — Определена release role

---

## 📊 COVERAGE STATUS

### Priority 1 Technical Nodes

| Node | Summary | Contract | Manifest | Branch | Domain | Settings | Runtime | Codegen | Access | Deps | Capabilities | Release |
|------|---------|----------|----------|--------|--------|----------|---------|---------|--------|------|--------------|---------|
| workdocs-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| nodes-switcher-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| kpdegen-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| projectgeneralsettings-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| database-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Production Nodes

| Node | Summary | Contract | Manifest | Branch | Domain | Settings | Runtime | Codegen | Access | Deps | Capabilities | Release |
|------|---------|----------|----------|--------|--------|----------|---------|---------|--------|------|--------------|---------|
| balloo-production-root | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| api-production | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ai-api-production | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| files-production | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| docs-production | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| future-production | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| admin-production | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| workers-production | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| abaut-production | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| apps-production | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| client-apps-family | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Alpha Nodes

| Node | Summary | Contract | Manifest | Branch | Domain | Settings | Runtime | Codegen | Access | Deps | Capabilities | Release |
|------|---------|----------|----------|--------|--------|----------|---------|---------|--------|------|--------------|---------|
| alpha-root | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| apps-alpha | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2commands-alpha | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Working Nodes (Non-Technical)

| Node | Summary | Contract | Manifest | Branch | Domain | Settings | Runtime | Codegen | Access | Deps | Capabilities | Release |
|------|---------|----------|----------|--------|--------|----------|---------|---------|--------|------|--------------|---------|
| working-root | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| api-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| files-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| docs-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| future-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| pilot-future-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| admin-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| workers-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| abaut-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| apps-working | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 📈 COVERAGE SUMMARY

```
Total Nodes: 29
Fully Documented: 29 (100%)
Partially Documented: 0 (0%)
Undocumented: 0 (0%)

Coverage by Category:
- hasSummary: 29/29 (100%)
- hasContract: 29/29 (100%)
- hasManifestEntry: 29/29 (100%)
- hasBranchBinding: 29/29 (100%)
- hasDomainBinding: 29/29 (100%)
- hasSettingsSurface: 29/29 (100%)
- hasRuntimeModel: 29/29 (100%)
- hasCodegenRelevance: 29/29 (100%)
- hasAccessRules: 29/29 (100%)
- hasDependencies: 29/29 (100%)
- hasVersionCapabilities: 29/29 (100%)
- hasReleaseRole: 29/29 (100%)
```

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [node-doc-health.json](../state/node-doc-health.json) — Health metrics
- [NODE_CAPABILITY_MATRIX.md](./NODE_CAPABILITY_MATRIX.md) — Capability matrix

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
