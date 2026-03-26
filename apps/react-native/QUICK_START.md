# Quick Start - Budowanie FitCounter

## Setup (tylko raz)

```bash
# 1. Zainstaluj EAS CLI globalnie
npm install -g eas-cli

# 2. Zaloguj się
eas login

# 3. Skonfiguruj projekt
cd apps/react-native
eas build:configure

# 4. Zaktualizuj Project ID w app.json
# Zamień YOUR_PROJECT_ID na prawdziwe ID z expo.dev
```

## Budowanie aplikacji

### Wersja testowa (APK dla Android, TestFlight dla iOS)

```bash
# Android APK
npm run build:preview:android

# iOS
npm run build:preview:ios

# Obie platformy
npm run build:preview:all
```

### Wersja produkcyjna (Google Play, App Store)

```bash
# Android AAB
npm run build:prod:android

# iOS
npm run build:prod:ios

# Obie platformy
npm run build:prod:all
```

## Publikowanie aktualizacji (bez rebuildu)

### Aktualizacja testowa

```bash
npm run update:preview "Opis zmian"
```

### Aktualizacja produkcyjna

```bash
npm run update:prod "Naprawiono błąd X"
```

## Sprawdzanie statusu

```bash
# Status buildów
eas build:list

# Opublikowane aktualizacje
eas update:list --branch testing
eas update:list --branch production
```

## Typowy workflow

1. **Zbuduj wersję testową:**
   ```bash
   npm run build:preview:all
   ```

2. **Testuj i publikuj poprawki:**
   ```bash
   npm run update:preview "Poprawki po testach"
   ```

3. **Gdy gotowe, zbuduj produkcję:**
   ```bash
   npm run build:prod:all
   ```

4. **Hotfixy produkcyjne (jeśli potrzebne):**
   ```bash
   npm run update:prod "Hotfix: krytyczny błąd"
   ```

## Więcej informacji

- Szczegółowy przewodnik: `DEPLOYMENT.md`
- Build guide: `BUILD_GUIDE.md`
- Skrypty pomocnicze: `scripts/`
