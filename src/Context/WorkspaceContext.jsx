import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const WorkspaceContext = createContext();

export function useWorkspaces() {
  return useContext(WorkspaceContext);
}

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkspaces();
    // eslint-disable-next-line
  }, []);

  async function loadWorkspaces() {
    setLoading(true);
    try {
      // Backend expone /api/workspace
      const data = await api.get('/api/workspace');
      // Respuesta: { status: 'OK', message, data: { workspaces: [...] } }
      setWorkspaces((data && data.data && data.data.workspaces) || []);
    } catch (err) {
      console.error('Error cargando workspaces', err);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }

  async function createWorkspace(payload) {
    // payload: { name, description } en frontend; backend espera { name, url_img }
    const body = {
      name: payload.name,
      url_img: payload.url_img || payload.url || ''
    };
    const ws = await api.post('/api/workspace', body);
    // backend responde con status 201 y message, no devuelve necesariamente el objeto creado.
    // Para asegurar consistencia recargamos la lista.
    await loadWorkspaces();
    return ws;
  }

  async function deleteWorkspace(id) {
    await api.delete(`/api/workspace/${id}`);
    setWorkspaces(prev => prev.filter(w => w._id !== id && w.id !== id));
    navigate('/workspaces');
  }

  async function getWorkspace(id) {
    const res = await api.get(`/api/workspace/${id}`);
    // Respuesta: { ok:true, message, data: { workspace } }
    return res && res.data && res.data.workspace ? res.data.workspace : res;
  }

  async function addUser(workspaceId, { email, role = 'member' }) {
    // Nota: backend actual no expone este endpoint; si lo implementas será similar a:
    // POST /api/workspace/:id/users
    const res = await api.post(`/api/workspace/${workspaceId}/users`, { email, role });
    await loadWorkspaces();
    return res;
  }

  async function removeUser(workspaceId, userId) {
    const res = await api.delete(`/api/workspace/${workspaceId}/users/${userId}`);
    return getWorkspace(workspaceId);
  }

  async function assignRole(workspaceId, userId, role) {
    const res = await api.put(`/api/workspace/${workspaceId}/users/${userId}/role`, { role });
    return res;
  }

  const value = {
    workspaces,
    loading,
    loadWorkspaces,
    createWorkspace,
    deleteWorkspace,
    getWorkspace,
    addUser,
    removeUser,
    assignRole,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}