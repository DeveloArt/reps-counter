# TODO - PWA Application

## 1. Pliki do podziału na mniejsze komponenty

### Strony (pages/) - wymagają podziału

| Plik | Linie | Zawartość | Wymagany podział |
|------|-------|-----------|------------------|
| `Home.tsx` | 453 | Header, Daily Goal Card, Quick Add, Weekly Performance | `HomeHeader.tsx`, `DailyGoalCard.tsx`, `QuickAddSection.tsx`, `WeeklyPerformance.tsx` |
| `Goals.tsx` | 455 | Active Goals, Calendar History | `GoalsList.tsx`, `GoalsCalendar.tsx`, `GoalCard.tsx` |
| `Settings.tsx` | 376 | Reminders, Appearance, Language, Data, About | `SettingsSection.tsx` (wiele sekcji), `ThemeSelector.tsx`, `LanguageSelector.tsx` |
| `Stats.tsx` | 477 | Summary Cards, Charts (Area, Bar) | `StatsSummary.tsx`, `ActivityChart.tsx`, `ComparisonChart.tsx` |
| `Privacy.tsx` | ~50 | Static content | Brak - mały |
| `Terms.tsx` | ~50 | Static content | Brak - mały |

### Komponenty (components/) - wymagają podziału

| Plik | Linie | Zawartość | Wymagany podział |
|------|-------|-----------|------------------|
| `AddExerciseModal.tsx` | 264 | Form, icons, colors, delete confirm | `ExerciseForm.tsx`, `IconPicker.tsx`, `ColorPicker.tsx` |
| `AddGoalModal.tsx` | 312 | Goal form, exercise select, metrics | `GoalForm.tsx`, `ExerciseSelect.tsx`, `MetricSelector.tsx` |
| `LogEntryModal.tsx` | 257 | Reps counter, Timer, manual entry | `RepsCounter.tsx`, `Timer.tsx`, `ManualEntry.tsx` |
| `QuickLogModal.tsx` | 83 | Exercise grid | `ExerciseGrid.tsx` |
| `Layout.tsx` | 59 | Modals management | `Layout.tsx` (ok) |
| `BottomNav.tsx` | 59 | Navigation | `BottomNav.tsx` (ok) |
| `Modal.tsx` | ~60 | Base modal | `Modal.tsx` (ok) |

---

## 2. Komponenty - oddzielne pliki dla styli, typów i logiki

### Aktualny stan
Wszystko w jednym pliku (`.tsx`) - brak podziału styli/typów/logiki.

### Wymagany wzorzec dla każdego komponentu
```
components/
  features/
    AddExerciseModal/
      index.tsx          # główny komponent
      AddExerciseModal.types.ts    # typy Props, interfaces
      AddExerciseModal.logic.ts    # hooki, helper functions
      AddExerciseModal.styles.ts   # Tailwind classes lub styled components
```

### Lista komponentów do refaktoryzacji (priorytet)

**Wysoki priorytet:**
1. `AddExerciseModal` - 264 linie, złożony form
2. `AddGoalModal` - 312 linie, wiele logiki
3. `LogEntryModal` - 257 linie, timer + counter
4. `Home` - 453 linie, wiele sekcji

**Średni priorytet:**
5. `Goals` - 455 linie, kalendarz + lista
6. `Stats` - 477 linie, wykresy
7. `Settings` - 376 linie, wiele sekcji

**Niski priorytet:**
8. `QuickLogModal` - 83 linie
9. `BottomNav` - 59 linii
10. `Modal` - 60 linii

### Typy do wyodrębnienia
- `src/types/components.ts` - typy dla komponentów (Props interfaces)
- `src/types/pages.ts` - typy dla stron

---

## 3. Zadania poprawiające Performance i Developer Experience

### Performance

- [ ] **Code splitting** - użyć `React.lazy()` dla modali i ciężkich komponentów
- [ ] **Memoization** - dodać `React.memo()`, `useMemo()`, `useCallback()` dla:
  - Listy ćwiczeń w Home
  - Elementów kalendarza w Goals
  - Danych wykresów w Stats
- [ ] **Virtual scrolling** - dodać `react-window` dla długich list (goals, exercises)
- [ ] **Debounce** - dodać debounce dla zapytań DB w Stats
- [ ] **Query optimization** - zoptymalizować Dexie queries (indeksy, pagination)
- [ ] **Bundle size** - uruchomić bundle analyzer i usunąć nieużywane importy
- [ ] **Image optimization** - kompresja obrazów statycznych

### Developer Experience

- [ ] **TypeScript** - pełne typowanie wszystkich komponentów i props
- [ ] **Custom hooks** - wyodrębnić logikę do hooks:
  - `useExercises()` - zarządzanie ćwiczeniami
  - `useGoals()` - zarządzanie celami
  - `useStats()` - obliczanie statystyk
  - `useTimer()` - logika timera
- [ ] **Context separation** - podzielić `ThemeContext` na mniejsze:
  - `ThemeContext` - tylko theme
  - `ExerciseContext` - stan ćwiczeń
  - `GoalsContext` - stan celów
- [ ] **Constants extraction** - wyodrębnić stałe do `lib/constants.ts`:
  - Colors, Icons list
  - Default values
  - Translation keys
- [ ] **Error boundaries** - dodać ErrorBoundary dla każdej strony
- [ ] **Loading states** - ujednolicić skeleton loaders
- [ ] **Testing** - dodać Vitest + React Testing Library
- [ ] **ESLint config** - rozszerzyć o custom rules

### Code Quality

- [ ] **Accessibility (WCAG)**:
  - [ ] Dodać `aria-label` do przycisków bez tekstu
  - [ ] Dodać `role` i `aria-expanded` dla modali
  - [ ] Poprawić kontrast kolorów
  - [ ] Dodać keyboard navigation
- [ ] **SEO**:
  - [ ] Dodać meta tagi dla każdej strony
  - [ ] Dodać Open Graph tags
  - [ ] Semantic HTML (header, main, nav, footer)
- [ ] **Internationalization**:
  - [ ] Wyodrębnić wszystkie hardcoded strings
  - [ ] Dodać namespace dla każdej strony
  - [ ] Pluralization dla statystyk
- [ ] **Error handling**:
  - [ ] Global error handler
  - [ ] User-friendly error messages
  - [ ] Retry logic dla DB operations

### Architecture

- [ ] **State management** - rozważyć Zustand zamiast Context dla globalnego stanu
- [ ] **API layer** - wyodrębnić warstwę DB do `lib/api/`
- [ ] **Validation** - dodać Zod dla walidacji formularzy
- [ ] **Routing** - rozważyć TanStack Query do cache'owania danych

---

## Priorytety

### High Priority (Week 1-2)
1. Podział `AddExerciseModal` - najbardziej złożony form
2. Podział `LogEntryModal` - timer logic
3. Custom hooks dla DB operations
4. Memoization dla list i wykresów

### Medium Priority (Week 3-4)
1. Podział stron (Home, Goals, Stats)
2. TypeScript pełne typowanie
3. Accessibility fixes
4. Error boundaries

### Low Priority (Week 5+)
1. Testing setup
2. i18n rozszerzenie
3. Virtual scrolling
4. Bundle optimization
