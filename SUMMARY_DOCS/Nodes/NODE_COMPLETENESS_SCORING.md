---
title: Node Completeness Scoring Model
description: Модель оценки полноты документации узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - scoring
  - completeness
  - quality
  - canonical
related_docs:
  - SUMMARY_DOCS/contracts/nodes/NodeDocumentationStandard.md
  - SUMMARY_DOCS/nodes/NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md
  - SUMMARY_DOCS/state/node-documentation-completeness.json
---

# 📊 NODE COMPLETENESS SCORING MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **модель оценки полноты** документации узлов.

**Цель:** Обеспечить объективную метрику качества документации.

---

## 📈 SCORING SCALE

### Score Ranges

| Score Range | Status | Description | Action Required |
|-------------|--------|-------------|-----------------|
| **95-100** | ✅ codegen-ready / human-ready | Полная документация | Weekly review |
| **80-94** | ✅ strong | Хорошая документация | Monthly review |
| **60-79** | ⚠️ workable | Базовая документация | Improve to 80+ |
| **30-59** | ⚠️ partial | Неполная документация | Critical improvements needed |
| **0-29** | ❌ skeletal | Минимальная документация | Unacceptable, immediate action |

---

## 📊 SCORING CRITERIA

### Mandatory Layers (70 points total)

| Criterion | Points | Description |
|-----------|--------|-------------|
| **hasSummary** | 10 | NODE_SUMMARY_<node-id>.md exists and meets requirements |
| **hasContract** | 10 | NODE_CONTRACT_<node-id>.md exists with all sections |
| **hasManifestEntry** | 5 | Entry in NODETREE_MANIFEST.json |
| **hasRuntimeModel** | 5 | Runtime defined for all environments |
| **hasSettingsMapping** | 5 | Mapping in node-settings-map.json |
| **hasAccessRules** | 5 | Mapping in node-access-map.json |
| **hasDependencies** | 5 | Mapping in node-dependency-map.json |
| **hasCapabilities** | 5 | Mapping in node-capability-map.json |
| **hasHealthDefinition** | 5 | Mapping in node-health-map.json |
| **hasOwnershipMetadata** | 5 | Mapping in node-ownership-map.json |
| **hasSchemasReference** | 5 | Reference to schemas exists |

### Operational Layers (30 points total)

| Criterion | Points | Description |
|-----------|--------|-------------|
| **hasRunbook** | 10 | RUNBOOK_<node-id>.md exists with all sections |
| **hasHumanQuickstart** | 5 | QUICKSTART_<node-id>.md exists |
| **hasTroubleshooting** | 5 | TROUBLESHOOTING_<node-id>.md with ≥5 scenarios |
| **hasExamples** | 5 | Usage examples exist (required for priority-1) |
| **hasRollback** | 5 | Rollback instructions in runbook |

### AI Enhancement Layers (Bonus 10 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| **hasAIUsageNotes** | 5 | AI-specific usage notes |
| **hasMachineReadableBlocks** | 5 | YAML/JSON blocks for parsing |

**Total Possible:** 100 + 10 bonus = 110 (capped at 100)

---

## 🎯 MINIMUM SCORES BY NODE TYPE

| Node Type | Minimum Required | Target | Critical Threshold |
|-----------|-----------------|--------|-------------------|
| **Priority-1 Technical** | 95 | 100 | <90 = escalate |
| **Priority-2 Working** | 85 | 95 | <80 = escalate |
| **Alpha** | 75 | 90 | <70 = escalate |
| **Production Public** | 85 | 95 | <80 = escalate |
| **Planned** | 65 | 85 | <60 = escalate |

---

## 📐 SCORING FORMULA

```
Base Score = Sum of (criterion_points * criterion_met)

Where:
  criterion_met = 1 if criterion satisfied, 0 otherwise

Final Score = min(100, Base Score + Bonus Points)
```

### Example Calculation

```
Priority-1 Technical Node:

Mandatory Layers:
- hasSummary: 10 ✅
- hasContract: 10 ✅
- hasManifestEntry: 5 ✅
- hasRuntimeModel: 5 ✅
- hasSettingsMapping: 5 ✅
- hasAccessRules: 5 ✅
- hasDependencies: 5 ✅
- hasCapabilities: 5 ✅
- hasHealthDefinition: 5 ✅
- hasOwnershipMetadata: 5 ✅
- hasSchemasReference: 5 ✅
Subtotal: 60

Operational Layers:
- hasRunbook: 10 ✅
- hasHumanQuickstart: 5 ✅
- hasTroubleshooting: 5 ✅
- hasExamples: 5 ✅
- hasRollback: 5 ✅
Subtotal: 30

Bonus:
- hasAIUsageNotes: 5 ✅
- hasMachineReadableBlocks: 5 ✅
Subtotal: 10

Total: 60 + 30 + 10 = 100
```

---

## ⚠️ SCORE INTERPRETATION

### 95-100: Codegen-Ready / Human-Ready

```
✅ All mandatory layers present
✅ All operational layers present
✅ AI enhancement layers present
✅ No TODO/FIXME placeholders
✅ All links working
✅ Examples tested and valid
✅ Runbook procedures verified

Action: Weekly review, maintain quality
```

### 80-94: Strong

```
✅ Most mandatory layers present
✅ Most operational layers present
⚠️ Minor gaps (1-2 criteria missing)
✅ No critical gaps

Action: Monthly review, fill minor gaps
```

### 60-79: Workable

```
⚠️ Some mandatory layers missing
⚠️ Operational layers incomplete
⚠️ Examples or troubleshooting missing

Action: Prioritize improvements, target 80+
```

### 30-59: Partial

```
❌ Multiple mandatory layers missing
❌ Critical gaps in documentation
❌ Unreliable for codegen or human use

Action: Critical improvements needed, escalate
```

### 0-29: Skeletal

```
❌ Most documentation missing
❌ Unacceptable for any use
❌ Blocks development and operations

Action: Immediate action required, block deployments
```

---

## 🔄 REVIEW CADENCE BY SCORE

| Score Range | Review Frequency | Reviewer |
|-------------|-----------------|----------|
| **95-100** | Weekly | Owner |
| **80-94** | Monthly | Owner |
| **60-79** | Bi-weekly | Owner + Tech Lead |
| **30-59** | Weekly | Owner + Tech Lead + QA |
| **0-29** | Immediate | Escalate to CTO |

---

## 📊 TRACKING AND REPORTING

### Monthly Report Metrics

- Average score across all nodes
- Median score
- Nodes below threshold
- Nodes improved since last month
- Nodes degraded since last month
- Critical gaps identified

### Quarterly Goals

- All priority-1 technical nodes ≥95
- All working nodes ≥85
- All production nodes ≥85
- No nodes below 60

---

## ✅ CRITICAL INVARIANTS

1. **Priority-1 technical nodes MUST maintain ≥95** — never drop below
2. **Score must be recalculated on every doc change** — automated
3. **Below threshold triggers escalation** — automatic alert
4. **Score visible in web reader** — transparency
5. **Score included in node-doc-health.json** — tracked

---

## 📖 RELATED DOCUMENTS

- [NodeDocumentationStandard.md](../contracts/nodes/NodeDocumentationStandard.md) — Documentation standard
- [NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md](./NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md) — Completeness matrix
- [node-documentation-completeness.json](../state/node-documentation-completeness.json) — Completeness state

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
