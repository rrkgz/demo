import React, { useState } from 'react';


interface Paciente {
  id: number;
  nombre: string;
  especie: 'perro' | 'gato' | 'otro';
}


interface Tratamiento {
  id: string;
  pacienteId: number;
  descripcion: string;
  fechaInicio: string;
  costo: number; 
}


interface NuevoTratamiento {
  pacienteId: number;
  descripcion: string;
  fechaInicio: string;
  costo: number;
}



const pacientesMock: Paciente[] = [
  { id: 1, nombre: 'Max', especie: 'perro' },
  { id: 2, nombre: 'Luna', especie: 'gato' },
  { id: 3, nombre: 'Coco', especie: 'otro' },
];

export const GestionTratamientos: React.FC = () => {

  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([
    { id: 'T001', pacienteId: 1, descripcion: 'Vacunación Anual', fechaInicio: '2025-11-20', costo: 45.50 },
    { id: 'T002', pacienteId: 2, descripcion: 'Revisión Dental', fechaInicio: '2025-11-25', costo: 78.00 },
  ]);


  const [nuevoTratamiento, setNuevoTratamiento] = useState<NuevoTratamiento>({
    pacienteId: pacientesMock[0].id,
    descripcion: '',
    fechaInicio: new Date().toISOString().split('T')[0], 
    costo: 0,
  });

  const getNombrePaciente = (pacienteId: number): string => {
    const paciente = pacientesMock.find(p => p.id === pacienteId);
    return paciente ? paciente.nombre : 'Desconocido';
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
    if (nuevoTratamiento.descripcion.trim() === '' || nuevoTratamiento.costo <= 0) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }

    const nuevoId = `T${(tratamientos.length + 1).toString().padStart(3, '0')}`;

    const nuevo: Tratamiento = {
      ...nuevoTratamiento,
      id: nuevoId,
    };

    setTratamientos([...tratamientos, nuevo]);

  
    setNuevoTratamiento({
        pacienteId: pacientesMock[0].id,
        descripcion: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        costo: 0,
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <h1> Gestión de Tratamientos Veterinarios</h1>
      </header>
      
      <hr />

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
            >
              {pacientesMock.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} ({p.especie})</option>
              ))}
            </select>
          </div>

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

          <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{getNombrePaciente(t.pacienteId)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.descripcion}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.fechaInicio}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{t.costo.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tratamientos.length === 0 && <p style={{ textAlign: 'center', marginTop: '10px' }}>No hay tratamientos registrados.</p>}
      </section>
    </div>
  );
};