---
title: Branch Tree
description: Каноническое дерево веток Balloo — production, alpha, working
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - branches
  - environments
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/nodes/NODETREE_MANIFEST.json
  - SUMMARY_DOCS/contracts/nodes/BranchNodeContract.md
  - SUMMARY_DOCS/nodes/ENV_PRODUCTION.md
  - SUMMARY_DOCS/nodes/ENV_ALPHA.md
  - SUMMARY_DOCS/nodes/ENV_WORKING.md
---

# 🌿 BRANCH TREE

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует **каноническое дерево веток** Balloo.

**Ветка (Branch)** = каноническая среда развертывания проекта, объединяющая набор узлов с общей стадией готовности и едиными правилами доступа.

---

## 📊 ОБЗОР ВЕТОК

```
┌─────────────────────────────────────────────────────────┐
│                    BALLOO BRANCH TREE                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │ PRODUCTION  │    │    ALPHA    │    │   WORKING   │  │
│  │   balloo    │    │   alpha     │    │   working   │  │
│  │   .su       │    │   .balloo   │    │   .balloo   │  │
│  │             │    │   .su       │    │   .su       │  │
│  │ 11 nodes    │    │  3 nodes    │    │  15 nodes   │  │
│  │ Stable      │    │  Testing    │    │  Development│  │
│  │ Public      │    │  Limited    │    │  Internal   │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🏭 PRODUCTION BRANCH

### Основная информация

| Параметр | Значение |
|----------|----------|
| **ID** | `production` |
| **Root Domain** | `balloo.su` |
| **Status** | Stable |
| **Maturity** | Production-ready |
| **Access** | Public + Authenticated |
| **Node Count** | 11 |

### Назначение

Production branch — **стабильная production-среда** для конечных пользователей.

**Цели:**
- ✅ Предоставление стабильного сервиса пользователям
- ✅ Хостинг production API и приложений
- ✅ Обеспечение SLA и надежности
- ✅ Публичный доступ к основным функциям

### Узлы production

| Node ID | Domain | Type | Public |
|---------|--------|------|--------|
| balloo-production-root | balloo.su | public-root | ✅ |
| api-production | api.balloo.su | api | ❌ |
| ai-api-production | ai.api.balloo.su | api-ai (v4.*) | ❌ |
| files-production | files.balloo.su | storage | ❌ |
| docs-production | docs.balloo.su | docs | ✅ |
| future-production | future.balloo.su | experimental | ✅ |
| admin-production | admin.balloo.su | admin | ❌ |
| workers-production | workers.balloo.su | workers | ❌ |
| abaut-production | abaut.balloo.su | info | ✅ |
| apps-production | apps.balloo.su | apps-portal | ✅ |
| client-apps-family | client-apps | family | ✅ |

### Правила production

#### Domain Policy
```
✅ production mode MUST use canonical assigned production domains
✅ balloo.su — root production domain
✅ Все production узлы имеют закреплённые production домены
```

#### Access Policy
```
✅ Public nodes: balloo.su, docs.balloo.su, abaut.balloo.su, apps.balloo.su
✅ Authenticated nodes: api.*, admin.*, workers.*, files.*
✅ ai.api.balloo.su — version-scoped (4.*), planned
```

#### Release Policy
```
✅ Только стабильные релизы
✅ Обязательное тестирование в alpha и working
✅ Rollback capability required
✅ Zero-downtime deployment preferred
```

---

## 🔬 ALPHA BRANCH

### Основная информация

| Параметр | Значение |
|----------|----------|
| **ID** | `alpha` |
| **Root Domain** | `alpha.balloo.su` |
| **Status** | Testing |
| **Maturity** | Beta/RC |
| **Access** | Limited (testers, QA) |
| **Node Count** | 3 |

### Назначение

Alpha branch — **среда тестирования новых функций** перед production.

**Цели:**
- ✅ Тестирование новых функций
- ✅ QA validation
- ✅ Early adopter feedback
- ✅ Pre-production validation

### Узлы alpha

| Node ID | Domain | Type | Access |
|---------|--------|------|--------|
| alpha-root | alpha.balloo.su | public-root | Limited |
| apps-alpha | apps.alpha.balloo.su | apps-portal | Limited |
| 2commands-alpha | 2commands.alpha.balloo.su | experimental | Limited |

### Правила alpha

#### Domain Policy
```
✅ alpha mode SHOULD use assigned alpha domains
✅ alpha.balloo.su — root alpha domain
✅ Alpha домены отделены от production
```

#### Access Policy
```
✅ Ограниченный доступ (тестировщики, QA)
✅ Требуется авторизация
✅ Не публично индексируется
```

#### Release Policy
```
✅ Функции после working, перед production
✅ Feature-complete для тестирования
✅ Bug fixes accepted
✅ Breaking changes allowed with notice
```

---

## 🔧 WORKING BRANCH

### Основная информация

| Параметр | Значение |
|----------|----------|
| **ID** | `working` |
| **Root Domain** | `working.balloo.su` |
| **Status** | Development |
| **Maturity** | In-development |
| **Access** | Internal + Developers |
| **Node Count** | 15 |

### Назначение

Working branch — **среда разработки и интеграции**.

**Цели:**
- ✅ Разработка новых функций
- ✅ Интеграционное тестирование
- ✅ Codegen и автоматизация
- ✅ Technical nodes orchestration

### Узлы working

| Node ID | Domain | Type | Priority |
|---------|--------|------|----------|
| working-root | working.balloo.su | public-root | 2 |
| api-working | api.working.balloo.su | api | 2 |
| files-working | files.working.balloo.su | storage | 2 |
| docs-working | docs.working.balloo.su | docs | 2 |
| future-working | future.working.balloo.su | experimental | 2 |
| pilot-future-working | pilot-future.working.balloo.su | experimental | 2 |
| admin-working | admin.working.balloo.su | admin | 2 |
| workers-working | workers.working.balloo.su | workers | 2 |
| abaut-working | abaut.working.balloo.su | info | 2 |
| apps-working | apps.working.balloo.su | apps-portal | 2 |
| **workdocs-working** | **workdocs.working.balloo.su** | **technical-docs** | **1** ⭐ |
| **nodes-switcher-working** | **nodes-switcher.working.balloo.su** | **technical-orchestration** | **1** ⭐ |
| **kpdegen-working** | **kpdegen.working.balloo.su** | **technical-codegen** | **1** ⭐ |
| **projectgeneralsettings-working** | **projectgeneralsettings.working.balloo.su** | **technical-settings** | **1** ⭐ |
| **database-working** | **(no domain)** | **technical-runtime** | **1** ⭐ |

### Правила working

#### Domain Policy
```
✅ working/dev запускается локально и без обязательных доменов
✅ working MAY run via localhost, ports, local host aliases or internal routing
✅ Production identity узла не теряется даже если dev запускается локально
```

#### Local Dev Mode
```
✅ localDevRequiredDomain = false для всех working узлов
✅ Localhost ports используются для разработки
✅ Internal routing для связи между узлами
```

#### Access Policy
```
✅ Внутренний доступ (разработчики)
✅ Требуется авторизация для всех узлов
✅ Technical nodes — restricted access
```

#### Release Policy
```
✅ Active development accepted
✅ Breaking changes allowed
✅ Feature flags encouraged
✅ Continuous deployment OK
```

---

## 🔄 RELEASE FLOW

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│ WORKING  │ ───► │  ALPHA   │ ───► │PRODUCTION│
│          │      │          │      │          │
│ Develop  │      │  Test    │      │ Release  │
│ Integrate│      │ Validate │      │  Stable  │
│  (15)    │      │   (3)    │      │   (11)   │
└──────────┘      └──────────┘      └──────────┘
     │                   │                   │
     ▼                   ▼                   ▼
 localhost:32xx      alpha.balloo.su     balloo.su
 working.balloo.su   (limited)           (public)
 (internal)
```

