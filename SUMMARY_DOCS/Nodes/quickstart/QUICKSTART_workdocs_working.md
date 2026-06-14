---
title: 'Quickstart: workdocs-working'
description: Быстрый старт для workdocs.working.balloo.su
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - quickstart
  - workdocs
  - priority-1
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/technical/NODE_workdocs_working.md
  - SUMMARY_DOCS/contracts/nodes/NODE_CONTRACT_workdocs_working.md
  - SUMMARY_DOCS/runbooks/RUNBOOK_workdocs_working.md
---

# 🚀 QUICKSTART: workdocs-working

**Что это:** Рабочая документация Balloo для разработчиков и AI — presentation layer для SUMMARY_DOCS.

**Когда нужен:** Когда нужно прочитать документацию узла, contract, runbook или использовать AI для работы с docs.

---

## 📍 ГДЕ НАЙТИ

| Среда | Access |
|-------|--------|
| **Working** | `https://workdocs.working.balloo.su:3210` |
| **Local Dev** | `http://localhost:3210` |

---

## ✅ ПРОВЕРКА РАБОТЫ

```bash
curl http://localhost:3210/health
```

**Ожидаемый ответ:**
```json
{
  "status": "healthy",
  "docs_loaded": 50,
  "contracts_loaded": 30
}
```

---

## 🎯 ПЕРВЫЕ ШАГИ

### 1. Открыть индекс

```
http://localhost:3210/nodes/NODETREE_INDEX.md
```

### 2. Найти нужный узел

Использовать навигацию по:
- Branch (production/alpha/working)
- Node type (technical/public)
- Priority (1-4)

### 3. Прочитать summary

Для быстрого понимания узла.

### 4. Прочитать contract

Для полной спецификации.

### 5. Открыть runbook

Для операционных инструкций.

---

## 📚 ПОЛНАЯ ДОКУМЕНТАЦИЯ

| Документ | Link |
|----------|------|
| **Summary** | [NODE_workdocs_working.md](../technical/NODE_workdocs_working.md) |
| **Contract** | [NODE_CONTRACT_workdocs_working.md](../contracts/nodes/NODE_CONTRACT_workdocs_working.md) |
| **Runbook** | [RUNBOOK_workdocs_working.md](../runbooks/RUNBOOK_workdocs_working.md) |
| **Troubleshooting** | [TROUBLESHOOTING_workdocs_working.md](../troubleshooting/TROUBLESHOOTING_workdocs_working.md) |
| **Examples** | [NODE_EXAMPLES_workdocs_working.md](../examples/NODE_EXAMPLES_workdocs_working.md) |

---

## ❌ НЕЛЬЗЯ

- ❌ **Не коммитить секретные данные** в документацию
- ❌ **Не использовать как production docs** — только для working/dev
- ❌ **Не отключать auth** — password protection required
- ❌ **Не игнорировать health checks** — проверять перед использованием

---

## 🆘 ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ

1. Проверить health: `curl http://localhost:3210/health`
2. Проверить логи: `tail -f logs/workdocs.log`
3. Перезапустить: `pm2 restart workdocs`
4. См. [Troubleshooting](../troubleshooting/TROUBLESHOOTING_workdocs_working.md)

---

## ⏱️ TIME TO VALUE

- **Первый доступ:** 1 минута
- **Найти узел:** 2 минуты
- **Прочитать docs:** 5 минут
- **Полное понимание:** 15 минут

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
