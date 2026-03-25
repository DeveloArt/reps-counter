import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Wait for i18n to be initialized before rendering
setTimeout(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}, 0);
