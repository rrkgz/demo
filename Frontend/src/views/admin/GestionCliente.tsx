import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

type NuevoCliente = Omit<Cliente, 'id'>;

export const GestionClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [nuevoCliente, setNuevoCliente] = useState<NuevoCliente>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  });
  const navigate = useNavigate();

  // Función para obtener el token y manejar la no autenticación
  const getToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirigir si no hay token (no autenticado)
      navigate('/iniciar-sesion');
      alert('Sesión expirada o no iniciada. Por favor, inicie sesión.');
      return null;
    }
    return token;
  };

  // --- Operaciones de API (Autenticadas) ---

  const fetchClientes = async () => {
    const token = getToken();
    if (!token) return;

    setCargando(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/clientes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluir el token en la cabecera
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Fallo al cargar clientes');
      }

      const data: Cliente[] = await res.json();
      setClientes(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de red o servidor al cargar clientes');
      // Opcional: si el error es 401/403, forzar logout/redirigir
    } finally {
      setCargando(false);
    }
  };

  const registrarCliente = async (cliente: NuevoCliente) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluir el token
        },
        body: JSON.stringify(cliente),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Fallo al registrar cliente');
      }

      // Asumimos que el servidor devuelve el cliente creado (con ID)
      const nuevo: Cliente = await res.json();
      setClientes(prev => [...prev, nuevo]);
      
      // Limpiar formulario
      setNuevoCliente({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          direccion: '',
      });
      alert(`Cliente ${nuevo.nombre} ${nuevo.apellido} registrado con éxito.`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de red o servidor al registrar cliente');
    }
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []); 

  // --- Manejo del Formulario ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoCliente(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCliente.nombre || !nuevoCliente.apellido || !nuevoCliente.telefono) {
        alert('Por favor, complete los campos obligatorios: Nombre, Apellido y Teléfono.');
        return;
    }
    registrarCliente(nuevoCliente);
  };
  
  // --- Renderizado (Se mantiene el JSX y estilos originales) ---

  return (
    <div style={styles.container}>
      <header>
        <h1>👨‍👩‍👧‍👦 Gestión de Clientes</h1>
        <p>Clientes registrados: **{clientes.length}**</p>
      </header>

      <hr style={styles.hr} />

      {error && <p style={{ color: "red", padding: '10px', border: '1px solid red', borderRadius: '5px' }}>Error: {error}</p>}
      
      {/* Sección de Registrar Cliente */}
      <section style={styles.section}>
        <h2>➕ Registrar Nuevo Cliente</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* ... Controles de Formulario ... (Mismos que el original) */}
          <div style={styles.formRow}>
            <label>Nombre (*):
              <input type="text" name="nombre" value={nuevoCliente.nombre} onChange={handleChange} required style={styles.input} />
            </label>
            <label>Apellido (*):
              <input type="text" name="apellido" value={nuevoCliente.apellido} onChange={handleChange} required style={styles.input} />
            </label>
          </div>
          <div style={styles.formRow}>
            <label>Teléfono (*):
              <input type="tel" name="telefono" value={nuevoCliente.telefono} onChange={handleChange} required style={styles.input} />
            </label>
            <label>Email:
              <input type="email" name="email" value={nuevoCliente.email} onChange={handleChange} style={styles.input} />
            </label>
          </div>
          <div>
            <label>Dirección:
              <input type="text" name="direccion" value={nuevoCliente.direccion} onChange={handleChange} style={styles.input} />
            </label>
          </div>

          <button type="submit" style={styles.button}>
            Registrar Cliente
          </button>
        </form>
      </section>

      <hr style={styles.hr} />

      {/* Sección de Listado de Clientes */}
      <section style={styles.section}>
        <h2>📋 Listado de Clientes Registrados</h2>
        
        {cargando ? (
            <p style={{ textAlign: 'center' }}>Cargando clientes...</p>
        ) : (
            <>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Nombre Completo</th>
                      <th style={styles.th}>Teléfono</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Dirección</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map(c => (
                      <tr key={c.id}>
                        <td style={styles.td}>{c.id}</td>
                        <td style={styles.td}>**{c.nombre} {c.apellido}**</td>
                        <td style={styles.td}>{c.telefono}</td>
                        <td style={styles.td}>{c.email || '-'}</td>
                        <td style={styles.td}>{c.direccion || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {clientes.length === 0 && <p style={{ textAlign: 'center', marginTop: '15px' }}>No hay clientes registrados.</p>}
            </>
        )}
      </section>
    </div>
  );
};


// Estilos (Se mantienen los originales)
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: 'Roboto, sans-serif',
        maxWidth: '1000px',
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
        gridTemplateColumns: '1fr 1fr', 
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