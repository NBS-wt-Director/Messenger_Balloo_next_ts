---
title: User vs Technical UI Boundary
description: Границы между пользовательским и техническим интерфейсами Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - design
  - ui-boundary
  - canonical
related_docs:
  - SUMMARY_DOCS/design/USER_ENV_DESIGN_CONTRACT.md
  - SUMMARY_DOCS/design/TECHNICAL_NODES_DESIGN_CONTRACT.md
  - SUMMARY_DOCS/state/design-node-ui-map.json
---

# 🚧 USER VS TECHNICAL UI BOUNDARY

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот документ определяет **границы между пользовательским и техническим UI** в платформе Balloo.

**Цель:** Чёткое разделение компонентов и паттернов для client apps и technical nodes.

---

## 📊 UI BOUNDARY MATRIX

### Component Availability

| Component | Client Apps | Technical Nodes | Admin Panel | Shared |
|-----------|-------------|-----------------|-------------|--------|
| **Button** | ✅ Full | ✅ Limited | ✅ Full | ✅ |
| **Input** | ✅ Full | ✅ Limited | ✅ Full | ✅ |
| **Card** | ✅ Full | ✅ Full | ✅ Full | ✅ |
| **Modal** | ✅ Full | ⚠️ Limited | ✅ Full | ⚠️ |
| **Header** | ✅ Full | ⚠️ Minimal | ✅ Full | ⚠️ |
| **Footer** | ✅ Full | ❌ None | ⚠️ Minimal | ❌ |
| **StatusBadge** | ⚠️ Limited | ✅ Full | ✅ Full | ⚠️ |
| **MetricCard** | ❌ None | ✅ Full | ✅ Full | ❌ |
| **LogViewer** | ❌ None | ✅ Full | ✅ Full | ❌ |
| **NodeStatusBlock** | ❌ None | ✅ Full | ✅ Full | ❌ |

**Legend:**
- ✅ Full — All variants available
- ⚠️ Limited — Some variants only
- ❌ None — Not available
- Shared — Component definition shared

---

## 🎨 THEME POLICY

### Theme Availability by Node Type

| Node Type | dark | light | russia | Custom |
|-----------|------|-------|--------|--------|
| **Client (messenger, mobile)** | ✅ | ✅ | ✅ | ✅ Allowed |
| **Technical (admin, workdocs)** | ✅ | ✅ | ❌ | ❌ Forbidden |
| **Service (api, auth)** | ✅ | ❌ | ❌ | ❌ Forbidden |
| **Infra (postgres, redis)** | ❌ | ❌ | ❌ | ❌ N/A |

### Theme Switcher

| Node Type | Theme Switcher | Persist Preference |
|-----------|---------------|-------------------|
| **Client** | ✅ Yes | ✅ Yes (localStorage) |
| **Technical** | ✅ Yes | ✅ Yes (localStorage) |
| **Service** | ❌ No | ❌ N/A |
| **Infra** | ❌ No | ❌ N/A |

---

## 🏗️ LAYOUT PATTERNS

### Client Apps (User Environment)

| Pattern | Usage | Example |
|---------|-------|---------|
| **Centered** | Auth screens | Login, Register |
| **Two-column** | Chat, Mail | Messenger |
| **Grid** | Dashboard | Home screen |
| **Sidebar** | Settings | User preferences |

### Technical Nodes

| Pattern | Usage | Example |
|---------|-------|---------|
| **Dashboard Grid** | Monitoring | Node overview |
| **Tabs** | Node details | Overview/Logs/Config |
| **Full-width** | Log viewer | Real-time logs |
| **Sidebar** | Admin nav | Technical settings |

---

## 📦 SHARED VS NODE-SPECIFIC

### Shared Components (packages/core-ui)

```
- Button
- Input
- Card
- Modal (base)
- StatusBadge (base)
```

### Client-Specific (messenger/src/components)

