import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Cliente {
  id_cliente: number;
  nombre: string;
  telefono: string;
  email: string;
}

interface Mascota {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
  rut_cliente: number;
}

interface Veterinario {
  email: string;
  nombre: string;
  especialidad: string;
}

interface Servicio {
  id_servicio: number;
  nombre: string;
  precio: number;
}

interface Reserva {
  id_reserva: number;
  rut_cliente: number;
  id_mascota: number;
  id_veterinario: number;
  id_servicio: number;
  fecha: string;
  hora: string;
  cliente?: Cliente;
  mascota?: Mascota;
  veterinario?: Veterinario;
  servicio?: Servicio;
}

export default function AgendarCitasAdmin() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    rut_cliente: '',
    id_mascota: '',
    id_veterinario: '',
    id_servicio: '',
    fecha: '',
    hora: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [clientesRes, veterinariosRes, serviciosRes, reservasRes] = await Promise.all([
        fetch(`${API_URL}/clientes`, { headers }),
        fetch(`${API_URL}/veterinarios`, { headers }),
        fetch(`${API_URL}/servicios`, { headers }),
        fetch(`${API_URL}/reservas`, { headers })
      ]);

      if (!clientesRes.ok || !veterinariosRes.ok || !serviciosRes.ok || !reservasRes.ok) {
        throw new Error('Error cargando datos');
      }

      const clientesData = await clientesRes.json();
      const veterinariosData = await veterinariosRes.json();
      const serviciosData = await serviciosRes.json();
      const reservasData = await reservasRes.json();

      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setVeterinarios(Array.isArray(veterinariosData) ? veterinariosData : []);
      setServicios(Array.isArray(serviciosData) ? serviciosData : []);
      setReservas(Array.isArray(reservasData) ? reservasData : []);
      
      // Cargar todas las mascotas la primera vez
      if (mascotas.length === 0) {
        const mascotasRes = await fetch(`${API_URL}/mascotas`, { headers });
        if (mascotasRes.ok) {
          const mascotasData = await mascotasRes.json();
          setMascotas(Array.isArray(mascotasData) ? mascotasData : []);
        }
      }
      setLoading(false);
    } catch (err) {
      setError('Error cargando datos del servidor');
      setLoading(false);
      console.error(err);
    }
  };

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clienteId = e.target.value;
    setFormData({ ...formData, rut_cliente: clienteId, id_mascota: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.rut_cliente || !formData.id_mascota || !formData.id_veterinario || !formData.id_servicio || !formData.fecha || !formData.hora) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({
          rut_cliente: '',
          id_mascota: '',
          id_veterinario: '',
          id_servicio: '',
          fecha: '',
          hora: ''
        });
        cargarDatos();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al agendar la cita');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    }
  };

  if (loading) return <div className="container py-5 text-center">Cargando...</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Agendar Citas - Administrador</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4">Agendar Nueva Cita</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Cliente</label>
                  <select 
                    className="form-control form-control-lg" 
                    value={formData.rut_cliente}
                    onChange={handleClienteChange}
                    required
                  >
                    <option value="">Selecciona un cliente...</option>
                    {clientes.map(c => (
                      <option key={c.id_cliente} value={c.id_cliente}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Mascota</label>
                  <select 
                    className="form-control form-control-lg" 
                    value={formData.id_mascota}
                    onChange={(e) => setFormData({ ...formData, id_mascota: e.target.value })}
                    required
                  >
                    <option value="">Selecciona una mascota...</option>
                    {mascotas
                      .filter(m => formData.rut_cliente === '' || m.rut_cliente === parseInt(formData.rut_cliente))
                      .map(m => (
                        <option key={m.id_mascota} value={m.id_mascota}>
                          {m.nombre} ({m.especie})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Veterinario</label>
                  <select 
                    className="form-control form-control-lg" 
                    value={formData.id_veterinario}
                    onChange={(e) => setFormData({ ...formData, id_veterinario: e.target.value })}
                    required
                  >
                    <option value="">Selecciona un veterinario...</option>
                    {veterinarios.map(v => (
                      <option key={v.email} value={v.email}>
                        {v.nombre} - {v.especialidad}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Servicio</label>
                  <select 
                    className="form-control form-control-lg" 
                    value={formData.id_servicio}
                    onChange={(e) => setFormData({ ...formData, id_servicio: e.target.value })}
                    required
                  >
                    <option value="">Selecciona un servicio...</option>
                    {servicios.map(s => (
                      <option key={s.id_servicio} value={s.id_servicio}>
                        {s.nombre} - ${s.precio}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Fecha</label>
                  <input 
                    type="date" 
                    className="form-control form-control-lg" 
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Hora</label>
                  <input 
                    type="time" 
                    className="form-control form-control-lg" 
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 fw-bold"
                  disabled={!formData.rut_cliente || !formData.id_mascota || !formData.id_veterinario || !formData.id_servicio || !formData.fecha || !formData.hora}
                >
                  <span className="bi bi-calendar-check me-2"></span>
                  Agendar Cita
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Listado de citas */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4">Citas Agendadas</h5>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {reservas.length === 0 ? (
                  <p className="text-muted text-center py-4">No hay citas agendadas</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {reservas.map(r => (
                      <div key={r.id_reserva} className="list-group-item px-0 py-3 border-bottom">
                        <h6 className="mb-2 fw-bold text-primary">{r.mascota?.nombre || 'Mascota'}</h6>
                        <small className="d-block text-muted">
                          <p className="mb-1"><strong>Cliente:</strong> {r.cliente?.nombre}</p>
                          <p className="mb-1"><strong>RUT Cliente:</strong> {r.cliente?.rut || 'N/A'}</p>
                          <p className="mb-1"><strong>Veterinario:</strong> Dr. {r.veterinario?.nombre}</p>
                          <p className="mb-1"><strong>Servicio:</strong> {r.servicio?.nombre}</p>
                          <p className="mb-0"><strong>Fecha y Hora:</strong> {new Date(r.fecha).toLocaleDateString('es-CL')} - {r.hora}</p>
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
