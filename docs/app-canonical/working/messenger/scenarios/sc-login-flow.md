---
objectType: scenario
nodeId: working
appId: messenger
scenarioId: sc-login-flow
title: "Поток авторизации"
goal: "Авторизовать пользователя в системе"
actor: "public-user"
preconditions: ["user has registered account or wants to register", "network connection available"]
steps:
  - "User opens login screen"
  - "User enters email and password"
  - "User clicks login button"
  - "System validates credentials via int-auth-email-password"
  - "If valid → redirected to dashboard via t-login-to-dashboard"
  - "If invalid → error message shown on login screen"
  - "User can click 'forgot password' → t-login-to-forgot-password"
  - "User can click 'register' → t-login-to-register"
involvedScreens: ["login", "dashboard", "register", "settings"]
involvedTransitions: ["t-login-to-dashboard", "t-login-to-register", "t-login-to-forgot-password"]
outputs: ["user authenticated", "session created", "redirected to dashboard"]
exceptions: ["invalid credentials", "account suspended", "network failure", "email not verified"]
sourceRefs:
  - type: contract
    path: SUMMARY_DOCS/state/auth-policy-manifest.json
    title: "Authentication policy"
  - type: code
    path: messenger/src/pages/LoginPage.tsx
    title: "Login page implementation"
status: active
---

# Сценарий: Поток авторизации

## Цель
Авторизовать пользователя в системе.

## Актер
public-user

## Предусловия
- user has registered account or wants to register
- network connection available

## Шаги
1. User opens login screen
2. User enters email and password
3. User clicks login button
4. System validates credentials via int-auth-email-password
5. If valid → redirected to dashboard via t-login-to-dashboard
6. If invalid → error message shown on login screen
7. User can click 'forgot password' → t-login-to-forgot-password
8. User can click 'register' → t-login-to-register

## Участвующие экраны
- [login](../screens/login.md)
- [dashboard](../screens/dashboard.md)
- [register](../screens/register.md)
- [settings](../screens/settings.md)

## Участвующие переходы
- [t-login-to-dashboard](../transitions/t-login-to-dashboard.md)
- [t-login-to-register](../transitions/t-login-to-register.md)
- [t-login-to-forgot-password](../transitions/t-login-to-forgot-password.md)

## Выходы
- user authenticated
- session created
- redirected to dashboard

## Исключения
- invalid credentials
- account suspended
- network failure
- email not verified
