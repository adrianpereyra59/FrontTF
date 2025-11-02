import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import LOCALSTORAGE_KEYS from "../constants/localstorage";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Decodificar JWT sin dependencia externa -> devuelve payload como objeto
function parseJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar desde localStorage (token)
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      api.setToken(token);
      const payload = parseJwt(token);
      // payload puede contener id, name, email, created_at
      if (payload) {
        setUser({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          created_at: payload.created_at,
        });
      } else {
        setUser(null);
      }
    }
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    // Backend responde: { ok:true, message, status, data: { authorization_token } }
    const token = res?.data?.authorization_token || res?.authorization_token || res?.token;
    if (token) {
      localStorage.setItem(LOCALSTORAGE_KEYS.AUTH_TOKEN, token);
      api.setToken(token);
      const payload = parseJwt(token);
      if (payload) {
        setUser({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          created_at: payload.created_at,
        });
      } else {
        setUser({});
      }
    }
    return res;
  };

  const register = async (payload) => {
    // payload: { name, email, password } -> backend expects username, email, password
    const body = {
      username: payload.name || payload.username || payload.email,
      email: payload.email,
      password: payload.password,
    };
    const res = await api.post("/api/auth/register", body);
    return res;
  };

  const logout = () => {
    localStorage.removeItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);
    api.setToken(null);
    setUser(null);
    navigate("/login");
  };

  const forgotPassword = async (email) => {
    return api.post("/api/auth/forgot-password", { email });
  };

  const resetPassword = async (token, password) => {
    // Backend espera: { reset_token, new_password }
    return api.post(`/api/auth/reset-password`, { reset_token: token, new_password: password });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Cargando...</div>}
    </AuthContext.Provider>
  );
}