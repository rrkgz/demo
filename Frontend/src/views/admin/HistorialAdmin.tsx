import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Cliente {
  id_cliente?: number;
  nombre: string;
  rut: string;
  email: string;
}

interface Mascota {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
  edad?: number;
  peso?: number;
}

interface Veterinario {
  nombre: string;
  especialidad: string;
}

interface Servicio {
  nombre: string;
  descripcion: string;
}

interface Reserva {
  id_reserva: number;
  rut_cliente: string;
  fecha: string;
  hora: string;
  cliente?: Cliente;
  mascota?: Mascota;
  veterinario?: Veterinario;
  servicio?: Servicio;
}

const HistorialAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroRUT, setFiltroRUT] = useState('');
  const [filtroMascota, setFiltroMascota] = useState('');
  // Estados para almacenar datos únicos
  // const [mascotas, setMascotas] = useState<Map<number, Mascota>>(new Map());
  // const [clientes, setClientes] = useState<Map<string, Cliente>>(new Map());

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/iniciar-sesion-admin');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Cargar todas las reservas
      const resReservas = await fetch(`${API_URL}/reservas`, {
        headers
      });

      if (!resReservas.ok) {
        throw new Error('Error al cargar reservas');
      }

      const reservasData: Reserva[] = await resReservas.json();
      
      // Filtrar solo visitas completadas (fecha pasada)
      const ahora = new Date();
      const visitasCompletadas = reservasData.filter(r => {
        const fechaReserva = new Date(`${r.fecha}T${r.hora}`);
        return fechaReserva <= ahora;
      }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      setReservas(visitasCompletadas);
      setError('');
    } catch (err: any) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [navigate]);

  const visitasFiltradas = reservas.filter(r => {
    const coincideRUT = !filtroRUT || r.rut_cliente.toLowerCase().includes(filtroRUT.toLowerCase());
    const coincideMascota = !filtroMascota || r.mascota?.nombre.toLowerCase().includes(filtroMascota.toLowerCase());
    return coincideRUT && coincideMascota;
  });

  if (loading) {
    return (
      <div className="container my-5">
        <h2 className="fw-bold mb-4">📋 Historial Clínico - Admin</h2>
        <div className="alert alert-info">Cargando historial...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid my-5">
      <h2 className="fw-bold mb-4">📋 Historial Clínico - Administración</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {reservas.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <h5>No hay visitas completadas registradas</h5>
        </div>
      ) : (
        <>
          {/* Filtros */}
          <div className="row mb-4 g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Filtrar por RUT del cliente..."
                value={filtroRUT}
                onChange={(e) => setFiltroRUT(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Filtrar por nombre de mascota..."
                value={filtroMascota}
                onChange={(e) => setFiltroMascota(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla de visitas */}
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>RUT Cliente</th>
                    <th>Cliente</th>
                    <th>Mascota</th>
                    <th>Tipo</th>
                    <th>Veterinario</th>
                    <th>Especialidad</th>
                    <th>Servicio</th>
                  </tr>
                </thead>
                <tbody>
                  {visitasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center text-muted py-4">
                        No hay visitas que coincidan con los filtros
                      </td>
                    </tr>
                  ) : (
                    visitasFiltradas.map(visita => (
                      <tr key={visita.id_reserva}>
                        <td>
                          <strong>
                            {new Date(visita.fecha).toLocaleDateString('es-CL')}
                          </strong>
                        </td>
                        <td>{visita.hora.substring(0, 5)}</td>
                        <td>
                          <code>{visita.rut_cliente || 'N/A'}</code>
                        </td>
                        <td>{visita.cliente?.nombre || 'N/A'}</td>
                        <td>
                          <strong>{visita.mascota?.nombre || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">
                            {visita.mascota?.especie} · {visita.mascota?.raza}
                          </small>
                        </td>
                        <td>
                          {visita.mascota?.edad && visita.mascota?.peso ? (
                            <small>
                              {visita.mascota.edad} años<br />
                              {visita.mascota.peso} kg
                            </small>
                          ) : (
                            <small className="text-muted">-</small>
                          )}
                        </td>
                        <td>{visita.veterinario?.nombre || 'N/A'}</td>
                        <td>
                          {visita.veterinario?.especialidad && (
                            <span className="badge bg-info text-dark">
                              {visita.veterinario.especialidad}
                            </span>
                          )}
                        </td>
                        <td>
                          {visita.servicio && (
                            <div>
                              <strong>{visita.servicio.nombre}</strong>
                              {visita.servicio.descripcion && (
                                <br />
                              )}
                              <small className="text-muted d-block">
                                {visita.servicio.descripcion}
                              </small>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-light text-muted text-center py-2">
              <small>
                Mostrando {visitasFiltradas.length} de {reservas.length} visita{reservas.length !== 1 ? 's' : ''}
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HistorialAdmin;
