# Scenarios — Canonical Documentation

## Overview

Scenarios represent user workflows within an application. Each scenario defines a complete user journey from start to finish, including steps, screens, and outcomes.

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectType | string | ✅ | Fixed value `"scenario"` |
| nodeId | string | ✅ | Node ID in monorepo |
| appId | string | ✅ | Application ID |
| scenarioId | string | ✅ | Unique scenario ID (kebab-case) |
| title | string | ✅ | Scenario title |
| goal | string | ✅ | Scenario goal |
| actor | string | ✅ | User role performing scenario |
| preconditions | string[] | | Preconditions |
| steps | string[] | ✅ | Step sequence |
| involvedScreens | string[] | | Involved screen IDs |
| involvedTransitions | string[] | | Involved transition IDs |
| outputs | string[] | | Outputs |
| exceptions | string[] | | Exceptions |
| sourceRefs | object[] | | Source references |
| status | enum | ✅ | `draft` \| `active` \| `deprecated` |

## Example

```yaml
objectType: scenario
nodeId: working
appId: messenger
scenarioId: user-login-flow
title: "User Login Flow"
goal: "Authenticate user in system"
actor: "public-user"
preconditions:
  - "user has registered account"
  - "network connection available"
steps:
  - "User opens login screen"
  - "User enters email and password"
  - "User clicks login button"
  - "System validates credentials"
  - "User is redirected to chat"
involvedScreens:
  - "login"
  - "chat"
involvedTransitions:
  - "login-to-chat"
outputs:
  - "user authenticated"
  - "session created"
exceptions:
  - "invalid credentials"
  - "account suspended"
  - "network failure"
status: active
```

## File Path

```
docs/app-canonical/<node-id>/<app-id>/scenarios/<scenario-id>.md
```

## Discovery

Scenarios are discovered by:
1. Analyzing user flow documentation (playbooks, runbooks)
2. Extracting from contract documents
3. Parsing `linked-view.json` scenario arrays

## Relations

Scenarios include:
- **Screens** — UI surfaces involved in workflow
- **Transitions** — Navigation flows between screens
- **Integrations** — External systems triggered during workflow
