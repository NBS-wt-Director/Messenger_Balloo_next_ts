---
title: Node Examples Index
description: Индекс примеров использования узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - examples
  - index
  - canonical
related_docs:
  - SUMMARY_DOCS/contracts/nodes/NodeExamplesPolicy.md
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
---

# 📖 NODE EXAMPLES INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **индекс примеров использования** для узлов Balloo.

**Examples** = реалистичные примеры входных данных, использования и output.

---

## 📊 EXAMPLES STRUCTURE

Каждый examples документ содержит:

1. **Пример входного контекста** — input data/contracts
2. **Пример использования** — usage scenario
3. **Пример expected output** — expected result
4. **Пример ошибки** — invalid scenario

---

## 🔒 PRIORITY-1 TECHNICAL EXAMPLES

| Examples | Node | Status |
|----------|------|--------|
| [NODE_EXAMPLES_workdocs_working](./NODE_EXAMPLES_workdocs_working.md) | workdocs-working | ✅ Active |
| [NODE_EXAMPLES_nodes_switcher_working](./NODE_EXAMPLES_nodes_switcher_working.md) | nodes-switcher-working | ✅ Active |
| [NODE_EXAMPLES_kpdegen_working](./NODE_EXAMPLES_kpdegen_working.md) | kpdegen-working | ✅ Active |
| [NODE_EXAMPLES_projectgeneralsettings_working](./NODE_EXAMPLES_projectgeneralsettings_working.md) | projectgeneralsettings-working | ✅ Active |
| [NODE_EXAMPLES_database_working](./NODE_EXAMPLES_database_working.md) | database-working | ✅ Active |

---

## 📖 EXAMPLES TEMPLATE

```markdown
# 📖 EXAMPLES: <node-id>

## Example 1: <Use Case Name>

### Input Context

```json
{
  "key": "value"
}
```

### Usage

```bash
<command or code>
```

### Expected Output

```json
{
  "result": "success"
}
```

### Notes

<explanation>

---

## Example 2: <Error Scenario>

### Invalid Input

```json
{
  "key": "invalid_value"
}
```

### What Happens

<description of error>

### How to Fix

<fix instructions>
```

---

## ✅ EXAMPLES POLICY

- ✅ Examples MUST быть реалистичными
- ✅ Examples MUST не противоречить contracts
- ✅ Examples MUST помогать codegen
- ✅ Examples MUST быть протестированы

---

## 🔗 RELATED DOCUMENTS

- [NodeExamplesPolicy.md](../contracts/nodes/NodeExamplesPolicy.md) — Examples policy
- [NodeDocumentationStandard.md](../contracts/nodes/NodeDocumentationStandard.md) — Documentation standard
- [RUNBOOK_INDEX.md](../runbooks/RUNBOOK_INDEX.md) — Runbooks

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
