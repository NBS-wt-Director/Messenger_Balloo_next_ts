# ARCHITECTURE — SUMMARYDOCS Web Reader

## Overview

Next.js 14 (App Router) application for browsing and editing canonical application documentation within the Balloo monorepo.

## Structure

```
SUMMARY_DOCS/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout with Header/Footer
│   │   ├── page.tsx                ← Home page with navigation
│   │   ├── not-found.tsx           ← 404 page
│   │   ├── error.tsx               ← Error page
│   │   ├── globals.css             ← Global styles
│   │   │
│   │   ├── api/
│   │   │   └── appdocs/
│   │   │       └── route.ts        ← Unified API for appdocs
│   │   │
│   │   ├── docs/
│   │   │   └── app-canonical/
│   │   │       └── [nodeId]/
│   │   │           └── [appId]/
│   │   │               └── page.tsx ← App docs viewer page
│   │   │
│   │   └── appdocs/
│   │       └── components/
│   │           ├── AppDocsViewer.tsx    ← Linked view viewer
│   │           └── PrivilegedEditor.tsx ← Privileged editor
│   │
│   └── components/
│       ├── Header.tsx                ← Global header navigation
│       ├── Footer.tsx                ← Global footer
│       ├── DocumentCatalog.tsx       ← Document catalog browser
│       └── DocumentViewer.tsx        ← Generic document viewer
│
├── docs/
│   └── app-canonical/
│       └── working/
│           └── messenger/
│               ├── screens/
│               ├── transitions/
│               ├── scenarios/
│               ├── integrations/
│               └── maps/
│
├── appdocs/
│   ├── APPDOCINDEX.md
│   ├── APPDOCVIEWERMODEL.md
│   ├── APPDOCEDITPOLICY.md
│   ├── APPDOCCODEGENINSTRUCTIONS.md
│   └── contracts/
│       ├── AppScreenContract.md
│       ├── AppTransitionContract.md
│       ├── AppScenarioContract.md
│       ├── AppIntegrationContract.md
│       ├── AppDocLinkedViewContract.md
│       └── AppDocEditContract.md
│
├── schemas/
│   ├── app-screen.schema.json
│   ├── app-transition.schema.json
│   ├── app-scenario.schema.json
│   ├── app-integration.schema.json
│   └── app-doc-linked-view.schema.json
│
├── state/
│   ├── app-doc-nodes.json
│   ├── app-doc-apps.json
│   ├── app-doc-objects.json
│   ├── app-doc-links.json
│   └── app-doc-view-index.json
│
├── MANIFEST.json
└── ROUTING.json
```

## Key Rules

1. **All pages MUST have Header and Footer** — enforced via root layout
2. **All pages MUST have Error handling** — enforced via error.tsx
3. **All pages MUST follow DESIGN.md** — mandatory design system for all screens
4. **Legacy docs are immutable** — canonical layer only writes to docs/app-canonical/**
5. **Privileged edit requires general password** — server-side verification only
6. **Audit all changes** — every write logged with timestamp and actor
7. **All new screens MUST reference DESIGN.md** — required before creating any new page

## Design System

- `DESIGN.md` — Complete design system (colors, typography, spacing, components, layouts)
- `DESIGN_POLICY.md` — Mandatory compliance policy for all screens
- All pages MUST use defined design tokens, no custom colors or spacing
- Header and Footer are enforced via root layout for ALL pages

## API Endpoints

- `GET /api/appdocs?action=linked-view&nodeId=X&appId=Y` — Get linked view
- `GET /api/appdocs?action=object&type=X&id=Y&nodeId=X&appId=Y` — Get single object
- `POST /api/appdocs?action=verify-privilege` — Verify superadmin password
- `POST /api/appdocs?action=save` — Save object (privileged)

## Document Types

| Type | Description | Contract |
|------|-------------|----------|
| Application | Top-level container for docs | MANIFEST.json |
| Screen | UI surface | AppScreenContract.md |
| Transition | Navigation between screens | AppTransitionContract.md |
| Scenario | User workflow | AppScenarioContract.md |
| Integration | External system connection | AppIntegrationContract.md |
