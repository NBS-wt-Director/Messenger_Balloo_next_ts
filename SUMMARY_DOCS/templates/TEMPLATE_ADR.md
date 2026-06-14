---
title: 'Template: ADR'
description: Шаблон для архитектурного решения (ADR) Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - template
  - adr
  - canonical
related_docs:
  - SUMMARY_DOCS/adr/ADR_INDEX.md
  - SUMMARY_DOCS/templates/TEMPLATE_NODE_CONTRACT.md
---

# 📄 TEMPLATE: ADR

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 📝 TEMPLATE

```markdown
---
title: 'ADR-XXX: <Title>'
description: <Short description>
status: proposed|active|superseded|deprecated|archived
date: YYYY-MM-DD
author: <Author>
tags:
  - architecture
  - <topic>
related_docs:
  - SUMMARY_DOCS/<related-doc-1>
  - SUMMARY_DOCS/<related-doc-2>
---

# ADR-XXX: <Title>

**Дата:** YYYY-MM-DD  
**Статус:** <Status>  
**Автор:** <Author>

---

## Status

✅ **Active** — Принято и действует  
*(или Proposed / Superseded / Deprecated / Archived)*

---

## Context

<Описание контекста и проблемы>

<Почему это решение потребовалось>

<Какая проблема решается>

---

## Decision

<Принятое решение>

<Что именно решено>

<Как это будет работать>

---

## Consequences

### Positive

- ✅ <Positive consequence 1>
- ✅ <Positive consequence 2>
- ✅ <Positive consequence 3>

### Negative

- ⚠️ <Negative consequence 1>
- ⚠️ <Negative consequence 2>

### Trade-offs

- ⚖️ <Trade-off 1>
- ⚖️ <Trade-off 2>

---

## Implementation

<Как это будет реализовано>

<Этапы реализации>

<Требования к реализации>

---

## Compliance

<Как проверять соответствие решению>

<Validation rules>

<Audit requirements>

---

## References

- <Related doc 1>
- <Related doc 2>
- <Related ADR if any>

---

**ADR-XXX | Status: <Status> | Date: YYYY-MM-DD**
```

---

## 📋 REQUIRED SECTIONS

1. **Status** — текущий статус ADR
2. **Context** — контекст и проблема
3. **Decision** — принятое решение
4. **Consequences** — positive/negative/trade-offs
5. **Implementation** — как реализовать
6. **Compliance** — как проверять
7. **References** — связанные документы

---

## ✅ BEST PRACTICES

- ✅ Одно решение на ADR
- ✅ Ясный контекст
- ✅ Конкретное решение
- ✅ Честные trade-offs
- ✅ Проверяемая compliance

---

## 📊 ADR STATUS VALUES

| Status | Description |
|--------|-------------|
| **Proposed** | Решение предложено, не принято |
| **Active** | Решение принято и действует |
| **Superseded** | Решение заменено новым ADR |
| **Deprecated** | Решение устарело, не рекомендуется |
| **Archived** | Решение заархивировано (история) |

---

**🎈 Balloo - Переверни общение!**
