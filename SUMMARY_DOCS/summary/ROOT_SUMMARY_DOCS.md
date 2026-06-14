---
title: ROOT SUMMARY DOCS
description: Обзор documentation node SUMMARY_DOCS
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
---

# 📚 ROOT SUMMARY DOCS

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

**SUMMARY_DOCS** — центральный documentation node монорепо Balloo.

Этот документ описывает что такое SUMMARY_DOCS, зачем он нужен и как его использовать.

---

## 🏗️ АРХИТЕКТУРА

### Что такое SUMMARY_DOCS:

```
SUMMARY_DOCS = единый источник истины для всей документации проекта
```

### Основные принципы:

1. **Единый источник** — вся документация в одном месте
2. **Canonical paths** — у каждого документа один canonical путь
3. **AI-readable** — структура понятна AI-агентам
4. **Human-readable** — навигация понятна людям
5. **Web-exposed** — доступно через web interface

---

## 📖 КАК ЭТО РАБОТАЕТ

### Для человека:

```
1. Открываешь INDEX.md
2. Видишь структуру документации
3. Переходишь в нужный раздел
4. Читаешь документ
```

### Для AI:

```
1. Читаешь INDEX.md (overview)
2. Читаешь MANIFEST.json (structure)
3. Читаешь relevant contracts (specs)
4. Генерируешь код/документацию
5. Записываешь обратно в SUMMARY_DOCS
```

### Для web reader:

```
1. Landing page = INDEX.md
2. Navigation tree из MANIFEST.json
3. Content из markdown файлов
4. Routing через ROUTING.json
```

---

## 📁 СТРУКТУРА

```
SUMMARY_DOCS/
├── README.md                    # Этот файл
├── INDEX.md                     # Главная навигация
├── MANIFEST.json                # Machine-readable индекс
├── ROUTING.json                 # Mapping путей
├── DOC_SOURCE_POLICY.md         # Политика источников
├── DOC_GENERATION_POLICY.md     # Политика генерации
├── DOC_CODEGEN_POLICY.md        # Политика кодогенерации
├── DOC_WEB_READER_POLICY.md     # Политика web reader
│
├── contracts/                   # Контракты системы
│   ├── node-contracts/          # Контракты узлов
│   ├── project-contracts/       # Контракты проекта
│   ├── domain-contracts/        # Доменные контракты
│   └── ...
│
├── summary/                     # Сводные документы
│   ├── ROOT_SUMMARY_DOCS.md     # Этот файл
│   ├── NODE_SUMMARY_*.md        # Сводки по узлам
│   └── ...
│
├── topology/                    # Карты и схемы
│   ├── DOMAIN_MAP.md
│   ├── NETWORK_MAP.md
│   ├── DEPLOYMENT_MAP.md
│   └── RESTORE_PLAYBOOK.md
│
├── state/                       # State файлы
│   ├── node-tree.json
│   ├── node-domains.json
│   ├── node-services.json
│   └── node-recovery-order.json
│
├── architecture/                # Архитектура
│   ├── system-overview.md
│   └── repo-structure.md
│
├── playbooks/                   # Playbooks
│   ├── doc-update-playbook.md
│   └── codegen-playbook.md
│
├── appendix/                    # Приложения
│   ├── glossary.md
│   └── AI_ENTRYPOINTS.md
│
└── deprecated/                  # Устаревшее
    └── legacy-paths.md
```

---

## 🔑 КЛЮЧЕВЫЕ КОМПОНЕНТЫ

### INDEX.md

**Что:** Главная навигация  
**Для кого:** Человек + AI  
**Зачем:** Overview структуры документации

### MANIFEST.json

**Что:** Machine-readable индекс  
**Для кого:** AI + Web reader  
**Зачем:** Structure metadata, document list

### ROUTING.json

**Что:** Mapping путей  
**Для кого:** Web reader  
**Зачем:** Legacy → canonical path resolution

### Policies

**Что:** Правила и политики  
**Для кого:** AI + Человек  
**Зачем:** Governance documentation

### Contracts

**Что:** Спецификации компонентов  
**Для кого:** AI + Codegen + Человек  
**Зачем:** Source of truth для кодогенерации

### State

**Что:** Конфигурация системы  
**Для кого:** AI + Codegen  
**Зачем:** Current state documentation

---

## 🔄 WORKFLOWS

### Doc Generation Workflow:

```
AI читает:
  1. INDEX.md
  2. MANIFEST.json
  3. Relevant contracts

AI создаёт:
  1. Новый документ в SUMMARY_DOCS/[category]/
  2. Обновляет MANIFEST.json
  3. Обновляет doc-state.json
```

### Codegen Workflow:

```
AI читает:
  1. Contracts (specifications)
  2. State (configuration)
  3. Topology (architecture)

AI генерирует:
  1. Код по contracts
  2. Обновляет документацию
  3. Commit changes
```

### Web Reader Workflow:

```
User открывает:
  1. Landing page (INDEX.md)
  2. Navigation (MANIFEST.json)
  3. Document (markdown)

Web reader:
  1. Рендерит markdown
  2. Показывает related docs
  3. Обновляет navigation
```

---

## 📊 METRICS

### Documentation Statistics:

| Metric | Value |
|--------|-------|
| Total documents | 17+ |
| Categories | 10 |
| Policies | 4 |
| Contracts | 7 |
| Topology docs | 4 |
| State files | 4 |

### Coverage:

| Area | Coverage |
|------|----------|
| Node contracts | ✅ 100% |
| Topology | ✅ 100% |
| State files | ✅ 100% |
| Policies | ✅ 100% |
| Summary docs | ✅ 100% |

---

## ✅ BENEFITS

### Для команды:

- ✅ Единый источник истины
- ✅ Понятная навигация
- ✅ Актуальная документация
- ✅ AI-assisted workflows

### Для AI:

- ✅ Чёткая структура
- ✅ Machine-readable индекс
- ✅ Canonical paths
- ✅ Policy-guided generation

### Для проекта:

- ✅ Maintainable documentation
- ✅ Audit-ready
- ✅ License-ready
- ✅ Reconstruction-ready

---

## 🚀 GETTING STARTED

### Первый раз:

1. Прочитать **INDEX.md**
2. Прочитать **DOC_SOURCE_POLICY.md**
3. Изучить структуру в **MANIFEST.json**
4. Открыть нужный раздел

### Для AI:

1. Прочитать **appendix/AI_ENTRYPOINTS.md**
2. Следовать **playbooks/codegen-playbook.md**
3. Обновлять **MANIFEST.json** при изменениях

---

## 🔗 RELATED DOCUMENTS

- [INDEX.md](../INDEX.md) — Главная навигация
- [MANIFEST.json](../MANIFEST.json) — Индекс документов
- [DOC_SOURCE_POLICY.md](../DOC_SOURCE_POLICY.md) — Политика источников
- [AI_ENTRYPOINTS.md](../appendix/AI_ENTRYPOINTS.md) — AI workflow

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
