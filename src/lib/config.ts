/**
 * Konfiguracja środowiska aplikacji
 * 
 * Logika:
 * - Jeśli zmienna (VITE_APP_ENV lub APP_ENV w .env) to 'production' -> https://pwa.licznikpowtorzen.pl/
 * - Jeśli zmienna to 'development' (lub cokolwiek innego niż 'production') -> lokalny adres: /app
 * - Jeśli zmiennej brak w .env -> domyślnie produkcja (https://pwa.licznikpowtorzen.pl/)
 */

const getAppEnv = (): string => {
  // Vite client env
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_ENV) {
    return import.meta.env.VITE_APP_ENV;
  }
  // Process env fallback
  if (typeof process !== 'undefined' && process.env?.APP_ENV) {
    return process.env.APP_ENV;
  }
  return '';
};

export const APP_ENV = getAppEnv();

// Domyślnie produkcja, chyba że jawnie ustawiono development
export const IS_PRODUCTION = APP_ENV ? APP_ENV === 'production' : true;

export const APP_URL = IS_PRODUCTION ? 'https://pwa.licznikpowtorzen.pl/' : '/app';
