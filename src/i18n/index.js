import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation imports
import enCommon from './locales/en/common.json';
import hiCommon from './locales/hi/common.json';
import bnCommon from './locales/bn/common.json';
import teCommon from './locales/te/common.json';
import mrCommon from './locales/mr/common.json';
import taCommon from './locales/ta/common.json';
import guCommon from './locales/gu/common.json';
import mlCommon from './locales/ml/common.json';
import knCommon from './locales/kn/common.json';
import paCommon from './locales/pa/common.json';
import asCommon from './locales/as/common.json';
import orCommon from './locales/or/common.json';
import urCommon from './locales/ur/common.json';

// Language resources
const resources = {
  en: {
    common: enCommon,
  },
  hi: {
    common: hiCommon,
  },
  bn: {
    common: bnCommon,
  },
  te: {
    common: teCommon,
  },
  mr: {
    common: mrCommon,
  },
  ta: {
    common: taCommon,
  },
  gu: {
    common: guCommon,
  },
  ml: {
    common: mlCommon,
  },
  kn: {
    common: knCommon,
  },
  pa: {
    common: paCommon,
  },
  as: {
    common: asCommon,
  },
  or: {
    common: orCommon,
  },
  ur: {
    common: urCommon,
  },
};

// Supported languages configuration
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
];

// RTL languages
export const rtlLanguages = ['ur'];

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'userLanguagePreference',
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Default namespace
    defaultNS: 'common',
    ns: ['common'],

    // React options
    react: {
      useSuspense: false,
    },
  });

export default i18n; 