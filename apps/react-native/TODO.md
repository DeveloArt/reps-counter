# React Native vs PWA - Differences List

## Overview
This document outlines all the differences between the React Native app and the PWA app that need to be implemented to make them look and work identically (1:1).

## 1. Home Screen (index.tsx)
**Status: ✅ COMPLETED**

- [x] Header with greeting and streak
- [x] Daily Goal Card with circular progress
- [x] Quick Add section with exercise cards
- [x] Weekly Performance chart
- [x] Proper theming support

## 2. Stats Screen (stats.tsx)
**Status: ✅ COMPLETED**

- [x] Add navigation tabs (Week/Month/Year)
- [x] Add metric toggle (Reps/Mins)
- [x] Add key summary cards (Total Reps, Total Minutes)
- [x] Add Area Chart for daily activity (using react-native-svg)
- [x] Add Bar Chart for weekly/monthly comparison
- [x] Add percentage change indicator
- [x] Proper header with back button

## 3. Goals Screen (goals.tsx)
**Status: ✅ COMPLETED**

- [x] Add Active Goals section with progress bars
- [x] Add goal editing functionality
- [x] Add History Calendar with month navigation
- [x] Add goal filtering (all/specific)
- [x] Add "Add Goal" button
- [x] Proper goal progress calculation

## 4. Settings Screen (settings.tsx)
**Status: ✅ COMPLETED**

- [x] Add Reminders section with notifications
- [x] Add Reminder Frequency options
- [x] Add Reminder Time picker
- [x] Add Appearance section (Light/Dark/System)
- [x] Add Data Management section (Reset Data)
- [x] Add About section with app info
- [x] Proper toggle switches

## 5. Bottom Navigation
**Status: ✅ COMPLETED**

- [x] Add "+" FAB button in the center
- [x] Proper positioning (-mt-10 for center button)
- [x] Connect FAB to Quick Log Modal
- [x] Match icon styling (strokeWidth)

## 6. Modals Needed
**Status: ⏳ TODO**

### Required Modals
- [ ] QuickLogModal - Opens when "+" button is pressed
  - List of exercises to log
  - "Add new exercise" option
  
- [ ] LogEntryModal - For logging workout entries
  - Timer functionality
  - Manual entry option
  - Save workout button

- [ ] AddExerciseModal - For adding/editing exercises
  - Exercise name input
  - Color picker
  - Icon picker
  - Unit selector (reps/time)

- [ ] AddGoalModal - For adding/editing goals
  - Goal type selector (daily/weekly)
  - Exercise selector
  - Target value input
  - Metric selector

## 7. Additional Pages Needed
**Status: ⏳ TODO**

- [ ] Terms page
- [ ] Privacy page

## 8. Missing Features
**Status: ⏳ TODO**

- [ ] i18n support (translations for EN/PL)
- [ ] Streak calculation and display
- [ ] Full goal progress calculation
- [ ] Weekly/Monthly/Yearly data filtering for Stats
- [ ] Data export functionality
- [ ] Data reset functionality
- [ ] Proper error handling

## 9. Technical Debt
**Status: ⏳ TODO**

- [ ] Add proper TypeScript types to all components
- [ ] Extract reusable components (Card, Button, etc.)
- [ ] Add proper loading states
- [ ] Add empty states for lists
- [ ] Add pull-to-refresh functionality

## Implementation Priority

### Phase 1: Core Navigation ✅ DONE
1. Bottom Navigation with FAB ✅
2. Quick Log Modal (in progress)

### Phase 2: Stats Screen ⏳ IN PROGRESS
1. Stats screen overhaul
2. Add chart library
3. Proper data filtering

### Phase 3: Goals Screen ⏳ TODO
1. Goals screen overhaul
2. Add Goal Modal
3. History calendar

### Phase 4: Settings Screen ⏳ TODO
1. Settings screen overhaul
2. Theme switching
3. Language switching

### Phase 5: Polish ⏳ TODO
1. Add translations
2. Add missing modals
3. Test and fix issues

