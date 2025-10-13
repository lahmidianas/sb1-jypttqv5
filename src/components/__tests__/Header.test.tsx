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

  it('renders login button when user is not authenticated', () => {
    renderHeader();
    
    const loginButton = screen.getByText('Connexion');
    expect(loginButton).toBeInTheDocument();
    expect(loginButton.closest('a')).toHaveAttribute('href', '/login');
  });

  it('has correct navigation links', () => {
    renderHeader();
    
    const links = screen.getAllByRole('link');
    const expectedPaths = ['/', '/about', '/properties', '/contact', '/login'];
    
    links.forEach((link, index) => {
      expect(link).toHaveAttribute('href', expectedPaths[index]);
    });
  });
});