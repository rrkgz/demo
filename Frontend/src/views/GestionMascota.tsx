import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';



interface Propietario {
  id: number;
  nombre: string;
  telefono: string;
}

interface Mascota {
  id: number;
  nombre: string;
  especie: 'Perro' | 'Gato' | 'Ave' | 'Reptil' | 'Otro';
  raza: string;
  fechaNacimiento: string; 
  propietarioId: number;
}


type NuevaMascota = Omit<Mascota, 'id'>; 

const ESPECIES_DISPONIBLES: Mascota['especie'][] = ['Perro', 'Gato', 'Ave', 'Reptil', 'Otro'];



export const GestionMascotas: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  const [nuevaMascota, setNuevaMascota] = useState<NuevaMascota>({
    nombre: '',
    especie: 'Perro', 
    raza: '',
    fechaNacimiento: new Date().toISOString().split('T')[0], 
    propietarioId: 0, 
  });
  
  const navigate = useNavigate();

  
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


  const fetchPropietarios = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/propietarios`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!res.ok) {
        await handleApiError(res);
      }

      const data: Propietario[] = await res.json();
      setPropietarios(data);
      
      if (data.length > 0) {
        setNuevaMascota(prev => ({ ...prev, propietarioId: data[0].id }));
      }
    } catch (err: any) {
      console.error("Error al cargar propietarios:", err);
      setError(err.message || 'Error de red al cargar propietarios');
    }
  };


  const fetchMascotas = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/mascotas`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!res.ok) {
        await handleApiError(res);
      }

      const data: Mascota[] = await res.json();
      setMascotas(data);
    } catch (err: any) {
      console.error("Error al cargar mascotas:", err);
      setError(err.message || 'Error de red al cargar mascotas');
    }
  };


  useEffect(() => {
    const token = getToken();
    if (token) {
      const loadData = async () => {
        setError('');
        setCargando(true);
        
        await fetchPropietarios(token);
        await fetchMascotas(token);
        setCargando(false);
      };
      loadData();
    } else {
        setCargando(false);
    }
  }, []); 


  const registrarMascota = async (mascota: NuevaMascota) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/mascotas`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(mascota),
      });

      if (!res.ok) {
        await handleApiError(res);
      }

      const nueva: Mascota = await res.json();
      setMascotas(prev => [...prev, nueva]);
      

      setNuevaMascota(() => ({
          nombre: '',
          especie: 'Perro',
          raza: '',
          fechaNacimiento: new Date().toISOString().split('T')[0],
          propietarioId: propietarios[0]?.id || 0, 
      }));
      alert(`Mascota ${nueva.nombre} registrada con éxito.`);

    } catch (err: any) {
      console.error("Error al registrar mascota:", err);
      setError(err.message || 'Error de red o servidor al registrar mascota');
    }
  };




  const getNombrePropietario = (propietarioId: number): string => {
    const propietario = propietarios.find(p => p.id === propietarioId);
    return propietario ? propietario.nombre : 'Desconocido (ID: ' + propietarioId + ')';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaMascota(prev => ({
      ...prev,
      [name]: name === 'propietarioId' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaMascota.nombre || !nuevaMascota.raza || nuevaMascota.propietarioId === 0) {
        alert('Por favor, complete todos los campos requeridos y seleccione un Propietario.');
        return;
    }
    registrarMascota(nuevaMascota);
  };
  


  return (
    <div style={styles.container}>
      <header>
        <h1>🐾 Gestión de Pacientes (Mascotas)</h1>
        <p>Total de mascotas registradas: **{mascotas.length}**</p>
      </header>

      <hr style={styles.hr} />

      {error && <p style={{ color: "red", padding: '10px', border: '1px solid red', borderRadius: '5px' }}>Error: {error}</p>}
      
      {cargando ? (
          <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Cargando datos de la API...</p>
      ) : (
          <>
            {/* Sección de Registrar Mascota */}
            <section style={styles.section}>
              <h2>➕ Registrar Nueva Mascota</h2>
              <form onSubmit={handleSubmit} style={styles.form}>
                  
                <div style={styles.formRow}>
                  <label>Nombre:
                    <input type="text" name="nombre" value={nuevaMascota.nombre} onChange={handleChange} required style={styles.input} />
                  </label>
                  <label>Especie:
                    <select name="especie" value={nuevaMascota.especie} onChange={handleChange} required style={styles.input}>
                      {ESPECIES_DISPONIBLES.map(esp => (
                        <option key={esp} value={esp}>{esp}</option>
                      ))}
                    </select>
                  </label>
                  <label>Raza:
                    <input type="text" name="raza" value={nuevaMascota.raza} onChange={handleChange} required style={styles.input} />
                  </label>
                </div>
                
                <div style={styles.formRow}>
                  <label>Fecha de Nacimiento:
                    <input type="date" name="fechaNacimiento" value={nuevaMascota.fechaNacimiento} onChange={handleChange} required style={styles.input} />
                  </label>
                  <label>Propietario:
                    <select name="propietarioId" value={nuevaMascota.propietarioId} onChange={handleChange} required style={styles.input}>
                       <option value={0} disabled>Seleccione un propietario...</option>
                      {propietarios.map(prop => (
                        <option key={prop.id} value={prop.id}>{prop.nombre} ({prop.telefono})</option>
                      ))}
                    </select>
                  </label>
                </div>

                <button type="submit" style={styles.button}>
                  Registrar Paciente
                </button>
              </form>
            </section>

            <hr style={styles.hr} />

            {/* Sección de Listado de Mascotas */}
            <section style={styles.section}>
              <h2>📋 Listado de Pacientes </h2>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Especie</th>
                    <th style={styles.th}>Raza</th>
                    <th style={styles.th}>Fecha Nac.</th>
                    <th style={styles.th}>Propietario</th>
                  </tr>
                </thead>
                <tbody>
                  {mascotas.map(m => (
                    <tr key={m.id}>
                      <td style={styles.td}>{m.id}</td>
                      <td style={styles.td}>{m.nombre}</td>
                      <td style={styles.td}>{m.especie}</td>
                      <td style={styles.td}>{m.raza}</td>
                      <td style={styles.td}>{m.fechaNacimiento}</td>
                      <td style={styles.td}>{getNombrePropietario(m.propietarioId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {mascotas.length === 0 && <p style={{ textAlign: 'center', marginTop: '15px' }}>No hay mascotas registradas.</p>}
            </section>
          </>
      )}
    </div>
  );
};



const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: 'Verdana, sans-serif',
        maxWidth: '1100px',
        margin: '30px auto',
        padding: '25px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
    hr: {
        border: '0',
        borderTop: '1px solid #ccc',
        margin: '25px 0',
    },
    section: {
        marginBottom: '30px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '15px',
        padding: '15px',
        border: '1px solid #eee',
        borderRadius: '5px',
        backgroundColor: '#f8f8f8',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '12px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
    },
    th: {
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '12px 8px',
        textAlign: 'left',
        border: '1px solid #0056b3',
    },
    td: {
        border: '1px solid #eee',
        padding: '10px 8px',
    },
};