import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../../Styles/auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/messages'); // Ajusta la ruta home
    } catch (err) {
      setError(err.body?.message || 'Credenciales inválidas');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>Iniciar sesión</h2>
        {error && <div className="auth-error">{error}</div>}
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
        <div className="auth-links">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          <Link to="/register">Crear cuenta</Link>
        </div>
      </form>
    </div>
  );
}