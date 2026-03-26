# Proces Deployment - FitCounter

## Przegląd

Aplikacja wykorzystuje **dwa środowiska**:
- **Testing** - dla testerów, z OTA updates przez expo-updates
- **Production** - finalna wersja publikowana do App Store i Google Play

## Wymagania wstępne

1. Zainstaluj EAS CLI:
```bash
npm install -g eas-cli
```

2. Zaloguj się do Expo:
```bash
eas login
```

3. Skonfiguruj projekt (tylko raz):
```bash
cd apps/react-native
eas build:configure
```

4. Zaktualizuj `app.json` - zamień `YOUR_PROJECT_ID` na prawdziwe ID projektu z Expo:
   - Znajdź swoje Project ID na: https://expo.dev/accounts/[your-account]/projects/fitcounter
   - Zaktualizuj pole `updates.url` w `app.json`

## Instalacja zależności

```bash
cd apps/react-native
npm install
```

## Workflow

### 1. Pierwszy Build - Wersja Testowa

Zbuduj aplikację dla testerów (iOS i Android):

```bash
# iOS - build testowy
eas build --profile preview --platform ios

# Android - build testowy (APK)
eas build --profile preview --platform android
```

Po zakończeniu buildu:
- **iOS**: Pobierz plik `.ipa` i zainstaluj przez TestFlight lub Ad-Hoc
- **Android**: Pobierz plik `.apk` i wyślij testerom (mogą zainstalować bezpośrednio)

### 2. Publikowanie zmian dla testerów (OTA Updates)

Gdy wprowadzasz zmiany w kodzie i chcesz je wysłać do testerów **bez nowego buildu**:

```bash
# Publikuj update na kanał testing
eas update --branch testing --message "Opis zmian"
```

Testerzy otrzymają aktualizację **automatycznie** przy następnym uruchomieniu aplikacji.

### 3. Testowanie i weryfikacja

Testerzy testują aplikację z najnowszymi zmianami. Możesz publikować kolejne updates:

```bash
eas update --branch testing --message "Poprawki błędów"
eas update --branch testing --message "Nowa funkcja X"
```

### 4. Build produkcyjny

Gdy testerzy potwierdzą, że wszystko działa:

```bash
# iOS - build produkcyjny
eas build --profile production --platform ios

# Android - build produkcyjny (AAB dla Google Play)
eas build --profile production --platform android
```

### 5. Publikacja do sklepów

#### iOS - App Store

1. Pobierz plik `.ipa` z EAS Build
2. Prześlij do App Store Connect przez:
   - Transporter (aplikacja Apple)
   - lub bezpośrednio przez EAS Submit:
   ```bash
   eas submit --platform ios
   ```

#### Android - Google Play

1. Pobierz plik `.aab` z EAS Build
2. Prześlij do Google Play Console:
   ```bash
   eas submit --platform android
   ```

### 6. Updates produkcyjne (opcjonalnie)

Jeśli chcesz wysłać hotfix do wersji produkcyjnej **bez nowego buildu**:

```bash
eas update --branch production --message "Hotfix: poprawka krytycznego błędu"
```

## Kanały i Profile

### Profile Build (eas.json)

- **development**: Dla lokalnego developmentu z dev-client
- **preview**: Dla testerów (internal distribution)
  - iOS: Ad-Hoc lub TestFlight
  - Android: APK
  - Kanał: `testing`
- **production**: Dla sklepów
  - iOS: App Store
  - Android: Google Play (AAB)
  - Kanał: `production`

### Kanały Update

- **testing**: Dla testerów (preview builds)
- **production**: Dla użytkowników końcowych (production builds)

## Skrypty NPM (Szybkie komendy)

### Budowanie aplikacji

**Produkcja:**
```bash
npm run build:prod:android      # Build Android (AAB)
npm run build:prod:ios          # Build iOS
npm run build:prod:all          # Build obie platformy
```

**Preview/Testing:**
```bash
npm run build:preview:android   # Build Android (APK)
npm run build:preview:ios       # Build iOS
npm run build:preview:all       # Build obie platformy
```

### Publikowanie aktualizacji OTA

**Produkcja:**
```bash
npm run update:prod "Opis zmian"
```

**Preview/Testing:**
```bash
npm run update:preview "Opis zmian"
```

## Skrypty pomocnicze (PowerShell/Bash)

W katalogu `scripts/` znajdują się skrypty do łatwiejszego zarządzania buildami:

### Windows (PowerShell)

**Build:**
```powershell
.\scripts\build.ps1 -Environment prod -Platform android
.\scripts\build.ps1 -Environment preview -Platform ios
.\scripts\build.ps1 -Environment prod -Platform all
```

**Update:**
```powershell
.\scripts\update.ps1 -Environment prod -Message "Opis zmian"
.\scripts\update.ps1 -Environment preview -Message "Testowanie"
```

### Linux/Mac (Bash)

**Build:**
```bash
chmod +x scripts/*.sh  # Tylko raz, aby nadać uprawnienia
./scripts/build.sh prod android
./scripts/build.sh preview ios
./scripts/build.sh prod all
```

**Update:**
```bash
./scripts/update.sh prod "Opis zmian"
./scripts/update.sh preview "Testowanie"
```

## Komendy pomocnicze EAS CLI

### Sprawdź status buildów
```bash
eas build:list
```

### Sprawdź opublikowane updates
```bash
eas update:list --branch testing
eas update:list --branch production
```

### Zobacz szczegóły projektu
```bash
eas project:info
```

### Cofnij update (rollback)
```bash
eas update:republish --branch testing --group [group-id]
```

## Zarządzanie wersjami

### Kiedy zwiększać wersję?

1. **Patch (1.0.0 → 1.0.1)**: Małe poprawki, hotfixy
   - Możesz użyć OTA update zamiast nowego buildu

2. **Minor (1.0.0 → 1.1.0)**: Nowe funkcje
   - Możesz użyć OTA update jeśli nie ma zmian natywnych

3. **Major (1.0.0 → 2.0.0)**: Duże zmiany, breaking changes
   - Wymagany nowy build

### Kiedy wymagany jest nowy build?

Nowy build jest **wymagany** gdy:
- Zmieniasz natywny kod (iOS/Android)
- Dodajesz/usuwasz natywne moduły
- Zmieniasz konfigurację w `app.json` (np. permissions)
- Zmieniasz `runtimeVersion`

W innych przypadkach możesz użyć **OTA update**.

## Troubleshooting

### Update się nie pojawia

1. Sprawdź czy build ma poprawny kanał:
```bash
eas build:list
```

2. Sprawdź czy update został opublikowany:
```bash
eas update:list --branch testing
```

3. Wymuś sprawdzenie update w aplikacji (restart)

### Build się nie udaje

1. Sprawdź logi:
```bash
eas build:view [build-id]
```

2. Upewnij się że wszystkie zależności są zainstalowane
3. Sprawdź czy credentials są poprawne

### Różne wersje dla iOS i Android

Możesz budować platformy osobno:
```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

## Najlepsze praktyki

1. **Zawsze testuj na kanale testing przed production**
2. **Używaj opisowych wiadomości w updates**: `--message "Fix: problem z logowaniem"`
3. **Monitoruj updates**: Sprawdzaj czy testerzy otrzymują aktualizacje
4. **Dokumentuj zmiany**: Prowadź changelog dla każdego update
5. **Testuj na prawdziwych urządzeniach**: Emulatory mogą nie wykryć wszystkich problemów
6. **Backup**: Zachowaj poprzednie buildy na wypadek rollbacku

## Linki

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Expo Dashboard](https://expo.dev/)
