import React from 'react';

export default function UserList({ users = [], onRemove, onChangeRole }) {
  return (
    <div className="user-list">
      {users.length === 0 && <div>No hay miembros aún</div>}
      <ul>
        {users.map(u => (
          <li key={u._id || u.id} className="user-item">
            <div>
              <strong>{u.name || u.email}</strong>
              <div className="muted">{u.email}</div>
            </div>
            <div className="user-actions">
              <select value={u.role || 'member'} onChange={e => onChangeRole(u._id || u.id, e.target.value)}>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <button onClick={() => onRemove(u._id || u.id)} className="btn danger small">Quitar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}