---
title: I18N Runtime Model
description: Runtime модель языков Balloo — выбор языка, fallback, persistence
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - i18n
  - runtime-model
  - canonical
related_docs:
  - SUMMARY_DOCS/i18n/I18N_POLICY.md
  - SUMMARY_DOCS/i18n/I18N_LANGUAGE_MODEL.md
  - SUMMARY_DOCS/state/i18n-runtime-map.json
---

# ⚙️ I18N RUNTIME MODEL

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Эта модель определяет **как язык выбирается, сохраняется и применяется** в runtime Balloo.

**Цель:** Обеспечить консистентное поведение i18n в runtime для всех узлов.

---

## 🔄 LANGUAGE SELECTION

### Selection Priority

```
1. User preference (saved in profile/settings)
   ↓ (if not set)
2. Browser/App language (navigator.language)
   ↓ (if not supported)
3. Default language (ru)
```

### Selection Algorithm

```typescript
function selectLanguage(
  userPreference?: string,
  browserLanguage?: string,
  availableLanguages: string[]
): string {
  // 1. Try user preference
  if (userPreference && availableLanguages.includes(userPreference)) {
    return userPreference;
  }
  
  // 2. Try browser language (strip region code)
  if (browserLanguage) {
    const lang = browserLanguage.split('-')[0];
    if (availableLanguages.includes(lang)) {
      return lang;
    }
  }
  
  // 3. Fallback to default
  return 'ru';
}
```

---

## 💾 PERSISTENCE

### Storage Locations

| Location | Type | Lifetime | Scope |
|----------|------|----------|-------|
| **User Profile** | Backend DB | Permanent | All devices |
| **Local Storage** | localStorage | Persistent | Current device |
| **Session** | Memory | Session | Current session |

### Storage Priority

```
User Profile (backend)
    ↓ (if not available)
Local Storage (client)
    ↓ (if not available)
Session (memory)
```

### Implementation

```typescript
// Save language preference
function saveLanguagePreference(lang: string, scope: 'profile' | 'local' | 'session'): void {
  switch (scope) {
    case 'profile':
      api.updateUserProfile({ language: lang });
      break;
    case 'local':
      localStorage.setItem('balloo-language', lang);
      break;
    case 'session':
      sessionStorage.setItem('balloo-language', lang);
      break;
  }
}

// Load language preference
function loadLanguagePreference(): string | null {
  // Try profile first (async)
  const profile = api.getUserProfile();
  if (profile?.language) {
    return profile.language;
  }
  
  // Try local storage
  const local = localStorage.getItem('balloo-language');
  if (local) {
    return local;
  }
  
  // Try session
  const session = sessionStorage.getItem('balloo-language');
  if (session) {
    return session;
  }
  
  return null;
}
```

---

## 🔄 FALLBACK BEHAVIOR

### Runtime Fallback Chain

```
Selected Language (e.g., "hi")
    ↓ (if key missing)
Secondary Fallback (e.g., "en" for hi)
    ↓ (if key missing)
Primary Fallback (ru)
    ↓ (if key missing)
Explicit Marker [MISSING: key]
```

### Fallback Implementation

```typescript
function t(
  key: string,
  lang: string,
  variables?: Record<string, any>
): string {
  const fallbackChain = getFallbackChain(lang);
  
  for (const fallbackLang of fallbackChain) {
    const translation = translations[fallbackLang]?.[key];
    if (translation) {
      return interpolate(translation, variables);
    }
  }
  
  // All fallbacks exhausted
  console.warn(`Missing translation: ${key} in ${lang}`);
  return `[MISSING: ${key}]`;
}

function getFallbackChain(lang: string): string[] {
  const chains: Record<string, string[]> = {
    'hi': ['hi', 'en', 'ru'],
    'zh': ['zh', 'en', 'ru'],
    'tt': ['tt', 'ru'],
    'default': ['ru']
  };
  
  return chains[lang] || chains['default'];
}
```

---

## 🌐 RUNTIME AVAILABILITY

### Language Availability States

