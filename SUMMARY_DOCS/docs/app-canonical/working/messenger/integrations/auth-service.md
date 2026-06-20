---
objectType: "integration"
nodeId: "working"
appId: "messenger"
integrationId: "auth-service"
title: "Auth Service"
direction: "bidirectional"
targetType: "service"
targetId: "auth-service"
purpose: "User authentication and session management"
trigger: "user attempts to log in or change password"
input: "email, password, session token"
output: "user profile, session token, authentication status"
protocolOrChannel: "HTTPS / REST API"
authRequirements: "OAuth 2.0 client credentials"
failureHandling: "fallback to cached credentials, log error"
relatedScreens:
  - "login"
  - "profile"
  - "settings"
relatedTransitions:
  - "login-to-chat"
  - "settings-to-login"
relatedScenarios:
  - "user-login-flow"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SETUP_INSTRUCTIONS.md"
    context: "Authentication setup"
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SECURITY_GUIDE.md"
    context: "Security requirements"
status: "active"
---

# Auth Service

## Overview

Authentication service handles user login, session management, and profile operations.

## Direction

Bidirectional — sends auth requests, returns user data and session tokens.

## Protocol

- HTTPS / REST API
- JSON request/response bodies
- Cookie-based sessions (httpOnly, secure)

## Authentication

- OAuth 2.0 client credentials for service-to-service
- Password stored as bcrypt hash

## Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/auth/login | POST | User login |
| /api/auth/logout | POST | User logout |
| /api/auth/change-password | POST | Password change |
| /api/users/profile | GET | Get user profile |
| /api/users/profile | PUT | Update user profile |

## Data Flow

```
User → Login Screen → POST /api/auth/login → Auth Service
                                    ↓
                            Session cookie set
                                    ↓
                            Chat screen loaded
```

## Failure Handling

| Failure | Response | Recovery |
|---------|----------|----------|
| Invalid credentials | 401 Unauthorized | Allow retry |
| Account suspended | 403 Forbidden | Show suspension message |
| Server error | 500 Internal Error | Retry with backoff |

## Related Screens

- `login` — authentication entry point
- `profile` — user data management
- `settings` — password change

## Related Integrations

- `firebase-push` — session validation for push tokens
- `media-upload` — authenticated file uploads

