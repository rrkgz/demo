import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


interface Paciente { 
  id: number;
  nombre: string;
  especie: string; 
  propietarioId: number;
}

interface Tratamiento {
  id: string; 
  pacienteId: number;
  descripcion: string;
  fechaInicio: string;
  costo: number; 
}


type NuevoTratamiento = Omit<Tratamiento, 'id'>;


export const GestionTratamientos: React.FC = () => {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]); 
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  
  const [nuevoTratamiento, setNuevoTratamiento] = useState<NuevoTratamiento>({
    pacienteId: 0, 
    descripcion: '',
    fechaInicio: new Date().toISOString().split('T')[0], 
    costo: 0,
  });



  const getToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/iniciar-sesion');
      alert('Sesión expirada o no iniciada. Por favor, inicie sesión.');
      return null;
    }
    return token;
  };
  
  const getHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, 
  });
  
  const handleApiError = async (res: Response) => {
      const errorData = await res.json();
      throw new Error(errorData.error || `Fallo en la API: ${res.statusText}`);
  }


  const fetchPacientes = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/mascotas`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!res.ok) {
        await handleApiError(res);
      }

      const data: Paciente[] = await res.json();
      setPacientes(data);
      
      
      if (data.length > 0) {
        setNuevoTratamiento(prev => ({ ...prev, pacienteId: data[0].id }));
      }
    } catch (err: any) {
      console.error("Error al cargar pacientes:", err);
      setError(err.message || 'Error de red al cargar pacientes');
    }
  };


  const fetchTratamientos = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/tratamientos`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!res.ok) {
        await handleApiError(res);
      }

      const data: Tratamiento[] = await res.json();
      setTratamientos(data);
    } catch (err: any) {
      console.error("Error al cargar tratamientos:", err);
      setError(err.message || 'Error de red al cargar tratamientos');
    }
  };
  

  useEffect(() => {
    const token = getToken();
    if (token) {
      const loadData = async () => {
        setError('');
        setCargando(true);
     
        await fetchPacientes(token);
        await fetchTratamientos(token);
        setCargando(false);
      };
      loadData();
    } else {
        setCargando(false);
    }
  }, []); 


  const registrarTratamiento = async (tratamiento: NuevoTratamiento) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/tratamientos`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(tratamiento),
      });

      if (!res.ok) {
        await handleApiError(res);
      }

  
      const nuevo: Tratamiento = await res.json();
      setTratamientos(prev => [...prev, nuevo]);
      

      setNuevoTratamiento(() => ({
          pacienteId: pacientes[0]?.id || 0,
          descripcion: '',
          fechaInicio: new Date().toISOString().split('T')[0],
          costo: 0,
      }));
      alert(`Tratamiento ${nuevo.id} para ${getNombrePaciente(nuevo.pacienteId)} registrado con éxito.`);

    } catch (err: any) {
      console.error("Error al registrar tratamiento:", err);
      setError(err.message || 'Error de red o servidor al registrar tratamiento');
    }
  };



  const getNombrePaciente = (pacienteId: number): string => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombre} (${paciente.especie})` : `Desconocido (ID: ${pacienteId})`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoTratamiento(prev => ({
      ...prev,
    
      [name]: name === 'costo' || name === 'pacienteId' ? Number(value) : value, 
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoTratamiento.descripcion.trim() === '' || nuevoTratamiento.costo <= 0 || nuevoTratamiento.pacienteId === 0) {
        alert('Por favor, complete todos los campos requeridos y seleccione un paciente válido.');
        return;
    }
    registrarTratamiento(nuevoTratamiento);
  };



  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <h1>🔬 Gestión de Historial Médico y Tratamientos</h1>
      </header>
      
      <hr />
      {error && <p style={{ color: "red", padding: '10px', border: '1px solid red', borderRadius: '5px' }}>Error: {error}</p>}
      
      {cargando ? (
        <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Cargando datos de pacientes y tratamientos...</p>
      ) : (
        <>
          <section>
            <h2>➕ Registrar Nuevo Tratamiento</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
              
              <div>
                <label htmlFor="pacienteId" style={{ display: 'block', marginBottom: '5px' }}>Paciente:</label>
                <select
                  id="pacienteId"
                  name="pacienteId"
                  value={nuevoTratamiento.pacienteId}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px' }}
                  disabled={pacientes.length === 0} // Desactivar si no hay pacientes
                >
                  {pacientes.length === 0 ? (
                      <option value={0}>No hay pacientes disponibles</option>
                  ) : (
                      pacientes.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre} ({p.especie})</option>
                      ))
                  )}
                </select>
              </div>

              {/* ... Resto de campos del formulario (Descripción, Fecha, Costo) se mantienen ... */}
              <div>
                <label htmlFor="descripcion" style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={nuevoTratamiento.descripcion}
                  onChange={handleChange}
                  placeholder="Ej: Cirugía de esterilización"
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              
              <div>
                <label htmlFor="fechaInicio" style={{ display: 'block', marginBottom: '5px' }}>Fecha Inicio:</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={nuevoTratamiento.fechaInicio}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              
              <div>
                <label htmlFor="costo" style={{ display: 'block', marginBottom: '5px' }}>Costo (€ / $):</label>
                <input
                  type="number"
                  id="costo"
                  name="costo"
                  value={nuevoTratamiento.costo > 0 ? nuevoTratamiento.costo : ''}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>

              <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} disabled={pacientes.length === 0}>
                Registrar Tratamiento
              </button>
            </form>
          </section>

          <hr />

          <section>
            <h2> Lista de Tratamientos Registrados </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Paciente</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Descripción</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Costo</th>
                </tr>
              </thead>
              <tbody>
                {tratamientos.map(t => (
                  <tr key={t.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>**{getNombrePaciente(t.pacienteId)}**</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.descripcion}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.fechaInicio}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.costo.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tratamientos.length === 0 && <p style={{ textAlign: 'center', marginTop: '10px' }}>No hay tratamientos registrados.</p>}
          </section>
        </>
      )}
    </div>
  );
};