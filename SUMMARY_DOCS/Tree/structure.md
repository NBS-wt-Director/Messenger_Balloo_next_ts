---
title: Repository Tree
date: 2026-06-12
status: ✅ Documented
---

# Repository Structure

```
app_balloo/
├── packages/                    # Core packages
│   ├── core-types/             # Shared TypeScript types
│   ├── core-config/            # Configuration management
│   ├── core-i18n/              # Internationalization
│   ├── core-theme/             # Theme presets
│   ├── core-brand/             # Branding components
│   └── core-ui/                # UI components
├── api/                         # API service
├── messenger/                   # Messenger service
├── admin-portal/               # Admin web app
├── mobile/                      # React Native app
├── desktop/                     # Electron app
├── docker/                      # Docker configuration
├── SUMMARY_DOCS/               # Documentation site
└── workdocs/                   # Working documents
```

## Package Dependencies

```mermaid
graph TD
    A[Core Types] --> B[Core Config]
    A --> C[Core I18n]
    A --> D[Core Theme]
    A --> E[Core Brand]
    A --> F[Core UI]
    B --> G[API]
    C --> H[Messenger]
    D --> I[Admin Portal]
    E --> I
    F --> I
```

## Branch Strategy

- `main` - Production ready
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `release/*` - Release preparation
