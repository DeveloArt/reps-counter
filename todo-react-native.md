# FitCounter - React Native (Expo) - Plan Migracji

## 1. Koncepcja i Działanie
Celem jest przepisanie obecnej aplikacji webowej (React, Vite, Tailwind) na natywną aplikację mobilną dla systemów iOS i Android przy użyciu frameworka React Native oraz Expo.
Aplikacja mobilna zachowa 100% obecnej funkcjonalności (local-first, brak logowania, szybkie dodawanie logów, statystyki), ale zyska dostęp do natywnych funkcji telefonu (haptyka, powiadomienia push, widgety).

### Główne założenia:
*   **Natywne Doświadczenie (Native Feel):** Płynne animacje (60fps), natywne modale, obsługa gestów (swipe-to-delete, pull-to-refresh).
*   **Baza Danych:** Zastąpienie Dexie.js (IndexedDB) natywną bazą danych SQLite (`expo-sqlite`) lub WatermelonDB, aby zapewnić wydajność i trwałość danych na urządzeniu.
*   **Styling:** Zastąpienie Tailwind CSS biblioteką NativeWind (Tailwind dla React Native) lub standardowym `StyleSheet`.

## 2. Architektura i Technologie
*   **Framework:** React Native + Expo (Managed Workflow).
*   **Język:** TypeScript.
*   **Nawigacja:** React Navigation (Bottom Tabs, Stack Navigator).
*   **Baza Danych:** `expo-sqlite` (z ORM np. Drizzle) lub `@nozbe/watermelondb`.
*   **Styling:** NativeWind (pozwala na używanie klas Tailwind w React Native).
*   **Animacje:** React Native Reanimated (zamiast Framer Motion).
*   **Ikony:** `lucide-react-native` (zamiast `lucide-react`).
*   **Internacjonalizacja:** `i18next` + `expo-localization`.

## 3. Plan Wdrożenia (Krok po Kroku)

### Etap 1: Inicjalizacja Projektu i Konfiguracja
*   [ ] **Utworzenie Projektu:** `npx create-expo-app FitCounter -t expo-template-blank-typescript`.
*   [ ] **Instalacja Zależności:** React Navigation, NativeWind, Reanimated, Lucide-React-Native, Expo SQLite, date-fns, i18next.
*   [ ] **Konfiguracja NativeWind:** Skonfigurowanie `tailwind.config.js` oraz Babel pluginu dla NativeWind.
*   [ ] **Struktura Katalogów:** Odtworzenie struktury z wersji webowej (`src/components`, `src/screens`, `src/db`, `src/utils`).

### Etap 2: Migracja Bazy Danych (Local Storage)
*   [ ] **Zastąpienie Dexie.js:** IndexedDB nie działa natywnie w React Native. Należy zaimplementować warstwę abstrakcji bazy danych.
    *   **Opcja A (Zalecana):** Użycie `expo-sqlite` z Drizzle ORM.
    *   **Opcja B:** WatermelonDB (świetne do aplikacji offline-first).
*   [ ] **Odtworzenie Schematu:** Utworzenie tabel: `exercises`, `logs`, `goals`, `settings`.
*   [ ] **Migracja Logiki:** Przepisanie zapytań (CRUD) z Dexie na SQL/ORM.
*   [ ] **Hooki Danych:** Utworzenie własnych hooków (np. `useLiveQuery` odpowiednik) do reaktywnego odświeżania UI po zmianie danych w bazie.

### Etap 3: Nawigacja i Routing
*   [ ] **Zastąpienie React Router:** Implementacja `@react-navigation/native`.
*   [ ] **Bottom Tab Navigator:** Utworzenie dolnego paska nawigacji (Home, Stats, Goals, Settings).
*   [ ] **Stack Navigator:** Obsługa ekranów szczegółowych i modali (np. AddExerciseModal, QuickLogModal jako ekrany typu "modal" lub "bottom sheet").

### Etap 4: Przepisanie Interfejsu (UI)
*   [ ] **Zamiana Tagów HTML:** Zastąpienie `<div>` -> `<View>`, `<span>`/`<p>` -> `<Text>`, `<button>` -> `<TouchableOpacity>` lub `<Pressable>`.
*   [ ] **Dostosowanie Klas Tailwind:** Aplikacja klas z NativeWind (np. `className="flex-1 bg-background p-4"`).
*   [ ] **Komponenty Bazowe:** Przepisanie przycisków, kart, modali (użycie `@gorhom/bottom-sheet` dla lepszego UX).
*   [ ] **Wykresy:** Zastąpienie Recharts biblioteką natywną (np. `react-native-chart-kit` lub `react-native-gifted-charts`).

### Etap 5: Animacje i Ikony
*   [ ] **Framer Motion -> Reanimated:** Przepisanie animacji wejścia/wyjścia, przejść między ekranami oraz interakcji przycisków (np. `whileTap` -> `useAnimatedStyle`).
*   [ ] **Ikony:** Zmiana importów z `lucide-react` na `lucide-react-native`.

### Etap 6: Funkcje Natywne (Expo)
*   [ ] **Haptyka (Wibracje):** Dodanie `expo-haptics` przy dodawaniu logu (Quick Log), usuwaniu ćwiczenia czy osiągnięciu celu.
*   [ ] **Powiadomienia Lokalne:** Użycie `expo-notifications` do planowania przypomnień o ćwiczeniach (zastąpienie webowych powiadomień).
*   [ ] **Widgety (Opcjonalnie):** W przyszłości dodanie widgetów na ekran główny iOS/Android (wymaga pisania kodu natywnego lub pluginów Expo).

### Etap 7: Testowanie i Budowanie
*   [ ] **Testy na Urządzeniach:** Uruchomienie aplikacji na fizycznych urządzeniach iOS i Android przez aplikację Expo Go (lub Development Build).
*   [ ] **Optymalizacja Wydajności:** Sprawdzenie renderowania list (użycie `FlashList` z `@shopify/flash-list` zamiast standardowego `FlatList` dla historii logów).
*   [ ] **EAS Build:** Zbudowanie paczek produkcyjnych (`.apk`/`.aab` dla Androida, `.ipa` dla iOS) za pomocą Expo Application Services (EAS).
*   [ ] **Publikacja:** Przygotowanie do publikacji w App Store i Google Play.
