# COMPLETE DOCUMENT CATALOG — All Nodes & Apps

## Overview

This document lists ALL documents in the SUMMARYDOCS documentation center, organized by node and application.

---

## Node: working

### Application: messenger

#### Manifest

| File | Path | Size |
|------|------|------|
| Application Manifest | `docs/app-canonical/working/messenger/manifest.json` | ~300B |

#### Screens (5)

| ID | File | Path | Description |
|----|------|------|-------------|
| login | `login.md` | `docs/app-canonical/working/messenger/screens/login.md` | User login screen |
| chat | `chat.md` | `docs/app-canonical/working/messenger/screens/chat.md` | Main chat interface |
| profile | `profile.md` | `docs/app-canonical/working/messenger/screens/profile.md` | User profile screen |
| settings | `settings.md` | `docs/app-canonical/working/messenger/screens/settings.md` | Application settings |
| notifications | `notifications.md` | `docs/app-canonical/working/messenger/screens/notifications.md` | Notifications panel |

#### Transitions (6)

| ID | File | Path | Description |
|----|------|------|-------------|
| login-to-chat | `login-to-chat.md` | `docs/app-canonical/working/messenger/transitions/login-to-chat.md` | Login → Chat |
| login-to-register | `login-to-register.md` | `docs/app-canonical/working/messenger/transitions/login-to-register.md` | Login → Register |
| chat-to-profile | `chat-to-profile.md` | `docs/app-canonical/working/messenger/transitions/chat-to-profile.md` | Chat → Profile |
| profile-to-settings | `profile-to-settings.md` | `docs/app-canonical/working/messenger/transitions/profile-to-settings.md` | Profile → Settings |
| chat-to-notifications | `chat-to-notifications.md` | `docs/app-canonical/working/messenger/transitions/chat-to-notifications.md` | Chat → Notifications |
| settings-to-chat | `settings-to-chat.md` | `docs/app-canonical/working/messenger/transitions/settings-to-chat.md` | Settings → Chat |

#### Scenarios (4)

| ID | File | Path | Description |
|----|------|------|-------------|
| user-login-flow | `user-login-flow.md` | `docs/app-canonical/working/messenger/scenarios/user-login-flow.md` | Complete user login workflow |
| send-message-flow | `send-message-flow.md` | `docs/app-canonical/working/messenger/scenarios/send-message-flow.md` | Send message workflow |
| view-notifications-flow | `view-notifications-flow.md` | `docs/app-canonical/working/messenger/scenarios/view-notifications-flow.md` | View notifications workflow |
| push-notification-flow | `push-notification-flow.md` | `docs/app-canonical/working/messenger/scenarios/push-notification-flow.md` | Push notification handling |

#### Integrations (3)

| ID | File | Path | Description |
|----|------|------|-------------|
| auth-service | `auth-service.md` | `docs/app-canonical/working/messenger/integrations/auth-service.md` | Authentication service |
| firebase | `firebase.md` | `docs/app-canonical/working/messenger/integrations/firebase.md` | Firebase for push notifications |
| messenger-api | `messenger-api.md` | `docs/app-canonical/working/messenger/integrations/messenger-api.md` | Core messaging API |

#### Maps

| Type | File | Path |
|------|------|------|
| Linked View | `linked-view.json` | `docs/app-canonical/working/messenger/maps/linked-view.json` |

#### Documentation

| Type | File | Path |
|------|------|------|
| Applications Spec | `applications.md` | `docs/app-canonical/working/messenger/docs/applications.md` |
| Screens Spec | `screens.md` | `docs/app-canonical/working/messenger/docs/screens.md` |
| Transitions Spec | `transitions.md` | `docs/app-canonical/working/messenger/docs/transitions.md` |
| Scenarios Spec | `scenarios.md` | `docs/app-canonical/working/messenger/docs/scenarios.md` |
| Integrations Spec | `integrations.md` | `docs/app-canonical/working/messenger/docs/integrations.md` |

---

## Summary Statistics

### By Node

| Node | Apps | Total Files |
|------|------|-------------|
| working | 1 (messenger) | 25 |

### By Application

| App | Screens | Transitions | Scenarios | Integrations | Total Files |
|-----|---------|-------------|-----------|--------------|-------------|
| messenger | 5 | 6 | 4 | 3 | 25 |

### By Type

| Type | Count | Files |
|------|-------|-------|
| Screens | 5 | `screens/*.md` |
| Transitions | 6 | `transitions/*.md` |
| Scenarios | 4 | `scenarios/*.md` |
| Integrations | 3 | `integrations/*.md` |
| Maps | 1 | `maps/linked-view.json` |
| Manifest | 1 | `manifest.json` |
| Docs | 5 | `docs/*.md` |

---

## File Structure

