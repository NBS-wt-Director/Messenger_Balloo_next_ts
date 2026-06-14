---
title: I18N Index
description: Индекс языковой политики и локализации Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - localization
  - languages
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/contracts/i18n/I18nPolicyContract.md
  - SUMMARY_DOCS/state/i18n-languages.json
---

# 🌐 I18N INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **индекс языковой политики** Balloo, реконструированной из messenger.

**Цель:** Зафиксировать каноническую языковую политику, поддерживаемые языки и архитектуру расширяемой i18n-модели.

---

## 📊 SUPPORTED LANGUAGES (Baseline)

### Active Languages (12)

| Code | Name | Native Name | Status | Priority | Coverage |
|------|------|-------------|--------|----------|----------|
| **ru** | Russian | Русский | ✅ Active | 1 (Primary) | 100% |
| **en** | English | English | ✅ Active | 2 | 100% |
| **tt** | Tatar | Татарча | ✅ Active | 3 | 100% |
| **hi** | Hindi | हिंदी | ✅ Active | 4 | Partial |
| **zh** | Chinese | 中文 | ✅ Active | 5 | Partial |
| **be** | Belarusian | Беларуская | ✅ Active | 6 | 100% |
| **ba** | Bashkir | Башҡорт | ✅ Active | 7 | 100% |
| **cv** | Chuvash | Чăваш | ✅ Active | 8 | 100% |
| **sah** | Yakut | Саха | ✅ Active | 9 | 100% |
| **udm** | Udmurt | Удмурт | ✅ Active | 10 | 100% |
| **ce** | Chechen | Нохчийн | ✅ Active | 11 | 100% |
| **os** | Ossetian | Ирон | ✅ Active | 12 | 100% |

### Language Categories

| Category | Languages | Description |
|----------|-----------|-------------|
| **Primary** | ru | Default language, source of truth |
| **International** | en, hi, zh | Major world languages |
| **Regional (Russia)** | tt, be, ba, cv, sah, udm, ce, os | Languages of Russia regions |

---

## 📁 I18N DOCUMENTS

### Policy & Models

| Document | Description | Status |
|----------|-------------|--------|
| [I18N_POLICY.md](./I18N_POLICY.md) | языковая политика | ✅ Active |
| [I18N_LANGUAGE_MODEL.md](./I18N_LANGUAGE_MODEL.md) | Модель языков | ✅ Active |
| [I18N_TRANSLATION_MODEL.md](./I18N_TRANSLATION_MODEL.md) | Модель переводов | ✅ Active |
| [I18N_EXTENSION_MODEL.md](./I18N_EXTENSION_MODEL.md) | Модель расширения | ✅ Active |
| [I18N_CODEGEN_POLICY.md](./I18N_CODEGEN_POLICY.md) | Codegen политика | ✅ Active |
| [I18N_DOCGEN_POLICY.md](./I18N_DOCGEN_POLICY.md) | Docgen политика | ✅ Active |
| [I18N_COVERAGE_POLICY.md](./I18N_COVERAGE_POLICY.md) | Политика покрытия | ✅ Active |
| [I18N_MANAGEMENT_MODEL.md](./I18N_MANAGEMENT_MODEL.md) | Модель управления | ✅ Active |
| [I18N_PACKAGE_MODEL.md](./I18N_PACKAGE_MODEL.md) | Модель пакетов | ✅ Active |
| [I18N_RUNTIME_MODEL.md](./I18N_RUNTIME_MODEL.md) | Runtime модель | ✅ Active |

### Reports & Playbooks

| Document | Description | Status |
|----------|-------------|--------|
| [I18N_DISCOVERY_REPORT.md](./I18N_DISCOVERY_REPORT.md) | Отчёт реконструкции | ✅ Active |
| [I18N_LANGUAGE_MANAGEMENT.md](./I18N_LANGUAGE_MANAGEMENT.md) | Управление языками | ✅ Active |
| [I18N_NEW_LANGUAGE_PLAYBOOK.md](./I18N_NEW_LANGUAGE_PLAYBOOK.md) | Добавление языка | ✅ Active |

---

## 📁 STATE FILES

