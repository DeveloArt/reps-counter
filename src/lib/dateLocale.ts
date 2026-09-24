import { pl, enUS, es, de, fr } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import i18n from '@/i18n';

export function getDateLocale(lang?: string): Locale {
  const code = (lang || '').split('-')[0].toLowerCase();
  switch (code) {
    case 'pl':
      return pl;
    case 'es':
      return es;
    case 'de':
      return de;
    case 'fr':
      return fr;
    case 'en':
    default:
      return enUS;
  }
}

export const WEEK_DAYS_2_LETTERS: Record<string, string[]> = {
  pl: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  es: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
  de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  fr: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
};

export function getWeekDays(lang?: string): string[] {
  try {
    const list = i18n.t('common.weekDays', { returnObjects: true, lng: lang }) as string[];
    if (Array.isArray(list) && list.length === 7) {
      return list;
    }
  } catch {
    // fallback to static list
  }
  const code = (lang || i18n.language || '').split('-')[0].toLowerCase();
  return WEEK_DAYS_2_LETTERS[code] || WEEK_DAYS_2_LETTERS.en;
}

export function get2LetterDay(date: Date, lang?: string): string {
  const list = getWeekDays(lang);
  // Monday is index 0, Sunday is index 6 (getDay(): 0=Sun, 1=Mon, ..., 6=Sat)
  const index = (date.getDay() + 6) % 7;
  return list[index];
}
