import type { Language, Translation } from './types';
import { ru } from './locales/ru';
import { hi } from './locales/hi';
import { zh } from './locales/zh';
import { tt } from './locales/tt';
import { en } from './locales/en';
import { be } from './locales/be';
import { ba } from './locales/ba';
import { cv } from './locales/cv';
import { sah } from './locales/sah';
import { udm } from './locales/udm';
import { ce } from './locales/ce';
import { os } from './locales/os';

export const translationsData: Record<Language, Translation> = {
  ru,
  hi,
  zh,
  tt,
  en,
  be,
  ba,
  cv,
  sah,
  udm,
  ce,
  os,
};

/**
 * Get translation by key
 */
export function t(key: keyof Translation, lang: Language = 'ru'): string {
  return translationsData[lang]?.[key] || translationsData.ru[key] || key;
}

/**
 * Get all translations for a language
 */
export function getTranslations(lang: Language): Translation {
  return translationsData[lang] || translationsData.ru;
}

/**
 * Backward compatibility - allows translations(lang) usage
 */
export function translations(lang: Language): Translation {
  return getTranslations(lang);
}

/**
 * Get available languages
 */
export { LANGUAGES } from './types';
export type { Language, Translation };
