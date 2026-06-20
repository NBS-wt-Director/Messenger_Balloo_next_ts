---
objectType: "transition"
nodeId: "working"
appId: "messenger"
transitionId: "login-to-chat"
title: "Login to Chat"
sourceScreenId: "login"
targetScreenId: "chat"
trigger: "submit login form with valid credentials"
conditions:
  - "email format is valid"
  - "password matches stored hash"
  - "account is not suspended"
  - "user has completed email verification"
result: "user authenticated, session created, redirected to chat"
failureModes:
  - "invalid credentials — show error message"
  - "account suspended — show suspension message"
  - "email not verified — show verification prompt"
  - "network error — show retry option"
relatedScenarios:
  - "user-login-flow"
relatedIntegrations:
  - "auth-service"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SETUP_INSTRUCTIONS.md"
    context: "Authentication flow"
status: "active"
---

# Login to Chat

## Overview

Transition from login screen to chat screen upon successful authentication.

## Trigger

User submits login form with valid email and password.

## Conditions

| Condition | Type | Description |
|-----------|------|-------------|
| Email format | validation | Must be valid email format |
| Password match | authentication | Password must match stored bcrypt hash |
| Account status | business logic | Account must not be suspended |
| Email verified | security | User must have verified email |

## Result

- Session cookie set (httpOnly, secure)
- User profile loaded
- Redirect to `/chat`
- Chat screen displays

## Failure Modes

| Failure | Response | User Action |
|---------|----------|-------------|
| Invalid credentials | Error toast "Invalid email or password" | Retry |
| Account suspended | Error page with contact info | Contact support |
| Email not verified | Prompt to resend verification email | Resend or login |
| Network error | "Connection failed" with retry button | Retry |

## Related Scenarios

- `user-login-flow` — complete authentication workflow

## Related Integrations

- `auth-service` — validates credentials via `/api/auth/login`

