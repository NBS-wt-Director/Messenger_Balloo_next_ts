---
title: Node client-apps Family
description: Семейство клиентских приложений Balloo — android, ios, windows, linux, macos
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - client-apps
  - family
  - platforms
  - canonical
related_docs:
  - SUMMARY_DOCS/nodes/NODE_FAMILIES.md
  - SUMMARY_DOCS/state/client-platform-map.json
---

# 📱 NODE: client-apps Family

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ описывает **семейство клиентских приложений** Balloo.

**Client Apps** = platform nodes для desktop и mobile клиентов.

---

## 📊 FAMILY OVERVIEW

| Параметр | Значение |
|----------|----------|
| **Family ID** | `client-apps-family` |
| **Type** | `family` |
| **Branch** | `production` |
| **Domain** | (none) |
| **Platforms** | 5 (android, ios, windows, linux, macos) |
| **Public** | ✅ Yes |

---

## 📱 PLATFORM ENTRIES

### 1. Android

| Параметр | Значение |
|----------|----------|
| **Platform ID** | `android` |
| **Type** | `mobile` |
| **Delivery Surface** | Google Play Store |
| **Release Stage** | `production` |
| **Download Surface** | `apps.balloo.su` (link) |

### 2. iOS

| Параметр | Значение |
|----------|----------|
| **Platform ID** | `ios` |
| **Type** | `mobile` |
| **Delivery Surface** | Apple App Store |
| **Release Stage** | `production` |
| **Download Surface** | `apps.balloo.su` (link) |

### 3. Windows

| Параметр | Значение |
|----------|----------|
| **Platform ID** | `windows` |
| **Type** | `desktop` |
| **Delivery Surface** | Direct Download |
| **Release Stage** | `production` |
| **Download Surface** | `apps.balloo.su` (link) |

### 4. Linux

| Параметр | Значение |
|----------|----------|
| **Platform ID** | `linux` |
| **Type** | `desktop` |
| **Delivery Surface** | Download / Package Manager |
| **Release Stage** | `production` |
| **Download Surface** | `apps.balloo.su` (link) |

### 5. macOS

| Параметр | Значение |
|----------|----------|
| **Platform ID** | `macos` |
| **Type** | `desktop` |
| **Delivery Surface** | Download / App Store |
| **Release Stage** | `production` |
| **Download Surface** | `apps.balloo.su` (link) |

---

## 🔗 RELATIONS

### Relation to apps.balloo.su

```yaml
relation:
  type: download_portal
  apps_node: apps-production
  domain: apps.balloo.su
  provides: download_links_for_all_platforms
```

### Relation to apps.working.balloo.su

```yaml
relation:
  type: working_download_portal
  apps_node: apps-working
  domain: apps.working.balloo.su
  provides: working_builds_links
```

---

## 📋 PLATFORM ENTRY SCHEMA

```typescript
interface PlatformEntry {
  platformId: "android" | "ios" | "windows" | "linux" | "macos";
  type: "mobile" | "desktop";
  deliverySurface: string;
  releaseStageCompatibility: ("production" | "alpha" | "working")[];
  downloadSurfaceMapping: string;  // apps.balloo.su
  relationToAppsNodes: string[];   // apps-production, apps-working
}
```

---

## ✅ CRITICAL INVARIANTS

1. **client-apps не имеют отдельного домена** — family node
2. **5 платформ** — android, ios, windows, linux, macos
3. **apps.balloo.su — download portal** — links to all platforms
4. **production release stage** — all platforms production-ready
5. **working builds available** — via apps.working.balloo.su

---

## 📖 RELATED DOCUMENTS

- [NODE_FAMILIES.md](./NODE_FAMILIES.md) — Node families overview
- [client-platform-map.json](../state/client-platform-map.json) — Platform state
- [NODE_production_apps.md](./NODE_apps_production.md) — Apps portal

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
