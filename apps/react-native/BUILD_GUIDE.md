# FitCounter - Build & Deployment Guide

## Wymagania wstępne

1. **Zainstaluj EAS CLI globalnie:**
   ```bash
   npm install -g eas-cli
   ```

2. **Zaloguj się do Expo:**
   ```bash
   eas login
   ```

3. **Skonfiguruj projekt (tylko przy pierwszym uruchomieniu):**
   ```bash
   cd apps/react-native
   eas build:configure
   ```

4. **Zaktualizuj Project ID:**
   - Po wykonaniu `eas build:configure` otrzymasz Project ID
   - Zaktualizuj `YOUR_PROJECT_ID` w pliku `app.json` w sekcji `extra.eas.projectId`

## Channels (Kanały)

Aplikacja używa dwóch kanałów do dystrybucji aktualizacji:

- **production** - Wersja produkcyjna dla użytkowników końcowych
- **testing** - Wersja testowa dla QA i wewnętrznych testów

## Budowanie aplikacji

### Wersja produkcyjna (Production)

**Android (AAB dla Google Play):**
```bash
npm run build:prod:android
```

**iOS (dla App Store):**
```bash
npm run build:prod:ios
```

**Obie platformy jednocześnie:**
```bash
npm run build:prod:all
```

### Wersja testowa (Preview)

**Android (APK do bezpośredniej instalacji):**
```bash
npm run build:preview:android
```

**iOS (dla TestFlight):**
```bash
npm run build:preview:ios
```

**Obie platformy jednocześnie:**
```bash
npm run build:preview:all
```

## Publikowanie aktualizacji OTA (Over-The-Air)

Po zbudowaniu aplikacji, możesz wysyłać szybkie aktualizacje bez przebudowywania całej aplikacji:

### Aktualizacja produkcyjna:
```bash
npm run update:prod "Opis zmian"
```

Przykład:
```bash
npm run update:prod "Naprawiono błąd w liczeniu powtórzeń"
```

### Aktualizacja testowa:
```bash
npm run update:preview "Opis zmian"
```

Przykład:
```bash
npm run update:preview "Testowanie nowej funkcji statystyk"
```

## Workflow budowania i deploymentu

### Pierwszy deployment:

1. **Zbuduj aplikację produkcyjną:**
   ```bash
   npm run build:prod:all
   ```

2. **Poczekaj na zakończenie buildu** (otrzymasz link do pobrania)

3. **Opublikuj w sklepach:**
   - Android: Wgraj AAB do Google Play Console
   - iOS: Build automatycznie trafi do App Store Connect

### Kolejne aktualizacje:

**Dla małych zmian (JS/React):**
```bash
npm run update:prod "Opis zmian"
```

**Dla zmian natywnych (zmiany w native code, nowe biblioteki):**
```bash
npm run build:prod:all
```

## Testowanie przed produkcją:

1. **Zbuduj wersję preview:**
   ```bash
   npm run build:preview:all
   ```

2. **Testuj na urządzeniach testowych**

3. **Wyślij aktualizacje testowe w razie potrzeby:**
   ```bash
   npm run update:preview "Poprawki po testach"
   ```

4. **Po zatwierdzeniu, zbuduj produkcję:**
   ```bash
   npm run build:prod:all
   ```

## Sprawdzanie statusu buildów

```bash
eas build:list
```

## Sprawdzanie opublikowanych aktualizacji

```bash
eas update:list --branch production
eas update:list --branch testing
```

## Ważne uwagi

- **Runtime Version**: Aplikacja używa `appVersion` jako runtime version. Zmiana wersji w `app.json` wymaga nowego buildu.
- **Channels**: Każdy build jest przypisany do kanału (production/testing). Aktualizacje OTA trafiają tylko do aplikacji z tego samego kanału.
- **Limity**: Darmowy plan Expo ma limity buildów miesięcznie. Sprawdź swój plan na expo.dev
- **Certyfikaty**: EAS automatycznie zarządza certyfikatami dla iOS i Android

## Troubleshooting

### Build fails:
```bash
eas build:list
# Sprawdź logi buildu który się nie powiódł
```

### Aktualizacja nie dociera do użytkowników:
- Sprawdź czy runtime version się zgadza
- Sprawdź czy kanał jest poprawny
- Użytkownicy muszą zrestartować aplikację aby pobrać aktualizację

### Problemy z certyfikatami iOS:
```bash
eas credentials
```
