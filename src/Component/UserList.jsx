import React from 'react';

export default function UserList({ users = [], onRemove, onChangeRole }) {
  if (!users || users.length === 0) return <div>No hay miembros todavía.</div>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {users.map((m) => {
        // Manejamos varias formas posibles de payload
        const id = m._id || m.userId || (m.user && (m.user._id || m.user.id)) || m.id;
        const name = (m.user && (m.user.name || m.user.username)) || m.name || m.email || 'Sin nombre';
        const email = (m.user && m.user.email) || m.email || '—';
        const role = m.role || 'member';

        return (
          <li key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{name}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{email}</div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={role}
                onChange={(e) => onChangeRole && onChangeRole(id, e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="member">Miembro</option>
                <option value="viewer">Viewer</option>
              </select>

              <button
                onClick={() => onRemove && onRemove(id)}
                style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}
              >
                Quitar
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}