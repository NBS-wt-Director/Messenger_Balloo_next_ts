# COMPLETE DOCUMENT CATALOG — All Nodes & Apps

**Last Updated:** 2026-06-20  
**Status:** Content populated for working/messenger and priority 1 technical nodes

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
| login | `login.md` | `docs/app-canonical/working/messenger/screens/login.md` | User login screen — authentication entry point |
| chat | `chat.md` | `docs/app-canonical/working/messenger/screens/chat.md` | Main chat interface — message display and composition |
| profile | `profile.md` | `docs/app-canonical/working/messenger/screens/profile.md` | User profile screen — display and editing |
| settings | `settings.md` | `docs/app-canonical/working/messenger/screens/settings.md` | Application settings — theme, language, preferences |
| notifications | `notifications.md` | `docs/app-canonical/working/messenger/screens/notifications.md` | Notifications panel — push notification management |

#### Transitions (6)

| ID | File | Path | Description |
|----|------|------|-------------|
| login-to-chat | `login-to-chat.md` | `docs/app-canonical/working/messenger/transitions/login-to-chat.md` | Login → Chat — authentication success |
| chat-to-profile | `chat-to-profile.md` | `docs/app-canonical/working/messenger/transitions/chat-to-profile.md` | Chat → Profile — avatar click |
| profile-to-settings | `profile-to-settings.md` | `docs/app-canonical/working/messenger/transitions/profile-to-settings.md` | Profile → Settings — settings icon click |
| chat-to-notifications | `chat-to-notifications.md` | `docs/app-canonical/working/messenger/transitions/chat-to-notifications.md` | Chat → Notifications — bell icon click |
| notifications-to-chat | `notifications-to-chat.md` | `docs/app-canonical/working/messenger/transitions/notifications-to-chat.md` | Notifications → Chat — notification tap |
| settings-to-login | `settings-to-login.md` | `docs/app-canonical/working/messenger/transitions/settings-to-login.md` | Settings → Login — logout |

#### Scenarios (4)

| ID | File | Path | Description |
|----|------|------|-------------|
| user-login-flow | `user-login-flow.md` | `docs/app-canonical/working/messenger/scenarios/user-login-flow.md` | Complete user authentication workflow |
| send-message | `send-message.md` | `docs/app-canonical/working/messenger/scenarios/send-message.md` | Send message workflow |
| view-profile | `view-profile.md` | `docs/app-canonical/working/messenger/scenarios/view-profile.md` | View and edit profile workflow |
| push-notification | `push-notification.md` | `docs/app-canonical/working/messenger/scenarios/push-notification.md` | Push notification handling workflow |

#### Integrations (3)

| ID | File | Path | Description |
|----|------|------|-------------|
| auth-service | `auth-service.md` | `docs/app-canonical/working/messenger/integrations/auth-service.md` | User authentication and session management |
| firebase-push | `firebase-push.md` | `docs/app-canonical/working/messenger/integrations/firebase-push.md` | Firebase push notifications |
| media-upload | `media-upload.md` | `docs/app-canonical/working/messenger/integrations/media-upload.md` | Media file upload (avatars, attachments) |

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

### Application: workdocs-working

#### Manifest

| File | Path | Description |
|------|------|-------------|
| Application Manifest | `docs/app-canonical/working/workdocs-working/manifest.json` | Technical documentation node |

#### Screens (4)

| ID | Title | Status |
|----|-------|--------|
| docs-view | Documentation Viewer | active |
| docs-search | Documentation Search | active |
| docs-auth | Authentication | active |
| docs-settings | Documentation Settings | draft |

#### Transitions (3)

| ID | From | To | Status |
|----|------|-----|--------|
| auth-to-docs | docs-auth | docs-view | active |
| docs-view-to-search | docs-view | docs-search | active |
| docs-search-to-docs-view | docs-search | docs-view | active |

#### Scenarios (3)

| ID | Title | Actor | Status |
|----|-------|-------|--------|
| view-document | View Documentation | developer | active |
| search-docs | Search Documentation | developer | active |
| ai-read-docs | AI Read Documentation | ai-agent | active |

#### Integrations (2)

| ID | Title | Target | Status |
|----|-------|--------|--------|
| kpdegen-integration | Kpdegen Integration | kpdegen-working | active |
| nodes-switcher-integration | Nodes Switcher Integration | nodes-switcher-working | active |

---

### Application: kpdegen-working

#### Manifest

| File | Path | Description |
|------|------|-------------|
| Application Manifest | `docs/app-canonical/working/kpdegen-working/manifest.json` | Server code generator node |

#### Screens (4)

| ID | Title | Status |
|----|-------|--------|
| codegen-dashboard | Codegen Dashboard | active |
| codegen-input | Input Processing | active |
| codegen-output | Output Preview | active |
| codegen-settings | Codegen Settings | draft |

#### Transitions (3)

| ID | From | To | Status |
|----|------|-----|--------|
| dashboard-to-input | codegen-dashboard | codegen-input | active |
| input-to-output | codegen-input | codegen-output | active |
| output-to-dashboard | codegen-output | codegen-dashboard | active |

#### Scenarios (3)

| ID | Title | Actor | Status |
|----|-------|-------|--------|
| generate-node | Generate Node Code | ai-agent | active |
| generate-config | Generate Config | ai-agent | active |
| validate-output | Validate Output | system | active |

#### Integrations (3)

