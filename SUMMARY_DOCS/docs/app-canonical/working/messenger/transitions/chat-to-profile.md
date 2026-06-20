---
objectType: "transition"
nodeId: "working"
appId: "messenger"
transitionId: "chat-to-profile"
title: "Chat to Profile"
sourceScreenId: "chat"
targetScreenId: "profile"
trigger: "tap avatar"
conditions:
  - "user is authenticated"
  - "avatar element is clickable"
result: "profile screen opens with user data"
failureModes:
  - "user data not loaded — show loading state"
relatedScenarios:
  - "view-profile"
relatedIntegrations:
  - "auth-service"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/AVATARS_AND_USERS.md"
    context: "Avatar and user data"
status: "active"
---

# Chat to Profile

## Overview

Transition from chat screen to profile screen when user taps their avatar.

## Trigger

User clicks/taps on avatar image in the chat header.

## Conditions

- User must be authenticated
- Avatar must be rendered and clickable

## Result

- Profile screen opens
- User data pre-loaded from session
- Edit mode available

## Failure Modes

| Failure | Response | User Action |
|---------|----------|-------------|
| User data not loaded | Loading spinner | Wait or retry |

## Related Scenarios

- `view-profile` — viewing and editing profile

## Related Integrations

- `auth-service` — fetches user profile data

