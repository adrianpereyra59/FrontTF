import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkspaces } from '../../Context/WorkspaceContext';
import UserList from '../../Components/UserList';
import '../../Styles/workspace.css';

export default function WorkspaceDetail() {
  const { id } = useParams();
  const { getWorkspace, addUser, removeUser, assignRole } = useWorkspaces();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await getWorkspace(id);
      setWorkspace(data);
    } catch (err) {
      setError(err.body?.message || 'No se encontró el workspace');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addUser(id, { email, role });
      setMessage('Invitación enviada / usuario agregado.');
      setEmail('');
      await load();
    } catch (err) {
      setError(err.body?.message || 'No se pudo agregar usuario');
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!confirm('Quitar usuario del workspace?')) return;
    try {
      await removeUser(id, userId);
      await load();
    } catch (err) {
      setError(err.body?.message || 'No se pudo quitar usuario');
    }
  };

  const handleAssignRole = async (userId, newRole) => {
    try {
      await assignRole(id, userId, newRole);
      setMessage('Rol actualizado');
      await load();
    } catch (err) {
      setError(err.body?.message || 'No se pudo asignar rol');
    }
  };

  if (loading) return <div>Cargando workspace...</div>;
  if (!workspace) return <div>No hay workspace</div>;

  return (
    <div className="workspace-detail">
      <header className="workspace-header">
        <h1>{workspace.name}</h1>
      </header>

      <section className="workspace-meta">
        <p>{workspace.description}</p>
      </section>

      <section className="workspace-users">
        <h2>Miembros</h2>
        {message && <div className="workspace-success">{message}</div>}
        {error && <div className="workspace-error">{error}</div>}

        <UserList users={workspace.users || []} onRemove={handleRemoveUser} onChangeRole={handleAssignRole} />

        <form onSubmit={handleAddUser} className="workspace-add-user">
          <h3>Agregar usuario</h3>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Rol</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="member">Miembro</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <button className="btn">Agregar</button>
        </form>
      </section>
    </div>
  );
}