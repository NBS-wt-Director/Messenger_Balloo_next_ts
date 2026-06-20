---
objectType: "screen"
nodeId: "working"
appId: "messenger"
screenId: "profile"
title: "Profile Screen"
purpose: "User profile display and editing"
actors: ["authenticated-user"]
entryConditions: ["user authenticated"]
exitConditions: ["navigate to settings", "navigate to chat"]
elements:
  - "profile avatar (clickable, changes photo)"
  - "display name (editable)"
  - "bio/description (editable)"
  - "username (read-only)"
  - "email (read-only)"
  - "save button (primary action)"
  - "cancel button (secondary action)"
actions:
  - "edit display name"
  - "edit bio"
  - "change avatar"
  - "save profile changes"
  - "cancel editing"
relatedTransitions:
  - "chat-to-profile"
  - "profile-to-settings"
relatedScenarios:
  - "view-profile"
relatedIntegrations:
  - "auth-service"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/AVATARS_AND_USERS.md"
    context: "Avatar and user management"
  - path: "SUMMARY_DOCS/project/nodes/Messenger/API_DOCUMENTATION.md"
    context: "User API endpoints"
status: "active"
---

# Profile Screen

## Purpose

User profile display and editing — allows users to view and modify their profile information.

## UI Elements

| Element | Type | Required | Notes |
|---------|------|----------|-------|
| Profile avatar | img (clickable) | Yes | Upload new photo |
| Display name | input[type=text] | Yes | Max 50 chars |
| Bio | textarea | No | Max 500 chars |
| Username | span (read-only) | Yes | Unique identifier |
| Email | span (read-only) | Yes | From auth-service |
| Save button | button[type=submit] | Yes | Primary action |
| Cancel button | button[type=button] | Yes | Secondary action |

## Actions

1. **Edit display name**
   - Input field for name change
   - Validation: max 50 chars, no special chars

2. **Edit bio**
   - Textarea for short description
   - Max 500 characters

3. **Change avatar**
   - Click avatar to open file picker
   - Supported formats: JPG, PNG, GIF
   - Max size: 5MB

4. **Save profile**
   - Validates all fields
   - POST to `/api/users/profile`
   - Shows success/error toast

## Related Transitions

- `chat-to-profile` — from chat screen avatar click
- `profile-to-settings` — navigate to settings

## Related Scenarios

- `view-profile` — viewing and editing profile

## Related Integrations

- `auth-service` — user data validation
- `media-upload` — avatar upload to CDN

