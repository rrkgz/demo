import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Mascota {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
  edad?: number;
  peso?: number;
}

interface Reserva {
  id_reserva: number;
  fecha: string;
  hora: string;
  mascota?: Mascota;
  veterinario?: {
    nombre: string;
    especialidad: string;
  };
  servicio?: {
    nombre: string;
    descripcion: string;
  };
}

const HistorialClinico: React.FC = () => {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroMascota, setFiltroMascota] = useState<number | null>(null);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/iniciar-sesion');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Cargar reservas del cliente
      const resReservas = await fetch(`${API_URL}/reservas`, {
        headers
      });

      if (!resReservas.ok) {
        throw new Error('Error al cargar reservas');
      }

      const reservasData: Reserva[] = await resReservas.json();
      
      // Filtrar para mostrar solo visitas completadas (fecha pasada)
      const ahora = new Date();
      console.log('📅 Ahora:', ahora);
      console.log('📊 Total de reservas obtenidas:', reservasData.length);
      console.log('📋 Reservas:', JSON.stringify(reservasData, null, 2));
      
      const visitasCompletadas = reservasData.filter(r => {
        const fechaReserva = new Date(`${r.fecha}T${r.hora}`);
        console.log(`✓ ${r.fecha} ${r.hora} = ${fechaReserva} (¿Pasada? ${fechaReserva <= ahora})`);
        return fechaReserva <= ahora;
      }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      console.log('✅ Visitas completadas:', visitasCompletadas.length);
      setReservas(visitasCompletadas);

      // Extraer mascotas únicas
      const mascotasUnicas = Array.from(
        new Map(
          visitasCompletadas
            .filter(r => r.mascota)
            .map(r => [r.mascota!.id_mascota, r.mascota!])
        ).values()
      );
      setMascotas(mascotasUnicas);

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

  const visitasFiltradas = filtroMascota
    ? reservas.filter(r => r.mascota?.id_mascota === filtroMascota)
    : reservas;

  if (loading) {
    return (
      <div className="container my-5">
        <h2 className="fw-bold mb-4">📋 Historial Clínico</h2>
        <div className="alert alert-info">Cargando historial...</div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">📋 Historial Clínico de Mascotas</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {reservas.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <h5>No tienes visitas registradas aún</h5>
          <p className="text-muted">Las visitas completadas aparecerán aquí</p>
        </div>
      ) : (
        <>
          {/* Filtro por mascota */}
          <div className="mb-4">
            <label htmlFor="filtroMascota" className="form-label fw-bold">
              Filtrar por mascota:
            </label>
            <select
              id="filtroMascota"
              className="form-select"
              value={filtroMascota || ''}
              onChange={(e) => setFiltroMascota(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Todas las mascotas</option>
              {mascotas.map(m => (
                <option key={m.id_mascota} value={m.id_mascota}>
                  🐾 {m.nombre} ({m.especie})
                </option>
              ))}
            </select>
          </div>

          {/* Lista de visitas */}
          <div className="row g-3">
            {visitasFiltradas.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-warning">
                  No hay visitas para esta mascota
                </div>
              </div>
            ) : (
              visitasFiltradas.map(visita => (
                <div key={visita.id_reserva} className="col-md-6">
                  <div className="card border-left-primary shadow-sm h-100">
                    <div className="card-body">
                      {/* Mascota */}
                      <div className="mb-3">
                        <h6 className="card-subtitle mb-2 text-primary fw-bold">
                          🐾 {visita.mascota?.nombre}
                        </h6>
                        <small className="text-muted">
                          {visita.mascota?.especie} · {visita.mascota?.raza}
                          {visita.mascota?.edad && ` · ${visita.mascota.edad} años`}
                          {visita.mascota?.peso && ` · ${visita.mascota.peso} kg`}
                        </small>
                      </div>

                      <hr className="my-2" />

                      {/* Fecha y hora de la visita */}
                      <div className="mb-3">
                        <strong className="text-secondary">📅 Fecha de Visita</strong>
                        <p className="mb-1">
                          {new Date(visita.fecha).toLocaleDateString('es-CL', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-muted">
                          ⏰ {visita.hora.substring(0, 5)}
                        </p>
                      </div>

                      {/* Veterinario */}
                      {visita.veterinario && (
                        <div className="mb-3">
                          <strong className="text-secondary">👨‍⚕️ Veterinario</strong>
                          <p className="mb-1">Dr. {visita.veterinario.nombre}</p>
                          <small className="badge bg-info text-dark">
                            {visita.veterinario.especialidad}
                          </small>
                        </div>
                      )}

                      {/* Servicio/Diagnóstico */}
                      {visita.servicio && (
                        <div className="mb-3">
                          <strong className="text-secondary">🏥 Servicio</strong>
                          <p className="mb-1">{visita.servicio.nombre}</p>
                          {visita.servicio.descripcion && (
                            <small className="text-muted d-block">
                              {visita.servicio.descripcion}
                            </small>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resumen */}
          <div className="mt-5 p-3 bg-light rounded">
            <small className="text-muted">
              📊 Mostrando {visitasFiltradas.length} de {reservas.length} visita{reservas.length !== 1 ? 's' : ''}
            </small>
          </div>
        </>
      )}
    </div>
  );
};

export default HistorialClinico;