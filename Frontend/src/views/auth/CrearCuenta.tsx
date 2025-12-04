import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function CrearCuenta() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rut: '',
    nombre: '',
    telefono: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const navigate = useNavigate();

  // Validar RUT chileno (simple)
  const validarRUT = (rut: string): boolean => {
    const rutLimpio = rut.replace(/[.-]/g, '').toUpperCase();
    return rutLimpio.length >= 7 && rutLimpio.length <= 9 && /^\d{7,8}[0-9K]$/.test(rutLimpio);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOk('');

    // Validar campos obligatorios
    if (!formData.email || !formData.password || !formData.rut || !formData.nombre || !formData.telefono || !formData.direccion) {
      setError('Email, contraseña, RUT, nombre, teléfono y dirección son obligatorios');
      return;
    }

    // Validar RUT
    if (!validarRUT(formData.rut)) {
      setError('RUT inválido. Formato: 12345678 o 12.345.678-9');
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        rut: formData.rut.replace(/[.-]/g, ''),
        nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion
      };
      
      console.log('📤 Enviando datos:', payload);
      
      const res = await fetch(`${API_URL}/crear-cuenta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
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
      <div className="p-4 shadow rounded-4 bg-white" style={{ minWidth: 340, maxWidth: 450 }}>
        <h2 className="fw-bold mb-4">Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Campo Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email *</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              value={formData.email} 
              onChange={handleChange}
              required 
            />
          </div>

          {/* Campo Contraseña */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña *</label>
            <input 
              type="password" 
              name="password"
              className="form-control" 
              value={formData.password} 
              onChange={handleChange}
              required 
            />
          </div>

          {/* Campo RUT */}
          <div className="mb-3">
            <label className="form-label fw-semibold">RUT *</label>
            <input 
              type="text" 
              name="rut"
              className="form-control" 
              placeholder="Ej: 12.345.678-9"
              value={formData.rut} 
              onChange={handleChange}
              required 
            />
            <small className="text-muted">Formato: 12.345.678-9 o 12345678</small>
          </div>

          {/* Campo Nombre */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre *</label>
            <input 
              type="text" 
              name="nombre"
              className="form-control" 
              placeholder="Tu nombre completo"
              value={formData.nombre} 
              onChange={handleChange}
              required 
            />
          </div>


          {/* Campo Teléfono */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Teléfono *</label>
            <input 
              type="tel" 
              name="telefono"
              className="form-control" 
              placeholder="Ej: +56 9 1234 5678"
              value={formData.telefono} 
              onChange={handleChange}
              required 
            />
          </div>

          {/* Campo Dirección */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Dirección *</label>
            <input 
              type="text" 
              name="direccion"
              className="form-control" 
              placeholder="Ej: Calle 123, Apt 4"
              value={formData.direccion} 
              onChange={handleChange}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100">Crear Cuenta</button>
          
          {error && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {error}
            </div>
          )}
          {ok && (
            <div className="alert alert-success mt-3 mb-0" role="alert">
              {ok}
            </div>
          )}
        </form>
        
        <div className="text-center mt-3">
          <Link to="/iniciar-sesion" className="small text-decoration-none text-primary-emphasis">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}