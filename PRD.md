# FitCounter - Product Requirements Document (PRD)

## 1. Cel Projektu (Wizja)
FitCounter to prosta, szybka i w 100% prywatna aplikacja (PWA - Progressive Web App) do śledzenia codziennej aktywności fizycznej. Aplikacja jest zaprojektowana w architekturze "local-first", co oznacza, że wszystkie dane są przechowywane wyłącznie na urządzeniu użytkownika. Nie wymaga logowania, połączenia z internetem ani zewnętrznej bazy danych.

## 2. Grupa Docelowa
Osoby pracujące przy biurku, sportowcy amatorzy oraz każdy, kto chce w szybki sposób (1-2 kliknięcia) zanotować wykonanie serii ćwiczeń (np. pompki, przysiady, deska) w ciągu dnia, bez konieczności uruchamiania skomplikowanych aplikacji treningowych.

## 3. Główne Funkcjonalności (Core Features)

### 3.1. Zarządzanie Ćwiczeniami
*   **Domyślne ćwiczenia:** Aplikacja startuje z predefiniowaną listą (np. Pompki, Przysiady, Deska).
*   **Dodawanie/Edycja:** Użytkownik może tworzyć własne ćwiczenia.
*   **Atrybuty ćwiczenia:** Nazwa, jednostka (powtórzenia lub sekundy), kolor (do wykresów), ikona.
*   **Archiwizacja:** Zamiast trwałego usuwania (co zepsułoby historię), ćwiczenia są archiwizowane (ukrywane z głównego widoku).

### 3.2. Szybkie Logowanie (Quick Log)
*   Możliwość dodania wpisu z poziomu ekranu głównego za pomocą jednego kliknięcia.
*   Wybór konkretnego ćwiczenia, wpisanie wartości (np. 20 powtórzeń) i zapisanie z aktualną datą i godziną.

### 3.3. Ekran Główny (Dashboard)
*   Podsumowanie dzisiejszego dnia (łączna liczba powtórzeń, łączny czas).
*   Wizualizacja postępów w obecnym tygodniu (wykres słupkowy).
*   Siatka szybkiego dostępu do aktywnych ćwiczeń.

### 3.4. Cele (Goals)
*   Użytkownik może ustawić dzienne lub tygodniowe cele dla konkretnych ćwiczeń (np. 100 pompek dziennie).
*   Śledzenie postępu realizacji celu (progress bar).

### 3.5. Statystyki i Historia
*   Przeglądanie historii logów z podziałem na dni.
*   Agregacja danych (tygodniowa, miesięczna).

### 3.6. Ustawienia
*   Personalizacja motywu (Jasny / Ciemny / Systemowy).
*   Zarządzanie powiadomieniami (przypomnienia o ćwiczeniach).
*   Eksport/Import danych (backup lokalnej bazy).

## 4. Architektura Techniczna
*   **Frontend:** React 18, TypeScript, Vite.
*   **Styling:** Tailwind CSS.
*   **Animacje:** Framer Motion.
*   **Baza Danych:** Dexie.js (wrapper na IndexedDB - działa w pełni lokalnie w przeglądarce).
*   **Ikony:** Lucide React.
*   **Routing:** React Router DOM.
*   **Internacjonalizacja (i18n):** react-i18next (wsparcie dla wielu języków).

## 5. Przepływ Użytkownika (User Flow)
1.  **Wejście:** Użytkownik otwiera aplikację (brak ekranu logowania).
2.  **Akcja główna:** Klika w wybrane ćwiczenie na ekranie głównym -> wpisuje wynik -> zapisuje.
3.  **Analiza:** Przechodzi do zakładki "Statystyki", aby sprawdzić swój postęp w danym tygodniu.
4.  **Zarządzanie:** Przechodzi do "Ustawień" lub modali edycji, aby dodać nowe ćwiczenie (np. "Podciągania").
