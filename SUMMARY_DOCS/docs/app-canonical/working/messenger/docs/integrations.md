# Integrations — Canonical Documentation

## Overview

Integrations represent connections between the application and external systems. Each integration defines the protocol, data flow, and authentication requirements for the connection.

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectType | string | ✅ | Fixed value `"integration"` |
| nodeId | string | ✅ | Node ID in monorepo |
| appId | string | ✅ | Application ID |
| integrationId | string | ✅ | Unique integration ID (kebab-case) |
| title | string | ✅ | Integration title |
| direction | enum | ✅ | `inbound` \| `outbound` \| `bidirectional` |
| targetType | enum | ✅ | `app` \| `node` \| `service` \| `external-system` |
| targetId | string | ✅ | Target system ID |
| purpose | string | ✅ | Integration purpose |
| trigger | string | | What triggers the integration |
| input | string | | Input data format |
| output | string | | Output data format |
| protocolOrChannel | string | | Protocol or channel |
| authRequirements | string | | Authentication requirements |
| failureHandling | string | | Failure handling strategy |
| relatedScreens | string[] | | Related screen IDs |
| relatedTransitions | string[] | | Related transition IDs |
| relatedScenarios | string[] | | Related scenario IDs |
| sourceRefs | object[] | | Source references |
| status | enum | ✅ | `draft` \| `active` \| `deprecated` |

## direction Enum

- **inbound** — Data flows into the application
- **outbound** — Data flows out of the application
- **bidirectional** — Two-way data exchange

## targetType Enum

- **app** — Another monorepo application
- **node** — Another monorepo node
- **service** — Internal service (API, queue, etc.)
- **external-system** — External system (SMTP, OAuth, etc.)

## Example

```yaml
objectType: integration
nodeId: working
appId: messenger
integrationId: auth-service
title: "Authentication Service"
direction: bidirectional
targetType: service
targetId: auth-service
purpose: "User authentication and authorization"
trigger: "user attempts to log in"
input: "email, password"
output: "user profile, session token"
protocolOrChannel: "HTTPS / REST API"
authRequirements: "OAuth 2.0 client credentials"
failureHandling: "fallback to cached credentials, log error"
relatedScreens: ["login"]
relatedTransitions: ["login-to-chat"]
relatedScenarios: ["user-login-flow"]
status: active
```

## File Path

```
docs/app-canonical/<node-id>/<app-id>/integrations/<integration-id>.md
```

## Discovery

Integrations are discovered by:
1. Scanning API routes and service calls
2. Analyzing configuration files (OAuth, SMTP, etc.)
3. Extracting from contract documents
4. Parsing `linked-view.json` integration arrays

## Relations

Integrations connect to:
- **Screens** — UI surfaces that trigger the integration
- **Transitions** — Navigation flows affected by integration
- **Scenarios** — Workflows that use the integration
