# Transitions — Canonical Documentation

## Overview

Transitions represent navigation flows between screens. Each transition defines the trigger, conditions, and outcomes of moving from one screen to another.

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectType | string | ✅ | Fixed value `"transition"` |
| nodeId | string | ✅ | Node ID in monorepo |
| appId | string | ✅ | Application ID |
| transitionId | string | ✅ | Unique transition ID (kebab-case) |
| title | string | ✅ | Transition title |
| sourceScreenId | string | ✅ | Source screen ID |
| targetScreenId | string | ✅ | Target screen ID |
| trigger | string | ✅ | Trigger action |
| conditions | string[] | | Execution conditions |
| result | string | | Successful result |
| failureModes | string[] | | Failure modes |
| relatedScenarios | string[] | | Related scenario IDs |
| relatedIntegrations | string[] | | Related integration IDs |
| sourceRefs | object[] | | Source references |
| status | enum | ✅ | `draft` \| `active` \| `deprecated` |

## Example

```yaml
objectType: transition
nodeId: working
appId: messenger
transitionId: login-to-chat
title: "Login to Chat"
sourceScreenId: login
targetScreenId: chat
trigger: "user clicks login button with valid credentials"
conditions:
  - "user email exists"
  - "password matches"
result: "user authenticated, redirected to chat"
failureModes:
  - "invalid credentials"
  - "account suspended"
relatedScenarios: ["user-login-flow"]
relatedIntegrations: ["auth-service"]
status: active
```

## File Path

```
docs/app-canonical/<node-id>/<app-id>/transitions/<transition-id>.md
```

## Discovery

Transitions are discovered by:
1. Analyzing navigation code (react-router, next/link)
2. Extracting from user flow documentation
3. Parsing `linked-view.json` transition arrays

## Relations

Transitions connect:
- **Source Screen** — Origin screen
- **Target Screen** — Destination screen
- **Scenarios** — Workflows using this transition
- **Integrations** — Systems affecting transition outcome
