import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../Styles/auth.css';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      await resetPassword(token, password);
      setSuccess('Contraseña actualizada. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.body?.message || 'Error al resetear contraseña');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>Restablecer contraseña</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <label>Nueva contraseña</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <label>Confirmar contraseña</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        <button type="submit">Guardar nueva contraseña</button>
      </form>
    </div>
  );
}