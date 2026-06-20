---
objectType: "transition"
nodeId: "working"
appId: "messenger"
transitionId: "notifications-to-chat"
title: "Notifications to Chat"
sourceScreenId: "notifications"
targetScreenId: "chat"
trigger: "tap notification item"
conditions:
  - "notification references a valid chat"
  - "user is authenticated"
result: "chat screen opens with referenced conversation"
failureModes:
  - "chat not found — show error message"
relatedScenarios:
  - "view-notifications-flow"
  - "push-notification-flow"
relatedIntegrations:
  - "messenger-api"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/API_DOCUMENTATION.md"
    context: "Chat API"
status: "active"
---

# Notifications to Chat

## Overview

Transition from notifications screen to chat screen when user taps a notification.

## Trigger

User clicks on a notification item in the notifications list.

## Conditions

- Notification must reference a valid chat ID
- User must be authenticated

## Result

- Chat screen opens
- Referenced conversation is selected and displayed
- Notification is marked as read

## Failure Modes

| Failure | Response | User Action |
|---------|----------|-------------|
| Chat not found | Error "Conversation not found" | Return to notifications |

## Related Scenarios

- `view-notifications-flow` — viewing notifications
- `push-notification-flow` — push notification handling

## Related Integrations

- `messenger-api` — fetches conversation data

