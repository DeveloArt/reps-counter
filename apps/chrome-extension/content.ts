import type { PlasmoContentScript } from 'plasmo';

export const config: PlasmoContentScript = {
  matches: ['<all_urls>'],
  run_at: 'document_end',
};

console.log('FitCounter Chrome Extension loaded');
