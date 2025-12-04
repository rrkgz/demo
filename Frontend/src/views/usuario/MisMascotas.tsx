import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Mascota {
  id_mascota: number;
  rut_cliente: number;
  id_veterinario?: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  peso: number;
  sexo: boolean;
}

export default function MisMascotas() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMascota, setEditingMascota] = useState<Mascota | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    peso: '',
    sexo: ''
  });

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🐾 Cargando mascotas, token:', token ? 'OK' : 'FALTA TOKEN');
      
      const response = await fetch(`${API_URL}/mascotas`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Mascotas:', data.length);
        setMascotas(Array.isArray(data) ? data : []);
      } else {
        console.log('❌ Error:', response.status);
        setError('Error al cargar mascotas');
      }
      setLoading(false);
    } catch (err) {
      console.log('❌ Error de red:', err);
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('📝 Enviando mascota, token:', token ? 'OK' : 'FALTA');
      
      const url = editingMascota 
        ? `${API_URL}/mascotas/${editingMascota.id_mascota}`
        : `${API_URL}/mascotas`;
      
      const method = editingMascota ? 'PUT' : 'POST';
      
      const payload: any = {
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza || '',
        sexo: formData.sexo === '1'
      };
      
      // Solo incluir edad si tiene valor
      if (formData.edad) {
        payload.edad = parseInt(formData.edad);
      }
      
      // Solo incluir peso si tiene valor
      if (formData.peso) {
        payload.peso = parseFloat(formData.peso);
      }
      
      console.log('📦 Payload:', payload);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('📡 Respuesta:', response.status);
      
      if (response.ok) {
        console.log('✅ Mascota guardada');
        setShowModal(false);
        resetForm();
        cargarMascotas();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al guardar mascota');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    }
  };

  const handleEdit = (mascota: Mascota) => {
    setEditingMascota(mascota);
    setFormData({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza || '',
      edad: mascota.edad?.toString() || '',
      peso: mascota.peso?.toString() || '',
      sexo: mascota.sexo ? '1' : '0'
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/mascotas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        cargarMascotas();
      } else {
        setError('Error al eliminar mascota');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      especie: '',
      raza: '',
      edad: '',
      peso: '',
      sexo: ''
    });
    setEditingMascota(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) return <div className="container py-5 text-center">Cargando...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Mis Mascotas</h2>
        <button onClick={handleOpenModal} className="btn btn-primary">
          <span className="bi bi-plus-circle me-2"></span>
          Agregar Mascota
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {mascotas.length === 0 ? (
        <div className="text-center py-5">
          <span className="bi bi-heart" style={{ fontSize: 64, color: '#ccc' }}></span>
          <p className="text-muted mt-3">No tienes mascotas registradas</p>
          <button onClick={handleOpenModal} className="btn btn-primary mt-2">
            Agregar tu primera mascota
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {mascotas.map(mascota => (
            <div key={mascota.id_mascota} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="bi bi-heart-fill" style={{ fontSize: 32, color: '#e63946' }}></span>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <span className="bi bi-three-dots-vertical"></span>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button className="dropdown-item" onClick={() => handleEdit(mascota)}>
                            <span className="bi bi-pencil me-2"></span>Editar
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item text-danger" onClick={() => handleDelete(mascota.id_mascota)}>
                            <span className="bi bi-trash me-2"></span>Eliminar
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <h5 className="card-title fw-bold">{mascota.nombre}</h5>
                  <p className="card-text text-muted mb-2">
                    <strong>Especie:</strong> {mascota.especie}
                  </p>
                  {mascota.raza && (
                    <p className="card-text text-muted mb-2">
                      <strong>Raza:</strong> {mascota.raza}
                    </p>
                  )}
                  {mascota.edad && (
                    <p className="card-text text-muted mb-2">
                      <strong>Edad:</strong> {mascota.edad} {mascota.edad === 1 ? 'año' : 'años'}
                    </p>
                  )}
                  {mascota.peso && (
                    <p className="card-text text-muted mb-2">
                      <strong>Peso:</strong> {mascota.peso} kg
                    </p>
                  )}
                  <p className="card-text mb-1">
                    <strong>Sexo:</strong> {mascota.sexo ? 'Macho' : 'Hembra'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingMascota ? 'Editar Mascota' : 'Agregar Mascota'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Especie *</label>
                    <select
                      className="form-control"
                      value={formData.especie}
                      onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
                      required
                    >
                      <option value="">Selecciona...</option>
                      <option value="Perro">Perro</option>
                      <option value="Gato">Gato</option>
                      <option value="Ave">Ave</option>
                      <option value="Conejo">Conejo</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Raza</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.raza}
                      onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                      placeholder="Opcional"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Edad (años)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={formData.edad}
                      onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                      placeholder="Ej: 3 (opcional)"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-control"
                      value={formData.peso}
                      onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                      placeholder="Ej: 5.5 (opcional)"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Sexo</label>
                    <select
                      className="form-control"
                      value={formData.sexo}
                      onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                    >
                      <option value="0">Hembra</option>
                      <option value="1">Macho</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingMascota ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
