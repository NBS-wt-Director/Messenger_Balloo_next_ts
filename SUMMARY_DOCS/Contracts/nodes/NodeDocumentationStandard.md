---
title: Node Documentation Standard
description: Единый стандарт полноты документации для всех узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - standard
  - documentation
  - quality
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md
  - SUMMARY_DOCS/nodes/NODE_COMPLETENESS_SCORING.md
  - SUMMARY_DOCS/playbooks/node-documentation-acceptance-gate.md
---

# 📐 NODE DOCUMENTATION STANDARD

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **единый стандарт полноты документации** для всех узлов Balloo.

**Цель:** Гарантировать что каждый узел описан одинаково глубоко и пригоден для человека и AI.

---

## 📋 MANDATORY DOCUMENTATION LAYERS

### For All Nodes

| Layer | Document | Required |
|-------|----------|----------|
| **Summary** | `NODE_SUMMARY_<node-id>.md` | ✅ Yes |
| **Contract** | `NODE_CONTRACT_<node-id>.md` | ✅ Yes |
| **Manifest Entry** | `NODETREE_MANIFEST.json` | ✅ Yes |
| **Settings Mapping** | `node-settings-map.json` | ✅ Yes |
| **Runtime Mapping** | `node-runtime-map.json` | ✅ Yes |
| **Access Rules** | `node-access-map.json` | ✅ Yes |
| **Dependencies** | `node-dependency-map.json` | ✅ Yes |
| **Capabilities** | `node-capability-map.json` | ✅ Yes |
| **Health Definition** | `node-health-map.json` | ✅ Yes |
| **Ownership Metadata** | `node-ownership-map.json` | ✅ Yes |

### For Operational Nodes (Priority 1-2)

| Layer | Document | Required |
|-------|----------|----------|
| **Runbook** | `RUNBOOK_<node-id>.md` | ✅ Yes |
| **Quickstart** | `QUICKSTART_<node-id>.md` | ✅ Yes |
| **Troubleshooting** | `TROUBLESHOOTING_<node-id>.md` | ✅ Yes |
| **Examples** | `NODE_EXAMPLES_<node-id>.md` | ✅ Yes |

### For Public-Facing Nodes

| Layer | Document | Required |
|-------|----------|----------|
| **Examples** | `NODE_EXAMPLES_<node-id>.md` | ⚠️ Recommended |
| **Quickstart** | `QUICKSTART_<node-id>.md` | ⚠️ Recommended |

---

## 📄 MANDATORY SECTIONS

### Node Summary (Human-Readable)

```markdown
Required Sections:
1. Что это за узел (краткое описание)
2. Зачем он нужен (purpose)
3. Где он живёт в branch tree (branch binding)
4. Как к нему обращаться (environment mappings)
5. Какие у него функции (functional surface)
6. Какие у него настройки (settings surface)
7. Почему он важен (importance)

Minimum Length: 300 words
Maximum Length: 1500 words
Reading Time: 3-5 minutes
```

### Node Contract (AI-Readable)

```markdown
Required Sections:
1. Node Identity (nodeId, canonicalName, branch, nodeType)
2. Branch Binding
3. Domain Binding
4. Purpose
5. Functional Surface
6. Settings Surface
7. Runtime Model
8. Auth and Access
9. Codegen Relevance
10. Dependencies
11. Related Modules
12. Invariants
13. Environment Behavior
14. Release Role

Minimum Length: 800 words
Maximum Length: 3000 words
Format: YAML blocks for machine parsing
```

### Node Runbook (Operational)

```markdown
Required Sections:
1. Purpose
2. Health Check
3. Start Conditions
4. Required Inputs/Config
5. Common Failure Modes (минимум 3)
6. Safe Restart Procedure
7. Rollback Hints
8. Access Requirements
9. Logs/Diagnostic Surfaces
10. Related Contracts/Docs

Minimum Length: 1000 words
Format: Step-by-step commands
```

### Node Quickstart (Fast Entry)

```markdown
Required Sections:
1. Что это за узел (1-2 предложения)
2. Когда он нужен (use cases)
3. Как его открыть/найти (URL/port)
4. Как понять, что он работает (health check)
5. Что делать в первую очередь (first steps)
6. Где его полный contract (link)
7. Где его runbook (link)
8. Что нельзя делать (forbidden actions)

Minimum Length: 200 words
Maximum Length: 500 words
Reading Time: 1-2 minutes
```

### Node Troubleshooting (Problem Resolution)

```markdown
Required Sections (минимум 5 scenarios):
- Symptom
- Likely Cause
- Verification
- Safe Action
- Escalation Path
- Rollback Note
- Related Runbook

Format: Table or structured list
```

### Node Examples (Usage Patterns)

```markdown
Required for Priority-1 Technical Nodes:
1. Пример входного контекста
2. Пример использования
3. Пример expected output
4. Пример ошибки/невалидного сценария

Format: Code blocks with explanations
```

