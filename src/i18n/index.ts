import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonVi from './locales/vi/common.json';
import errorsVi from './locales/vi/errors.json';
import commonEn from './locales/en/common.json';
import errorsEn from './locales/en/errors.json';

export const LANG_STORAGE_KEY = 'pimi_lang';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: commonVi, errors: errorsVi },
      en: { common: commonEn, errors: errorsEn },
    },
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en'],
    ns: ['common', 'errors'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANG_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
