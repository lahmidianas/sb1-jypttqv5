import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Logo from '../Logo';

describe('Logo', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );
    
    expect(screen.getByText('MEDIMMO')).toBeInTheDocument();
    expect(screen.getByText('SECRET')).toBeInTheDocument();
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