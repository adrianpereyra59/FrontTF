import React, { useState } from 'react';

export default function WorkspaceForm({ onSubmit, onCancel, initial = {} }) {
  const [form, setForm] = useState({ name: initial.name || '', description: initial.description || '' });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  return (
    <form className="workspace-form" onSubmit={submit}>
      <label>Nombre</label>
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <label>Descripción (opcional)</label>
      <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="submit" className="btn">Crear</button>
        {onCancel && <button type="button" onClick={onCancel} className="btn alt">Cancelar</button>}
      </div>
    </form>
  );
}