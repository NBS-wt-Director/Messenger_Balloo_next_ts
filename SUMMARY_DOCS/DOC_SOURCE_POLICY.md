---
title: Documentation Source Policy
description: Политика источников документации Balloo monorepo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
---

# 📜 DOCUMENTATION SOURCE POLICY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Активная политика  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ фиксирует правила управления источниками документации в monorepo Balloo.

**Primary Purpose:** Установить SUMMARY_DOCS как единственный canonical source of truth для всей рабочей документации.

---

## ✅ ПРАВИЛО ЕДИНОГО ИСТОЧНИКА

### SUMMARY_DOCS = Canonical Source

**SUMMARY_DOCS** является единственным canonical source of truth для:
- Project contracts и specifications
- Node contracts и topology
- Architecture documentation
- Migration guides
- Audit reports
- State files
- Playbooks и инструкции

---

## 📁 РАЗРЕШЁННЫЕ РАСПОЛОЖЕНИЯ

### Внутри SUMMARY_DOCS (Canonical):

| Тип | Расположение | Статус |
|-----|--------------|--------|
| Contracts | `SUMMARY_DOCS/contracts/` | ✅ Canonical |
| Summary | `SUMMARY_DOCS/summary/` | ✅ Canonical |
| Topology | `SUMMARY_DOCS/topology/` | ✅ Canonical |
| State | `SUMMARY_DOCS/state/` | ✅ Canonical |
| Migrations | `SUMMARY_DOCS/migrations/` | ✅ Canonical |
| Audits | `SUMMARY_DOCS/audits/` | ✅ Canonical |
| Architecture | `SUMMARY_DOCS/architecture/` | ✅ Canonical |
| Playbooks | `SUMMARY_DOCS/playbooks/` | ✅ Canonical |
| Appendix | `SUMMARY_DOCS/appendix/` | ✅ Canonical |

### Вне SUMMARY_DOCS (Non-Canonical):

| Тип | Расположение | Статус |
|-----|--------------|--------|
| Generated mirrors | `workdocs/`, `infra/` | ⚠️ Generated only |
| Compatibility stubs | Старые пути | ⚠️ Redirect only |
| Deprecated redirects | Legacy paths | ❌ Deprecated |

---

## 🚫 ЗАПРЕЩЕНО

### Создание документации вне SUMMARY_DOCS:

- ❌ Запрещено создавать новые рабочие документы вне `SUMMARY_DOCS/`
- ❌ Запрещено дублировать canonical документы в других местах
- ❌ Запрещено обновлять legacy документы вместо canonical
- ❌ Запрещено создавать competing sources of truth

### Исключения (разрешено вне SUMMARY_DOCS):

- ✅ Generated mirrors (автоматически создаваемые копии)
- ✅ Compatibility stubs (короткие redirect-заглушки)
- ✅ Deprecated redirects (указывают на canonical path)
- ✅ Технические файлы (конфигурации, скрипты)

---

## 🔄 MIGRATION RULES

### При переносе документа:

1. **Physical move** — переместить документ в SUMMARY_DOCS
2. **Create stub** — создать заглушку на старом месте
3. **Update references** — обновить все ссылки на новый path
4. **Update MANIFEST** — добавить в MANIFEST.json
5. **Update ROUTING** — добавить mapping в ROUTING.json

### Формат stub:

```markdown
---
title: [Document Name]
status: deprecated
canonical: SUMMARY_DOCS/[category]/[document].md
---

# ⚠️ DEPRECATED PATH

Этот документ перемещён.

**Canonical source:** [SUMMARY_DOCS/[category]/[document].md](SUMMARY_DOCS/[category]/[document].md)

---

*Это compatibility stub для обратной совместимости.*
```

---

## 📊 CONFLICT RESOLUTION

### Если документ существует в двух местах:

| Ситуация | Решение |
|----------|---------|
| SUMMARY_DOCS + legacy | SUMMARY_DOCS wins |
| SUMMARY_DOCS + generated | SUMMARY_DOCS wins |
| SUMMARY_DOCS + stub | SUMMARY_DOCS wins |
| Legacy + legacy | Migrate to SUMMARY_DOCS |

### Priority order:

1. **SUMMARY_DOCS canonical** (highest priority)
2. **Generated mirrors** (read-only)
3. **Compatibility stubs** (redirect only)
4. **Legacy documents** (deprecated)

---

## 🔍 VERIFICATION

### Проверка соответствия:

```bash
# Найти документы вне SUMMARY_DOCS
find workdocs infra platform-state -name "*.md" -type f

# Проверить наличие canonical версий
grep -r "canonical:" workdocs/ infra/

# Обновить MANIFEST
node scripts/update-manifest.js
```

---

## 📝 MAINTENANCE

### Обновление политики:

- Минимум раз в квартал
- При добавлении новых категорий документов
- При изменении структуры SUMMARY_DOCS

### Ответственные:

- **Documentation Owner:** NLP-Core-Team
- **AI Agent:** Koda
- **Review Process:** Pull Request + Audit

---

## ✅ КРИТЕРИИ ПРИЁМКИ

Документация считается соответствующей политике если:

1. ✅ Вся рабочая документация в SUMMARY_DOCS
2. ✅ Legacy пути имеют stubs с redirect
3. ✅ MANIFEST.json актуален
4. ✅ ROUTING.json содержит все mappings
5. ✅ Нет competing sources of truth

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active Policy  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
