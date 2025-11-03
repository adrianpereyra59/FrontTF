// src/screens/AcceptInvite.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';

export default function AcceptInvite() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState(null);
  const [member, setMember] = useState(null);

  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    async function accept() {
      if (!token) {
        setStatus('error');
        setMessage('Token no proporcionado');
        return;
      }
      setStatus('loading');
      try {
        const res = await api.get(`/api/invitations/accept?token=${encodeURIComponent(token)}`);
        setStatus('success');
        setMessage(res.message || 'Invitación aceptada');
        setMember(res.data?.member || null);
      } catch (err) {
        setStatus('error');
        const errMsg = err?.body?.message || err.message || 'Error inesperado';
        setMessage(errMsg);
      }
    }
    accept();
  }, [token]);

  return (
    <div style={{ maxWidth: 760, margin: '2rem auto', padding: '1rem' }}>
      <h2>Aceptar Invitación</h2>

      {status === 'idle' || status === 'loading' ? (
        <div>
          <p>{status === 'loading' ? 'Procesando invitación...' : 'Iniciando...'}</p>
        </div>
      ) : null}

      {status === 'error' ? (
        <div style={{ border: '1px solid #f5c6cb', background: '#f8d7da', padding: '1rem', borderRadius: 6 }}>
          <h3 style={{ color: '#721c24' }}>No se pudo aceptar la invitación</h3>
          <p>{message}</p>
          <div style={{ marginTop: 12 }}>
            <Link to="/login" style={{ marginRight: 12 }}>Ir a Iniciar Sesión</Link>
            <button onClick={() => navigate('/')} style={{ marginLeft: 8 }}>Ir al inicio</button>
          </div>
        </div>
      ) : null}

      {status === 'success' ? (
        <div style={{ border: '1px solid #c3e6cb', background: '#d4edda', padding: '1rem', borderRadius: 6 }}>
          <h3 style={{ color: '#155724' }}>{message}</h3>
          {member ? (
            <div style={{ marginTop: 8 }}>
              <strong>Miembro:</strong>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(member, null, 2)}</pre>
            </div>
          ) : null}
          <div style={{ marginTop: 12 }}>
            <Link to="/login" style={{ marginRight: 12 }}>Iniciar Sesión</Link>
            <button onClick={() => navigate('/')} style={{ marginLeft: 8 }}>Ir al inicio</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
