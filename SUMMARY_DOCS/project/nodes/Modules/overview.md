---
title: Modules Overview
date: 2026-06-12
status: ✅ Documented
---

# Modules Documentation

## Core Modules (6)

| Module | Package | Status |
|--------|---------|--------|
| Core Types | `@balloo/core-types` | ✅ |
| Core Config | `@balloo/core-config` | ✅ |
| Core I18n | `@balloo/core-i18n` | ✅ |
| Core Theme | `@balloo/core-theme` | ✅ |
| Core Brand | `@balloo/core-brand` | ✅ |
| Core UI | `@balloo/core-ui` | ✅ |

## Application Modules (12)

| Module | Location | Status |
|--------|----------|--------|
| Auth | `packages/auth` | ✅ |
| Database | `packages/database` | ✅ |
| Logger | `packages/logger` | ✅ |
| Cache | `packages/cache` | ✅ |
| Queue | `packages/queue` | ✅ |
| Storage | `packages/storage` | ✅ |
| Validation | `packages/validation` | ✅ |
| Utils | `packages/utils` | ✅ |
| Crypto | `packages/crypto` | ✅ |
| HTTP | `packages/http` | ✅ |
| WebSocket | `packages/websocket` | ✅ |
| Testing | `packages/testing` | ✅ |

## Module Structure

Each module follows this structure:

```
module-name/
├── src/
│   ├── index.ts      # Main exports
│   ├── types.ts      # TypeScript types
│   └── utils.ts      # Utility functions
├── tests/
│   └── *.test.ts     # Unit tests
├── package.json
└── README.md
```
