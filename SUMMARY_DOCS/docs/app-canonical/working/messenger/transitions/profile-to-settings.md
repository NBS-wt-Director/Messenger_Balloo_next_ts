---
objectType: "transition"
nodeId: "working"
appId: "messenger"
transitionId: "profile-to-settings"
title: "Profile to Settings"
sourceScreenId: "profile"
targetScreenId: "settings"
trigger: "tap settings icon"
conditions:
  - "user is authenticated"
result: "settings screen opens with current preferences"
failureModes:
  - "settings data not loaded — show loading state"
relatedScenarios:
  - "user-login-flow"
relatedIntegrations:
  - "auth-service"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/THEME_UI_COMPONENTS.md"
    context: "Theme and settings"
status: "draft"
---

# Profile to Settings

## Overview

Transition from profile screen to settings screen.

## Trigger

User clicks settings icon in profile header.

## Conditions

- User must be authenticated

## Result

- Settings screen opens
- Current preferences loaded from localStorage and API

## Failure Modes

| Failure | Response | User Action |
|---------|----------|-------------|
| Settings data not loaded | Loading spinner | Wait or retry |

## Related Scenarios

- `user-login-flow` — logout path

## Related Integrations

- `auth-service` — fetches user preferences

