---
objectType: "transition"
nodeId: "working"
appId: "messenger"
transitionId: "settings-to-login"
title: "Settings to Login"
sourceScreenId: "settings"
targetScreenId: "login"
trigger: "logout"
conditions:
  - "user is authenticated"
  - "logout confirmed"
result: "session cleared, redirected to login screen"
failureModes:
  - "logout failed — show error, retry"
relatedScenarios:
  - "user-login-flow"
relatedIntegrations:
  - "auth-service"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SECURITY_GUIDE.md"
    context: "Logout security"
status: "active"
---

# Settings to Login

## Overview

Transition from settings screen to login screen via logout action.

## Trigger

User clicks "Logout" button in settings.

## Conditions

- User must be authenticated
- Logout should be confirmed (optional, depends on security policy)

## Result

- Session cookie deleted
- User profile cleared from localStorage
- Redirect to `/login`
- Login screen displayed

## Failure Modes

| Failure | Response | User Action |
|---------|----------|-------------|
| Logout failed | Error toast "Logout failed" | Retry |

## Related Scenarios

- `user-login-flow` — logout as part of login flow

## Related Integrations

- `auth-service` — invalidates session server-side

