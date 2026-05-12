import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import LegalPage from './LegalPage';

function Router() {
  const path = window.location.pathname;

  if (path === '/polityka-prywatnosci') {
    return <LegalPage type="privacy" />;
  }

  if (path === '/regulamin') {
    return <LegalPage type="terms" />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
