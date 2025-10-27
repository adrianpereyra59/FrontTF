import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../Styles/auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setSuccess('Cuenta creada. Revisa tu email si se requiere verificación.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.body?.message || 'Error al registrar');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>Crear cuenta</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <label>Nombre</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <label>Contraseña</label>
        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <label>Confirmar contraseña</label>
        <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}