---

## 🤖 HUMAN vs AI READABILITY RULES

### Human-Readable Docs Must

- ✅ Иметь ясный purpose в первом абзаце
- ✅ Избегать неоднозначности (no "maybe", "possibly")
- ✅ Иметь короткое вступление (≤3 предложения)
- ✅ Иметь quickstart section
- ✅ Иметь примеры использования
- ✅ Иметь troubleshooting section
- ✅ Использовать headings для навигации
- ✅ Иметь cross-references к related docs

### AI-Readable Docs Must

- ✅ Иметь стабильные секции (consistent structure)
- ✅ Иметь явные поля и статусы (YAML/JSON blocks)
- ✅ Иметь machine-readable links to related docs/state
- ✅ Не использовать расплывчатые формулировки
- ✅ Иметь explicit invariants
- ✅ Иметь forbidden assumptions
- ✅ Иметь canonical identifiers (nodeId, branch, etc.)
- ✅ Иметь version information

---

## ✅ MINIMUM QUALITY RULES

### Completeness Rules

1. **No Empty Sections** — каждая секция должна содержать информацию
2. **No Placeholder Text** — "TODO", "FIXME" запрещены
3. **No Broken Links** — все cross-references должны работать
4. **Consistent Terminology** — использовать glossary термины
5. **Up-to-Date** — актуализировать при изменении узла

### Accuracy Rules

1. **Truthful** — не выдумывать несуществующие функции
2. **Evidence-Based** — claims должны иметь evidence
3. **Version-Scoped** — version-scoped capabilities явно marked
4. **No Speculation** — planned features marked as planned

### Consistency Rules

1. **Cross-Document** — summary, contract, runbook должны быть консистентны
2. **Manifest Alignment** — manifest entry должен соответствовать docs
3. **State Alignment** — state files должны соответствовать docs

---

## 📊 COMPLETENESS CRITERIA

### Documentation is Complete When

- [ ] Summary exists and meets length requirements
- [ ] Contract exists and has all 14 sections
- [ ] Runbook exists (for operational nodes)
- [ ] Quickstart exists
- [ ] Troubleshooting exists (минимум 5 scenarios)
- [ ] Examples exist (для priority-1 technical nodes)
- [ ] All state file entries exist
- [ ] All manifest entries exist
- [ ] All links work
- [ ] No TODO/FIXME placeholders
- [ ] Completeness score ≥ threshold

### Thresholds by Node Type

| Node Type | Minimum Score | Required Layers |
|-----------|--------------|-----------------|
| **Priority-1 Technical** | 95 | All layers |
| **Priority-2 Working** | 85 | Summary, Contract, Runbook, Quickstart |
| **Alpha** | 75 | Summary, Contract, Quickstart |
| **Production Public** | 85 | Summary, Contract, Runbook, Examples |
| **Planned** | 65 | Summary, Contract (until implemented) |

---

## 🔄 REVIEW RULES

### Review Cadence

| Node Type | Cadence | Reviewer |
|-----------|---------|----------|
| **Priority-1 Technical** | Weekly | Owner + Tech Lead |
| **Priority-2 Working** | Monthly | Owner |
| **Production** | Monthly | Owner + QA |
| **Alpha** | Quarterly | Owner |
| **Planned** | Quarterly | Product Owner |

### Review Checklist

- [ ] Documentation is up-to-date
- [ ] No broken links
- [ ] Examples still work
- [ ] Runbook procedures tested
- [ ] Troubleshooting scenarios valid
- [ ] Completeness score accurate
- [ ] State files synchronized

### Update Triggers

Документация ДОЛЖНА быть обновлена при:

- Изменении runtime settings
- Изменении domain binding
- Изменении access rules
- Изменении dependencies
- Изменении health checks
- Добавлении/удалении features
- Post-incident (после сбоев)

---

## 🚫 FORBIDDEN PATTERNS

### Never Do

- ❌ Empty sections
- ❌ Placeholder text (TODO, FIXME)
- ❌ Broken cross-references
- ❌ Outdated screenshots
- ❌ Contradictory information
- ❌ Speculation without marking
- ❌ Hardware-specific details
- ❌ Secret values in examples

### Always Do

- ✅ Mark planned features as planned
- ✅ Use version scoping (3.1.*, 4.*)
- ✅ Provide evidence for claims
- ✅ Keep examples realistic
- ✅ Update docs in same change set as code
- ✅ Flag deprecated docs

---

## 📖 RELATED DOCUMENTS

- [NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md](../nodes/NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md) — Completeness matrix
- [NODE_COMPLETENESS_SCORING.md](../nodes/NODE_COMPLETENESS_SCORING.md) — Scoring model
- [node-documentation-acceptance-gate.md](../playbooks/node-documentation-acceptance-gate.md) — Acceptance gate
- [NodeDocAudienceContract.md](./NodeDocAudienceContract.md) — Human vs AI audience

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
