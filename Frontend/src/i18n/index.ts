import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './translations/en.json';
import hi from './translations/hi.json';
import mr from './translations/mr.json';
import gu from './translations/gu.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  gu: { translation: gu },
};

const LANGUAGE_KEY = '@app_language';

const initI18n = async () => {
  let savedLanguage = 'en';
  try {
    savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY) || Localization.getLocales()[0]?.languageCode || 'en';
  } catch (error) {
    savedLanguage = Localization.getLocales()[0]?.languageCode || 'en';
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      compatibilityJSON: 'v4',
    });
};

initI18n();

export default i18n;
