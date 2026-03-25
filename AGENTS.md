# Repository Guidelines

## Project Structure & Module Organization
This repository is a monorepo with application targets in `apps/` and shared code in `packages/`.

- `apps/pwa` contains the main React + Vite progressive web app, including `src/`, `public/`, Vitest tests in `src/test/`, and Playwright specs in `e2e/`.
- `apps/react-native` contains the Expo / React Native mobile app with routes under `app/` and shared mobile code under `src/`.
- `apps/landing` is the marketing site.
- `apps/chrome-extension` contains the browser extension entry points and assets.
- `packages/core` holds shared business logic and data models.
- `packages/ui` holds shared UI utilities and components for web targets.

## Build, Test, and Development Commands
Install dependencies once from the repo root:

```bash
pnpm install
```

Key commands:

- `npm run dev:pwa` runs the PWA locally on port `3000`.
- `npm run dev:mobile` starts the Expo dev server for the mobile app.
- `npm run build:pwa` creates a production build for the PWA.
- `npm run build` builds all workspaces that expose a `build` script.
- `npm run test` runs workspace tests.
- `npm run test:e2e` runs Playwright end-to-end tests for `apps/pwa`.
- `npm run lint` checks the repo with Biome.
- `npm run format` formats supported files with Biome.

## Coding Style & Naming Conventions
Use TypeScript throughout the repo. Formatting is enforced by Biome: 2-space indentation, single quotes in TS/JS, semicolons enabled, trailing commas in ES5 style, and max line width `100`. Prefer `PascalCase` for React components, `camelCase` for variables/functions/hooks, and descriptive file names such as `useGoals.ts` or `QuickLogModal.tsx`.

## Testing Guidelines
PWA unit and component tests use Vitest; end-to-end coverage uses Playwright. Place unit tests near app code in `apps/pwa/src/test/` and name them `*.test.ts` or `*.test.tsx`. Place browser flows in `apps/pwa/e2e/` and keep names scenario-based, for example `pwa.spec.ts`. Run relevant tests before opening a PR.

## Commit & Pull Request Guidelines
Commit messages should follow Conventional Commits. Allowed types are defined in `commitlint.config.js`, including `feat`, `fix`, `docs`, `refactor`, `test`, and `chore`. Example: `fix(pwa): correct stats navigation`.

PRs should include:

- a short description of the change and affected app/package;
- linked issue or task reference when available;
- screenshots or recordings for UI changes in PWA, mobile, landing, or extension flows;
- notes about tests run, such as `npm run lint` or `npm run test:e2e`.

## Security & Configuration Tips
Do not commit real secrets. Use `.env.local` for local configuration and keep examples in `.env.example` or `apps/pwa/.env.example`. The PWA currently relies on browser-local storage patterns (`Dexie` / IndexedDB), so changes touching persistence should be reviewed carefully.
