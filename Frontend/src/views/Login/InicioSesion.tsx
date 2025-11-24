import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function InicioSesion() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		try {
			const res = await fetch(`${API_URL}/iniciar-sesion`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.error || 'Error al iniciar sesión');
				return;
			}
			localStorage.setItem('token', data.token);
			navigate('/');
		} catch (err) {
			setError('Error de red o servidor');
		}
	};

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="login-card p-4 shadow rounded-4 bg-white" style={{ minWidth: 340, maxWidth: 370 }}>
        <div className="text-center mb-4">
          <span className="bi bi-person-circle" style={{ fontSize: 48, color: '#000' }}></span>
          <h2 className="fw-bold mt-2 mb-1" style={{ letterSpacing: 1 }}>Iniciar Sesión</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email</label>
            <input 
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email" 
              name="email" 
              className="form-control" required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contraseña" className="form-label fw-semibold">Contraseña</label>
            <input 
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="contraseña" name="contraseña" required
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">Entrar</button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <div className="text-center mt-3">
          <Link to="/cambiar-pass" className="small text-decoration-none text-primary-emphasis">Cambiar contraseña  /  </Link>
          <Link to="/crear-cuenta" className="small text-decoration-none text-primary-emphasis">  Crear cuenta  </Link>
        </div>
      </div>
    </div>
  );
}
