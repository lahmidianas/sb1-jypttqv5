import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Header from '../Header';

// Mock useAuthContext hook
vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuthContext: () => ({ user: null })
}));

describe('Header', () => {
  const renderHeader = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders navigation links correctly', () => {
    renderHeader();
    
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('À propos')).toBeInTheDocument();
    expect(screen.getByText('Biens')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('does not render login button in header', () => {
    renderHeader();
    expect(screen.queryByText('Connexion')).toBeNull();
  });

  it('has correct navigation links', () => {
    renderHeader();

    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    const expectedPaths = ['/', '/about', '/properties', '/contact'];
    expectedPaths.forEach((p) => {
      expect(hrefs).toContain(p);
    });
  });
});
