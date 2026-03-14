# FitCounter Landing Page

To jest wyodrębniony, samodzielny projekt Landing Page'a dla aplikacji FitCounter. Został przygotowany jako osobna aplikacja w architekturze monorepo.

## Technologie
- React 18
- Vite 6
- Tailwind CSS v4
- Framer Motion (animacje)
- Lucide React (ikony)

## Jak uruchomić lokalnie?

1. Przejdź do tego folderu:
   ```bash
   cd apps/landing
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```

4. Zbuduj wersję produkcyjną:
   ```bash
   npm run build
   ```

## Eksport
Możesz skopiować cały folder `apps/landing` w dowolne miejsce na swoim dysku i traktować go jako w pełni niezależny projekt webowy. Zamiast linków React Routera (`<Link>`), używa on standardowych tagów `<a>`, co ułatwia jego hostowanie na platformach takich jak Vercel, Netlify czy GitHub Pages.
