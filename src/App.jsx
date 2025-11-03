import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext"; // ajusta import si tu AuthProvider está en otro path
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import WhatsAppRouter from "./Component/WhatsAppRouter";
import Home from "./Pages/Home";
import { WhatsAppProvider } from "./Context/WhatsappContext";


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
