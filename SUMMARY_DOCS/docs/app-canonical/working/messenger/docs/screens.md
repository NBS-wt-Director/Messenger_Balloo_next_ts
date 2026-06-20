# Screens — Canonical Documentation

## Overview

Screens represent user or service interface surfaces within an application. Each screen defines the UI elements, actions, and navigation flows available to users.

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectType | string | ✅ | Fixed value `"screen"` |
| nodeId | string | ✅ | Node ID in monorepo |
| appId | string | ✅ | Application ID |
| screenId | string | ✅ | Unique screen ID (kebab-case) |
| title | string | ✅ | Screen title |
| purpose | string | | Screen purpose description |
| actors | string[] | | User roles interacting with screen |
| entryConditions | string[] | | Entry conditions |
| exitConditions | string[] | | Exit conditions |
| elements | string[] | | UI elements |
| actions | string[] | | Available actions |
| relatedTransitions | string[] | | Related transition IDs |
| relatedScenarios | string[] | | Related scenario IDs |
| relatedIntegrations | string[] | | Related integration IDs |
| sourceRefs | object[] | | Source references |
| status | enum | ✅ | `draft` \| `active` \| `deprecated` |

## Example

```yaml
objectType: screen
nodeId: working
appId: messenger
screenId: login
title: "Login Screen"
purpose: "User authentication"
actors: ["public-user"]
entryConditions: []
exitConditions: ["user authenticated", "login failed"]
elements: ["email field", "password field", "login button"]
actions: ["login", "forgot password", "register"]
relatedTransitions: ["login-to-chat", "login-to-register"]
relatedScenarios: ["user-login-flow"]
relatedIntegrations: ["auth-service"]
status: active
```

## File Path

```
docs/app-canonical/<node-id>/<app-id>/screens/<screen-id>.md
```

## Discovery

Screens are discovered by:
1. Scanning `docs/app-canonical/<node-id>/<app-id>/screens/` directory
2. Parsing `linked-view.json` counters
3. Extracting from source code components

## Relations

Screens connect to:
- **Transitions** — Navigation flows triggered by user actions
- **Scenarios** — Workflows that include this screen
- **Integrations** — External systems triggered on this screen
