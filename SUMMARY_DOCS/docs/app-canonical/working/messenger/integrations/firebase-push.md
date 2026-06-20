---
objectType: "integration"
nodeId: "working"
appId: "messenger"
integrationId: "firebase-push"
title: "Firebase Push"
direction: "outbound"
targetType: "external-system"
targetId: "firebase"
purpose: "Push notifications for new messages"
trigger: "message sent to offline user"
input: "device token, message payload"
output: "delivery status, error reports"
protocolOrChannel: "Firebase Cloud Messaging (FCM) HTTP v1 API"
authRequirements: "Server key (service account JSON)"
failureHandling: "retry with exponential backoff, log to error queue"
relatedScreens:
  - "chat"
  - "notifications"
relatedTransitions:
  - "notifications-to-chat"
relatedScenarios:
  - "send-message-flow"
  - "push-notification-flow"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SECURITY_GUIDE.md"
    context: "Notification security"
status: "active"
---

# Firebase Push

## Overview

Firebase Cloud Messaging integration for push notifications when users are offline or app is in background.

## Direction

Outbound — messenger sends push requests to FCM, receives delivery status.

## Protocol

- Firebase Cloud Messaging HTTP v1 API
- JSON payload
- Service account authentication

## Push Payload

```json
{
  "token": "device_fcm_token",
  "notification": {
    "title": "New message",
    "body": "User: Hello!",
    "icon": "/favicon.ico",
    "click_action": "OPEN_CHAT"
  },
  "data": {
    "chatId": "conversation_id",
    "senderId": "user_id",
    "timestamp": "2026-06-20T00:00:00Z"
  }
}
```

## Data Flow

```
Message sent → Messenger API → Check if user online
                                    ↓ (offline)
                            Send FCM push
                                    ↓
                            User receives notification
                                    ↓
                            User taps → Open chat
```

## Failure Handling

| Failure | Response | Recovery |
|---------|----------|----------|
| Invalid token | Remove from registry | Clean stale tokens |
| Rate limited | Retry with backoff | Exponential backoff |
| Server error | Queue for retry | Error queue + retry job |

## Related Screens

- `chat` — message origin
- `notifications` — notification display

## Related Integrations

- `auth-service` — validates user session for push
- `messenger-api` — determines if user is online

