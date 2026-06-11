# RepsCounter - Rozszerzenie Chrome (Plan Wdrożenia)

## 1. Koncepcja i Działanie
Rozszerzenie Chrome dla RepsCounter to przeniesienie obecnej aplikacji PWA do formy wygodnego pop-upu (np. 400x600 px) dostępnego po kliknięciu ikony na pasku przeglądarki. 
Głównym celem jest umożliwienie użytkownikom szybkiego logowania ćwiczeń (np. podczas przerwy w pracy przy komputerze) bez konieczności otwierania nowej karty czy telefonu.

### Główne założenia:
*   **W pełni lokalne:** Rozszerzenie nie łączy się z zewnętrzną bazą danych. Dane są przechowywane lokalnie w przeglądarce.
*   **Szybki dostęp:** Kliknięcie w ikonę natychmiast otwiera ekran główny (Dashboard) z możliwością dodania logu (Quick Log).
*   **Powiadomienia:** Wykorzystanie natywnych powiadomień Chrome (`chrome.notifications` i `chrome.alarms`) do przypominania o przerwie na ćwiczenia.

## 2. Architektura i Technologie
*   **Manifest V3:** Wymagany standard dla nowych rozszerzeń Chrome.
*   **Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion (ten sam stack co obecnie).
*   **Routing:** Zmiana z `BrowserRouter` na `MemoryRouter` lub `HashRouter` (wymóg rozszerzeń).
*   **Storage:** 
    *   Dexie.js (IndexedDB) działa poprawnie w kontekście rozszerzeń Chrome (w popupie i background workerze).
    *   Alternatywnie: synchronizacja stanu z `chrome.storage.local`.

## 3. Plan Wdrożenia (Krok po Kroku)

### Etap 1: Konfiguracja Projektu i Builda
*   [ ] **Dodanie `manifest.json`:** Utworzenie pliku manifestu w folderze `public/` z odpowiednimi uprawnieniami (`storage`, `alarms`, `notifications`).
*   [ ] **Konfiguracja Vite:** Dostosowanie `vite.config.ts` do budowania rozszerzenia.
    *   Wyłączenie hashowania nazw plików (lub użycie pluginu np. `@crxjs/vite-plugin`).
    *   Ustawienie punktów wejścia (entry points) dla `popup.html`, `options.html` (opcjonalnie) oraz `background.ts` (Service Worker).
*   [ ] **Dostosowanie Routingu:** Zamiana `BrowserRouter` na `MemoryRouter` w głównym pliku aplikacji (rozszerzenia nie mają paska adresu, więc `BrowserRouter` powoduje błędy).

### Etap 2: Dostosowanie Interfejsu (UI/UX)
*   [ ] **Wymiary Pop-upu:** Ustawienie sztywnej szerokości i wysokości dla tagu `<body>` w `popup.html` (np. `width: 400px; height: 600px;`).
*   [ ] **Nawigacja:** Uproszczenie dolnego paska nawigacji (BottomNav), aby dobrze wyglądał na małej, stałej przestrzeni.
*   [ ] **Responsywność Modali:** Upewnienie się, że modale (np. dodawanie ćwiczenia, szybki log) nie wychodzą poza obszar 400x600 px i mają odpowiedni scroll.

### Etap 3: Pamięć i Baza Danych (Dexie.js)
*   [ ] **Weryfikacja IndexedDB:** Upewnienie się, że Dexie.js poprawnie inicjalizuje się w kontekście pop-upu rozszerzenia.
*   [ ] **Eksport/Import:** Utrzymanie funkcji eksportu i importu bazy danych, aby użytkownik mógł przenieść dane z wersji webowej do rozszerzenia.

### Etap 4: Funkcje Natywne Chrome (Service Worker)
*   [ ] **Background Script (`background.ts`):** Utworzenie Service Workera do obsługi zadań w tle.
*   [ ] **Powiadomienia (Alarms):** Zastąpienie obecnego systemu powiadomień webowych (jeśli istnieje) systemem `chrome.alarms`.
    *   Użytkownik ustawia w opcjach przypomnienie (np. co 1 godzinę).
    *   Service Worker nasłuchuje alarmu i wywołuje `chrome.notifications.create`.
*   [ ] **Akcja z Powiadomienia:** Kliknięcie w powiadomienie powinno otwierać popup rozszerzenia lub nową kartę z aplikacją.

### Etap 5: Testowanie i Publikacja
*   [ ] **Testowanie lokalne:** Załadowanie rozpakowanego rozszerzenia (Load unpacked) w `chrome://extensions/`.
*   [ ] **Testy wydajnościowe:** Sprawdzenie, czy animacje (Framer Motion) działają płynnie w popupie.
*   [ ] **Przygotowanie paczki:** Zbudowanie wersji produkcyjnej (`npm run build`) i spakowanie do pliku `.zip`.
*   [ ] **Chrome Web Store:** Przygotowanie grafik, opisów i polityki prywatności do publikacji w sklepie.
