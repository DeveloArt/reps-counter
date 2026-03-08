# Product Requirements Document (PRD) - FitCounter

## 1. Executive Summary

**FitCounter** is a minimalist, offline-first fitness tracking application designed to help users build lasting workout habits through friction-less logging and visual feedback. Unlike complex fitness apps that require detailed workout planning, FitCounter focuses on the *micro-actions* of fitness—logging a set of pushups, a minute of planking, or a quick run—making it effortless to track progress throughout the day.

The application is built on the principles of behavioral psychology, specifically leveraging concepts from *Atomic Habits* by James Clear and *Tiny Habits* by BJ Fogg, to reduce the cognitive load of tracking and reinforce positive behavior loops.

---

## 2. Core Philosophy & Behavioral Science Alignment

### 2.1. Alignment with *Atomic Habits* (James Clear)

*   **Make it Obvious (Cue):**
    *   **Visual Dashboard:** The home screen immediately shows active exercises with distinct colors and icons, serving as visual triggers.
    *   **Daily Goal:** A prominent progress ring at the top of the dashboard makes the daily target undeniable.
*   **Make it Easy (Response):**
    *   **Quick Add:** The interface is designed for speed. Users can log a set in 2 clicks.
    *   **Friction Reduction:** No account creation required. The app works offline immediately.
    *   **Input Flexibility:** Users can tap "+" buttons for quick increments or type specific numbers, accommodating different contexts.
*   **Make it Satisfying (Reward):**
    *   **Streak Counter:** A prominent "Days Streak" indicator provides immediate gratification and a cost to missing a day (loss aversion).
    *   **Visual Progress:** Graphs fill up, and daily totals update instantly, providing immediate feedback on effort.
    *   **Weekly Performance:** Seeing the bars grow over the week reinforces the identity of someone who "doesn't miss workouts."

### 2.2. Alignment with *Tiny Habits* (BJ Fogg)

*   **Micro-Behaviors:** The app encourages tracking small units (e.g., "10 pushups" or "30 seconds plank") rather than requiring full "workout sessions." This lowers the barrier to entry.
*   **Celebration:** The visual feedback (green indicators, progress bars filling) acts as a digital "shine" or celebration, wiring the habit into the brain.
*   **Ability:** By keeping the interface simple and removing network dependencies, the "Ability" factor (ease of doing) is maximized, making the behavior more likely to occur even when motivation is low.

---

## 3. User Experience (UX) & Features

### 3.1. Dashboard (Home)
*   **Streak & Daily Goal:** A header displaying the current streak and a circular progress indicator for the day's primary goal (Reps or Time).
*   **Weekly Performance Graph:** A dynamic bar chart showing activity over the last 7 days. Users can toggle between "Reps" and "Mins" to visualize different metrics.
*   **Quick Add Grid:** A grid of exercise cards.
    *   **Status Indicators:** Cards show today's total volume (e.g., "150" reps or "15m") directly on the face.
    *   **Interaction:** Tapping a card opens the logging modal.

### 3.2. Logging System
*   **Modal Interface:** Focused overlay for data entry.
*   **Dual Input Methods:**
    *   **Stepper:** +/- buttons for quick, standard adjustments.
    *   **Direct Entry:** Numeric keyboard input for precise values.
*   **Timer Mode:** For time-based exercises (e.g., Plank), the input adapts to handle minutes/seconds.
*   **Context:** Optional "Notes" field for recording weight used or subjective feeling (RPE).

### 3.3. Statistics & Analytics
*   **Timeframes:** View data by Week, Month, or Year.
*   **Metrics:**
    *   **Total Volume:** Aggregate reps and time.
    *   **Consistency:** Average time per day.
    *   **Trends:** Comparison vs. previous periods (e.g., "+15% vs last week").
*   **Visualizations:**
    *   **Area Chart:** Daily activity trends.
    *   **Bar Chart:** Period-over-period comparison.
*   **Breakdown:** Top exercises sorted by volume.

### 3.4. Goal Setting
*   **Custom Goals:** Users can define goals based on:
    *   **Frequency:** Daily, Weekly.
    *   **Metric:** Total Reps, Total Time, or Number of Workouts.
    *   **Scope:** Global (all exercises) or Specific (e.g., "100 Pushups Daily").
*   **Tracking:** Dedicated "Goals" tab to monitor active vs. completed objectives.

### 3.5. Settings & Customization
*   **Theme Engine:** Full support for Light, Dark, and System themes.
*   **Localization:** Complete support for English (EN) and Polish (PL).
*   **Data Sovereignty:**
    *   **Offline Storage:** All data stored in IndexedDB (via Dexie.js).
    *   **Privacy:** No data leaves the device.
    *   **Management:** Options to reset/wipe data.
*   **Reminders:** Configurable daily notifications to prompt habit formation.

---

## 4. Technical Architecture

### 4.1. Stack
*   **Frontend Framework:** React 18 (TypeScript).
*   **Build Tool:** Vite.
*   **Styling:** Tailwind CSS (Utility-first).
*   **Database:** Dexie.js (Wrapper for IndexedDB) - Ensures offline persistence and high performance.
*   **Animation:** Framer Motion - Provides fluid transitions (critical for "Satisfying" feedback).
*   **Charts:** Recharts - Responsive, composable data visualization.
*   **Routing:** React Router DOM.
*   **Internationalization:** i18next / react-i18next.

### 4.2. Data Model
*   **Exercises:** `id`, `name`, `unit` (reps/seconds), `color`, `icon`.
*   **Logs:** `id`, `exerciseId`, `date`, `value`, `timestamp`, `notes`.
*   **Goals:** `id`, `type`, `targetValue`, `metric`, `startDate`, `isActive`.
*   **Settings:** `theme`, `dailyGoalReps`, `dailyGoalTime`, `language`.

### 4.3. Key Technical Decisions
*   **Timestamp-based Logic:** All date filtering and aggregation uses Unix timestamps to prevent timezone issues and ensure accurate "streak" calculation across day boundaries.
*   **Context API:** Used for global Theme management to prevent flash-of-unstyled-content (FOUC) or theme flickering.
*   **PWA Ready:** Structure supports Service Workers and Manifest for installability (add to home screen).

---

## 5. Future Roadmap (Potential)
*   **Gamification V2:** Badges/Achievements for milestones (e.g., "10k Rep Club").
*   **Export/Import:** JSON/CSV export for data backup (partially implemented in UI).
*   **Custom Icons:** User-uploaded icons for exercises.
*   **Rest Timer:** Built-in countdown timer between sets.
