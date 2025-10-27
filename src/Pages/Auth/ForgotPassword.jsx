import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import '../../Styles/auth.css';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await forgotPassword(email);
      setMessage('Si existe una cuenta, se envió un email con instrucciones.');
    } catch (err) {
      setError(err.body?.message || 'Error al solicitar recuperación');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>Recuperar contraseña</h2>
        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Enviar instrucciones</button>
      </form>
    </div>
  );
}