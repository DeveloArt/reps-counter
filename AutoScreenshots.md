# Auto Screenshots (Detox E2E)

This project uses **Detox** to generate automated, real device screenshots for the App Store and Google Play.

## Prerequisites
- **Android:** Android Studio installed. `ANDROID_HOME` and `ANDROID_SDK_ROOT` environment variables must be configured.
- **iOS:** macOS required. Xcode installed.

## Usage

### 1. Build the App
Run this once, or whenever native dependencies change (takes a few minutes):
- **Android:** `pnpm e2e:build:android`
- **iOS:** `pnpm e2e:build:ios`

### 2. Take Screenshots
> **Important:** The Metro bundler must be running in the background! Start it in a separate terminal with: `pnpm dev:mobile`

Make sure your emulator/simulator is open and running, then run:
- **Android:** `pnpm e2e:test:android`
- **iOS:** `pnpm e2e:test:ios`

Generated `.png` screenshots will be saved in `apps/react-native/artifacts/`.
