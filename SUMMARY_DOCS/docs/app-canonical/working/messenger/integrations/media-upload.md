---
objectType: "integration"
nodeId: "working"
appId: "messenger"
integrationId: "media-upload"
title: "Media Upload"
direction: "outbound"
targetType: "service"
targetId: "cdn-service"
purpose: "Upload and serve media files (avatars, attachments)"
trigger: "user uploads avatar or message attachment"
input: "file (JPG, PNG, GIF, PDF), max 5MB"
output: "CDN URL, file metadata"
protocolOrChannel: "HTTPS / REST API (multipart/form-data)"
authRequirements: "Authenticated session (cookie-based)"
failureHandling: "show upload error, allow retry, log to error queue"
relatedScreens:
  - "profile"
  - "chat"
relatedTransitions: []
relatedScenarios:
  - "view-profile"
sourceRefs:
  - path: "SUMMARY_DOCS/project/nodes/Messenger/AVATARS_AND_USERS.md"
    context: "Avatar upload"
  - path: "SUMMARY_DOCS/project/nodes/Messenger/API_DOCUMENTATION.md"
    context: "Media upload API"
status: "draft"
---

# Media Upload

## Overview

Media upload integration for avatars and message attachments. Handles file validation, upload to CDN, and URL return.

## Direction

Outbound — messenger uploads files to CDN service, receives URLs.

## Protocol

- HTTPS / REST API
- Multipart/form-data for file upload
- JSON response with CDN URL

## Supported Formats

| Format | Max Size | Usage |
|--------|----------|-------|
| JPG | 5MB | Avatars, images |
| PNG | 5MB | Avatars, images |
| GIF | 5MB | Animated avatars |
| PDF | 10MB | Document attachments |

## Data Flow

```
User selects file → Client validation (size, type)
                                    ↓
                            POST /api/media/upload
                                    ↓
                            CDN service processes file
                                    ↓
                            Returns CDN URL
                                    ↓
                            URL stored in database
```

## Failure Handling

| Failure | Response | Recovery |
|---------|----------|----------|
| File too large | "File too large" error | Ask user to compress |
| Invalid format | "Unsupported format" error | Ask user to convert |
| Upload failed | "Upload failed" with retry | Allow retry |

## Related Screens

- `profile` — avatar upload
- `chat` — message attachments

## Related Integrations

- `auth-service` — validates user session
- `messenger-api` — stores CDN URL in database

