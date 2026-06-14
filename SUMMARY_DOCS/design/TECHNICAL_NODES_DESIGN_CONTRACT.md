---
title: Technical Nodes Design Contract
description: Реконструированный дизайн-контракт технических узлов Balloo на основе SUMMARY_DOCS
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - design
  - technical-nodes
  - summary-docs
  - canonical
related_docs:
  - SUMMARY_DOCS/design/USER_ENV_DESIGN_CONTRACT.md
  - SUMMARY_DOCS/nodes/NODETREE_INDEX.md
  - SUMMARY_DOCS/runbooks/RUNBOOK_INDEX.md
---

# ⚙️ TECHNICAL NODES DESIGN CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот контракт определяет **дизайн-систему технических узлов** Balloo, реконструированную из SUMMARY_DOCS документации.

**Evidence Sources:**
- `SUMMARY_DOCS/nodes/technical/` — Technical node docs
- `SUMMARY_DOCS/runbooks/` — Operational runbooks
- `SUMMARY_DOCS/contracts/nodes/` — Node contracts
- `SUMMARY_DOCS/state/` — State files and mappings
- `workdocs/` — WorkDocs implementation (reconstructed)

---

## 🏛️ TECHNICAL UI IDENTITY

### Core Principles

1. **Function Over Form** — Utility-first design
2. **Information Density** — High data density acceptable
3. **Keyboard-Native** — Shortcuts and keyboard navigation
4. **Status-Visible** — Health, errors, states always visible
5. **Auth-Required** — All technical UIs require authentication

### Difference from Client UI

| Aspect | Client UI | Technical UI |
|--------|-----------|--------------|
| **Audience** | End users | Developers, operators, admin |
| **Density** | Comfortable | High |
| **Navigation** | Simple, guided | Complex, power-user |
| **States** | Simplified | Detailed diagnostics |
| **Themes** | 3 presets | Same + high-contrast |
| **Rounded Corners** | ❌ Never | ❌ Never (same invariant) |

---

## 🎨 SERVICE/ADMIN TOKEN PROFILE

### Shared Tokens (from User Environment)

| Token | Value | Usage |
|-------|-------|-------|
| `--border-radius` | `0` | Sharp corners everywhere |
| `--border-width` | `2px` | Consistent borders |
| `--primary` | `#3b82f6` | Primary actions |
| `--destructive` | `#dc2626` | Errors, dangerous actions |

### Technical-Specific Tokens

```css
:root {
  /* Status Colors */
  --status-healthy: #10b981;
  --status-degraded: #f59e0b;
  --status-failed: #dc2626;
  --status-startup: #3b82f6;
  --status-maintenance: #6b7280;
  
  /* Technical UI */
  --code-background: #1a1a1a;
  --code-foreground: #e5e5e5;
  --log-info: #3b82f6;
  --log-warning: #f59e0b;
  --log-error: #dc2626;
  --log-debug: #6b7280;
  
  /* Dashboard */
  --metric-card-bg: var(--card);
  --metric-value-size: 2.5rem;
  --metric-label-size: 0.875rem;
  
  /* Tables */
  --table-header-bg: var(--muted);
  --table-row-hover: var(--muted);
  --table-border: var(--border);
}
```

---

## 📊 DASHBOARD PATTERNS

### Metric Card

```
┌────────────────────────┐
│  Node Health           │
│  ─────────────────     │
│  98.5%          ▲ 2.1% │
│  Last 24 hours         │
└────────────────────────┘
```

**Structure:**
- Title
- Value (large, prominent)
- Delta/trend indicator
- Time range

### Status Block

```
┌────────────────────────────────┐
│ ●  workdocs-working            │
│    Status: HEALTHY             │
│    Uptime: 99.9% (24h)         │
│    Last check: 30s ago         │
└────────────────────────────────┘
```

**States:** healthy, degraded, failed, startup, maintenance

---

## 📋 FORM PATTERNS

### Settings Form

```
┌────────────────────────────────┐
│  Node Settings                 │
│  ─────────────────────────     │
│                                │
│  Node ID                       │
│  ┌──────────────────────────┐ │
│  │ workdocs-working         │ │
│  └──────────────────────────┘ │
│                                │
│  Port                         │
│  ┌──────────────────────────┐ │
│  │ 3210                     │ │
│  └──────────────────────────┘ │
│                                │
│  [Save] [Cancel] [Reset]      │
└────────────────────────────────┘
```

**Characteristics:**
- Clear labels
- Inline validation
- Action buttons at bottom
- Reset to defaults option

---

## 📄 DOCS LAYOUT PATTERNS

### Documentation Page (WorkDocs-like)

```
┌─────────────────────────────────────────┐
│ [Logo] WorkDocs              [Search]  │
├───────────┬─────────────────────────────┤
│ NAVIGATION│  CONTENT                     │
│           │                              │
│ ► Nodes   │  # Node Documentation        │
│ ► Contracts│                              │
│ ► Runbooks│  Content here...             │
│ ► State   │                              │
│           │                              │
└───────────┴─────────────────────────────┘
```

**Characteristics:**
- Left navigation (collapsible on mobile)
- Main content area
- Search at top
- Breadcrumbs for deep navigation

---

## 🎛️ CONTROL SURFACES

