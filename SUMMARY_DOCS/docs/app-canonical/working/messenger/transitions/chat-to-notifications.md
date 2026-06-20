---
objectType: "transition"
nodeId: "working"
appId: "messenger"
transitionId: "chat-to-notifications"
title: "Chat to Notifications"
sourceScreenId: "chat"
targetScreenId: "notifications"
trigger: "tap bell icon"
conditions:
  - "user is authenticated"
  - "notifications enabled"
result: "notifications screen opens with unread count"
failureModes:
  - "no notifications — show empty state"
relatedScenarios:
  - "view-notifications-flow"
relatedIntegrations:
  - "firebase-push"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SECURITY_GUIDE.md"
    context: "Notification security"
status: "draft"
---

# Chat to Notifications

## Overview

Transition from chat screen to notifications screen.

## Trigger

User clicks bell icon in chat header.

## Conditions

- User must be authenticated
- Notifications must be enabled

## Result

- Notifications screen opens
- Unread count displayed as badge
- List sorted by timestamp (newest first)

## Failure Modes

| Failure | Response | User Action |
|---------|----------|-------------|
| No notifications | Empty state with "No notifications" | None needed |

## Related Scenarios

- `view-notifications-flow` — viewing notifications

## Related Integrations

- `firebase-push` — fetches push notification history

