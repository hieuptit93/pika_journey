import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import vi from './locales/vi';
import en from './locales/en';
import ko from './locales/ko';

export const SUPPORTED_LANGUAGES = ['vi', 'en', 'ko'] as const;
export type AppLanguage = typeof SUPPORTED_LANGUAGES[number];

// Tên mỗi ngôn ngữ viết bằng chính ngôn ngữ đó, nên không đưa vào file dịch.
export const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ko: '한국어',
};

const LANGUAGE_STORAGE_KEY = '@pika_language';

const isSupported = (lng: string | null | undefined): lng is AppLanguage =>
  !!lng && (SUPPORTED_LANGUAGES as readonly string[]).includes(lng);

// Chỉ xét ngôn ngữ ưu tiên số 1 của máy; ngoài vi/en/ko thì về tiếng Việt.
const deviceLanguage = (): AppLanguage => {
  const code = getLocales()[0]?.languageCode;
  return isSupported(code) ? code : 'vi';
};

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    en: { translation: en },
    ko: { translation: ko },
  },
  lng: deviceLanguage(),
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
});

// Ngôn ngữ người dùng đã chọn được ưu tiên hơn ngôn ngữ máy. Đọc bất đồng bộ
// nên khởi tạo bằng ngôn ngữ máy trước, có lựa chọn đã lưu thì đổi sang.
AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
  .then(stored => {
    if (isSupported(stored) && stored !== i18n.language) {
      i18n.changeLanguage(stored);
    }
  })
  .catch(() => {});

export const changeAppLanguage = async (lng: AppLanguage) => {
  await i18n.changeLanguage(lng);
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  } catch (error) {
    console.warn('Failed to save language:', error);
  }
};

export const currentLanguage = (): AppLanguage =>
  isSupported(i18n.language) ? i18n.language : 'vi';

export default i18n;
