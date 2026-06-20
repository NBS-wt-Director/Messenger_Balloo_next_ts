---
objectType: "scenario"
nodeId: "working"
appId: "messenger"
scenarioId: "view-profile"
title: "View Profile"
goal: "View and edit user profile"
actor: "user"
preconditions:
  - "user is authenticated"
  - "user is on chat screen"
steps:
  - "User taps avatar in chat header"
  - "Profile screen opens with user data"
  - "User views profile information"
  - "User optionally edits display name or bio"
  - "User optionally changes avatar"
  - "User clicks save to persist changes"
  - "Profile updates are confirmed"
involvedScreens:
  - "chat"
  - "profile"
involvedTransitions:
  - "chat-to-profile"
outputs:
  - "profile viewed"
  - "changes saved (if edited)"
exceptions:
  - "user data not loaded — show loading state"
  - "save failed — show error, allow retry"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/AVATARS_AND_USERS.md"
    context: "Avatar and user management"
status: "active"
---

# View Profile

## Overview

Workflow for viewing and editing user profile information.

## Preconditions

| # | Condition | Notes |
|---|-----------|-------|
| 1 | User authenticated | Session valid |
| 2 | User on chat screen | Avatar visible |

## Step-by-Step Flow

| Step | Action | Screen | Component |
|------|--------|--------|-----------|
| 1 | Tap avatar | chat | img (clickable) |
| 2 | Open profile | profile | Page load, fetch user data |
| 3 | View profile | profile | Display fields |
| 4 | Edit name/bio | profile | input/textarea |
| 5 | Change avatar | profile | File picker |
| 6 | Save changes | profile | POST /api/users/profile |
| 7 | Confirm update | profile | Success toast |

## Outputs

- Profile information displayed
- Changes saved to server (if edited)

## Exceptions

| Exception | Handling |
|-----------|----------|
| User data not loaded | Show loading spinner |
| Save failed | Show error toast, allow retry |

## Related Screens

- `chat` — entry point
- `profile` — main screen

## Related Transitions

- `chat-to-profile` — from chat to profile