### Rollout Control (Nodes-Switcher-like)

```
┌─────────────────────────────────────┐
│  Rollout: api-production            │
│  ─────────────────────────────────  │
│                                     │
│  Target Version: 3.2.0              │
│  Current: 3.1.5                     │
│                                     │
│  Progress: [████████░░] 80%         │
│                                     │
│  Nodes Updated: 8/10                │
│  ┌─────────────────────────────┐   │
│  │ ● node-1  ✓ 3.2.0          │   │
│  │ ● node-2  ✓ 3.2.0          │   │
│  │ ● node-3  🔄 Updating...   │   │
│  │ ● node-4  ⏳ Pending       │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Pause] [Resume] [Rollback]        │
└─────────────────────────────────────┘
```

---

## 🔐 ACCESS/AUTH PATTERNS

### Auth Screen (Technical)

```
┌────────────────────────────────┐
│         [Logo]                  │
│    Technical Access             │
│  ─────────────────────────      │
│                                 │
│  Node: workdocs-working         │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Username                 │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Password                 │  │
│  └──────────────────────────┘  │
│                                 │
│  [Sign In]                      │
│                                 │
│  Internal access only           │
└────────────────────────────────┘
```

**Characteristics:**
- Node identifier shown
- Clear access level warning
- 2FA support (for sensitive nodes)

---

## 📈 STATE/HEALTH/MONITORING PATTERNS

### Health Widget

```
┌────────────────────────────────┐
│  System Health                 │
│  ─────────────────────────     │
│                                │
│  ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ 98%  │ │ 12   │ │ 0    │  │
│  │ Up   │ │Nodes │ │Alerts│  │
│  └──────┘ └──────┘ └──────┘  │
│                                │
│  [View Details]                │
└────────────────────────────────┘
```

### Log Viewer

```
┌────────────────────────────────────────┐
│  Logs: kpdegen-working      [Filter]  │
│  ─────────────────────────────────     │
│                                        │
│  [INFO] 10:00:00 Codegen started       │
│  [INFO] 10:00:01 Templates loaded: 10  │
│  [WARN] 10:00:05 Slow response: 2.1s   │
│  [ERROR] 10:00:10 Template parse fail  │
│  [INFO] 10:00:15 Generation complete   │
│                                        │
│  [Auto-scroll] [Download] [Clear]      │
└────────────────────────────────────────┘
```

**Log Levels:** INFO, WARN, ERROR, DEBUG

---

## 🏗️ TECHNICAL NODE SCREEN ARCHETYPES

### Reconstructed from SUMMARY_DOCS

| Screen Type | Example Nodes | Pattern |
|-------------|---------------|---------|
| **Dashboard** | nodes-switcher, projectgeneralsettings | Metrics + status |
| **Docs View** | workdocs | Navigation + content |
| **Settings** | projectgeneralsettings | Form sections |
| **Control** | nodes-switcher, kpdegen | Actions + progress |
| **Logs** | All technical nodes | Log stream + filters |
| **Health** | All technical nodes | Status widgets |
| **Auth** | All technical nodes | Login form |
| **Config** | All technical nodes | JSON/YAML editor |

---

## ✅ INVARIANTS

### Critical (Shared with Client UI)

1. **`border-radius: 0`** — No rounded corners anywhere
2. **`border: 2px solid`** — All borders 2px
3. **3 themes** — dark, light, russia (same as client)
4. **System fonts** — No custom font imports

### Technical-Specific

1. **Status always visible** — Health/state in header or sidebar
2. **Keyboard shortcuts** — All actions accessible via keyboard
3. **Logs accessible** — Log viewer available for all nodes
4. **Auth required** — No public technical UI
5. **Audit trail** — Actions logged and visible

---

## 🚫 FORBIDDEN DEVIATIONS

### Never Do (Technical UI)

- ❌ Rounded corners (same as client)
- ❌ Hidden status/health
- ❌ Mouse-only interactions
- ❌ No auth on technical endpoints
- ❌ Unlogged admin actions
- ❌ Missing error states
- ❌ No rollback capability

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "technicalDesignTokens": "SUMMARY_DOCS/state/design-tokens.json",
  "technicalComponents": "SUMMARY_DOCS/state/design-components.json",
  "technicalPatterns": "SUMMARY_DOCS/state/design-screen-patterns.json",
  "invariants": ["no-rounded-corners", "status-visible", "auth-required"]
}
```

### Template Variables

```typescript
interface TechnicalDesignContext {
  nodeType: 'technical';
  requiresAuth: true;
  showHealth: true;
  showLogs: true;
  allowRollback: true;
  borderRadius: 0; // Always
  borderWidth: 2; // Default
}
```

---

## 📖 RELATED DOCUMENTS

- [USER_ENV_DESIGN_CONTRACT.md](./USER_ENV_DESIGN_CONTRACT.md) — Client UI contract
- [USER_VS_TECH_UI_BOUNDARY.md](./USER_VS_TECH_UI_BOUNDARY.md) — UI boundaries
- [NODETREE_INDEX.md](../nodes/NODETREE_INDEX.md) — Node tree
- [RUNBOOK_INDEX.md](../runbooks/RUNBOOK_INDEX.md) — Runbooks

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