```
- ChatMessage
- ConversationList
- UserAvatar
- MessageInput
- TypingIndicator
```

### Technical-Specific (nodes/admin/components)

```
- MetricCard
- LogViewer
- NodeStatusBlock
- HealthWidget
- ConfigEditor
```

---

## 🎯 DESIGN INVARIANTS (Apply to ALL)

### Universal Rules

| Invariant | Client | Technical | Notes |
|-----------|--------|-----------|-------|
| **border-radius: 0** | ✅ | ✅ | No rounded corners anywhere |
| **border: 2px solid** | ✅ | ✅ | Default border width |
| **System fonts** | ✅ | ✅ | No custom font imports |
| **44px touch targets** | ✅ | ⚠️ | Mobile only for client |
| **3 themes max** | ✅ | ⚠️ | Technical: 2 themes |

### Client-Only Rules

| Rule | Description |
|------|-------------|
| Custom themes allowed | Users can create custom themes |
| Full animation support | All animations enabled |
| Mobile responsive | Full mobile support required |

### Technical-Only Rules

| Rule | Description |
|------|-------------|
| No custom themes | Only preset themes allowed |
| Minimal animations | Only essential animations |
| Desktop-first | Primary target is desktop |

---

## 🔄 BOUNDARY CROSSING

### When Client Needs Technical Components

**Scenario:** Client app shows node health status

**Solution:** Use shared `StatusBadge` component

```typescript
// ✅ CORRECT: Use shared component
import { StatusBadge } from '@balloo/core-ui';

<StatusBadge status="healthy">Node OK</StatusBadge>
```

### When Technical Needs Client Components

**Scenario:** Technical node has user settings

**Solution:** Use shared `Input`, `Button`, `Card` components

```typescript
// ✅ CORRECT: Use shared components
import { Input, Button, Card } from '@balloo/core-ui';

<Card>
  <Input placeholder="Enter API key" />
  <Button>Save</Button>
</Card>
```

---

## 📊 NODE CLASSIFICATION

### Client Nodes

| Node | UI Complexity | Themes | Components |
|------|--------------|--------|------------|
| **messenger** | High | 3 + custom | Full client set |
| **web-main** | High | 3 + custom | Full client set |
| **mobile** | High | 3 + custom | Mobile-optimized |
| **desktop** | High | 3 + custom | Desktop-optimized |

### Technical Nodes

| Node | UI Complexity | Themes | Components |
|------|--------------|--------|------------|
| **admin** | Medium | 2 | Technical set |
| **workdocs** | Medium | 2 | Technical set |
| **monitoring** | Medium | 2 | Technical set |

### Service Nodes

| Node | UI Complexity | Themes | Components |
|------|--------------|--------|------------|
| **api** | Minimal | 1 | Health endpoint only |
| **auth** | Minimal | 1 | Health endpoint only |

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "uiBoundary": {
    "client": {
      "components": ["Button", "Input", "Card", "Modal", "Header", "Footer"],
      "patterns": ["centered", "two-column", "grid", "sidebar"],
      "themes": ["dark", "light", "russia", "custom"],
      "complexity": "high"
    },
    "technical": {
      "components": ["Button", "Input", "Card", "MetricCard", "LogViewer", "NodeStatusBlock"],
      "patterns": ["dashboard-grid", "tabs", "full-width"],
      "themes": ["dark", "light"],
      "complexity": "medium"
    },
    "shared": {
      "components": ["Button", "Input", "Card", "StatusBadge"],
      "invariants": ["no-rounded-corners", "2px-borders", "system-fonts"]
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [USER_ENV_DESIGN_CONTRACT.md](./USER_ENV_DESIGN_CONTRACT.md) — User environment design
- [TECHNICAL_NODES_DESIGN_CONTRACT.md](./TECHNICAL_NODES_DESIGN_CONTRACT.md) — Technical nodes design
- [../state/design-node-ui-map.json](../state/design-node-ui-map.json) — Node UI mapping

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
