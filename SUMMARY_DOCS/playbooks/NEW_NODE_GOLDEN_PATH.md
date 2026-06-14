---
title: New Node Golden Path
description: Пошаговое руководство по добавлению нового узла в Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - golden-path
  - new-node
  - playbook
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/playbooks/NODE_DELIVERY_PLAYBOOK.md
  - SUMMARY_DOCS/templates/TEMPLATE_NODE_SUMMARY.md
---

# 🛤️ NEW NODE GOLDEN PATH

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот playbook описывает **пошаговый процесс добавления нового узла** в Balloo.

**Цель:** Обеспечить консистентный workflow для добавления узлов.

---

## 📊 STEP-BY-STEP GUIDE

### Step 1: Define Node Identity

```markdown
1.1. Определить nodeId (уникальный идентификатор)
     Пример: my-new-node

1.2. Определить canonicalName
     Пример: my-new-node.working.balloo.su

1.3. Определить branch (production/alpha/working)
     Пример: working

1.4. Определить nodeType
     Пример: technical-codegen

1.5. Определить domain (или null для no-domain nodes)
     Пример: my-new-node.working.balloo.su

1.6. Определить localDevIdentity
     Пример: localhost:4300
```

### Step 2: Create Required Documents

```markdown
2.1. Создать node summary
     Файл: SUMMARY_DOCS/nodes/summary/NODE_SUMMARY_my-new-node.md
     Шаблон: SUMMARY_DOCS/templates/TEMPLATE_NODE_SUMMARY.md

2.2. Создать node contract
     Файл: SUMMARY_DOCS/contracts/nodes/NODE_CONTRACT_my-new-node.md
     Шаблон: SUMMARY_DOCS/templates/TEMPLATE_NODE_CONTRACT.md

2.3. Создать runbook (если operational node)
     Файл: SUMMARY_DOCS/runbooks/RUNBOOK_my-new-node.md
     Шаблон: SUMMARY_DOCS/templates/TEMPLATE_RUNBOOK.md
```

### Step 3: Update State Files

```markdown
3.1. Обновить NODETREE_MANIFEST.json
     - Добавить entry для нового узла
     - Заполнить все required поля
     - Валидировать JSON

3.2. Обновить node-settings-map.json
     - Добавить settings scopes

3.3. Обновить node-runtime-map.json
     - Добавить runtime mapping

3.4. Обновить node-codegen-map.json
     - Добавить codegen relevance

3.5. Обновить node-priority-map.json
     - Добавить priority (если technical node)

3.6. Обновить node-capability-map.json
     - Добавить capabilities

3.7. Обновить node-access-map.json
     - Добавить access rules

3.8. Обновить node-dependency-map.json
     - Добавить dependencies

3.9. Обновить node-health-map.json
     - Добавить health model

3.10. Обновить node-ownership-map.json
      - Добавить ownership metadata
```

### Step 4: Add Settings Schema (если нужно)

```markdown
4.1. Создать settings schema (если узел имеет уникальные настройки)
     Файл: SUMMARY_DOCS/schemas/my-new-node-settings.schema.json

4.2. Обновить SCHEMA_INDEX.md
     - Добавить entry для новой схемы
```

### Step 5: Define Health Model

```markdown
5.1. Обновить NODE_HEALTH_MODEL.md
     - Добавить health checks
     - Определить critical signals
     - Определить smoke checks
     - Назначить health owner

5.2. Обновить node-health-map.json
     - Добавить health model entry
```

### Step 6: Define Ownership

```markdown
6.1. Обновить NODE_OWNERSHIP_MODEL.md
     - Определить ownerType
     - Определить ownerRole
     - Определить maintenanceResponsibility
     - Определить reviewCadence

6.2. Обновить node-ownership-map.json
     - Добавить ownership entry
```

### Step 7: Connect to Web Reader

```markdown
7.1. Убедиться что документы доступны через web reader
7.2. Проверить navigation (branch-first, node-first)
7.3. Проверить что матрицы отображают новый узел
```

### Step 8: Make Codegen-Ready

```markdown
8.1. Убедиться что contract полон
8.2. Убедиться что state files обновлены
8.3. Запустить kpdegen для генерации кода (если нужно)
8.4. Проверить что codegen output корректен
```

### Step 9: Working First, Prod Later

```markdown
9.1. Развернуть в working branch
9.2. Протестировать в working
9.3. Обновить docs по результатам тестирования
9.4. Только после testing → alpha → production (если applicable)
```

---

## 📋 REQUIRED DOCUMENTS CHECKLIST

### Mandatory (для всех узлов)

- [ ] NODE_SUMMARY_<node-id>.md
- [ ] NODE_CONTRACT_<node-id>.md
- [ ] NODETREE_MANIFEST.json entry
- [ ] node-settings-map.json entry
- [ ] node-runtime-map.json entry
- [ ] node-codegen-map.json entry
- [ ] node-access-map.json entry
- [ ] node-dependency-map.json entry
- [ ] node-health-map.json entry
- [ ] node-ownership-map.json entry
- [ ] node-capability-map.json entry

### Recommended (для operational nodes)

- [ ] RUNBOOK_<node-id>.md
- [ ] Settings schema (если уникальные настройки)

### Optional

- [ ] Additional matrices
- [ ] Additional playbooks

---

## 📊 STATE FILES TO UPDATE

| File | Purpose | Required |
|------|---------|----------|
| NODETREE_MANIFEST.json | Node registry | ✅ Yes |
| node-settings-map.json | Settings scopes | ✅ Yes |
| node-runtime-map.json | Runtime mapping | ✅ Yes |
| node-codegen-map.json | Codegen relevance | ✅ Yes |
| node-priority-map.json | Priority | ✅ Yes |
| node-capability-map.json | Capabilities | ✅ Yes |
| node-access-map.json | Access rules | ✅ Yes |
| node-dependency-map.json | Dependencies | ✅ Yes |
| node-health-map.json | Health model | ✅ Yes |
| node-ownership-map.json | Ownership | ✅ Yes |

---

## 🔗 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md) — Node tree index
- [NODE_DELIVERY_PLAYBOOK.md](./NODE_DELIVERY_PLAYBOOK.md) — Delivery playbook
- [TEMPLATE_NODE_SUMMARY.md](../templates/TEMPLATE_NODE_SUMMARY.md) — Summary template
- [TEMPLATE_NODE_CONTRACT.md](../templates/TEMPLATE_NODE_CONTRACT.md) — Contract template

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