### Release Stages

| Stage | Branch | Nodes | Purpose |
|-------|--------|-------|---------|
| 1 | working | 15 | Development & Integration |
| 2 | alpha | 3 | Testing & Validation |
| 3 | production | 11 | Stable Release |

---

## 📋 BRANCH COMPARISON

| Параметр | Production | Alpha | Working |
|----------|------------|-------|---------|
| **Root Domain** | balloo.su | alpha.balloo.su | working.balloo.su |
| **Node Count** | 11 | 3 | 15 |
| **Maturity** | Stable | Beta | Development |
| **Access** | Public | Limited | Internal |
| **Domain Required** | ✅ Yes | ✅ Yes | ❌ No (local OK) |
| **Technical Nodes** | Minimal | Minimal | **Priority 1** |
| **Breaking Changes** | ❌ No | ⚠️ With notice | ✅ Yes |
| **Codegen Priority** | 4 | 3 | 1-2 |

---

## 🎯 TECHNICAL NODES POLICY

### Working Branch Technical Nodes (Priority 1)

Следующие узлы имеют **наивысший приоритет** для codegen и автоматизации:

1. **workdocs-working** — Рабочая документация, SUMMARY_DOCS web presentation
2. **nodes-switcher-working** — Менеджер версий узлов, rollout control
3. **kpdegen-working** — Серверный кодогенератор
4. **projectgeneralsettings-working** — Управление настройками проекта
5. **database-working** — Technical runtime node (no domain)

### Production Branch Technical Nodes

- admin-production — Admin panel
- workers-production — Background workers

### Alpha Branch Technical Nodes

- None (minimal technical footprint)

---

## 🔑 CRITICAL INVARIANTS

1. **Production identity не теряется** — даже при local dev запуске
2. **Working без доменов** — localDevRequiredDomain = false
3. **Production под доменами** — productionDomainRequired = true
4. **Alpha ограниченная** — separate environment with alpha domains
5. **Технические узлы приоритет 1** — working technical nodes first for codegen
6. **Не смешивать ветки** — working/prod/alpha isolation

---

## 📖 RELATED DOCUMENTS

- [NODETREE_INDEX.md](./NODETREE_INDEX.md) — Главный индекс дерева узлов
- [NODETREE_MANIFEST.json](./NODETREE_MANIFEST.json) — Machine-readable registry
- [ENV_PRODUCTION.md](./ENV_PRODUCTION.md) — Production environment details
- [ENV_ALPHA.md](./ENV_ALPHA.md) — Alpha environment details
- [ENV_WORKING.md](./ENV_WORKING.md) — Working environment details
- [BranchNodeContract.md](../contracts/nodes/BranchNodeContract.md) — Branch contract spec

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
