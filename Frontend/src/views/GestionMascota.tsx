import React, { useState } from 'react';


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


interface NuevaMascota {
  nombre: string;
  especie: Mascota['especie'];
  raza: string;
  fechaNacimiento: string;
  propietarioId: number;
}

const ESPECIES_DISPONIBLES: Mascota['especie'][] = ['Perro', 'Gato', 'Ave', 'Reptil', 'Otro'];



const propietariosMock: Propietario[] = [
  { id: 101, nombre: 'Andrea Rojas', telefono: '555-1234' },
  { id: 102, nombre: 'Javier Soto', telefono: '555-5678' },
];

const mascotasMock: Mascota[] = [
  { id: 1, nombre: 'Max', especie: 'Perro', raza: 'Labrador', fechaNacimiento: '2020-05-15', propietarioId: 101 },
  { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Siamés', fechaNacimiento: '2022-01-20', propietarioId: 102 },
  { id: 3, nombre: 'Coco', especie: 'Ave', raza: 'Periquito', fechaNacimiento: '2023-10-01', propietarioId: 101 },
];



export const GestionMascotas: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>(mascotasMock);
  const [propietarios] = useState<Propietario[]>(propietariosMock);

  
  const [nuevaMascota, setNuevaMascota] = useState<NuevaMascota>({
    nombre: '',
    especie: 'Perro', 
    raza: '',
    fechaNacimiento: new Date().toISOString().split('T')[0], 
    propietarioId: propietariosMock[0]?.id || 0, 
  });

  const getNombrePropietario = (propietarioId: number): string => {
    const propietario = propietarios.find(p => p.id === propietarioId);
    return propietario ? propietario.nombre : 'Desconocido';
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaMascota(prev => ({
      ...prev,
      [name]: name === 'propietarioId' ? Number(value) : value,
    }));
  };


  const generarNuevoId = (list: { id: number }[]): number => {
    const maxId = list.reduce((max, item) => (item.id > max ? item.id : max), 0);
    return maxId + 1;
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaMascota.nombre || !nuevaMascota.raza || nuevaMascota.propietarioId === 0) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }

    const nueva: Mascota = {
      ...nuevaMascota,
      id: generarNuevoId(mascotas),
    };

    setMascotas([...mascotas, nueva]);


    setNuevaMascota({
        nombre: '',
        especie: 'Perro',
        raza: '',
        fechaNacimiento: new Date().toISOString().split('T')[0],
        propietarioId: propietariosMock[0]?.id || 0,
    });
  };

  return (
    <div style={styles.container}>
      <header>
        <h1>🐾 Gestión de Pacientes (Mascotas)</h1>
        <p>Total de mascotas registradas: **{mascotas.length}**</p>
      </header>

      <hr style={styles.hr} />

  
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