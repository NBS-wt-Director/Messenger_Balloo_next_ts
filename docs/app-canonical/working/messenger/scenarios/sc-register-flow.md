---
objectType: scenario
nodeId: working
appId: messenger
scenarioId: sc-register-flow
title: "Поток регистрации"
goal: "Зарегистрировать нового пользователя в системе"
actor: "public-user"
preconditions: ["user does not have an account", "valid email available"]
steps:
  - "User navigates to register screen via t-login-to-register"
  - "User enters email, password, confirms password"
  - "User clicks register button"
  - "System validates input via int-auth-email-password"
  - "If valid → user authenticated and redirected to dashboard via t-register-to-dashboard"
  - "If invalid → error shown, user returned to login via t-register-to-login"
involvedScreens: ["register", "login", "dashboard"]
involvedTransitions: ["t-register-to-dashboard", "t-register-to-login"]
outputs: ["new user registered", "user authenticated", "session created"]
exceptions: ["email already exists", "password too weak", "network error", "email verification required"]
sourceRefs:
  - type: code
    path: messenger/src/pages/RegisterPage.tsx
    title: "Registration page implementation"
  - type: code
    path: messenger/src/api/auth/register.ts
    title: "Registration API"
status: active
---

# Сценарий: Поток регистрации

## Цель
Зарегистрировать нового пользователя в системе.

## Актер
public-user

## Шаги
1. User navigates to register screen via t-login-to-register
2. User enters email, password, confirms password
3. User clicks register button
4. System validates input via int-auth-email-password
5. If valid → redirected to dashboard via t-register-to-dashboard
6. If invalid → returned to login via t-register-to-login

## Участвующие экраны
- [register](../screens/register.md)
- [login](../screens/login.md)
- [dashboard](../screens/dashboard.md)

## Участвующие переходы
- [t-register-to-dashboard](../transitions/t-register-to-dashboard.md)
- [t-register-to-login](../transitions/t-register-to-login.md)
