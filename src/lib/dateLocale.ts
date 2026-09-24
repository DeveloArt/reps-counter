import { pl, enUS, es, de, fr } from 'date-fns/locale';
import type { Locale } from 'date-fns';

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