| State | Description | UI Visible | Runtime Available |
|-------|-------------|------------|-------------------|
| **available** | Fully loaded and ready | ✅ Yes | ✅ Yes |
| **loading** | Being fetched | ⏳ Loading | ⏳ Queued |
| **error** | Failed to load | ❌ No | ❌ No |
| **unavailable** | Not activated | ❌ No | ❌ No |

### Availability Check

```typescript
interface LanguageAvailability {
  languageId: string;
  status: 'available' | 'loading' | 'error' | 'unavailable';
  coverage: number;
  loadedAt?: string;
  error?: string;
}

function checkLanguageAvailability(lang: string): LanguageAvailability {
  if (loadingLanguages.includes(lang)) {
    return { languageId: lang, status: 'loading', coverage: 0 };
  }
  
  if (loadedLanguages.includes(lang)) {
    return { 
      languageId: lang, 
      status: 'available', 
      coverage: getCoverage(lang),
      loadedAt: getLoadedAt(lang)
    };
  }
  
  if (failedLanguages.includes(lang)) {
    return { 
      languageId: lang, 
      status: 'error', 
      coverage: 0,
      error: getError(lang)
    };
  }
  
  return { languageId: lang, status: 'unavailable', coverage: 0 };
}
```

---

## 🔧 TECHNICAL ZONE OVERRIDE

### Management Capabilities

Technical zone can:

1. **Enable/Disable Languages**
   ```typescript
   function setLanguageEnabled(lang: string, enabled: boolean): void {
     // Update i18n-runtime-map.json
     runtimeMap[lang].enabled = enabled;
   }
   ```

2. **Override Fallback Chain**
   ```typescript
   function setFallbackChain(lang: string, chain: string[]): void {
     // Update i18n-runtime-map.json
     runtimeMap[lang].fallbackChain = chain;
   }
   ```

3. **Force Reload Translations**
   ```typescript
   async function reloadTranslations(lang: string): Promise<void> {
     await fetchTranslations(lang, { force: true });
   }
   ```

---

## 📊 RUNTIME STATE

### Runtime Map Structure

```typescript
interface I18nRuntimeMap {
  [languageId: string]: {
    enabled: boolean;
    loaded: boolean;
    coverage: number;
    fallbackChain: string[];
    loadedAt?: string;
    version?: string;
  };
}
```

### Example Runtime Map

```json
{
  "ru": {
    "enabled": true,
    "loaded": true,
    "coverage": 100,
    "fallbackChain": ["ru"],
    "loadedAt": "2026-06-13T00:00:00Z"
  },
  "en": {
    "enabled": true,
    "loaded": true,
    "coverage": 100,
    "fallbackChain": ["en", "ru"],
    "loadedAt": "2026-06-13T00:00:00Z"
  },
  "hi": {
    "enabled": true,
    "loaded": true,
    "coverage": 80,
    "fallbackChain": ["hi", "en", "ru"],
    "loadedAt": "2026-06-13T00:00:00Z"
  }
}
```

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "runtimeModel": {
    "selection": {
      "priority": ["user-preference", "browser-language", "default"],
      "default": "ru"
    },
    "persistence": {
      "locations": ["profile", "local-storage", "session"],
      "priority": ["profile", "local", "session"]
    },
    "fallback": {
      "chain": ["selected", "secondary", "ru", "[MISSING]"],
      "customizable": true
    },
    "availability": {
      "states": ["available", "loading", "error", "unavailable"],
      "technicalZoneOverride": true
    }
  }
}
```

---

## 📖 RELATED DOCUMENTS

- [I18N_POLICY.md](./I18N_POLICY.md) — Language policy
- [I18N_LANGUAGE_MODEL.md](./I18N_LANGUAGE_MODEL.md) — Language model
- [../state/i18n-runtime-map.json](../state/i18n-runtime-map.json) — Runtime mapping
- [../contracts/i18n/I18nLanguageManagementContract.md](../contracts/i18n/I18nLanguageManagementContract.md) — Management contract

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**
