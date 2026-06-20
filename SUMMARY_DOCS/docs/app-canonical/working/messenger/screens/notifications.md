---
objectType: "screen"
nodeId: "working"
appId: "messenger"
screenId: "notifications"
title: "Notifications Screen"
purpose: "Push notification display and management"
actors: ["authenticated-user"]
entryConditions: ["user authenticated", "notifications enabled"]
exitConditions: ["navigate to chat"]
elements:
  - "notification list (scrollable)"
  - "unread count badge"
  - "mark as read button"
  - "clear all button"
  - "notification item (icon, title, message, timestamp)"
actions:
  - "mark notification as read"
  - "clear all notifications"
  - "navigate to related chat"
  - "open notification settings"
relatedTransitions:
  - "chat-to-notifications"
  - "notifications-to-chat"
relatedScenarios:
  - "view-notifications-flow"
  - "push-notification-flow"
relatedIntegrations:
  - "firebase-push"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SECURITY_GUIDE.md"
    context: "Notification security"
status: "draft"
---

# Notifications Screen

## Purpose

Push notification display and management — shows all incoming notifications from the messenger.

## UI Elements

| Element | Type | Required | Notes |
|---------|------|----------|-------|
| Notification list | div.scrollable | Yes | Sorted by timestamp |
| Unread count | span.badge | Yes | Red circle with number |
| Mark as read | button | No | Single notification |
| Clear all | button | No | Clears all |
| Notification item | div.card | Yes | Icon + title + message + time |

## Actions

1. **Mark as read**
   - POST to `/api/notifications/{id}/read`
   - Removes red badge

2. **Clear all**
   - POST to `/api/notifications/clear`
   - Removes all notifications

3. **Navigate to chat**
   - Clicking notification navigates to related chat
   - Uses transition reference

## Related Transitions

- `chat-to-notifications` — from chat screen
- `notifications-to-chat` — clicking notification

## Related Scenarios

- `view-notifications-flow` — viewing notifications workflow
- `push-notification-flow` — push notification handling

## Related Integrations

- `firebase-push` — receives push notifications from Firebase

