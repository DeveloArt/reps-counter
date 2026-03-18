import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import pl from './locales/pl.json';

const systemLanguageTag = Localization.getLocales()[0]?.languageTag ?? 'en';
const initialLanguage = systemLanguageTag.toLowerCase().startsWith('pl') ? 'pl' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pl: { translation: pl },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'pl'],
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