| ID | Title | Target | Status |
|----|-------|--------|--------|
| workdocs-integration | Workdocs Integration | workdocs-working | active |
| nodes-switcher-integration | Nodes Switcher Integration | nodes-switcher-working | active |
| projectsettings-integration | Project Settings Integration | projectgeneralsettings-working | active |

---

### Application: nodes-switcher-working

#### Manifest

| File | Path | Description |
|------|------|-------------|
| Application Manifest | `docs/app-canonical/working/nodes-switcher-working/manifest.json` | Node version manager node |

#### Screens (4)

| ID | Title | Status |
|----|-------|--------|
| version-registry | Version Registry | active |
| rollout-control | Rollout Control | active |
| compatibility-check | Compatibility Check | active |
| rollout-settings | Rollout Settings | draft |

#### Transitions (3)

| ID | From | To | Status |
|----|------|-----|--------|
| registry-to-rollout | version-registry | rollout-control | active |
| rollout-to-compatibility | rollout-control | compatibility-check | active |
| compatibility-to-registry | compatibility-check | version-registry | active |

#### Scenarios (3)

| ID | Title | Actor | Status |
|----|-------|-------|--------|
| register-version | Register New Version | devops | active |
| rollout-version | Rollout Version | devops | active |
| check-compatibility | Check Compatibility | system | active |

#### Integrations (3)

| ID | Title | Target | Status |
|----|-------|--------|--------|
| kpdegen-integration | Kpdegen Integration | kpdegen-working | active |
| projectsettings-integration | Project Settings Integration | projectgeneralsettings-working | active |
| workdocs-integration | Workdocs Integration | workdocs-working | active |

---

### Application: projectgeneralsettings-working

#### Manifest

| File | Path | Description |
|------|------|-------------|
| Application Manifest | `docs/app-canonical/working/projectgeneralsettings-working/manifest.json` | Central settings UI node |

#### Screens (5)

| ID | Title | Status |
|----|-------|--------|
| settings-dashboard | Settings Dashboard | active |
| project-settings | Project Settings | active |
| node-settings | Node Settings Map | active |
| feature-flags | Feature Flags | active |
| release-toggles | Release Toggles | draft |

#### Transitions (4)

| ID | From | To | Status |
|----|------|-----|--------|
| dashboard-to-project | settings-dashboard | project-settings | active |
| dashboard-to-node | settings-dashboard | node-settings | active |
| dashboard-to-features | settings-dashboard | feature-flags | active |
| dashboard-to-releases | settings-dashboard | release-toggles | draft |

#### Scenarios (4)

| ID | Title | Actor | Status |
|----|-------|-------|--------|
| manage-project-settings | Manage Project Settings | admin | active |
| manage-node-settings | Manage Node Settings | admin | active |
| manage-feature-flags | Manage Feature Flags | product-owner | active |
| manage-release-toggles | Manage Release Toggles | admin | draft |

#### Integrations (3)

| ID | Title | Target | Status |
|----|-------|--------|--------|
| nodes-switcher-integration | Nodes Switcher Integration | nodes-switcher-working | active |
| kpdegen-integration | Kpdegen Integration | kpdegen-working | active |
| workdocs-integration | Workdocs Integration | workdocs-working | active |

---

## Summary Statistics

### By Node

| Node | Apps | Total Files | Content Status |
|------|------|-------------|----------------|
| working | 5 | 64 | ✅ Populated |

### By Application

| App | Screens | Transitions | Scenarios | Integrations | Total |
|-----|---------|-------------|-----------|--------------|-------|
| messenger | 5 | 6 | 4 | 3 | 25 |
| workdocs-working | 4 | 3 | 3 | 2 | 12 |
| kpdegen-working | 4 | 3 | 3 | 3 | 13 |
| nodes-switcher-working | 4 | 3 | 3 | 3 | 13 |
| projectgeneralsettings-working | 5 | 4 | 4 | 3 | 16 |
| **Total** | **22** | **19** | **17** | **14** | **72** |

### By Type

| Type | Count | Files |
|------|-------|-------|
| Screens | 22 | `screens/*.md` |
| Transitions | 19 | `transitions/*.md` |
| Scenarios | 17 | `scenarios/*.md` |
| Integrations | 14 | `integrations/*.md` |
| Manifests | 5 | `manifest.json` |
| Maps | 1 | `maps/linked-view.json` |
| Docs Specs | 5 | `docs/*.md` |

---

## Content Status

### Populated (real content from project docs):

- ✅ `working/messenger` — 25 files with real content from `project/nodes/Messenger/`
- ✅ `working/workdocs-working` — manifest with real content from `project/nodes/Nodes/technical/NODE_workdocs_working.md`
- ✅ `working/kpdegen-working` — manifest with real content from `project/nodes/Nodes/technical/NODE_kpdegen_working.md`
- ✅ `working/nodes-switcher-working` — manifest with real content from `project/nodes/Nodes/technical/NODE_nodes_switcher_working.md`
- ✅ `working/projectgeneralsettings-working` — manifest with real content from `project/nodes/Nodes/technical/NODE_projectgeneralsettings_working.md`

### Remaining (no app-doc structure yet):

- ❌ 10 working branch nodes (api, files, docs, future, pilot-future, admin, workers, abaut, apps, working-root)
- ❌ 14 production/alpha nodes (balloo.su, api.balloo.su, ai.api.balloo.su, files.balloo.su, docs.balloo.su, future.balloo.su, admin.balloo.su, workers.balloo.su, abaut.balloo.su, apps.balloo.su, client-apps, alpha.balloo.su, apps.alpha.balloo.su, 2commands.alpha.balloo.su)

