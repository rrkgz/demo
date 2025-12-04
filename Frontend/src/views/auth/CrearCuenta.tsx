import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function CrearCuenta() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOk('');

    try {
      const res = await fetch(`${API_URL}/crear-cuenta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) 
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Error al crear cuenta');
        return;
      }
      
      setOk('Cuenta creada, ahora puedes iniciar sesión');
      setTimeout(() => navigate('/iniciar-sesion'), 1000);
      
    } catch (err) {
      setError('Error de red o servidor');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="p-4 shadow rounded-4 bg-white" style={{ minWidth: 340, maxWidth: 370 }}>
        <h2 className="fw-bold mb-3">Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Campo Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          {/* Campo Contraseña */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100">Crear</button>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {ok && <p style={{ color: 'green' }}>{ok}</p>}
        </form>
        
        <div className="text-center mt-3">
          <Link to="/iniciar-sesion" className="small text-decoration-none text-primary-emphasis">Volver a Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
}