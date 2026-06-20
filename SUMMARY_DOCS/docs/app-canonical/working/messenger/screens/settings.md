---
objectType: "screen"
nodeId: "working"
appId: "messenger"
screenId: "settings"
title: "Settings Screen"
purpose: "Application settings and preferences"
actors: ["authenticated-user"]
entryConditions: ["user authenticated"]
exitConditions: ["navigate to profile", "navigate to chat"]
elements:
  - "theme selector (dark/light/russia)"
  - "language selector (12 languages)"
  - "notification preferences (toggle)"
  - "privacy settings (read receipts, online status)"
  - "change password form"
  - "logout button (danger action)"
actions:
  - "change theme"
  - "change language"
  - "toggle notifications"
  - "change privacy settings"
  - "change password"
  - "logout"
relatedTransitions:
  - "profile-to-settings"
  - "settings-to-login"
relatedScenarios:
  - "user-login-flow"
relatedIntegrations:
  - "auth-service"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/THEME_UI_COMPONENTS.md"
    context: "Theme system"
  - path: "SUMMARY_DOCS/project/nodes/Messenger/SECURITY_GUIDE.md"
    context: "Security settings"
status: "draft"
---

# Settings Screen

## Purpose

Application settings and preferences — allows users to customize their messenger experience.

## UI Elements

| Element | Type | Required | Notes |
|---------|------|----------|-------|
| Theme selector | select/dropdown | Yes | dark/light/russia |
| Language selector | select/dropdown | Yes | 12 languages |
| Notifications toggle | switch/toggle | Yes | Push notifications |
| Read receipts toggle | switch/toggle | No | Show read status |
| Online status toggle | switch/toggle | No | Show online status |
| Change password form | form | No | Current + new password |
| Logout button | button[type=button] | Yes | Danger (red) |

## Actions

1. **Change theme**
   - Applies immediately, persisted in localStorage
   - Themes: dark, light, russia

2. **Change language**
   - Reloads UI with selected locale
   - Supported: 12 languages per LanguageContract

3. **Toggle notifications**
   - Enables/disables push notifications
   - Requires browser permission

4. **Change password**
   - Validates current password
   - New password: min 8 chars, complexity requirements
   - POST to `/api/auth/change-password`

5. **Logout**
   - Clears session, redirects to login

## Related Transitions

- `profile-to-settings` — from profile screen
- `settings-to-login` — logout action

## Related Scenarios

- `user-login-flow` — logout as part of login flow

## Related Integrations

- `auth-service` — password change, session management

