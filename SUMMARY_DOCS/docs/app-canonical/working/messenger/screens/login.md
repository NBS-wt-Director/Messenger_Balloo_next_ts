---
objectType: "screen"
nodeId: "working"
appId: "messenger"
screenId: "login"
title: "Login Screen"
purpose: "User authentication — entry point to the messenger"
actors: ["public-user"]
entryConditions: []
exitConditions: ["user authenticated → chat", "login failed → error"]
elements:
  - "email input field (required, type=email)"
  - "password input field (required, type=password, masked)"
  - "login button (primary, type=submit)"
  - "forgot password link (secondary action)"
  - "register link (secondary action)"
  - "Yandex OAuth button (third-party auth)"
  - "error message display area (conditional)"
actions:
  - "submit login form (valid credentials)"
  - "navigate to register screen"
  - "navigate to forgot password"
  - "Yandex OAuth login"
  - "clear form fields"
relatedTransitions:
  - "login-to-chat"
  - "login-to-register"
relatedScenarios:
  - "user-login-flow"
relatedIntegrations:
  - "auth-service"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SETUP_INSTRUCTIONS.md"
    context: "Authentication setup"
  - path: "SUMMARY_DOCS/project/nodes/Messenger/YANDEX_OAUTH.md"
    context: "Yandex OAuth integration"
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SECURITY_GUIDE.md"
    context: "Security requirements"
status: "active"
---

# Login Screen

## Purpose

User authentication screen — the entry point to the messenger application.
Handles both local authentication (email/password) and Yandex OAuth.

## UI Elements

| Element | Type | Required | Notes |
|---------|------|----------|-------|
| Email field | input[type=email] | Yes | Validates format |
| Password field | input[type=password] | Yes | Masked, min 8 chars |
| Login button | button[type=submit] | Yes | Primary action |
| Forgot password link | a[href] | No | Secondary |
| Register link | a[href] | No | Secondary |
| Yandex OAuth button | button | No | Third-party auth |
| Error message | div.alert | Conditional | Red background |

## Actions

1. **Submit login form**
   - Validates email format and password length
   - Sends POST to `/api/auth/login`
   - On success: redirects to chat screen
   - On failure: shows error message

2. **Navigate to register**
   - Clicking "Register" navigates to register screen
   - Uses Next.js `<Link>` component

3. **Forgot password**
   - Sends password reset email via auth-service
   - Shows confirmation message

4. **Yandex OAuth**
   - Redirects to Yandex OAuth flow
   - Callback handled by `/api/auth/yandex/callback`

## Related Transitions

- `login-to-chat` — successful authentication
- `login-to-register` — user clicks register link

## Related Scenarios

- `user-login-flow` — complete authentication workflow

## Related Integrations

- `auth-service` — validates credentials, creates session

## Source References

- [SETUP_INSTRUCTIONS.md](../../../../../../../project/nodes/Messenger/SETUP_INSTRUCTIONS.md) — Authentication setup
- [YANDEX_OAUTH.md](../../../../../../../project/nodes/Messenger/YANDEX_OAUTH.md) — Yandex OAuth integration
- [SECURITY_GUIDE.md](../../../../../../../project/nodes/Messenger/SECURITY_GUIDE.md) — Security requirements

