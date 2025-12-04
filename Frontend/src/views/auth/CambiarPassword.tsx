import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function CambiarPassword() {
  const [actualPassword, setActualPassword] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOk('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/cambiar-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ actualPassword, nuevaPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al cambiar contraseña');
        return;
      }
      setOk('Contraseña actualizada');
    } catch (err) {
      setError('Error de red o servidor');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="p-4 shadow rounded-4 bg-white" style={{ minWidth: 340, maxWidth: 370 }}>
        <h2 className="fw-bold mb-3">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña Actual</label>
            <input type="password" className="form-control" value={actualPassword} onChange={e=>setActualPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nueva Contraseña</label>
            <input type="password" className="form-control" value={nuevaPassword} onChange={e=>setNuevaPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Actualizar</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {ok && <p style={{ color: 'green' }}>{ok}</p>}
        </form>
        <div className="text-center mt-3">
          <button onClick={() => navigate(-1)} className="btn btn-link small text-decoration-none text-primary-emphasis">Volver</button>
        </div>
      </div>
    </div>
  );
}
