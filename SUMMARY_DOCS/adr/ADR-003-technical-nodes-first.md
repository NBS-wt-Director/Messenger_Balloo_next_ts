---
title: 'ADR-003: Technical Nodes First'
description: Технические узлы working-ветки имеют приоритет 1 для codegen и автоматизации
status: active
date: 2026-06-13
author: Koda (NLP-Core-Team)
tags:
  - architecture
  - technical-nodes
  - priority
  - codegen
related_docs:
  - SUMMARY_DOCS/nodes/technical/TECHNICAL_NODES_PRIORITY.md
  - SUMMARY_DOCS/contracts/nodes/TechnicalNodeContract.md
  - SUMMARY_DOCS/state/node-priority-map.json
---

# ADR-003: Technical Nodes First

**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## Status

✅ **Active** — Принято и действует

---

## Context

Проблема:
- Технические узлы часто считаются второстепенными
- Без автоматизации codegen и documentation неэффективны
- Release management требует оркестрации

Требуется:
- Приоритизировать технические узлы для codegen
- Обеспечить full documentation для technical nodes
- Использовать technical nodes как foundation для automation

---

## Decision

Принято правило **Technical Nodes First**:

### 1. Priority 1 Technical Nodes

```
workdocs-working           — документация для AI и разработчиков
nodes-switcher-working     — менеджер версий и rollout control
kpdegen-working            — серверный кодогенератор
projectgeneralsettings-working — управление настройками
database-working           — technical runtime node
```

### 2. Codegen Priority

```yaml
codegen_order:
  1. priority_1_technical_nodes
  2. priority_2_working_nodes
  3. priority_3_alpha_nodes
  4. priority_4_production_nodes
```

### 3. Documentation Depth

```
Priority 1 technical nodes требуют:
- Полный node contract
- Подробный node summary
- Detailed settings surface
- Runtime model
- Codegen relevance spec
- Access rules
- Dependencies
```

### 4. First-Class Status

```
Технические узлы = first-class nodes
Не второстепенны
Не "internal only, docs optional"
Полная документация обязательна
```

---

## Consequences

### Positive

- ✅ Automation foundation established
- ✅ Codegen system self-documenting
- ✅ Release management orchestrated
- ✅ Settings centrally managed

### Negative

- ⚠️ Higher documentation burden for technical nodes
- ⚠️ Technical nodes exposed in docs (requires access control)

---

## References

- [TECHNICAL_NODES_PRIORITY.md](../nodes/technical/TECHNICAL_NODES_PRIORITY.md)
- [TechnicalNodeContract.md](../contracts/nodes/TechnicalNodeContract.md)
- [node-priority-map.json](../state/node-priority-map.json)

---

**ADR-003 | Status: Active | Date: 2026-06-13**
