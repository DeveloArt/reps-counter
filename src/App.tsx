/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import HomePage from '@/pages/Home';
import StatsPage from '@/pages/Stats';
import GoalsPage from '@/pages/Goals';
import SettingsPage from '@/pages/Settings';
import TermsPage from '@/pages/Terms';
import PrivacyPage from '@/pages/Privacy';
import './i18n';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/add" element={<HomePage />} /> {/* Placeholder for now */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
