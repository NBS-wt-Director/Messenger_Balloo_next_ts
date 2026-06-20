---
objectType: "scenario"
nodeId: "working"
appId: "messenger"
scenarioId: "send-message"
title: "Send Message"
goal: "Send message to contact"
actor: "user"
preconditions:
  - "user is authenticated"
  - "user is on chat screen"
  - "contact conversation exists"
steps:
  - "User opens chat screen"
  - "User types message in input field"
  - "User taps send button"
  - "Message is validated (length, content)"
  - "Message is sent via WebSocket/POST"
  - "Message appears in chat history"
  - "Recipient receives push notification (if offline)"
involvedScreens:
  - "chat"
involvedTransitions: []
outputs:
  - "message delivered"
  - "message visible to recipient"
exceptions:
  - "message too long — show character limit error"
  - "network failure — show retry option"
  - "media upload failed — show error"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/API_DOCUMENTATION.md"
    context: "Message API"
status: "active"
---

# Send Message

## Overview

Workflow for sending a text or media message to a contact.

## Preconditions

| # | Condition | Notes |
|---|-----------|-------|
| 1 | User authenticated | Session valid |
| 2 | User on chat screen | Conversation selected |
| 3 | Contact conversation exists | Conversation ID known |

## Step-by-Step Flow

| Step | Action | Screen | Component |
|------|--------|--------|-----------|
| 1 | Open chat | chat | Page load |
| 2 | Type message | chat | textarea |
| 3 | Tap send | chat | button[type=submit] |
| 4 | Validate message | — | Client-side validation |
| 5 | Send message | — | WebSocket/POST /api/messages |
| 6 | Display message | chat | Append to chat list |
| 7 | Notify recipient | — | Firebase push (if offline) |

## Outputs

- Message delivered to recipient
- Message visible in chat history

## Exceptions

| Exception | Handling |
|-----------|----------|
| Message too long | Show character limit error (max 4096) |
| Network failure | Show "Failed to send" with retry |
| Media upload failed | Show error, allow retry |

## Related Screens

- `chat` — only screen involved

## Related Integrations

- `messenger-api` — message delivery
- `firebase-push` — push notification to recipient

