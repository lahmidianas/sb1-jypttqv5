import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const PublicRoutes = lazy(() => import('./routes/PublicRoutes'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));

function RouteFallback() {
  return <div className="min-h-screen bg-gray-50" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminRoutes />
                </ProtectedRoute>
              }
            />
            <Route path="/*" element={<PublicRoutes />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
