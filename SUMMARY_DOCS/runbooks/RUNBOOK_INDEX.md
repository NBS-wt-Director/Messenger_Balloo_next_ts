---
title: Runbook Index
description: Индекс операционных инструкций для узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - runbooks
  - operations
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/nodes/NODE_HEALTH_MODEL.md
  - SUMMARY_DOCS/playbooks/NODE_DELIVERY_PLAYBOOK.md
---

# 📖 RUNBOOK INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **индекс операционных инструкций** (runbooks) для узлов Balloo.

**Runbook** = документ с пошаговыми инструкциями по запуску, обслуживанию и восстановлению узла.

---

## 📊 RUNBOOK CATEGORIES

| Category | Description | Runbooks |
|----------|-------------|----------|
| **Priority 1 Technical** | Технические узлы working-ветки | 5 |
| **Production Public** | Публичные production узлы | 11 |
| **Alpha** | Alpha-среда узлы | 3 |
| **Working Non-Technical** | Остальные working узлы | 10 |

---

## 🔒 PRIORITY 1 TECHNICAL RUNBOOKS

| Runbook | Node | Domain | Status |
|---------|------|--------|--------|
| [RUNBOOK_workdocs_working](./RUNBOOK_workdocs_working.md) | workdocs-working | workdocs.working.balloo.su | ✅ Active |
| [RUNBOOK_nodes_switcher_working](./RUNBOOK_nodes_switcher_working.md) | nodes-switcher-working | nodes-switcher.working.balloo.su | ✅ Active |
| [RUNBOOK_kpdegen_working](./RUNBOOK_kpdegen_working.md) | kpdegen-working | kpdegen.working.balloo.su | ✅ Active |
| [RUNBOOK_projectgeneralsettings_working](./RUNBOOK_projectgeneralsettings_working.md) | projectgeneralsettings-working | projectgeneralsettings.working.balloo.su | ✅ Active |
| [RUNBOOK_database_working](./RUNBOOK_database_working.md) | database-working | (no domain) | ✅ Active |

---

## 🏭 PRODUCTION RUNBOOKS

| Runbook | Node | Domain | Status |
|---------|------|--------|--------|
| [RUNBOOK_balloo_production_root](./RUNBOOK_balloo_production_root.md) | balloo-production-root | balloo.su | ✅ Active |
| [RUNBOOK_api_production](./RUNBOOK_api_production.md) | api-production | api.balloo.su | ✅ Active |
| [RUNBOOK_ai_api_production](./RUNBOOK_ai_api_production.md) | ai-api-production | ai.api.balloo.su | 📋 Planned |
| [RUNBOOK_files_production](./RUNBOOK_files_production.md) | files-production | files.balloo.su | ✅ Active |
| [RUNBOOK_docs_production](./RUNBOOK_docs_production.md) | docs-production | docs.balloo.su | ✅ Active |
| [RUNBOOK_future_production](./RUNBOOK_future_production.md) | future-production | future.balloo.su | 📋 Planned |
| [RUNBOOK_admin_production](./RUNBOOK_admin_production.md) | admin-production | admin.balloo.su | ✅ Active |
| [RUNBOOK_workers_production](./RUNBOOK_workers_production.md) | workers-production | workers.balloo.su | ✅ Active |
| [RUNBOOK_abaut_production](./RUNBOOK_abaut_production.md) | abaut-production | abaut.balloo.su | ✅ Active |
| [RUNBOOK_apps_production](./RUNBOOK_apps_production.md) | apps-production | apps.balloo.su | ✅ Active |
| [RUNBOOK_client_apps_family](./RUNBOOK_client_apps_family.md) | client-apps-family | (no domain) | ✅ Active |

---

## 🔬 ALPHA RUNBOOKS

| Runbook | Node | Domain | Status |
|---------|------|--------|--------|
| [RUNBOOK_alpha_root](./RUNBOOK_alpha_root.md) | alpha-root | alpha.balloo.su | ✅ Active |
| [RUNBOOK_apps_alpha](./RUNBOOK_apps_alpha.md) | apps-alpha | apps.alpha.balloo.su | ✅ Active |
| [RUNBOOK_2commands_alpha](./RUNBOOK_2commands_alpha.md) | 2commands-alpha | 2commands.alpha.balloo.su | ✅ Active |

---

## 🔧 WORKING NON-TECHNICAL RUNBOOKS

| Runbook | Node | Domain | Status |
|---------|------|--------|--------|
| [RUNBOOK_working_root](./RUNBOOK_working_root.md) | working-root | working.balloo.su | ✅ Active |
| [RUNBOOK_api_working](./RUNBOOK_api_working.md) | api-working | api.working.balloo.su | ✅ Active |
| [RUNBOOK_files_working](./RUNBOOK_files_working.md) | files-working | files.working.balloo.su | ✅ Active |
| [RUNBOOK_docs_working](./RUNBOOK_docs_working.md) | docs-working | docs.working.balloo.su | ✅ Active |
| [RUNBOOK_future_working](./RUNBOOK_future_working.md) | future-working | future.working.balloo.su | ✅ Active |
| [RUNBOOK_pilot_future_working](./RUNBOOK_pilot_future_working.md) | pilot-future-working | pilot-future.working.balloo.su | ✅ Active |
| [RUNBOOK_admin_working](./RUNBOOK_admin_working.md) | admin-working | admin.working.balloo.su | ✅ Active |
| [RUNBOOK_workers_working](./RUNBOOK_workers_working.md) | workers-working | workers.working.balloo.su | ✅ Active |
| [RUNBOOK_abaut_working](./RUNBOOK_abaut_working.md) | abaut-working | abaut.working.balloo.su | ✅ Active |
| [RUNBOOK_apps_working](./RUNBOOK_apps_working.md) | apps-working | apps.working.balloo.su | ✅ Active |

---

## 📖 RUNBOOK STRUCTURE

Каждый runbook содержит:

1. **Purpose** — Назначение узла
2. **Health Check** — Проверка здоровья
3. **Start Conditions** — Условия запуска
4. **Required Inputs/Config** — Необходимые конфиги
5. **Common Failure Modes** — Типовые сбои
6. **Safe Restart Procedure** — Безопасная перезагрузка
7. **Rollback Hints** — Инструкции по откату
8. **Access Requirements** — Требования доступа
9. **Logs/Diagnostic Surfaces** — Логи и диагностика
10. **Related Contracts/Docs** — Связанные документы

---

## 🔗 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md) — Node tree index
- [NODE_HEALTH_MODEL.md](../nodes/NODE_HEALTH_MODEL.md) — Health model
- [NODE_DELIVERY_PLAYBOOK.md](../playbooks/NODE_DELIVERY_PLAYBOOK.md) — Delivery playbook
- [ROLLBACK_PLAYBOOK.md](../playbooks/ROLLBACK_PLAYBOOK.md) — Rollback playbook

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
