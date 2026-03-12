/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ThemeProvider } from '@/context/ThemeContext';
import { useNotificationScheduler } from '@/hooks/useNotificationScheduler';
import GoalsPage from '@/pages/Goals';
import HomePage from '@/pages/Home';
import PrivacyPage from '@/pages/Privacy';
import SettingsPage from '@/pages/Settings';
import StatsPage from '@/pages/Stats';
import TermsPage from '@/pages/Terms';
import './i18n';

function AppContent() {
  useNotificationScheduler();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="add" element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppContent />
    </ThemeProvider>
  );
}
