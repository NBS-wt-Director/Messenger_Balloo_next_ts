---
objectType: "screen"
nodeId: "working"
appId: "messenger"
screenId: "chat"
title: "Chat Screen"
purpose: "Main chat interface — message display and composition"
actors: ["authenticated-user"]
entryConditions: ["user authenticated"]
exitConditions: ["navigate to profile", "navigate to notifications", "navigate to settings"]
elements:
  - "chat list (scrollable, shows recent conversations)"
  - "message input field (textarea with character limit)"
  - "send button (primary action)"
  - "attachment button (image, file, media)"
  - "contact avatar (clickable, navigates to profile)"
  - "unread message badge (conditional)"
  - "online status indicator (dot)"
  - "typing indicator (conditional)"
actions:
  - "send message (text, media, file)"
  - "open contact profile"
  - "open notifications"
  - "open settings"
  - "search contacts/messages"
  - "create new conversation"
relatedTransitions:
  - "chat-to-profile"
  - "chat-to-notifications"
relatedScenarios:
  - "send-message-flow"
  - "view-notifications-flow"
relatedIntegrations:
  - "messenger-api"
  - "firebase-push"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/API_DOCUMENTATION.md"
    context: "Chat API endpoints"
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SYSTEM_FEATURES.md"
    context: "System features"
status: "active"
---

# Chat Screen

## Purpose

Main chat interface — displays conversations, allows message composition and sending.
Handles real-time message delivery via WebSocket/SSE.

## UI Elements

| Element | Type | Required | Notes |
|---------|------|----------|-------|
| Chat list | div.scrollable | Yes | Shows recent conversations |
| Message input | textarea | Yes | Character limit: 4096 |
| Send button | button[type=submit] | Yes | Primary action |
| Attachment button | button | No | Opens file picker |
| Contact avatar | img (clickable) | Yes | Navigates to profile |
| Unread badge | span.badge | Conditional | Red circle with count |
| Online indicator | div.dot | Conditional | Green when online |
| Typing indicator | div.typing | Conditional | Shows "typing..." |

## Actions

1. **Send message**
   - Text messages via POST to `/api/messages`
   - Media messages upload via multipart/form-data
   - Real-time delivery via WebSocket

2. **Open contact profile**
   - Clicking avatar navigates to profile screen

3. **Open notifications**
   - Bell icon navigates to notifications screen

4. **Search**
   - Search bar filters conversations and messages

## Related Transitions

- `chat-to-profile` — clicking avatar
- `chat-to-notifications` — clicking bell icon

## Related Scenarios

- `send-message-flow` — sending messages workflow

## Related Integrations

- `messenger-api` — message CRUD operations
- `firebase-push` — push notifications for new messages

