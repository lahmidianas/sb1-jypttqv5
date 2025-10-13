import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { useAuthContext } from '../../contexts/AuthContext';
import SEO from '../../components/seo/SEO';

export default function LoginPage() {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <SEO 
        title="Connexion" 
        description="Connectez-vous à votre compte MedImmo-Secret"
      />
      <AuthForm />
    </>
  );
}