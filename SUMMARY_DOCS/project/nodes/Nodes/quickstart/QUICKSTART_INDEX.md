---
title: Quickstart Index
description: Индекс quickstart руководств для узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - quickstart
  - index
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/NodeDocumentationStandard.md
---

# 🚀 QUICKSTART INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **индекс quickstart руководств** для узлов Balloo.

**Quickstart** = краткое руководство для быстрого начала работы с узлом.

---

## 📊 QUICKSTART STRUCTURE

Каждый quickstart отвечает на 8 вопросов:

1. **Что это за узел** — 1-2 предложения
2. **Когда он нужен** — use cases
3. **Как его открыть/найти** — URL/port
4. **Как понять, что он работает** — health check
5. **Что делать в первую очередь** — first steps
6. **Где его полный contract** — link
7. **Где его runbook** — link
8. **Что нельзя делать** — forbidden actions

---

## 🔒 PRIORITY-1 TECHNICAL QUICKSTARTS

| Quickstart | Node | Domain | Status |
|------------|------|--------|--------|
| [QUICKSTART_workdocs_working](./QUICKSTART_workdocs_working.md) | workdocs-working | workdocs.working.balloo.su | ✅ Active |
| [QUICKSTART_nodes_switcher_working](./QUICKSTART_nodes_switcher_working.md) | nodes-switcher-working | nodes-switcher.working.balloo.su | ✅ Active |
| [QUICKSTART_kpdegen_working](./QUICKSTART_kpdegen_working.md) | kpdegen-working | kpdegen.working.balloo.su | ✅ Active |
| [QUICKSTART_projectgeneralsettings_working](./QUICKSTART_projectgeneralsettings_working.md) | projectgeneralsettings-working | projectgeneralsettings.working.balloo.su | ✅ Active |
| [QUICKSTART_database_working](./QUICKSTART_database_working.md) | database-working | (no domain) | ✅ Active |

---

## 🏭 PRODUCTION QUICKSTARTS (Excerpt)

| Quickstart | Node | Domain | Status |
|------------|------|--------|--------|
| [QUICKSTART_balloo_production_root](./QUICKSTART_balloo_production_root.md) | balloo-production-root | balloo.su | ✅ Active |
| [QUICKSTART_api_production](./QUICKSTART_api_production.md) | api-production | api.balloo.su | ✅ Active |
| [QUICKSTART_docs_production](./QUICKSTART_docs_production.md) | docs-production | docs.balloo.su | ✅ Active |

---

## 📖 QUICKSTART TEMPLATE

```markdown
# 🚀 QUICKSTART: <node-id>

**Что это:** <1-2 предложения>

**Когда нужен:** <use cases>

**Где найти:**
- Production: `<URL>`
- Working: `<URL or localhost:PORT>`
- Local Dev: `localhost:PORT`

**Проверка работы:**
```bash
curl http://localhost:PORT/health
# Expected: {"status": "healthy"}
```

**Первые шаги:**
1. <Step 1>
2. <Step 2>
3. <Step 3>

**Полная документация:**
- [Contract](../contracts/nodes/NODE_CONTRACT_<node-id>.md)
- [Runbook](../runbooks/RUNBOOK_<node-id>.md)

**Нельзя:**
- ❌ <Forbidden action 1>
- ❌ <Forbidden action 2>
```

---

## ✅ USAGE

### For Humans

- Start here when encountering a node for the first time
- Get up and running in 5 minutes
- Find links to full documentation

### For AI

- Use as fast-entry layer
- Extract node identity and purpose
- Link to full contract and runbook

---

## 🔗 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md) — Node tree index
- [NodeDocumentationStandard.md](../contracts/nodes/NodeDocumentationStandard.md) — Documentation standard
- [RUNBOOK_INDEX.md](../runbooks/RUNBOOK_INDEX.md) — Runbooks

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
