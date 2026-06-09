# Rounding Violations Audit

## Purpose

This document catalogs all legacy rounded corner usage in the donor repository. These are migration defects that must be removed in Phase 12.

## Source

Audit performed on: 2026-06-09
Search patterns: `border-radius`, `rounded-lg`, `rounded-full`, `rounded-md`, `rounded-xl`

---

## Summary

**Total violations found:** 200+ instances across messenger/ and admin-portal/

**Categories:**
1. **Inline style violations** - `borderRadius` in JSX/TSX
2. **Tailwind class violations** - `rounded-*` classes
3. **CSS border-radius violations** - `border-radius` in CSS files

---

## CSS Border-Radius Violations

### messenger/src/app/*.css

| File | Violations | Examples |
|------|------------|----------|
| `email-verification.css` | 1 | `border-radius: 8px` (line 13) |
| `forgot-password.css` | 5 | `border-radius: 12px`, `50%`, `8px` |
| `delete-account.css` | 6 | `border-radius: 12px`, `50%`, `8px` |
| `globals.css` | 3 | `border-radius: 12px`, `16px`, `10px` |
| `theme-subscription/page.css` | 8 | `border-radius: 8px`, `12px`, `20px` |
| `statuses/page.css` | 7 | `border-radius: 50%`, `16px` |
| `sessions/sessionsPage.css` | 6 | `border-radius: 50%`, `12px`, `8px` |
| `profile/profile.css` | 18 | `border-radius: 50%`, `16px`, `10px`, `8px` |
| `admin/page.css` | 9 | Mostly `border-radius: 0` (correct) |

### messenger/src/components/*.css

| File | Violations | Examples |
|------|------------|----------|
| `AccountSwitcher.css` | 2 | `border-radius: 8px` (lines 211, 226) |
| `AttachmentViewer.css` | 15 | `border-radius: 12px`, `50%`, `8px` |
| `AudioPlayer.css` | 8 | `border-radius: 12px`, `50%`, `2px` |
| `CallInterface.css` | 5 | `border-radius: 12px`, `50%` |
| `DeleteAccountModal.css` | 7 | `border-radius: 16px`, `50%`, `8px` |
| `InviteManager.css` | 0 | All `border-radius: 0` (correct) |
| `ListAttachment.css` | 0 | All `border-radius: 0` (correct) |
| `NotificationManager.css` | 0 | All `border-radius: 0` (correct) |
| `PollAttachment.css` | 0 | All `border-radius: 0` (correct) |
| `QuizAttachment.css` | 1 | `border-radius: 50%` (line 201) |
| `StatusUploader.css` | 8 | `border-radius: 16px`, `50%`, `12px`, `8px` |
| `StatusViewer.css` | 4 | `border-radius: 50%`, `8px` |
| `SurveyAttachment.css` | 0 | All `border-radius: 0` (correct) |
| `ThemeCard.css` | 0 | All `border-radius: 0` (correct) |
| `ThemeSelector.css` | 0 | All `border-radius: 0` (correct) |
| `ThemeSubscriptionDialog.css` | 5 | `border-radius: 6px`, `8px` |
| `TwoFASetup.css` | 11 | `border-radius: 16px`, `50%`, `12px`, `8px`, `4px` |
| `ui/Alert.css` | 6 | `border-radius: 16px`, `50%`, `8px` |
| `VerificationModal.css` | 10 | `border-radius: 16px`, `50%`, `8px`, `6px` |
| `NotificationManager.css` | 0 | All `border-radius: 0` (correct) |

### messenger/src/components/pages/*.css

| File | Violations | Examples |
|------|------------|----------|
| `AuthPage.css` | 12 | `border-radius: 16px`, `8px`, `0` |
| `ChatPage.css` | 20+ | `border-radius: 8px`, `12px`, `50%`, `3px` |
| `ChatsPage.css` | 10 | `border-radius: 0.5rem`, `0` |
| `ErrorPage.css` | 0 | All `border-radius: 0` (correct) |
| `HistoryPage.css` | 4 | `border-radius: 0.75rem`, `2rem`, `1rem` |
| `InvitationsPage.css` | 1 | `border-radius: 50%` (line 122) |
| `ProfilePage.css` | 0 | All `border-radius: 0` (correct) |

### admin-portal/src/app/globals.css

| Violations | Examples |
|------------|----------|
| 5 | `border-radius: 0.75rem`, `0.5rem`, `9999px` |

### messenger/src/components/admin/VersionsAdmin.css

| Violations | Examples |
|------------|----------|
| 8 | `border-radius: 0.5rem`, `0.25rem`, `0.375rem` |

---

## Tailwind Class Violations

### messenger/src/app/*.tsx

