---
title: Node Documentation Acceptance Gate
description: Gate проверки полноты документации узла Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - acceptance
  - gate
  - quality
  - canonical
related_docs:
  - SUMMARY_DOCS/contracts/nodes/NodeDocumentationStandard.md
  - SUMMARY_DOCS/nodes/NODE_COMPLETENESS_SCORING.md
  - SUMMARY_DOCS/nodes/NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md
---

# 🚪 NODE DOCUMENTATION ACCEPTANCE GATE

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот document определяет **gate проверки полноты документации** для узлов Balloo.

**Цель:** Гарантировать что узел не считается fully documented пока не пройдет все checks.

---

## 📋 ACCEPTANCE CRITERIA

Узел НЕ считается fully documented, пока нет:

### Mandatory Documents

- [ ] **Summary** — `NODE_SUMMARY_<node-id>.md`
- [ ] **Contract** — `NODE_CONTRACT_<node-id>.md`
- [ ] **Runbook** — `RUNBOOK_<node-id>.md` (для operational nodes)
- [ ] **Quickstart** — `QUICKSTART_<node-id>.md`
- [ ] **Troubleshooting** — `TROUBLESHOOTING_<node-id>.md`
- [ ] **Examples** — `NODE_EXAMPLES_<node-id>.md` (для priority-1 technical)

### Mandatory State Entries

- [ ] **Manifest Entry** — запись в `NODETREE_MANIFEST.json`
- [ ] **Health Definition** — запись в `node-health-map.json`
- [ ] **Settings Mapping** — запись в `node-settings-map.json`
- [ ] **Runtime Mapping** — запись в `node-runtime-map.json`
- [ ] **Access Rules** — запись в `node-access-map.json`
- [ ] **Dependencies** — запись в `node-dependency-map.json`
- [ ] **Capabilities** — запись в `node-capability-map.json`
- [ ] **Ownership Metadata** — запись в `node-ownership-map.json`

### Quality Checks

- [ ] **Completeness Score ≥ Threshold** — по типу узла
- [ ] **No TODO/FIXME** — нет placeholder text
- [ ] **All Links Work** — все cross-references работают
- [ ] **Examples Tested** — примеры протестированы
- [ ] **Runbook Procedures Verified** — процедуры проверены

---

## 📊 SCORE THRESHOLDS

| Node Type | Minimum Score | Gate Status |
|-----------|--------------|-------------|
| **Priority-1 Technical** | 95 | ❌ Block if <95 |
| **Priority-2 Working** | 85 | ❌ Block if <85 |
| **Alpha** | 75 | ⚠️ Warn if <75 |
| **Production Public** | 85 | ❌ Block if <85 |
| **Planned** | 65 | ⚠️ Warn if <65 |

---

## 🚪 GATE WORKFLOW

### Step 1: Self-Check

```markdown
Author проверяет:
- [ ] Все mandatory documents созданы
- [ ] Все mandatory state entries добавлены
- [ ] Completeness score рассчитан
- [ ] Score ≥ threshold для типа узла
```

### Step 2: Automated Validation

```bash
# Run validation script
node scripts/validate-node-docs.js --node <node-id>

# Check completeness score
node scripts/calculate-completeness.js --node <node-id>

# Validate links
node scripts/check-links.js --node <node-id>
```

### Step 3: Peer Review

```markdown
Reviewer проверяет:
- [ ] Summary понятен human
- [ ] Contract parse-ится AI
- [ ] Runbook процедуры работают
- [ ] Examples реалистичны
- [ ] Troubleshooting покрывает common issues
```

### Step 4: Gate Decision

| Result | Action |
|--------|--------|
| **All checks pass** | ✅ Gate passed, merge allowed |
| **Minor issues** | ⚠️ Fix before merge |
| **Major issues** | ❌ Block merge, fix required |
| **Score below threshold** | ❌ Block merge, improve docs |

---

## 📋 CHECKLIST BY NODE TYPE

### Priority-1 Technical Nodes

```markdown
Required:
- [ ] Summary (≥300 words)
- [ ] Contract (all 14 sections)
- [ ] Runbook (all 10 sections)
- [ ] Quickstart (all 8 questions)
- [ ] Troubleshooting (≥5 scenarios)
- [ ] Examples (≥4 examples)
- [ ] Health definition
- [ ] Ownership metadata
- [ ] All state entries
- [ ] Completeness score ≥95
```

### Production Public Nodes

```markdown
Required:
- [ ] Summary (≥300 words)
- [ ] Contract (all 14 sections)
- [ ] Runbook (all 10 sections)
- [ ] Quickstart (all 8 questions)
- [ ] Examples (≥2 examples)
- [ ] Health definition
- [ ] Ownership metadata
- [ ] All state entries
- [ ] Completeness score ≥85
```

### Alpha Nodes

```markdown
Required:
- [ ] Summary (≥300 words)
- [ ] Contract (all 14 sections)
- [ ] Quickstart (all 8 questions)
- [ ] Health definition
- [ ] Ownership metadata
- [ ] All state entries
- [ ] Completeness score ≥75
```

---

## 🔗 RELATED DOCUMENTS

- [NodeDocumentationStandard.md](../contracts/nodes/NodeDocumentationStandard.md) — Documentation standard
- [NODE_COMPLETENESS_SCORING.md](../nodes/NODE_COMPLETENESS_SCORING.md) — Scoring model
- [NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md](../nodes/NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md) — Completeness matrix

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
