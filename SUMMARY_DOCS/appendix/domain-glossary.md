---
title: Domain Glossary
description: Словарь терминов по дереву узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - glossary
  - definitions
  - terminology
related_docs:
  - SUMMARY_DOCS/appendix/entity-definitions.md
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
---

# 📖 DOMAIN GLOSSARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **терминологию** для дерева узлов Balloo.

**Цель:** Обеспечить консистентное понимание терминов AI и разработчиками.

---

## 📋 ТЕРМИНЫ

### B

**Branch (Ветка)**
> Каноническая среда развертывания проекта, объединяющая набор узлов с общей стадией готовности и едиными правилами доступа.
> 
> Примеры: production, alpha, working

**Branch Binding**
> Привязка узла к конкретной ветке (production/alpha/working).

---

### C

**Canonical Domain**
> Официальный production домен узла.
> 
> Пример: balloo.su для production root

**Canonical Name**
> Официальное имя узла в документации.
> 
> Пример: workdocs.working.balloo.su

**Canonical Doc**
> Документ в SUMMARY_DOCS, являющийся source of truth.
> 
> Пример: NODETREE_MANIFEST.json

**Capability**
> Функциональная возможность узла или системы.
> 
> Пример: AI API capability (v4.*)

**Codegen Relevance**
> Степень необходимости узла для AI-кодогенерации.
> 
> Уровни: 1 (highest) — 4 (lowest)

---

### D

**Domain-bearing Node**
> Узел, имеющий собственный production или environment-specific hostname.

**Domain Binding**
> Привязка узла к домену/поддомену.

---

### E

**Endpoint**
> Конкретная точка доступа API или сервиса.

**Environment**
> Среда выполнения (local/dev, working, alpha, production).

---

### F

**Feature Flag**
> Переключатель функциональности, управляющий доступностью features.

---

### L

**Local Dev Identity**
> Идентификатор узла в local development (обычно localhost:PORT).
> 
> Пример: localhost:3210 для workdocs-working

---

### M

**Module**
> Логическая единица кода, независимая от runtime deployment.
> 
> См. [MODULE_INDEX.md](../Modules/MODULE_INDEX.md)

---

### N

**Node (Узел)**
> Публично или внутренне доступная функциональная точка системы, имеющая идентичность, назначение, routing surface, settings surface и environment binding.

**Node Family**
> Группа связанных узлов с общим назначением.
> 
> Примеры: api family, storage family, client apps family

---

### P

**Production Identity**
> Canonical identity узла в production среде (не теряется при local dev).

**Public Node**
> Узел, ориентированный на конечного пользователя или внешнюю аудиторию.

---

### R

**Release Stage**
> Стадия release процесса (working → alpha → production).

**Runtime Target**
> Конкретная цель запуска узла (domain или localhost:PORT).

---

### S

**Settings Scope**
> Уровень настроек (project-global, branch-level, node-level, feature-level).

**Source of Truth**
> Канонический источник истины для данных или конфигурации.
> 
> Для node tree: SUMMARY_DOCS/nodes/

---

### T

**Technical Node**
> Узел, предназначенный для управления, разработки, документации, генерации, оркестрации, настройки или внутренних операций.

---

### V

**Version-scoped Capability**
> Функциональность, доступная начиная с определённой версии.
> 
> Пример: ai.api.balloo.su — с версии 4.*

---

## 🔗 RELATED DOCUMENTS

- [entity-definitions.md](./entity-definitions.md) — Entity definitions
- [entity-relationships.md](./entity-relationships.md) — Entity relationships
- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md) — Node tree index

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
