---
title: Design Index
description: Индекс дизайн-документации Balloo — реконструированная дизайн-система
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - design
  - reconstruction
  - canonical
related_docs:
  - SUMMARY_DOCS/DesignContract.md
  - SUMMARY_DOCS/ThemeContract.md
  - SUMMARY_DOCS/BrandContract.md
---

# 🎨 DESIGN INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ — **индекс дизайн-документации** Balloo, реконструированной из существующих артефактов.

**Источники реконструкции:**
- `messenger/` — пользовательская среда (UI компоненты, страницы, стили)
- `SUMMARY_DOCS/` — технические узлы (contracts, node docs, runbooks)
- `packages/core-brand` — бренд ассеты
- `packages/core-theme` — тема система

---

## 📊 DESIGN DOCUMENTS

### Design Contracts

| Document | Description | Status |
|----------|-------------|--------|
| [USER_ENV_DESIGN_CONTRACT.md](./USER_ENV_DESIGN_CONTRACT.md) | Контракт пользовательской среды | ✅ Active |
| [TECHNICAL_NODES_DESIGN_CONTRACT.md](./TECHNICAL_NODES_DESIGN_CONTRACT.md) | Контракт технических узлов | ✅ Active |
| [USER_VS_TECH_UI_BOUNDARY.md](./USER_VS_TECH_UI_BOUNDARY.md) | Границы client vs technical UI | ✅ Active |

### Design Maps

| Document | Description | Status |
|----------|-------------|--------|
| [DESIGN_TOKEN_MAP.md](./DESIGN_TOKEN_MAP.md) | Карта дизайн-токенов | ✅ Active |
| [COMPONENT_MAP.md](./COMPONENT_MAP.md) | Карта компонентов | ✅ Active |
| [SCREEN_PATTERN_MAP.md](./SCREEN_PATTERN_MAP.md) | Карта экранных паттернов | ✅ Active |
| [INTERACTION_PATTERN_MAP.md](./INTERACTION_PATTERN_MAP.md) | Карта взаимодействий | ✅ Active |

### Design Reports

| Document | Description | Status |
|----------|-------------|--------|
| [DESIGN_RECONSTRUCTION_REPORT.md](./DESIGN_RECONSTRUCTION_REPORT.md) | Отчёт реконструкции | ✅ Active |

---

## 🖼️ HTML REFERENCE PAGES

| Page | Description | Status |
|------|-------------|--------|
| [design-system-user.html](./html/design-system-user.html) | User environment design tokens | ✅ Active |
| [design-system-technical.html](./html/design-system-technical.html) | Technical nodes design tokens | ✅ Active |
| [client-node-examples.html](./html/client-node-examples.html) | Client node examples | ✅ Active |
| [service-node-examples.html](./html/service-node-examples.html) | Service node examples | ✅ Active |
| [screen-pattern-gallery.html](./html/screen-pattern-gallery.html) | Screen pattern gallery | ✅ Active |
| [component-anatomy.html](./html/component-anatomy.html) | Component anatomy | ✅ Active |

---

## 📁 STATE FILES

| File | Description | Status |
|------|-------------|--------|
| [design-tokens.json](../state/design-tokens.json) | Machine-readable design tokens | ✅ Active |
| [design-components.json](../state/design-components.json) | Component registry | ✅ Active |
| [design-screen-patterns.json](../state/design-screen-patterns.json) | Screen patterns | ✅ Active |
| [design-interactions.json](../state/design-interactions.json) | Interaction patterns | ✅ Active |
| [design-node-ui-map.json](../state/design-node-ui-map.json) | Node UI mapping | ✅ Active |

---

## 🔑 KEY DESIGN INVARIANTS

### From DesignContract.md

1. **No Rounded Corners** — `border-radius: 0` everywhere
2. **3 Preset Themes** — dark, light, russia
3. **Brand Colors** — Russia Blue (#0039A6), Russia Red (#D52B1E)
4. **Logo Clear Space** — 8px minimum
5. **Sharp Corners** — all UI elements

### From BrandContract.md

1. **Logo Minimum Size** — 32px
2. **Font Stack** — System fonts
3. **Color Consistency** — Exact hex values
4. **Russia Flag Gradient** — Red-White-Blue order

---

## 🤖 AI CODEGEN RELEVANCE

This design documentation is designed for:

- **Human designers** — Visual reference, patterns, guidelines
- **AI codegen** — Machine-readable tokens, components, patterns
- **Docgen** — Auto-generated design docs from contracts
- **Reconstruction** — New nodes in consistent style

---

## 🔗 RELATED DOCUMENTS

- [DesignContract.md](../DesignContract.md) — Original design contract
- [ThemeContract.md](../ThemeContract.md) — Theme system contract
- [BrandContract.md](../BrandContract.md) — Brand guidelines
- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md) — Node tree

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
