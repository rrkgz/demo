import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api';



interface Mascota {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
}

interface Veterinario {
  id_veterinario: number;
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
  fecha: string;
  hora: string;
  id_veterinario: string;
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface AgendarCitaUsuarioProps {
  appointmentId?: string; 
}



export default function AgendarCitaUsuario({ appointmentId }: AgendarCitaUsuarioProps) {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    id_mascota: '',
    id_veterinario: '',
    fecha: '',
    hora: ''
  });

  const [isEditing, setIsEditing] = useState(!!appointmentId);


  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
 
    setIsEditing(!!appointmentId);
    cargarDatos();
  }, [appointmentId]); 

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [mascotasRes, veterinariosRes, serviciosRes, reservasRes] = await Promise.all([
        fetch(`${API_URL}/mascotas`, { headers }),
        fetch(`${API_URL}/veterinarios`, { headers }),
        fetch(`${API_URL}/servicios`, { headers }),
        fetch(`${API_URL}/reservas`, { headers })
      ]);

      if (!mascotasRes.ok || !veterinariosRes.ok || !serviciosRes.ok || !reservasRes.ok) {
        throw new Error('Error cargando datos');
      }

      const mascotasData = await mascotasRes.json();
      const veterinariosData = await veterinariosRes.json();
      const serviciosData = await serviciosRes.json();
      const reservasData = await reservasRes.json();

      setMascotas(Array.isArray(mascotasData) ? mascotasData : []);
      setVeterinarios(Array.isArray(veterinariosData) ? veterinariosData : []);
      setServicios(Array.isArray(serviciosData) ? serviciosData : []);
      setReservas(Array.isArray(reservasData) ? reservasData : []);
      setLoading(false);
    } catch (err) {
      setError('Error cargando datos del servidor. Intenta recargar.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.id_mascota || !formData.id_veterinario || !formData.fecha || !formData.hora) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      // Buscar el servicio que coincida con la especialidad del veterinario
      const vet = veterinarios.find(v => v.email === formData.id_veterinario);
      const servicio = vet ? servicios.find(s => 
        s.nombre.toLowerCase().includes(vet.especialidad.toLowerCase()) ||
        vet.especialidad.toLowerCase().includes(s.nombre.toLowerCase())
      ) : null;

      if (!servicio) {
        setError('No se encontró un servicio compatible con la especialidad del veterinario');
        return;
      }

      const token = localStorage.getItem('token');
      const dataToSend = {
        ...formData,
        id_servicio: servicio.id_servicio
      };

      const response = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        setSuccess('¡Cita agendada exitosamente!');
        
        // Recargar las reservas para actualizar las horas disponibles
        await cargarDatos();
        
        setFormData({
          id_mascota: '',
          id_veterinario: '',
          fecha: '',
          hora: ''
        });
        setTimeout(() => navigate('/mis-citas'), 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Error al ${isEditing ? 'actualizar' : 'agendar'} la cita`);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSelectDate = (day: number) => {
  
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayStr}`;
    setFormData({ ...formData, fecha: formattedDate });
  };

  const handleSelectHour = (hour: string) => {
    setFormData({ ...formData, hora: hour });
  };

  const isDateDisabled = (day: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Generar horarios cada 40 minutos
  const hours = [];
  const startHour = 9; // 9:00 AM
  const endHour = 19; // 7:00 PM
  let currentMinutes = startHour * 60; // Convertir a minutos
  const endMinutes = endHour * 60;

  while (currentMinutes < endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    hours.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    currentMinutes += 40; // Incremento de 40 minutos
  }

  // Filtrar horas ya reservadas para el veterinario y fecha seleccionados
  const horasDisponibles = hours.filter(hora => {
    if (!formData.id_veterinario || !formData.fecha) return true;
    
    const estaReservada = reservas.some(r => {
      // Normalizar fecha para comparación (solo la parte YYYY-MM-DD)
      const fechaReserva = r.fecha.split('T')[0];
      const fechaSeleccionada = formData.fecha;
      
      // Normalizar hora: comparar solo HH:MM (ignorar segundos)
      const horaReserva = r.hora.substring(0, 5); // "10:00:00" -> "10:00"
      
      const match = r.id_veterinario === formData.id_veterinario && 
                    fechaReserva === fechaSeleccionada && 
                    horaReserva === hora;
      
      if (match) {
        console.log('🚫 Hora ocupada:', hora, 'Vet:', r.id_veterinario, 'Fecha:', fechaReserva);
      }
      
      return match;
    });
    
    return !estaReservada;
  });

  if (loading) return <div className="container py-5 text-center">Cargando...</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        {isEditing ? 'Modificar Cita Existente' : 'Agendar una Nueva Cita'}
      </h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4">
                {isEditing ? `Editando Cita #${appointmentId}` : 'Completa tu reserva'}
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mi Mascota</label>
                  <select
                    className="form-control form-control-lg"
                    value={formData.id_mascota}
                    onChange={(e) => setFormData({ ...formData, id_mascota: e.target.value })}
                    required
                  >
                    <option value="">Selecciona tu mascota...</option>
                    {mascotas.map(m => (
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
                      <option key={v.id_veterinario} value={v.id_veterinario}>
                        {v.nombre} - {v.especialidad}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Tipo de Servicio</label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light"
                    value={formData.id_veterinario ? (veterinarios.find(v => v.email === formData.id_veterinario)?.especialidad || 'Selecciona un veterinario') : 'Selecciona un veterinario'}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Fecha Seleccionada</label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light"
                
                    value={formData.fecha 
                      ? new Date(formData.fecha + 'T00:00:00').toLocaleDateString('es-CL') 
                      : 'Selecciona una fecha'
                    }
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Hora Seleccionada</label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light"
                    value={formData.hora || 'Selecciona una hora'}
                    disabled
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 fw-bold"
                  disabled={!formData.id_mascota || !formData.id_veterinario || !formData.fecha || !formData.hora}
                >
                  <span className="bi bi-calendar-check me-2"></span>
                  {isEditing ? 'Actualizar Cita' : 'Agendar Cita'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Calendario y Horas */}
        <div className="col-lg-6">
          {/* Calendario */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-3">Selecciona una Fecha</h5>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <button onClick={handlePrevMonth} className="btn btn-sm btn-outline-primary" type="button">
                  <span className="bi bi-chevron-left"></span>
                </button>
                <span className="fw-bold">
                  {MESES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button onClick={handleNextMonth} className="btn btn-sm btn-outline-primary" type="button">
                  <span className="bi bi-chevron-right"></span>
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-sm text-center table-bordered">
                  <thead>
                    <tr>
                      {DIAS_SEMANA.map(dia => (
                        <th key={dia} className="bg-light">{dia}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => (
                      <tr key={weekIndex}>
                        {calendarDays.slice(weekIndex * 7, (weekIndex * 7) + 7).map((day, dayIndex) => {
                          const year = currentMonth.getFullYear();
                          const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
                          const dayStr = day ? String(day).padStart(2, '0') : '';
                          const dateStr = day ? `${year}-${month}-${dayStr}` : '';
                          const isSelected = day && formData.fecha === dateStr;
                          const isDisabled = day ? isDateDisabled(day) : false;
                          return (
                            <td key={dayIndex} className="p-2">
                              {day ? (
                                <button
                                  type="button"
                                  onClick={() => !isDisabled && handleSelectDate(day)}
                                  className={`btn btn-sm w-100 ${
                                    isSelected
                                      ? 'btn-primary'
                                      : isDisabled
                                        ? 'btn-outline-secondary disabled text-muted'
                                        : 'btn-outline-primary'
                                  }`}
                                  disabled={isDisabled}
                                >
                                  {day}
                                </button>
                              ) : (
                                <div></div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Horas */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-3">Selecciona una Hora</h5>
              {!formData.fecha || !formData.id_veterinario ? (
                <p className="text-muted text-center">Primero selecciona una fecha y un veterinario</p>
              ) : horasDisponibles.length === 0 ? (
                <p className="text-warning text-center">No hay horas disponibles para esta fecha</p>
              ) : (
                <div className="row g-2">
                  {horasDisponibles.map((hour) => (
                    <div key={hour} className="col-6">
                      <button
                        type="button"
                        onClick={() => handleSelectHour(hour)}
                        className={`btn w-100 ${
                          formData.hora === hour
                            ? 'btn-primary'
                            : 'btn-outline-secondary'
                        }`}
                      >
                        {hour}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}