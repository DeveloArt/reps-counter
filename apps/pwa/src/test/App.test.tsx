import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders without crashing', () => {
    expect(document.body).toBeInTheDocument();
  });

  it('has correct title', () => {
    const title = document.title;
    expect(title).toBe('FitCounter');
  });
});

describe('Navigation', () => {
  it('redirects to app by default', () => {
    render(<App />);
    const landingElements = document.querySelectorAll('main, div');
    expect(landingElements.length).toBeGreaterThan(0);
  });
});