| File | Description | Status |
|------|-------------|--------|
| [../state/i18n-languages.json](../state/i18n-languages.json) | Language registry | ✅ Active |
| [../state/i18n-packages.json](../state/i18n-packages.json) | Translation packages | ✅ Active |
| [../state/i18n-translation-coverage.json](../state/i18n-translation-coverage.json) | Coverage map | ✅ Active |
| [../state/i18n-language-priority.json](../state/i18n-language-priority.json) | Priority map | ✅ Active |
| [../state/i18n-runtime-map.json](../state/i18n-runtime-map.json) | Runtime mapping | ✅ Active |
| [../state/i18n-management-map.json](../state/i18n-management-map.json) | Management mapping | ✅ Active |
| [../state/i18n-missing-strings.json](../state/i18n-missing-strings.json) | Missing strings | ✅ Active |

---

## 📁 CONTRACTS

| Contract | Description | Status |
|----------|-------------|--------|
| [../contracts/i18n/I18nPolicyContract.md](../contracts/i18n/I18nPolicyContract.md) | Policy contract | ✅ Active |
| [../contracts/i18n/I18nLanguageContract.md](../contracts/i18n/I18nLanguageContract.md) | Language contract | ✅ Active |
| [../contracts/i18n/I18nTranslationContract.md](../contracts/i18n/I18nTranslationContract.md) | Translation contract | ✅ Active |
| [../contracts/i18n/I18nLanguageManagementContract.md](../contracts/i18n/I18nLanguageManagementContract.md) | Management contract | ✅ Active |
| [../contracts/i18n/I18nCodegenContract.md](../contracts/i18n/I18nCodegenContract.md) | Codegen contract | ✅ Active |

---

## 📁 LANGUAGE DOCS

| Document | Language | Status |
|----------|----------|--------|
| [./languages/LANGUAGE_ru.md](./languages/LANGUAGE_ru.md) | Russian | ✅ Active |
| [./languages/LANGUAGE_en.md](./languages/LANGUAGE_en.md) | English | ✅ Active |
| [./languages/LANGUAGE_tt.md](./languages/LANGUAGE_tt.md) | Tatar | ✅ Active |
| [./languages/LANGUAGE_hi.md](./languages/LANGUAGE_hi.md) | Hindi | ✅ Active |
| [./languages/LANGUAGE_zh.md](./languages/LANGUAGE_zh.md) | Chinese | ✅ Active |
| [./languages/LANGUAGE_be.md](./languages/LANGUAGE_be.md) | Belarusian | ✅ Active |
| [./languages/LANGUAGE_ba.md](./languages/LANGUAGE_ba.md) | Bashkir | ✅ Active |
| [./languages/LANGUAGE_cv.md](./languages/LANGUAGE_cv.md) | Chuvash | ✅ Active |
| [./languages/LANGUAGE_sah.md](./languages/LANGUAGE_sah.md) | Yakut | ✅ Active |
| [./languages/LANGUAGE_udm.md](./languages/LANGUAGE_udm.md) | Udmurt | ✅ Active |
| [./languages/LANGUAGE_ce.md](./languages/LANGUAGE_ce.md) | Chechen | ✅ Active |
| [./languages/LANGUAGE_os.md](./languages/LANGUAGE_os.md) | Ossetian | ✅ Active |

---

## 🔑 KEY INVARIANTS

### Critical (Never Violate)

1. **100% переводимость** — Все строки должны быть переводимы
2. **No hardcoded strings** — Запрещены скрытые hardcoded строки
3. **No silent fallback** — Missing translations должны быть явными
4. **Technical zone managed** — Языки добавляются из технической зоны
5. **No code file editing** — Добавление языка без правки кода

### Strong (Should Follow)

1. **Russian as source** — ru является источником истины
2. **Priority order** — Приоритет языков соблюдается
3. **Coverage tracking** — Покрытие отслеживается
4. **Audit trail** — Изменения логируются

---

## 🤖 AI CODEGEN RELEVANCE

### For Code Generation

```json
{
  "i18nPolicy": "SUMMARY_DOCS/i18n/I18N_POLICY.md",
  "languages": "SUMMARY_DOCS/state/i18n-languages.json",
  "packages": "SUMMARY_DOCS/state/i18n-packages.json",
  "coverage": "SUMMARY_DOCS/state/i18n-translation-coverage.json",
  "invariants": [
    "100-percent-translatable",
    "no-hardcoded-strings",
    "technical-zone-managed",
    "no-silent-fallback"
  ]
}
```

---

## 🔗 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [LanguageContract.md](../LanguageContract.md) — Original language contract
- [../state/i18n-languages.json](../state/i18n-languages.json) — Language registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
