import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import WhatsAppRouter from "./Component/WhatsAppRouter";
import Home from "./Pages/Home";
import { WhatsAppProvider } from "./Context/WhatsappContext";

/* Mantengo tu PrivateRoute */
function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Envolvemos las rutas con WhatsAppProvider para que cualquier componente que use
            useWhatsApp esté dentro del contexto */}
        <WhatsAppProvider>
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
        </WhatsAppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}