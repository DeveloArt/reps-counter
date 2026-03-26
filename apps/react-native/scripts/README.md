# Build & Update Scripts

Skrypty pomocnicze do budowania i publikowania aplikacji FitCounter.

## Dostępne skrypty

### build.ps1 / build.sh
Skrypt do budowania aplikacji dla Android i iOS.

**Windows (PowerShell):**
```powershell
.\scripts\build.ps1 -Environment <prod|preview> -Platform <android|ios|all>
```

**Linux/Mac (Bash):**
```bash
./scripts/build.sh <prod|preview> <android|ios|all>
```

**Przykłady:**
```powershell
# Build produkcyjny dla Android
.\scripts\build.ps1 -Environment prod -Platform android

# Build testowy dla iOS
.\scripts\build.ps1 -Environment preview -Platform ios

# Build produkcyjny dla obu platform
.\scripts\build.ps1 -Environment prod -Platform all
```

### update.ps1 / update.sh
Skrypt do publikowania aktualizacji OTA (Over-The-Air).

**Windows (PowerShell):**
```powershell
.\scripts\update.ps1 -Environment <prod|preview> -Message "Opis zmian"
```

**Linux/Mac (Bash):**
```bash
./scripts/update.sh <prod|preview> "Opis zmian"
```

**Przykłady:**
```powershell
# Aktualizacja produkcyjna
.\scripts\update.ps1 -Environment prod -Message "Naprawiono błąd w liczeniu powtórzeń"

# Aktualizacja testowa
.\scripts\update.ps1 -Environment preview -Message "Testowanie nowej funkcji"
```

## Pierwsze uruchomienie (Linux/Mac)

Nadaj uprawnienia wykonywania skryptom bash:
```bash
chmod +x scripts/*.sh
```

## Parametry

### Environment
- `prod` - Środowisko produkcyjne (kanał: production)
- `preview` - Środowisko testowe (kanał: testing)

### Platform (tylko build)
- `android` - Buduj tylko dla Android
- `ios` - Buduj tylko dla iOS
- `all` - Buduj dla obu platform

### Message (tylko update)
Opis zmian w aktualizacji. Powinien być opisowy i zrozumiały.

## Wymagania

- EAS CLI zainstalowane globalnie: `npm install -g eas-cli`
- Zalogowanie do Expo: `eas login`
- Skonfigurowany projekt: `eas build:configure`

## Alternatywa - NPM Scripts

Możesz też używać skryptów npm bezpośrednio:

```bash
# Build
npm run build:prod:android
npm run build:preview:ios
npm run build:prod:all

# Update
npm run update:prod "Opis zmian"
npm run update:preview "Opis zmian"
```

## Więcej informacji

Zobacz:
- `../QUICK_START.md` - Szybki start
- `../BUILD_GUIDE.md` - Szczegółowy przewodnik budowania
- `../DEPLOYMENT.md` - Pełna dokumentacja deploymentu
