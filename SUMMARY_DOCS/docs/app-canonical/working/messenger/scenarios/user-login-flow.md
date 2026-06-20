---
objectType: "scenario"
nodeId: "working"
appId: "messenger"
scenarioId: "user-login-flow"
title: "User Login Flow"
goal: "Authenticate user and grant access to messenger"
actor: "user"
preconditions:
  - "user has registered account"
  - "user has verified email"
  - "network connection available"
steps:
  - "User opens login screen"
  - "User enters email in email field"
  - "User enters password in password field"
  - "User clicks login button or presses Enter"
  - "System validates credentials via auth-service"
  - "System creates session and sets cookie"
  - "User is redirected to chat screen"
  - "Chat screen loads conversations"
involvedScreens:
  - "login"
  - "chat"
involvedTransitions:
  - "login-to-chat"
  - "settings-to-login"
outputs:
  - "user authenticated"
  - "session created"
  - "chat loaded"
exceptions:
  - "invalid credentials — show error, allow retry"
  - "account suspended — show suspension message"
  - "email not verified — prompt for verification"
  - "network failure — show retry option"
  - "server error — show generic error"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SETUP_INSTRUCTIONS.md"
    context: "Authentication setup"
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SECURITY_GUIDE.md"
    context: "Security requirements"
status: "active"
---

# User Login Flow

## Overview

Complete user authentication workflow from login screen to chat screen.

## Preconditions

| # | Condition | Notes |
|---|-----------|-------|
| 1 | User has registered account | Account exists in database |
| 2 | User has verified email | Email verification completed |
| 3 | Network connection available | Required for API calls |

## Step-by-Step Flow

| Step | Action | Screen | Component |
|------|--------|--------|-----------|
| 1 | Open login screen | login | Page load |
| 2 | Enter email | login | input[type=email] |
| 3 | Enter password | login | input[type=password] |
| 4 | Submit form | login | button[type=submit] |
| 5 | Validate credentials | — | POST /api/auth/login |
| 6 | Create session | — | Set cookie |
| 7 | Redirect to chat | chat | Next.js router |
| 8 | Load conversations | chat | GET /api/conversations |

## Outputs

- User authenticated in system
- Session cookie set (httpOnly, secure)
- Chat screen loaded with conversations

## Exceptions

| Exception | Handling |
|-----------|----------|
| Invalid credentials | Show error toast, allow retry |
| Account suspended | Show suspension page with contact info |
| Email not verified | Show verification prompt with resend option |
| Network failure | Show "Connection failed" with retry button |
| Server error | Show generic error message |

## Related Screens

- `login` — entry point
- `chat` — destination

## Related Transitions

- `login-to-chat` — main transition
- `settings-to-login` — logout and re-login

## Related Integrations

- `auth-service` — validates credentials

