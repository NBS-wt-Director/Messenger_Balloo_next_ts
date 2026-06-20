---
objectType: "scenario"
nodeId: "working"
appId: "messenger"
scenarioId: "push-notification"
title: "Push Notification"
goal: "Receive and handle push notification"
actor: "system"
preconditions:
  - "user has enabled notifications"
  - "browser has notification permission"
  - "user is offline or app is in background"
steps:
  - "System sends push via Firebase Cloud Messaging"
  - "User taps notification"
  - "App opens to relevant chat"
  - "Notification is marked as read"
involvedScreens:
  - "chat"
  - "notifications"
involvedTransitions:
  - "notifications-to-chat"
outputs:
  - "user notified of new message"
  - "user redirected to chat"
exceptions:
  - "notification permission denied — show in-app prompt"
  - "chat not found — show error"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SECURITY_GUIDE.md"
    context: "Notification security"
status: "active"
---

# Push Notification

## Overview

Workflow for receiving and handling push notifications when user is offline or app is in background.

## Preconditions

| # | Condition | Notes |
|---|-----------|-------|
| 1 | User enabled notifications | Setting in profile |
| 2 | Browser permission granted | Browser notification API |
| 3 | User offline or app background | Push only relevant when not active |

## Step-by-Step Flow

| Step | Action | Component |
|------|--------|-----------|
| 1 | System sends push | Firebase Cloud Messaging |
| 2 | User sees notification | Browser notification |
| 3 | User taps notification | Click handler |
| 4 | App opens relevant chat | Navigate to chat screen |
| 5 | Notification marked as read | POST /api/notifications/{id}/read |

## Outputs

- User notified of new message
- User redirected to relevant chat

## Exceptions

| Exception | Handling |
|-----------|----------|
| Permission denied | Show in-app prompt to enable |
| Chat not found | Show error, return to notifications |

## Related Screens

- `chat` — destination when tapping notification
- `notifications` — notification list

## Related Transitions

- `notifications-to-chat` — from notifications to chat

## Related Integrations

- `firebase-push` — sends push notifications

