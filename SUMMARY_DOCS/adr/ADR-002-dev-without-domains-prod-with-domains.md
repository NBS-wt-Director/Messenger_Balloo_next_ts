---
title: 'ADR-002: Dev Without Domains / Prod With Domains'
description: Правило: local/dev запуск без реальных доменов, production под canonical доменами
status: active
date: 2026-06-13
author: Koda (NLP-Core-Team)
tags:
  - architecture
  - domains
  - runtime
  - environments
related_docs:
  - SUMMARY_DOCS/nodes/DOMAIN_TREE.md
  - SUMMARY_DOCS/nodes/NODE_RUNTIME_MODEL.md
  - SUMMARY_DOCS/contracts/nodes/DomainNodeContract.md
---

# ADR-002: Dev Without Domains / Prod With Domains

**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## Status

✅ **Active** — Принято и действует

---

## Context

Проблема:
- Разработка требует DNS configuration для доменов
- Это создаёт барьер для local development
- Усложняет CI/CD pipelines
- Создаёт зависимость от внешней инфраструктуры

Требуется:
- Упростить local development
- Сохранить production identity
- Обеспечить консистентность между средами

---

## Decision

Принято правило **Dev Without Domains / Prod With Domains**:

### 1. Local/Dev Mode

```yaml
local_dev:
  domain_required: false
  routing: localhost:PORT
  identity_preservation: true
```

**Все узлы могут запускаться на localhost без реальных доменов.**

### 2. Working Mode

```yaml
working:
  domain_required: false
  can_use_localhost: true
  can_use_working_domain: true
  identity_preservation: true
```

**Working branch может использовать localhost или working.balloo.su.**

### 3. Production Mode

```yaml
production:
  domain_required: true
  canonical_domains: true
  identity_preservation: true
```

**Production branch требует canonical production доменов.**

### 4. Identity Preservation

```
logicalNodeId — сохраняется во всех средах
canonicalName — документируется для всех узлов
runtimeMapping — поддерживается для каждой среды
```

---

## Consequences

### Positive

- ✅ Local development не требует DNS configuration
- ✅ CI/CD упрощён (no domain dependencies)
- ✅ Production identity сохраняется
- ✅ Consistent mapping между средами

### Negative

- ⚠️ Требует поддержания mapping таблиц
- ⚠️ Port conflicts возможны при local dev
- ⚠️ Production config отличается от dev config

---

## References

- [DOMAIN_TREE.md](../nodes/DOMAIN_TREE.md)
- [NODE_RUNTIME_MODEL.md](../nodes/NODE_RUNTIME_MODEL.md)
- [DomainNodeContract.md](../contracts/nodes/DomainNodeContract.md)

---

**ADR-002 | Status: Active | Date: 2026-06-13**
