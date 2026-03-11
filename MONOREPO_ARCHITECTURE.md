# Architektura Monorepo dla FitCounter

Ten dokument opisuje docelową strukturę monorepo dla projektu FitCounter, która pozwala na współdzielenie kodu pomiędzy wieloma platformami (PWA, Landing Page, Rozszerzenie Chrome, React Native).

## Dlaczego Monorepo?
Dzięki monorepo (np. z użyciem **Turborepo** lub **npm/yarn workspaces**) możemy:
1. Współdzielić logikę biznesową (np. modele bazy danych Dexie, typy TypeScript).
2. Współdzielić komponenty UI (przyciski, modale, ikony) pomiędzy PWA, Landing Page i Rozszerzeniem Chrome.
3. Utrzymywać spójność wersji zależności w całym ekosystemie.
4. Uruchamiać wszystkie aplikacje jedną komendą.

## Struktura Katalogów

```text
fitcounter-monorepo/
├── apps/
│   ├── pwa/                 # Główna aplikacja PWA (React + Vite)
│   ├── landing/             # Strona Landing Page (np. Astro, Next.js lub Vite)
│   ├── chrome-extension/    # Rozszerzenie do przeglądarki (np. Plasmo)
│   └── react-native/        # Aplikacja mobilna (Expo / React Native)
│
├── packages/
│   ├── core/                # Logika biznesowa, baza danych (Dexie), typy TS
│   ├── ui/                  # Współdzielone komponenty UI (Tailwind + Radix/Shadcn)
│   ├── eslint-config/       # Współdzielona konfiguracja lintera
│   └── tsconfig/            # Współdzielona konfiguracja TypeScript
│
├── package.json             # Główny plik zarządzający workspace'ami
├── turbo.json               # Konfiguracja Turborepo (opcjonalnie, ale zalecane)
└── README.md
```

## Opis Pakietów (Packages)

### `packages/core`
To najważniejszy pakiet. Będzie zawierał:
- Definicje typów (`Exercise`, `LogEntry`, `Goal`).
- Logikę bazy danych (instancja Dexie.js).
- Funkcje pomocnicze (np. formatowanie dat, obliczanie statystyk).
Dzięki temu aplikacja PWA, React Native i Chrome Extension będą korzystać z tej samej logiki zapisu/odczytu i tych samych typów.

### `packages/ui`
Zestaw komponentów React. Ponieważ PWA, Landing Page i Chrome Extension używają technologii webowych (React + DOM), mogą współdzielić 100% komponentów wizualnych (przyciski, karty, nawigacja). *Uwaga: React Native używa własnych prymitywów (`<View>`, `<Text>`), więc nie skorzysta z tego pakietu bezpośrednio, chyba że użyjemy biblioteki uniwersalnej (np. Tamagui).*

## Opis Aplikacji (Apps)

### `apps/pwa`
Obecna aplikacja, którą właśnie rozwijamy. Importuje `@fitcounter/core` oraz `@fitcounter/ui`. Służy jako pełnoprawny dashboard dla użytkownika.

### `apps/landing`
Strona wizytówkowa. Może być wyciągnięta do osobnego projektu (np. w Next.js dla lepszego SEO), importując jedynie komponenty z `@fitcounter/ui` dla spójnego wyglądu.

### `apps/chrome-extension`
Rozszerzenie, które pozwala na szybkie logowanie nawyków bez otwierania nowej karty. Korzysta z `@fitcounter/core` do zapisu danych. Jeśli użyjemy Plasmo, możemy łatwo integrować Reacta.

### `apps/react-native`
Natywna aplikacja mobilna (iOS/Android) zbudowana w Expo. Korzysta z `@fitcounter/core` (Dexie.js wspiera React Native poprzez odpowiednie adaptery lub możemy użyć SQLite z tym samym interfejsem).

## Jak zacząć migrację?
W środowisku lokalnym (np. VS Code) wykonaj następujące kroki:
1. Utwórz plik `package.json` w głównym folderze z polem `"workspaces": ["apps/*", "packages/*"]`.
2. Przenieś obecny kod (foldery `src`, `public`, pliki konfiguracyjne) do folderu `apps/pwa`.
3. Utwórz foldery dla pozostałych aplikacji i pakietów.
4. Zainstaluj **Turborepo** (`npx create-turbo@latest`), aby zoptymalizować proces budowania wszystkich aplikacji naraz.

*W obecnym środowisku AI Studio wygenerowałem dla Ciebie szkielet tych folderów, abyś mógł zobaczyć, jak to wygląda w praktyce.*
