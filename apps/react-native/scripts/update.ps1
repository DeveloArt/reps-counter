# FitCounter Update Script
# Skrypt do publikowania aktualizacji OTA

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('prod', 'preview')]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$Message
)

$ErrorActionPreference = "Stop"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "FitCounter Update Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Message: $Message" -ForegroundColor Yellow
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

# Określ kanał
$channel = if ($Environment -eq 'prod') { 'production' } else { 'testing' }

# Publikuj aktualizację
Write-Host ""
Write-Host "Publikuję aktualizację do kanału: $channel..." -ForegroundColor Green
Write-Host ""

try {
    eas update --channel $channel --message $Message --non-interactive
    
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "Aktualizacja opublikowana!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Sprawdź opublikowane aktualizacje:" -ForegroundColor Yellow
    Write-Host "  eas update:list --branch $channel" -ForegroundColor White
    Write-Host ""
    Write-Host "Użytkownicy otrzymają aktualizację przy następnym uruchomieniu aplikacji." -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host "Publikacja nie powiodła się!" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host ""
    exit 1
}
