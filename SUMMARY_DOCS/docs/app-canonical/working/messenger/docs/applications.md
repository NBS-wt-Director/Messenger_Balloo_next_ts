# Applications — Canonical Documentation

## Overview

Applications are top-level containers for all canonical documentation objects within a node. Each application represents a distinct software system or service in the Balloo monorepo.

## Structure

```
docs/app-canonical/
├── <node-id>/
│   └── <app-id>/
│       ├── manifest.json          ← Application metadata
│       ├── screens/               ← Screen objects
│       ├── transitions/           ← Transition objects
│       ├── scenarios/             ← Scenario objects
│       ├── integrations/          ← Integration objects
│       └── maps/                  ← Relationship maps
```

## manifest.json

```json
{
  "appId": "messenger",
  "nodeId": "working",
  "title": "Messenger Application",
  "description": "Core messaging application for user communication",
  "status": "active",
  "version": "1.0.0",
  "createdAt": "2026-06-13T00:00:00Z",
  "updatedAt": "2026-06-13T00:00:00Z"
}
```

## Discovery

Applications are discovered by scanning:
1. `SUMMARY_DOCS/state/app-doc-apps.json` — Application registry
2. `SUMMARY_DOCS/MANIFEST.json` — Document manifest
3. `docs/app-canonical/<node-id>/<app-id>/` — File system

## Relations

Each application contains:
- **Screens** — UI surfaces
- **Transitions** — Navigation flows
- **Scenarios** — User workflows
- **Integrations** — External system connections

## Source References

Applications reference:
- `SUMMARY_DOCS/ROUTING.json` — Routing configuration
- `SUMMARY_DOCS/MANIFEST.json` — Document manifest
- Code repositories — Application source code
