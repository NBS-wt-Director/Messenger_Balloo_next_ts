// i18n types
export type Language = 'ru' | 'hi' | 'zh' | 'tt' | 'en' | 'be' | 'ba' | 'cv' | 'sah' | 'udm' | 'ce' | 'os';

export type Translation = Record<string, string>;

export type LanguageOption = {
  code: Language;
  name: string;
  nativeName: string;
};

export const LANGUAGES: LanguageOption[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
  { code: 'tt', name: 'Tatar', nativeName: 'Татарча' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ba', name: 'Bashkir', nativeName: 'Башҡорт' },
  { code: 'cv', name: 'Chuvash', nativeName: 'Чăваш' },
  { code: 'sah', name: 'Yakut', nativeName: 'Саха' },
  { code: 'udm', name: 'Udmurt', nativeName: 'Удмурт' },
  { code: 'ce', name: 'Chechen', nativeName: 'Нохчийн' },
  { code: 'os', name: 'Ossetian', nativeName: 'Ирон' },
];

export type Theme = 
  | 'dark' 
  | 'light' 
  | 'russia'
  | 'india'
  | 'china'
  | 'tatarstan'
  | 'belarus'
  | 'bashkortostan'
  | 'chuvashia'
  | 'yakutia'
  | 'udmurtia'
  | 'chechnya'
  | 'ossetia';
