---
title: 'Template: Node Summary'
description: Шаблон для summary документа узла Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - template
  - node-summary
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/templates/TEMPLATE_NODE_CONTRACT.md
---

# 📄 TEMPLATE: NODE SUMMARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 📝 TEMPLATE

```markdown
---
title: 'Node: <node-id>'
description: <Short description>
version: 1.0.0
date: YYYY-MM-DD
author: <Author>
status: active
audience: both
tags:
  - node
  - <branch>
  - <node-type>
related_docs:
  - SUMMARY_DOCS/contracts/nodes/NODE_CONTRACT_<node-id>.md
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
---

# 🏷️ NODE: <node-id>

**Node ID:** `<node-id>`  
**Domain:** `<domain or null>`  
**Local Dev:** `<localhost:PORT>`  
**Priority:** `<1-4>`  
**Branch:** `<production|alpha|working>`  

---

## 1. ЧТО ЭТО ЗА УЗЕЛ

<Description of what this node is>

---

## 2. ЗАЧЕМ ОН НУЖЕН

<Purpose and key responsibilities>

---

## 3. ГДЕ ОН ЖИВЁТ В BRANCH TREE

<Branch binding and relation to other nodes>

---

## 4. КАК К НЕМУ ОБРАЩАТЬСЯ

| Environment | Access |
|-------------|--------|
| Local Dev | `localhost:PORT` |
| Working | `<domain or localhost>` |
| Alpha | `<alpha domain>` |
| Production | `<production domain>` |

---

## 5. КАКИЕ У НЕГО ФУНКЦИИ

- <Function 1>
- <Function 2>
- <Function 3>

---

## 6. КАКИЕ У НЕГО НАСТРОЙКИ

| Setting | Scope | Default | Mutable By |
|---------|-------|---------|------------|
| <setting> | <scope> | <default> | <who> |

---

## 7. ПОЧЕМУ ОН ВАЖЕН

<Importance and criticality>

---

## 🔗 RELATED DOCUMENTS

- [NODE_CONTRACT_<node-id>.md](../contracts/nodes/NODE_CONTRACT_<node-id>.md) — Node contract
- [NODETREE_MANIFEST.json](../nodes/NODETREE_MANIFEST.json) — Node registry
- [RUNBOOK_<node-id>.md](../runbooks/RUNBOOK_<node-id>.md) — Runbook (if exists)

---

**Создано:** YYYY-MM-DD  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** <Author>

---

**🎈 Balloo - Переверни общение!**
```

---

## 📋 REQUIRED SECTIONS

1. **Что это за узел** — краткое описание
2. **Зачем он нужен** — purpose
3. **Где он живёт** — branch binding
4. **Как к нему обращаться** — environments
5. **Какие у него функции** — functional surface
6. **Какие у него настройки** — settings surface
7. **Почему он важен** — importance

---

## ✅ BEST PRACTICES

- ✅ Кратко и по делу
- ✅ Human-readable
- ✅ Cross-references к contract
- ✅ Актуальные environment mappings
- ✅ Нет hardware-specific деталей

---

**🎈 Balloo - Переверни общение!**
