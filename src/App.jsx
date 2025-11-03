import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';

import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import Home from './Pages/HomePage';
import AcceptInvite from './screens/AcceptInvite';

// IMPORTA AQUI TU WhatsAppRouter — ajusta la ruta según dónde esté en tu repo
// Ejemplo: import WhatsAppRouter from './Component/WhatsAppRouter';
import WhatsAppRouter from './Component/WhatsAppRouter';

// Import API wrapper to initialize token
import api from './utils/api';
import LOCALSTORAGE_KEYS from './constants/localstorage';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  // Initialize API token from localStorage on app startup
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      api.setToken(token);
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />

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
    </BrowserRouter>
  );
}