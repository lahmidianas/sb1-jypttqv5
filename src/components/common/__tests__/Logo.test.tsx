import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Logo from '../Logo';

describe('Logo', () => {
  it('renders logo image', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );

    const img = screen.getByAltText('MedImmo-Secret Logo');
    expect(img).toBeInTheDocument();
  });

  it('links to home page', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });
});
