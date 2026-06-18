---
title: Schema Index
description: Индекс схем для узлов и настроек Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - schemas
  - validation
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/contracts/validation/ContractValidationPolicy.md
---

# 📐 SCHEMA INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **индекс схем** для валидации узлов и настроек Balloo.

**Schema** = machine-readable структура для проверки конфигов и manifests.

---

## 📊 AVAILABLE SCHEMAS

| Schema | File | Description |
|--------|------|-------------|
| **Project Settings** | [project-settings.schema.json](./project-settings.schema.json) | Глобальные настройки проекта |
| **Node Settings** | [node-settings.schema.json](./node-settings.schema.json) | Настройки узлов |
| **Branch Settings** | [branch-settings.schema.json](./branch-settings.schema.json) | Настройки веток |
| **Codegen Request** | [codegen-request.schema.json](./codegen-request.schema.json) | Запросы кодогенерации |
| **Node Manifest** | [node-manifest.schema.json](./node-manifest.schema.json) | Node tree manifest |

---

## 🔍 SCHEMA USAGE

### Validation Command

```bash
# Validate settings against schema
node scripts/validate-settings.js --schema project-settings.schema.json --data settings.json

# Validate manifest
node scripts/validate-manifest.js --schema node-manifest.schema.json --data NODETREE_MANIFEST.json
```

### Programmatic Validation

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = require('./project-settings.schema.json');
const data = require('./settings.json');

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error(validate.errors);
}
```

---

## 📋 SCHEMA VERSIONS

| Schema | Current Version | Last Updated |
|--------|-----------------|--------------|
| project-settings | 1.0.0 | 2026-06-13 |
| node-settings | 1.0.0 | 2026-06-13 |
| branch-settings | 1.0.0 | 2026-06-13 |
| codegen-request | 1.0.0 | 2026-06-13 |
| node-manifest | 1.0.0 | 2026-06-13 |

---

## ✅ VALIDATION RULES

### Required Fields

- Все `required` поля должны присутствовать
- Типы данных должны соответствовать
- Enum значения должны быть из списка

### Optional Fields

- Могут отсутствовать
- Если присутствуют, должны соответствовать типу

### Version Notes

- Схемы версионируются
- Breaking changes требуют новой версии
- Старые версии поддерживаются 90 дней

---

## 🔗 RELATED DOCUMENTS

- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md) — Node tree index
- [ContractValidationPolicy.md](../contracts/validation/ContractValidationPolicy.md) — Validation policy
- [node-manifest.schema.json](./node-manifest.schema.json) — Manifest schema

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
