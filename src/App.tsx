/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import LandingPage from '@/pages/Landing';
import HomePage from '@/pages/Home';
import StatsPage from '@/pages/Stats';
import GoalsPage from '@/pages/Goals';
import SettingsPage from '@/pages/Settings';
import TermsPage from '@/pages/Terms';
import PrivacyPage from '@/pages/Privacy';
import { ThemeProvider } from '@/context/ThemeContext';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';
import './i18n';

function AppContent() {
  useNotificationScheduler();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="add" element={<HomePage />} /> {/* Placeholder for now */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppContent />
    </ThemeProvider>
  );
}
