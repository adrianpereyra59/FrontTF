import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializar desde localStorage (token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Opcional: validar token con backend
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.user || null);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.token) {
      localStorage.setItem("token", res.token);
      api.setToken(res.token);
      setUser(res.user || null);
    }
    return res;
  };

  const register = async (payload) => {
    // payload: { name, email, password }
    const res = await api.post("/auth/register", payload);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    api.setToken(null);
    setUser(null);
    navigate("/login");
  };

  const forgotPassword = async (email) => {
    return api.post("/auth/forgot-password", { email });
  };

  const resetPassword = async (token, password) => {
    return api.post(`/auth/reset-password`, { token, password });
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
