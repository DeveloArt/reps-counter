#!/bin/bash

# FitCounter Update Script
# Skrypt do publikowania aktualizacji OTA

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funkcja pomocy
show_help() {
    echo -e "${CYAN}=====================================${NC}"
    echo -e "${CYAN}FitCounter Update Script${NC}"
    echo -e "${CYAN}=====================================${NC}"
    echo ""
    echo "Usage: ./scripts/update.sh <environment> <message>"
    echo ""
    echo "Arguments:"
    echo "  environment   prod | preview"
    echo "  message       Opis zmian w aktualizacji"
    echo ""
    echo "Examples:"
    echo "  ./scripts/update.sh prod \"Naprawiono błąd w liczeniu\""
    echo "  ./scripts/update.sh preview \"Testowanie nowej funkcji\""
    echo ""
    exit 1
}

# Sprawdź argumenty
if [ $# -lt 2 ]; then
    show_help
fi

ENVIRONMENT=$1
MESSAGE=$2

# Walidacja argumentów
if [[ ! "$ENVIRONMENT" =~ ^(prod|preview)$ ]]; then
    echo -e "${RED}Error: Environment musi być 'prod' lub 'preview'${NC}"
    show_help
fi

echo -e "${CYAN}=====================================${NC}"
echo -e "${CYAN}FitCounter Update Script${NC}"
echo -e "${CYAN}=====================================${NC}"
echo ""
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Message: $MESSAGE${NC}"
echo ""

# Sprawdź czy jesteśmy w odpowiednim katalogu
if [ ! -f "app.json" ]; then
    echo -e "${RED}Error: Musisz uruchomić ten skrypt z katalogu apps/react-native${NC}"
    exit 1
fi

# Sprawdź czy EAS CLI jest zainstalowane
if ! command -v eas &> /dev/null; then
    echo -e "${RED}Error: EAS CLI nie jest zainstalowane. Zainstaluj: npm install -g eas-cli${NC}"
    exit 1
fi

EAS_VERSION=$(eas --version)
echo -e "${GREEN}EAS CLI version: $EAS_VERSION${NC}"

# Określ kanał
if [ "$ENVIRONMENT" = "prod" ]; then
    CHANNEL="production"
else
    CHANNEL="testing"
fi

# Publikuj aktualizację
echo ""
echo -e "${GREEN}Publikuję aktualizację do kanału: $CHANNEL...${NC}"
echo ""

eas update --channel $CHANNEL --message "$MESSAGE" --non-interactive

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Aktualizacja opublikowana!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${YELLOW}Sprawdź opublikowane aktualizacje:${NC}"
echo -e "  ${NC}eas update:list --branch $CHANNEL${NC}"
echo ""
echo -e "${CYAN}Użytkownicy otrzymają aktualizację przy następnym uruchomieniu aplikacji.${NC}"
echo ""
