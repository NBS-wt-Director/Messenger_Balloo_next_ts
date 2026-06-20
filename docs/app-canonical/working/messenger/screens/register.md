---
objectType: screen
nodeId: working
appId: messenger
screenId: register
title: "Экран регистрации"
purpose: "Регистрация нового пользователя в системе"
actors: ["public-user"]
entryConditions: ["user is not authenticated"]
exitConditions: ["registration successful → dashboard", "registration failed → login", "validation error → stay on register"]
elements: ["email input", "password input", "confirm password input", "register button", "back to login link"]
actions: ["register", "go back to login"]
relatedTransitions: ["t-register-to-login", "t-register-to-dashboard"]
relatedScenarios: ["sc-register-flow"]
relatedIntegrations: ["int-auth-email-password"]
sourceRefs:
  - type: code
    path: messenger/src/pages/RegisterPage.tsx
    title: "RegisterPage component"
  - type: code
    path: messenger/src/api/auth/register.ts
    title: "Registration API handler"
status: active
---

# Экран регистрации (register)

## Назначение
Регистрация нового пользователя в системе.

## Актеры
- public-user

## Связанные переходы
- [t-register-to-login](transitions/t-register-to-login.md)
- [t-register-to-dashboard](transitions/t-register-to-dashboard.md)

## Связанные сценарии
- [sc-register-flow](scenarios/sc-register-flow.md)

## Связанные интеграции
- [int-auth-email-password](integrations/int-auth-email-password.md)
