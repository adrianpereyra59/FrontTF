import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function AcceptInvite() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [memberInfo, setMemberInfo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Token no proporcionado');
      return;
    }

    // Call the API to accept the invitation
    api
      .get(`/api/invitations/accept?token=${token}`)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Invitación aceptada exitosamente');
        setMemberInfo(data.member || null);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.body?.message || err.message || 'Error al aceptar la invitación');
      });
  }, [location.search]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Aceptar Invitación</h1>

        {status === 'loading' && (
          <div style={styles.loading}>
            <p>Procesando invitación...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={styles.success}>
            <p style={styles.message}>{message}</p>
            {memberInfo && (
              <div style={styles.memberInfo}>
                <p><strong>Workspace ID:</strong> {memberInfo.workspaceId}</p>
                <p><strong>Email:</strong> {memberInfo.email}</p>
                <p><strong>Rol:</strong> {memberInfo.role}</p>
              </div>
            )}
            <div style={styles.buttonGroup}>
              <Link to="/login" style={styles.button}>
                Ir al Login
              </Link>
              <Link to="/" style={styles.buttonSecondary}>
                Ir a la lista de Workspaces
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={styles.error}>
            <p style={styles.message}>{message}</p>
            <div style={styles.buttonGroup}>
              <Link to="/login" style={styles.button}>
                Ir al Login
              </Link>
              <Link to="/" style={styles.buttonSecondary}>
                Ir a Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  success: {
    textAlign: 'center',
  },
  error: {
    textAlign: 'center',
  },
  message: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#555',
  },
  memberInfo: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'left',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  button: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '500',
    textAlign: 'center',
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '500',
    textAlign: 'center',
    transition: 'background-color 0.2s',
  },
};
