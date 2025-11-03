import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';

import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import Home from './Pages/HomePage';

// IMPORTA AQUI TU WhatsAppRouter — ajusta la ruta según dónde esté en tu repo
// Ejemplo: import WhatsAppRouter from './Component/WhatsAppRouter';
import WhatsAppRouter from './Component/WhatsAppRouter';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Montar todo el router de WhatsApp bajo /whatsapp/* */}
        <Route path="/whatsapp/*" element={<WhatsAppRouter />} />

        {/* Ruta privada raíz */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Fallback: redirigir a / si está autenticado, a /login si no */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}