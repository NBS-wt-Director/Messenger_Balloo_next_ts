---
title: Canonical Node Doc Update Playbook
description: Инструкции по обновлению документации узлов Balloo с приоритетом canonical файлов
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - playbook
  - canonical
  - update
  - docs
related_docs:
  - SUMMARY_DOCS/adr/ADR-004-summary-docs-as-node-source-of-truth.md
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
---

# 📝 CANONICAL NODE DOC UPDATE PLAYBOOK

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот playbook описывает workflow **обновления документации узлов** с приоритетом canonical файлов.

**Цель:** Гарантировать что canonical docs всегда являются source of truth.

---

## 📊 UPDATE PRIORITY ORDER

```
┌────────────────────────────────────────────────────────────────┐
│  PRIORITY 1: CANONICAL FILES (update FIRST)                    │
├────────────────────────────────────────────────────────────────┤
│  1. SUMMARY_DOCS/nodes/contracts/*.md                          │
│  2. SUMMARY_DOCS/nodes/summary/*.md                            │
│  3. SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json                  │
│  4. SUMMARY_DOCS/state/*.json                                  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  PRIORITY 2: GENERATED FILES (update SECOND)                   │
├────────────────────────────────────────────────────────────────┤
│  1. Codegen output from contracts                              │
│  2. Runtime config (generated from state)                      │
│  3. Web reader compatibility layer                             │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  PRIORITY 3: LEGACY STUBS (update LAST, if any)                │
├────────────────────────────────────────────────────────────────┤
│  1. Legacy documentation stubs                                 │
│  2. Old config files (to be deprecated)                        │
│  3. Temporary files                                            │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 UPDATE WORKFLOW

### Step 1: Update Canonical Contracts

```markdown
1. Найти NODE_CONTRACT_<node-id>.md в SUMMARY_DOCS/contracts/nodes/
2. Обновить contract с новыми данными
3. Проверить что contract соответствует ADR-004
4. Commit contract changes
```

### Step 2: Update Canonical Summaries

```markdown
1. Найти NODE_SUMMARY_<node-id>.md в SUMMARY_DOCS/nodes/summary/
2. Обновить summary с новыми данными
3. Проверить что summary отражает contract
4. Commit summary changes
```

### Step 3: Update Manifest

```markdown
1. Открыть SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
2. Найти entry для node
3. Обновить поля (domain, settingsScope, codegenPriority, etc.)
4. Валидировать JSON
5. Commit manifest changes
```

### Step 4: Update State Files

```markdown
1. Обновить соответствующие SUMMARY_DOCS/state/*.json files:
   - branch-tree.json (если изменилась branch)
   - domain-tree.json (если изменился domain)
   - node-settings-map.json (если изменились settings)
   - node-runtime-map.json (если изменился runtime)
   - node-codegen-map.json (если изменился codegen priority)
   - node-access-map.json (если изменились access rules)
   - node-dependency-map.json (если изменились dependencies)
   - node-capability-map.json (если изменились capabilities)
2. Валидировать JSON files
3. Commit state changes
```

### Step 5: Run Codegen

```markdown
1. Запустить kpdegen-working с обновлёнными contracts
2. Проверить что codegen output соответствует contracts
3. Commit generated code (if applicable)
```

### Step 6: Update Web Reader

```markdown
1. Проверить что web reader совместим с изменениями
2. Обновить web docs если нужно
3. Проверить navigation (branch-first, node-first)
4. Проверить что ADR/capability/access matrices отображаются
```

### Step 7: Update Legacy Stubs (если есть)

```markdown
1. Найти legacy documentation stubs
2. Обновить или deprecate
3. Добавить note о том что canonical docs в SUMMARY_DOCS
```

---

## ⚠️ CRITICAL RULES

### Rule 1: Canonical First

```
✅ ALWAYS update canonical files FIRST
❌ NEVER update generated files before canonical
```

### Rule 2: Source of Truth

```
✅ SUMMARY_DOCS is source of truth
❌ UI/runtime config is NOT source of truth
```

### Rule 3: Consistency

```
✅ All state files must be consistent with manifest
❌ Never update only one state file without checking others
```

### Rule 4: Validation

```
✅ Validate JSON files before commit
❌ Never commit invalid JSON
```

### Rule 5: Audit Trail

```
✅ Document changes in node-doc-health.json
❌ Never make undocumented changes
```

---

## 📋 UPDATE CHECKLIST

Для каждого обновления:

- [ ] Canonical contracts updated
- [ ] Canonical summaries updated
- [ ] NODETREE_MANIFEST.json updated
- [ ] State files updated
- [ ] JSON files validated
- [ ] Codegen run (if applicable)
- [ ] Web reader compatibility checked
- [ ] Legacy stubs updated/deprecated
- [ ] node-doc-health.json updated
- [ ] Drift audit run

---

## 📖 RELATED DOCUMENTS

- [ADR-004](../adr/ADR-004-summary-docs-as-node-source-of-truth.md) — Source of truth ADR
- [NODETREE_MANIFEST.json](../nodes/NODETREE_MANIFEST.json) — Node registry
- [node-drift-audit-playbook.md](./node-drift-audit-playbook.md) — Drift audit

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
