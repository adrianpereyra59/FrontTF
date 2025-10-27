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
  }, []);

  async function loadWorkspaces() {
    setLoading(true);
    try {
      const data = await api.get('/workspaces');
      setWorkspaces(data || []);
    } catch (err) {
      console.error('Error cargando workspaces', err);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }

  async function createWorkspace(payload) {
    // payload: { name, description }
    const ws = await api.post('/workspaces', payload);
    setWorkspaces(prev => [ws, ...prev]);
    return ws;
  }

  async function deleteWorkspace(id) {
    await api.delete(`/workspaces/${id}`);
    setWorkspaces(prev => prev.filter(w => w._id !== id && w.id !== id));
    // If currently viewing detail you may navigate away outside
    navigate('/workspaces');
  }

  async function getWorkspace(id) {
    return api.get(`/workspaces/${id}`);
  }

  async function addUser(workspaceId, { email, role = 'member' }) {
    const res = await api.post(`/workspaces/${workspaceId}/users`, { email, role });
    // Optionally refresh list
    await loadWorkspaces();
    return res;
  }

  async function removeUser(workspaceId, userId) {
    await api.delete(`/workspaces/${workspaceId}/users/${userId}`);
    return getWorkspace(workspaceId); // caller can refresh view
  }

  async function assignRole(workspaceId, userId, role) {
    const res = await api.put(`/workspaces/${workspaceId}/users/${userId}/role`, { role });
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