---
title: Troubleshooting Index
description: Индекс troubleshooting руководств для узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - troubleshooting
  - index
  - canonical
related_docs:
  - SUMMARY_DOCS/runbooks/RUNBOOK_INDEX.md
  - SUMMARY_DOCS/contracts/nodes/NodeDocumentationStandard.md
---

# 🔧 TROUBLESHOOTING INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **индекс troubleshooting руководств** для узлов Balloo.

**Troubleshooting** = руководство по диагностике и решению проблем.

---

## 📊 TROUBLESHOOTING STRUCTURE

Каждый troubleshooting содержит минимум 5 сценариев:

1. **Symptom** — что наблюдается
2. **Likely Cause** — вероятная причина
3. **Verification** — как проверить
4. **Safe Action** — безопасное действие
5. **Escalation** — когда эскалировать
6. **Rollback Note** — как откатить
7. **Related Runbook** — ссылка на runbook

---

## 🔒 PRIORITY-1 TECHNICAL TROUBLESHOOTING

| Troubleshooting | Node | Scenarios | Status |
|-----------------|------|-----------|--------|
| [TROUBLESHOOTING_workdocs_working](./TROUBLESHOOTING_workdocs_working.md) | workdocs-working | 5+ | ✅ Active |
| [TROUBLESHOOTING_nodes_switcher_working](./TROUBLESHOOTING_nodes_switcher_working.md) | nodes-switcher-working | 5+ | ✅ Active |
| [TROUBLESHOOTING_kpdegen_working](./TROUBLESHOOTING_kpdegen_working.md) | kpdegen-working | 5+ | ✅ Active |
| [TROUBLESHOOTING_projectgeneralsettings_working](./TROUBLESHOOTING_projectgeneralsettings_working.md) | projectgeneralsettings-working | 5+ | ✅ Active |
| [TROUBLESHOOTING_database_working](./TROUBLESHOOTING_database_working.md) | database-working | 5+ | ✅ Active |

---

## 📖 TROUBLESHOOTING TEMPLATE

```markdown
# 🔧 TROUBLESHOOTING: <node-id>

## Scenario 1: <Problem Name>

**Symptom:**
- <What you observe>

**Likely Cause:**
- <Probable cause>

**Verification:**
```bash
<command to verify>
```

**Safe Action:**
```bash
<safe fix command>
```

**Escalation:**
- When: <when to escalate>
- Who: <who to contact>

**Rollback Note:**
- <how to rollback if fix fails>

**Related Runbook:**
- [RUNBOOK_<node-id>.md](../runbooks/RUNBOOK_<node-id>.md)
```

---

## 🔗 RELATED DOCUMENTS

- [RUNBOOK_INDEX.md](../runbooks/RUNBOOK_INDEX.md) — Runbooks
- [NodeDocumentationStandard.md](../contracts/nodes/NodeDocumentationStandard.md) — Documentation standard
- [NODE_HEALTH_MODEL.md](./NODE_HEALTH_MODEL.md) — Health model

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
