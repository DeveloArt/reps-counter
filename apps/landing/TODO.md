# TODO - Landing Page

## 1. Pliki do podziału na mniejsze komponenty

### Obecne pliki
- **`app/page.tsx`** (53 linie) - Główna strona zawierająca:
  - Nagłówek z przyciskami CTA
  - Sekcja features (3 karty)
  - Stopka
  - **Podział wymagany na:**
    - `components/Hero.tsx` - Nagłówek z przyciskami
    - `components/Features.tsx` - Sekcja features
    - `components/Footer.tsx` - Stopka

- **`app/layout.tsx`** (20 linie) - Root layout
  - Można wyodrębnić metadata do `lib/metadata.ts`

---

## 2. Komponenty - oddzielne pliki dla styli, typów i logiki

### Aktualny stan
Brak podziału - wszystkie komponenty są w jednym pliku.

### Wymagane zmiany
- Utworzyć folder `components/` z podziałem:
  - `components/Hero.tsx` - komponent
  - `components/Hero.styles.ts` - style (Tailwind classes lub CSS)
  - `components/Features.tsx` - komponent
  - `components/Features.styles.ts` - style
  - `components/Footer.tsx` - komponent
  - `components/Footer.styles.ts` - style

### Typy
- Utworzyć `types/index.ts` dla wspólnych typów (jeśli potrzebne)

---

## 3. Zadania poprawiające Performance i Developer Experience

### Performance
- [ ] **Lazy loading** - dodać `next/dynamic` dla komponentów poniżej fold
- [ ] **Image optimization** - użyć `next/image` dla obrazów (gdy będą dodane)
- [ ] **Font optimization** - użyć `next/font` zamiast zewnętrznych fontów
- [ ] **Bundle analysis** - uruchomić `@next/bundle-analyzer` i zoptymalizować importy

### Developer Experience
- [ ] **TypeScript** - dodać pełne typowanie propsów komponentów
- [ ] **ESLint/Prettier** - skonfigurować lint-staged i husky pre-commit
- [ ] **Component documentation** - dodać JSDoc comments dla komponentów
- [ ] **Storybook** - utworzyć stories dla komponentów
- [ ] **Tests** - dodać Vitest tests dla komponentów
- [ ] **Internationalization** - dodać i18n dla wielu języków

### Code Quality
- [ ] **Extract constants** - wyodrębnić stałe (colors, strings) do `lib/constants.ts`
- [ ] **Accessibility** - dodać aria-labels, proper semantic HTML
- [ ] **SEO** - rozszerzyć metadata (og:image, twitter cards)

---

## Priorytety

### High Priority
1. Podział `page.tsx` na mniejsze komponenty
2. Dodanie TypeScript typów
3. Lazy loading obrazów

### Medium Priority
1. Konfiguracja i18n
2. Rozszerzenie SEO
3. Dodanie testów

### Low Priority
1. Storybook setup
2. Pełna dokumentacja