| File | Violations | Examples |
|------|------------|----------|
| `about-balloo/page.tsx` | 1 | `rounded-full` (line 187) |
| `error.tsx` | 4 | `rounded-full`, `rounded-lg` |
| `forbidden.tsx` | 3 | `rounded-full`, `rounded-lg` |
| `maintenance.tsx` | 3 | `rounded-full`, `rounded-lg` |
| `profile/page.tsx` | 1 | `rounded-full` (line 181) |
| `support/page.tsx` | 1 | `rounded-full` (line 75) |
| `terms/page.tsx` | 4 | `rounded-xl`, `rounded-lg`, `rounded-full` |
| `privacy/page.tsx` | 4 | `rounded-xl`, `rounded-lg`, `rounded-full` |
| `loading.tsx` | 1 | `rounded-full` (line 14) |
| `not-found.tsx` | 3 | `rounded-full`, `rounded-lg` |
| `global-error.tsx` | 2 | `rounded-full`, `rounded-lg` |
| `health/page.tsx` | 8 | `rounded-lg` (multiple) |
| `features/page.tsx` | 1 | `rounded-full` (line 369) |
| `about-company/page.tsx` | 1 | `rounded-full` (line 58) |

### messenger/src/components/*.tsx

| File | Violations | Examples |
|------|------------|----------|
| `InviteManager.tsx` | 4 | `rounded-xl`, `rounded-full` |
| `ui/BurgerMenu.tsx` | 2 | `rounded-lg` (lines 47, 86) |
| `pages/ChatPage.tsx` | 1 | `rounded-full` (line 467) |
| `pages/ChatsPage.tsx` | 1 | `rounded-full` (line 631) |
| `pages/ProfilePage.tsx` | 1 | `rounded-full` (line 106) |
| `pages/HistoryPage.tsx` | 1 | `rounded-full` (line 66) |
| `admin/VersionsAdmin.tsx` | 1 | `rounded-full` (line 149) |

### admin-portal/src/components/*.tsx

| File | Violations | Examples |
|------|------------|----------|
| `Versions.tsx` | 1 | `rounded-lg` (line 300) |
| `Users.tsx` | 3 | `rounded-full`, `rounded-lg` |
| `Support.tsx` | 1 | `rounded-lg` (line 177) |
| `InternalChat.tsx` | 2 | `rounded-lg`, `rounded-full` |

### admin-portal/src/app/admin/page.tsx

| Violations | Examples |
|------------|----------|
| 3 | `rounded-full`, `rounded-lg` |

### messenger/docs/*.md

| File | Violations | Examples |
|------|------------|----------|
| `YANDEX_OAUTH.md` | 1 | `rounded-lg` (line 249) |

---

## Inline Style Violations

### messenger/src/lib/email.js

| Violations | Examples |
|------------|----------|
| 1 | `borderRadius: 8px` (line 64) |

### api/src/services/email.service.js

| Violations | Examples |
|------------|----------|
| 8 | Inline `borderRadius` in email templates |

---

## Files with Correct Implementation (border-radius: 0)

These files already comply with the DesignContract:

- `messenger/src/app/admin/page.css` - All `border-radius: 0`
- `messenger/src/components/InviteManager.css` - All `border-radius: 0`
- `messenger/src/components/ListAttachment.css` - All `border-radius: 0`
- `messenger/src/components/NotificationManager.css` - All `border-radius: 0`
- `messenger/src/components/PollAttachment.css` - All `border-radius: 0`
- `messenger/src/components/QuizAttachment.css` - Most correct, 1 violation
- `messenger/src/components/SurveyAttachment.css` - All `border-radius: 0`
- `messenger/src/components/ThemeCard.css` - All `border-radius: 0`
- `messenger/src/components/ThemeSelector.css` - All `border-radius: 0`
- `messenger/src/components/pages/ErrorPage.css` - All `border-radius: 0`
- `messenger/src/components/pages/ProfilePage.css` - All `border-radius: 0`

---

## Action Plan

### Phase 12: Legacy Design Cleanup

1. **Priority 1**: CSS files with >10 violations
   - `profile/profile.css` (18 violations)
   - `ChatPage.css` (20+ violations)

2. **Priority 2**: CSS files with 5-10 violations
   - `theme-subscription/page.css`
   - `TwoFASetup.css`
   - `VerificationModal.css`
   - `AttachmentViewer.css`

3. **Priority 3**: TSX files with Tailwind violations
   - `terms/page.tsx`
   - `privacy/page.tsx`
   - `health/page.tsx`

4. **Priority 4**: Email templates
   - `api/src/services/email.service.js`
   - `messenger/src/lib/email.js`

---

## Notes

- All violations must be fixed in Phase 12
- Do NOT fix these files in earlier phases
- Use `border-radius: 0` replacement
- Remove all `rounded-*` Tailwind classes
- Update CSS variables if needed

---

## Version

- **Audit Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Pending cleanup (Phase 12)
