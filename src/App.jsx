import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext"; // ajusta import si tu AuthProvider está en otro path
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import WhatsAppRouter from "./Component/WhatsAppRouter";
import Home from "./Pages/HomePage";
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
        
        <WhatsAppProvider>
          <Routes>
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            
            <Route path="/whatsapp/*" element={<WhatsAppRouter />} />

           
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WhatsAppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
