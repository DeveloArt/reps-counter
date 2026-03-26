#!/bin/bash

# FitCounter Build Script
# Skrypt do budowania aplikacji React Native

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
    echo -e "${CYAN}FitCounter Build Script${NC}"
    echo -e "${CYAN}=====================================${NC}"
    echo ""
    echo "Usage: ./scripts/build.sh <environment> <platform>"
    echo ""
    echo "Arguments:"
    echo "  environment   prod | preview"
    echo "  platform      android | ios | all"
    echo ""
    echo "Examples:"
    echo "  ./scripts/build.sh prod android"
    echo "  ./scripts/build.sh preview ios"
    echo "  ./scripts/build.sh prod all"
    echo ""
    exit 1
}

# Sprawdź argumenty
if [ $# -lt 2 ]; then
    show_help
fi

ENVIRONMENT=$1
PLATFORM=$2

# Walidacja argumentów
if [[ ! "$ENVIRONMENT" =~ ^(prod|preview)$ ]]; then
    echo -e "${RED}Error: Environment musi być 'prod' lub 'preview'${NC}"
    show_help
fi

if [[ ! "$PLATFORM" =~ ^(android|ios|all)$ ]]; then
    echo -e "${RED}Error: Platform musi być 'android', 'ios' lub 'all'${NC}"
    show_help
fi

echo -e "${CYAN}=====================================${NC}"
echo -e "${CYAN}FitCounter Build Script${NC}"
echo -e "${CYAN}=====================================${NC}"
echo ""
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Platform: $PLATFORM${NC}"
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

# Określ profil
if [ "$ENVIRONMENT" = "prod" ]; then
    PROFILE="production"
else
    PROFILE="preview"
fi

# Buduj aplikację
echo ""
echo -e "${GREEN}Rozpoczynam build...${NC}"
echo ""

if [ "$PLATFORM" = "all" ]; then
    echo -e "${CYAN}Buduję dla Android i iOS...${NC}"
    eas build --platform all --profile $PROFILE --non-interactive
else
    echo -e "${CYAN}Buduję dla $PLATFORM...${NC}"
    eas build --platform $PLATFORM --profile $PROFILE --non-interactive
fi

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Build zakończony pomyślnie!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${YELLOW}Sprawdź status buildu:${NC}"
echo -e "  ${NC}eas build:list${NC}"
echo ""