```
SUMMARY_DOCS/
├── docs/
│   └── app-canonical/
│       └── working/
│           └── messenger/
│               ├── manifest.json              ← Application metadata
│               ├── screens/
│               │   ├── login.md                ← Login screen
│               │   ├── chat.md                 ← Chat screen
│               │   ├── profile.md              ← Profile screen
│               │   ├── settings.md             ← Settings screen
│               │   └── notifications.md        ← Notifications screen
│               ├── transitions/
│               │   ├── login-to-chat.md        ← Login → Chat
│               │   ├── login-to-register.md    ← Login → Register
│               │   ├── chat-to-profile.md      ← Chat → Profile
│               │   ├── profile-to-settings.md  ← Profile → Settings
│               │   ├── chat-to-notifications.md ← Chat → Notifications
│               │   └── settings-to-chat.md     ← Settings → Chat
│               ├── scenarios/
│               │   ├── user-login-flow.md      ← Login workflow
│               │   ├── send-message-flow.md    ← Message workflow
│               │   ├── view-notifications-flow.md ← Notifications workflow
│               │   └── push-notification-flow.md ← Push workflow
│               ├── integrations/
│               │   ├── auth-service.md         ← Auth service
│               │   ├── firebase.md              ← Firebase
│               │   └── messenger-api.md         ← Messaging API
│               ├── maps/
│               │   └── linked-view.json        ← Relationship map
│               └── docs/
│                   ├── applications.md         ← Applications spec
│                   ├── screens.md              ← Screens spec
│                   ├── transitions.md          ← Transitions spec
│                   ├── scenarios.md            ← Scenarios spec
│                   └── integrations.md         ← Integrations spec
├── SUMMARY_DOCS/
│   ├── INDEX.md                              ← Main index
│   ├── MANIFEST.json                         ← Document manifest (30 docs)
│   ├── ROUTING.json                          ← Routing configuration
│   ├── ARCHITECTURE.md                       ← Architecture overview
│   ├── DESIGN.md                             ← Design system
│   ├── DESIGN_POLICY.md                      ← Design compliance policy
│   ├── IMPLEMENTATION_SUMMARY.md             ← Implementation summary
│   ├── appdocs/
│   │   ├── APPDOCINDEX.md                    ← App docs index
│   │   ├── APPDOCVIEWERMODEL.md              ← Linked view model
│   │   ├── APPDOCEDITPOLICY.md               ← Edit policy
│   │   ├── APPDOCCODEGENINSTRUCTIONS.md      ← Codegen instructions
│   │   └── contracts/
│   │       ├── AppScreenContract.md          ← Screen contract
│   │       ├── AppTransitionContract.md      ← Transition contract
│   │       ├── AppScenarioContract.md        ← Scenario contract
│   │       ├── AppIntegrationContract.md     ← Integration contract
│   │       ├── AppDocLinkedViewContract.md   ← Linked view contract
│   │       └── AppDocEditContract.md         ← Edit contract
│   ├── schemas/
│   │   ├── app-screen.schema.json            ← Screen schema
│   │   ├── app-transition.schema.json        ← Transition schema
│   │   ├── app-scenario.schema.json          ← Scenario schema
│   │   ├── app-integration.schema.json       ← Integration schema
│   │   └── app-doc-linked-view.schema.json   ← Linked view schema
│   └── state/
│       ├── app-doc-nodes.json                ← Node registry
│       ├── app-doc-apps.json                 ← App registry
│       ├── app-doc-objects.json              ← Object registry
│       ├── app-doc-links.json                ← Link registry
│       └── app-doc-view-index.json           ← View index
└── SUMMARY_DOCS/web/                         ← Web reader (Next.js)
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx                    ← Root layout (Header/Footer)
    │   │   ├── page.tsx                      ← Home page
    │   │   ├── error.tsx                     ← Error page
    │   │   ├── not-found.tsx                 ← 404 page
    │   │   ├── globals.css                   ← Global styles
    │   │   ├── catalog/
    │   │   │   └── page.tsx                  ← Document catalog
    │   │   ├── docs/
    │   │   │   ├── page.tsx                  ← All documents
    │   │   │   └── app-canonical/
    │   │   │       ├── page.tsx              ← App index
    │   │   │       └── [nodeId]/[appId]/
    │   │   │           └── page.tsx          ← App viewer
    │   │   ├── appdocs/
    │   │   │   └── page.tsx                  ← Linked view
    │   │   └── api/
    │   │       ├── appdocs/
    │   │       │   └── route.ts              ← Unified API
    │   │       ├── appdocs/
    │   │       │   └── apps/
    │   │       │       └── route.ts          ← Apps list API
    │   │       ├── catalog/
    │   │       │   └── route.ts              ← Catalog API
    │   │       └── docs/
    │   │           └── route.ts              ← Files scan API
    │   └── components/
    │       ├── Header.tsx                    ← Global header
    │       ├── Footer.tsx                    ← Global footer
    │       ├── DocumentCatalog.tsx           ← Catalog component
    │       └── appdocs/
    │           ├── AppDocsViewer.tsx         ← Viewer component
    │           └── PrivilegedEditor.tsx      ← Editor component
    └── package.json
```

---

## Total Document Count

| Category | Count |
|----------|-------|
| Core docs (INDEX, MANIFEST, etc.) | 5 |
| App docs contracts | 6 |
| App docs schemas | 5 |
| App docs policies | 4 |
| App docs state files | 5 |
| App canonical docs (working/messenger) | 25 |
| **Total** | **50** |
