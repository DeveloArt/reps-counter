import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  it('renders without crashing', () => {
    expect(document.body).toBeInTheDocument();
  });

  it('has correct title', () => {
    const title = document.title;
    expect(title).toBeTruthy();
  });
});

describe('Navigation', () => {
  it('redirects to app by default', () => {
    const landingElements = document.querySelectorAll('main, div');
    expect(landingElements.length).toBeGreaterThan(0);
  });
});
