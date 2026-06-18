---
title: Messenger Module Summary
description: Messenger application for Balloo platform
moduleId: messenger
moduleType: hybrid
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - app
  - messenger
  - communication
  - hybrid
related_docs:
  - SUMMARY_DOCS/modules/MODULE_INDEX.md
  - SUMMARY_DOCS/modules/contracts/MODULE_CONTRACT_messenger.md
  - messenger/README.md
---

# 🧩 MODULE SUMMARY: Messenger

**Module ID:** messenger  
**Module Type:** hybrid  
**Status:** active  
**Version:** 1.0.0

---

## 1. ✅ ЧТО ЭТО ЗА МОДУЛЬ

**Messenger** — приложение для обмена сообщениями в системе Balloo.

**Назначение:**
- Обмен текстовыми сообщениями
- Управление conversations
- Интеграция с другими сервисами

---

## 2. ✅ ЗАЧЕМ ОН НУЖЕН

**Проблемы которые решает:**

1. **Коммуникация** — обмен сообщениями между пользователями
2. **История** — сохранение истории переписки
3. **Уведомления** — уведомления о новых сообщениях

**Value Proposition:**
- ✅ Real-time messaging
- ✅ Conversation management
- ✅ Cross-platform support
- ✅ Integration with Balloo ecosystem

---

## 3. ✅ КАКОГО ОН ТИПА

**Module Type:** hybrid

**Characteristics:**
- ✅ Frontend (Next.js)
- ✅ Backend API (Next.js API routes)
- ✅ UI components
- ✅ Type definitions

**Authority Type:** hybrid

**Source of Truth:**
- ✅ Code (frontend + backend)
- ✅ Contracts (API specification)
- ✅ Documentation

---

## 4. ✅ ГДЕ ОН ЖИВЁТ В REPO

**Repository Paths:**
```
messenger/
├── src/
│   ├── pages/
│   ├── components/
│   ├── api/
│   └── lib/
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

**App Type:** Next.js application

---

## 5. ✅ КАКИЕ У НЕГО ЕСТЬ ИНТЕРФЕЙСЫ

### Public Interfaces:

**HTTP Endpoints:**
```
GET    /api/messages          # List messages
POST   /api/messages          # Send message
GET    /api/conversations     # List conversations
GET    /api/conversations/:id # Get conversation
POST   /api/conversations     # Create conversation
```

**UI Routes:**
```
/                    # Main chat view
/conversations/:id   # Specific conversation
/settings            # Settings page
```

### Import Surface:

**Uses:**
- ✅ @balloo/core-types
- ✅ @balloo/core-theme
- ✅ @balloo/core-i18n
- ✅ @balloo/core-ui

---

## 6. ✅ ГДЕ ОН ПРОЯВЛЯЕТСЯ В СИСТЕМЕ

### Node Presence:

| Node | Presence Type | Description |
|------|---------------|-------------|
| work_server | execution, exposure | Main deployment |
| laptop_control | docs-only | Development, docs |

### Domain Exposure:

**Domain:** messenger.balloo.su

**Type:** subdomain

---

## 7. ✅ С ЧЕМ ОН СВЯЗАН

### Dependencies:

**Upstream (depends on):**
- ✅ core-types
- ✅ core-theme
- ✅ core-i18n
- ✅ core-ui

**Downstream (used by):**
- ⭕ None — end-user application

### Related Modules:

| Module | Relationship |
|--------|--------------|
| core-types | uses types |
| core-theme | uses theme |
| core-i18n | uses i18n |
| core-ui | uses components |

---

## 8. ✅ НАСКОЛЬКО ОН РЕАЛИЗОВАН

**Implementation Status:** ✅ Implemented

**Evidence:**
- ✅ App directory exists
- ✅ package.json present
- ✅ Source files present
- ✅ Deployed to work_server

**Completeness:**
- ✅ Frontend implemented
- ✅ API routes implemented
- ✅ Basic features working
- ⭕ Some advanced features planned

---

## 9. ✅ ПОЧЕМУ ОН ВАЖЕН ДЛЯ AI/РАЗРАБОТКИ

### For AI Codegen:

**HIGH Relevance:**
- ✅ Full app scaffolding
- ✅ API route generation
- ✅ Component generation
- ✅ Type-safe code

### For Developers:

**Quick Reference:**
- ✅ App structure documented
- ✅ API endpoints documented
- ✅ UI routes documented
- ✅ Dependencies clear

---

## 📊 METRICS

| Metric | Value |
|--------|-------|
| **Endpoints** | 5 |
| **UI Routes** | 3+ |
| **Components** | 20+ |
| **Dependent Modules** | 0 |
| **Codegen Relevance** | HIGH |
| **Docgen Relevance** | HIGH |

---

## 🔗 LINKS

- **Contract:** [MODULE_CONTRACT_messenger.md](../contracts/MODULE_CONTRACT_messenger.md)
- **App:** [messenger/](../../../messenger/)
- **Module Index:** [MODULE_INDEX.md](../MODULE_INDEX.md)

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**
