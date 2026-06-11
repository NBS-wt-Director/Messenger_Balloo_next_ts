/**
 * Core I18n - Platform-wide internationalization
 * 
 * Extraction from: messenger/src/i18n/
 * 
 * Migration Status:
 * - Phase 5: Core i18n extracted from messenger/
 * - Backward compatibility maintained in messenger/
 * - Legacy apps still use messenger/src/i18n
 * 
 * Source of Truth:
 * - 12 languages defined in languages.json
 * - Platform-level language registry
 */

// ============================================================================
// Types
// ============================================================================

export type LanguageCode = 
  | 'ru' 
  | 'hi' 
  | 'zh' 
  | 'tt' 
  | 'en' 
  | 'be' 
  | 'ba' 
  | 'cv' 
  | 'sah' 
  | 'udm' 
  | 'ce' 
  | 'os';

export type Translation = Record<string, string>;

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  priority?: number;
  enabled?: boolean;
}

// ============================================================================
// Constants - 12 Platform Languages
// ============================================================================

export const LANGUAGES: LanguageOption[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский', priority: 1, enabled: true },
  { code: 'en', name: 'English', nativeName: 'English', priority: 2, enabled: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', priority: 3, enabled: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', priority: 4, enabled: true },
  { code: 'tt', name: 'Tatar', nativeName: 'Татарча', priority: 5, enabled: true },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', priority: 6, enabled: true },
  { code: 'ba', name: 'Bashkir', nativeName: 'Башҡорт', priority: 7, enabled: true },
  { code: 'cv', name: 'Chuvash', nativeName: 'Чăваш', priority: 8, enabled: true },
  { code: 'sah', name: 'Yakut', nativeName: 'Саха', priority: 9, enabled: true },
  { code: 'udm', name: 'Udmurt', nativeName: 'Удмурт', priority: 10, enabled: true },
  { code: 'ce', name: 'Chechen', nativeName: 'Нохчийн', priority: 11, enabled: true },
  { code: 'os', name: 'Ossetian', nativeName: 'Ирон', priority: 12, enabled: true },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'ru';
export const FALLBACK_LANGUAGE: LanguageCode = 'en';

// ============================================================================
// Translation Registry Type
// ============================================================================

export interface TranslationRegistry {
  [key: string]: Translation;
}

// ============================================================================
// Helper Functions (to be implemented with actual translations)
// ============================================================================

/**
 * Get translation by key
 * Note: Actual translations will be loaded from locale files
 */
export function t(key: string, lang: LanguageCode = DEFAULT_LANGUAGE, translations?: TranslationRegistry): string {
  return translations?.[lang]?.[key] || translations?.[DEFAULT_LANGUAGE]?.[key] || key;
}

/**
 * Get all translations for a language
 */
export function getTranslations(lang: LanguageCode, translations?: TranslationRegistry): Translation {
  return translations?.[lang] || translations?.[DEFAULT_LANGUAGE] || {};
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): LanguageOption[] {
  return LANGUAGES.filter(lang => lang.enabled !== false);
}

/**
 * Check if language is supported
 */
export function isSupportedLanguage(code: string): code is LanguageCode {
  return LANGUAGES.some(lang => lang.code === code);
}
