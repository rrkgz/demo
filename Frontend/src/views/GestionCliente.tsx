import React, { useState } from 'react';


interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}


interface NuevoCliente {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}



const clientesMock: Cliente[] = [
  { id: 101, nombre: 'Andrea', apellido: 'Rojas', email: 'andrea.r@mail.com', telefono: '555-1234', direccion: 'Calle Falsa 123' },
  { id: 102, nombre: 'Javier', apellido: 'Soto', email: 'javier.s@mail.com', telefono: '555-5678', direccion: 'Av. Siempre Viva 742' },
];



export const GestionClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesMock);
  const [nuevoCliente, setNuevoCliente] = useState<NuevoCliente>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoCliente(prev => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const generarNuevoId = (list: { id: number }[]): number => {
    const maxId = list.reduce((max, item) => (item.id > max ? item.id : max), 0);
    return maxId + 1;
  };

 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCliente.nombre || !nuevoCliente.apellido || !nuevoCliente.telefono) {
        alert('Por favor, complete los campos obligatorios: Nombre, Apellido y Teléfono.');
        return;
    }

    const nuevo: Cliente = {
      ...nuevoCliente,
      id: generarNuevoId(clientes),
    };

    setClientes([...clientes, nuevo]);


    setNuevoCliente({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
    });
  };

  return (
    <div style={styles.container}>
      <header>
        <h1>👨‍👩‍👧‍👦 Gestión de Clientes (Propietarios)</h1>
        <p>Clientes registrados en la base de datos: **{clientes.length}**</p>
      </header>

      <hr style={styles.hr} />

      
      <section style={styles.section}>
        <h2>➕ Registrar Nuevo Cliente</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
            
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

     
      <section style={styles.section}>
        <h2>📋 Listado de Clientes Registrados 

[Image of table showing list of clients]
</h2>
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
      </section>
    </div>
  );
};


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