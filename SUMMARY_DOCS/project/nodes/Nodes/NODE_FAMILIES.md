---
title: Node Families
description: Группы связанных узлов Balloo по функциональному назначению
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - families
  - groups
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/nodes/NODE_client_apps_family.md
---

# 👨‍👩‍👧‍👦 NODE FAMILIES

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **группы связанных узлов** (families) Balloo.

**Цель:** Обеспечить масштабирование tree и codegen templates через family abstraction.

---

## 📊 NODE FAMILIES

### 1. Root/Public Family

**Purpose:** Публичные entry points системы

| Node | Branch | Domain |
|------|--------|--------|
| balloo-production-root | production | balloo.su |
| alpha-root | alpha | alpha.balloo.su |
| working-root | working | working.balloo.su |

**Common Characteristics:**
- Root domain для ветки
- Public или limited access
- Entry point для пользователей

---

### 2. API Family

**Purpose:** API gateways и сервисы

| Node | Branch | Domain |
|------|--------|--------|
| api-production | production | api.balloo.su |
| ai-api-production | production | ai.api.balloo.su (v4.*) |
| api-working | working | api.working.balloo.su |

**Common Characteristics:**
- API gateway functionality
- Auth required
- Rate limiting

---

### 3. File/Storage Family

**Purpose:** Хранение файлов и данных

| Node | Branch | Domain | Storage Strategies |
|------|--------|--------|-------------------|
| files-production | production | files.balloo.su | yandex-disk (3.1.*), SPiFS (planned) |
| files-working | working | files.working.balloo.su | local, yandex-disk (3.1.*) |

**Common Characteristics:**
- File storage role
- Multiple storage strategies
- Auth required

---

### 4. Docs Family

**Purpose:** Документация и knowledge base

| Node | Branch | Domain |
|------|--------|--------|
| docs-production | production | docs.balloo.su |
| docs-working | working | docs.working.balloo.su |
| workdocs-working | working | workdocs.working.balloo.su |

**Common Characteristics:**
- Documentation presentation
- AI-readable
- workdocs is password-protected

---

### 5. Future/Planning Family

**Purpose:** Experimental и future features

| Node | Branch | Domain | Status |
|------|--------|--------|--------|
| future-production | production | future.balloo.su | planned |
| future-working | working | future.working.balloo.su | active |
| pilot-future-working | working | pilot-future.working.balloo.su | active |
| 2commands-alpha | alpha | 2commands.alpha.balloo.su | active |

**Common Characteristics:**
- Experimental features
- Feature flags
- Testing ground

---

### 6. Admin/Internal Family

**Purpose:** Администрирование и внутренние операции

| Node | Branch | Domain |
|------|--------|--------|
| admin-production | production | admin.balloo.su |
| admin-working | working | admin.working.balloo.su |
| workers-production | production | workers.balloo.su |
| workers-working | working | workers.working.balloo.su |

**Common Characteristics:**
- Internal/admin access
- Auth required
- Settings authority

---

### 7. Client Apps Family

**Purpose:** Клиентские приложения (platform nodes)

| Platform | Type | Delivery |
|----------|------|----------|
| android | mobile | Play Store |
| ios | mobile | App Store |
| windows | desktop | Download |
| linux | desktop | Download/Package |
| macos | desktop | Download/App Store |

**See:** [NODE_client_apps_family.md](./NODE_client_apps_family.md)

**Common Characteristics:**
- No separate domain
- Platform-specific delivery
- Relation to apps.* nodes

---

### 8. Technical Working Family

**Purpose:** Технические узлы для automation и codegen

| Node | Domain | Priority |
|------|--------|----------|
| workdocs-working | workdocs.working.balloo.su | 1 ⭐ |
| nodes-switcher-working | nodes-switcher.working.balloo.su | 1 ⭐ |
| kpdegen-working | kpdegen.working.balloo.su | 1 ⭐ |
| projectgeneralsettings-working | projectgeneralsettings.working.balloo.su | 1 ⭐ |
| database-working | (no domain) | 1 ⭐ |

**Common Characteristics:**
- Priority 1 for codegen
- Working branch only
- Full documentation required
- Auth required

---

## 📐 FAMILY BENEFITS

### Why Families Matter

1. **Codegen Templates** — один template для всей family
2. **Consistent Patterns** — одинаковые patterns внутри family
3. **Scalability** — легко добавлять новые nodes в family
4. **Documentation** — family-level docs + node-specific docs

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Node tree index
- [NODE_client_apps_family.md](./NODE_client_apps_family.md) — Client apps family
- [NODE_CAPABILITY_MATRIX.md](./NODE_CAPABILITY_MATRIX.md) — Capability matrix

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
