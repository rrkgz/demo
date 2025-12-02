import React, { useState } from 'react';


interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  propietario: string;
  fechaVisita: string; 
  diagnostico: string;
}


const datosIniciales: Mascota[] = [
  { id: 1, nombre: 'Mishi', especie: 'Gato', propietario: 'Ana Gómez', fechaVisita: '2023-11-20', diagnostico: 'Vacunación anual' },
  { id: 2, nombre: 'Roco', especie: 'Perro', propietario: 'Luis Torres', fechaVisita: '2023-10-15', diagnostico: 'Fractura de pata' },
];


const HistorialMascotas: React.FC = () => {
 
  const [mascotas, setMascotas] = useState<Mascota[]>(datosIniciales);
 
  const [nuevaMascota, setNuevaMascota] = useState<Omit<Mascota, 'id'>>({
    nombre: '',
    especie: '',
    propietario: '',
    fechaVisita: new Date().toISOString().substring(0, 10), 
    diagnostico: '',
  });

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaMascota(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nueva: Mascota = {
      ...nuevaMascota,
      id: Date.now(), 
    };

    setMascotas(prev => [...prev, nueva]); 
    
 
    setNuevaMascota({
      nombre: '',
      especie: '',
      propietario: '',
      fechaVisita: new Date().toISOString().substring(0, 10),
      diagnostico: '',
    });

    
    console.log("Nueva Mascota para persistir:", nueva);
  };

  return (
    <div className="historial-mascotas">
      <h2>🐾 Historial de Mascotas</h2>

    
      <h3>Agregar Nueva Visita</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
        <input name="nombre" value={nuevaMascota.nombre} onChange={handleInputChange} placeholder="Nombre de la Mascota" required />
        <input name="especie" value={nuevaMascota.especie} onChange={handleInputChange} placeholder="Especie" required />
        <input name="propietario" value={nuevaMascota.propietario} onChange={handleInputChange} placeholder="Nombre del Propietario" required />
        
        <label>Fecha de Visita: 
            <input type="date" name="fechaVisita" value={nuevaMascota.fechaVisita} onChange={handleInputChange} required />
        </label>
        
        <textarea name="diagnostico" value={nuevaMascota.diagnostico} onChange={handleInputChange} placeholder="Diagnóstico/Observaciones" style={{ gridColumn: '1 / 3' }} required />
        
        <button type="submit" style={{ gridColumn: '1 / 3' }}>Guardar Mascota</button>
      </form>

    
      <h3>Listado Completo</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Propietario</th>
            <th>Fecha Visita</th>
            <th>Diagnóstico</th>
          </tr>
        </thead>
        <tbody>
          {mascotas.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{m.nombre}</td>
              <td>{m.especie}</td>
              <td>{m.propietario}</td>
              <td>{m.fechaVisita}</td>
              <td>{m.diagnostico}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialMascotas;