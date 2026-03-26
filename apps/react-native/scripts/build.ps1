# FitCounter Build Script
# Skrypt do budowania aplikacji React Native

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('prod', 'preview')]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet('android', 'ios', 'all')]
    [string]$Platform,
    
    [Parameter(Mandatory=$false)]
    [string]$Message
)

$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "FitCounter Build Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Platform: $Platform" -ForegroundColor Yellow
Write-Host ""

# Sprawdź czy jesteśmy w odpowiednim katalogu
if (-not (Test-Path "app.json")) {
    Write-Host "Error: Musisz uruchomić ten skrypt z katalogu apps/react-native" -ForegroundColor Red
    exit 1
}

# Sprawdź czy EAS CLI jest zainstalowane
try {
    $easVersion = eas --version 2>&1
    Write-Host "EAS CLI version: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: EAS CLI nie jest zainstalowane. Zainstaluj: npm install -g eas-cli" -ForegroundColor Red
    exit 1
}

# Buduj aplikację
Write-Host ""
Write-Host "Rozpoczynam build..." -ForegroundColor Green
Write-Host ""

$profile = if ($Environment -eq 'prod') { 'production' } else { 'preview' }

try {
    if ($Platform -eq 'all') {
        Write-Host "Buduję dla Android i iOS..." -ForegroundColor Cyan
        eas build --platform all --profile $profile --non-interactive
    } else {
        Write-Host "Buduję dla $Platform..." -ForegroundColor Cyan
        eas build --platform $Platform --profile $profile --non-interactive
    }
    
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "Build zakończony pomyślnie!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Sprawdź status buildu:" -ForegroundColor Yellow
    Write-Host "  eas build:list" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host "Build nie powiódł się!" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Sprawdź logi:" -ForegroundColor Yellow
    Write-Host "  eas build:list" -ForegroundColor White
    Write-Host ""
    exit 1
}
