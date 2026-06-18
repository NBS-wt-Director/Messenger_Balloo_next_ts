---
title: Node Documentation Audience Contract
description: Контракт на документацию для human vs AI аудитории
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - audience
  - contract
  - documentation
  - canonical
related_docs:
  - SUMMARY_DOCS/contracts/nodes/NodeDocumentationStandard.md
  - SUMMARY_DOCS/nodes/NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md
---

# 👥 NODE DOCUMENTATION AUDIENCE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **требования к документации** для human и AI аудитории.

**Цель:** Гарантировать что документация пригодна и для человека, и для AI.

---

## 📖 HUMAN-READABLE REQUIREMENTS

### Human-Readable Docs MUST

| Requirement | Description | Verification |
|-------------|-------------|--------------|
| **Ясный purpose** | Purpose понятен в первом абзаце | Read first paragraph |
| **Без неоднозначности** | Нет "maybe", "possibly", "might" | Text analysis |
| **Короткое вступление** | ≤3 предложения в intro | Count sentences |
| **Quickstart** | Есть quickstart section | Check for section |
| **Примеры** | Есть usage examples | Check for examples |
| **Troubleshooting** | Есть troubleshooting section | Check for section |
| **Headings для навигации** | Использованы headings | Check structure |
| **Cross-references** | Есть ссылки на related docs | Check links |

### Human-Readable Docs MUST NOT

| Forbidden | Reason |
|-----------|--------|
| ❌ Technical jargon без объяснения | Confusing for humans |
| ❌ Длинные параграфы (>10 строк) | Hard to read |
| ❌ Отсутствие структуры | Confusing navigation |
| ❌ Нет summary в начале | Unclear purpose |

---

## 🤖 AI-READABLE REQUIREMENTS

### AI-Readable Docs MUST

| Requirement | Description | Verification |
|-------------|-------------|--------------|
| **Стабильные секции** | Consistent structure across docs | Check structure |
| **Явные поля** | YAML/JSON blocks для parsing | Check for blocks |
| **Machine-readable links** | Canonical paths to related docs | Check link format |
| **Без расплывчатых формулировок** | No vague language | Text analysis |
| **Explicit invariants** | Явно зафиксированные invariants | Check for section |
| **Forbidden assumptions** | Явно зафиксированные forbidden assumptions | Check for section |
| **Canonical identifiers** | nodeId, branch, etc. | Check for identifiers |
| **Version information** | Version in frontmatter | Check frontmatter |

### AI-Readable Docs MUST NOT

| Forbidden | Reason |
|-----------|--------|
| ❌ Inconsistent section names | Breaks parsing |
| ❌ Missing YAML/JSON blocks | No machine-readable data |
| ❌ Relative paths без canonical | Broken links |
| ❌ Speculation без marking | Misleads AI |

---

## 📊 AUDIENCE MATRIX

| Document Type | Primary Audience | Secondary Audience |
|---------------|------------------|-------------------|
| **Summary** | Human | AI |
| **Contract** | AI | Human |
| **Quickstart** | Human | AI |
| **Runbook** | Human (operations) | AI (automation) |
| **Troubleshooting** | Human (debugging) | AI (diagnosis) |
| **Examples** | Both | Both |
| **Health Model** | AI (monitoring) | Human (review) |
| **Ownership** | Human (management) | AI (audit) |

---

## ✅ QUALITY CHECKS

### Human Readability Checks

```markdown
1. Can a new developer understand this in 5 minutes?
2. Is the purpose clear in the first paragraph?
3. Are there examples of common use cases?
4. Is troubleshooting available?
5. Is navigation clear (headings, links)?
```

### AI Readability Checks

```markdown
1. Can AI parse the structure reliably?
2. Are YAML/JSON blocks valid?
3. Are all links canonical paths?
4. Are invariants explicit?
5. Is version information present?
```

---

## 🔄 DUAL-AUDIENCE VALIDATION

### Before Publishing

- [ ] Human can understand purpose in <1 minute
- [ ] AI can parse structure reliably
- [ ] Examples are realistic and tested
- [ ] All links work
- [ ] No ambiguous language
- [ ] All invariants explicit

### After Updates

- [ ] Re-run human readability check
- [ ] Re-run AI parsing check
- [ ] Update version in frontmatter
- [ ] Update changelog if needed

---

## 📖 RELATED DOCUMENTS

- [NodeDocumentationStandard.md](./NodeDocumentationStandard.md) — Documentation standard
- [NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md](../nodes/NODE_DOCUMENTATION_COMPLETENESS_MATRIX.md) — Completeness matrix
- [NodeExamplesPolicy.md](./NodeExamplesPolicy.md) — Examples policy

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
