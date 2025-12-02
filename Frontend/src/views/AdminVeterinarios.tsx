import { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Veterinario {
  email: string;
  nombre: string;
  especialidad: string;
  estado: string;
}

export default function AdminVeterinarios() {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [form, setForm] = useState({ email: '', nombre: '', especialidad: '', estado: 'activo', password: '' });
  const [editando, setEditando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarVeterinarios();
  }, []);

  const cargarVeterinarios = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/veterinarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setVeterinarios(data);
    } catch (err) {
      setError('Error al cargar veterinarios');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const token = localStorage.getItem('adminToken');
      const url = editando
        ? `${API_URL}/veterinarios/${editando}`
        : `${API_URL}/veterinarios`;
      const method = editando ? 'PUT' : 'POST';

      const body: any = { nombre: form.nombre, especialidad: form.especialidad, estado: form.estado };
      if (!editando) {
        body.email = form.email;
        body.password = form.password;
      } else if (form.password) {
        body.password = form.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al guardar veterinario');
        return;
      }

      setMensaje(editando ? 'Veterinario modificado con éxito ✅' : 'El veterinario ha sido agregado con éxito ✅');
      setForm({ email: '', nombre: '', especialidad: '', estado: 'activo', password: '' });
      setEditando(null);
      cargarVeterinarios();
    } catch (err) {
      setError('Error de red o servidor');
    }
  };

  const handleEliminar = async (email: string) => {
    if (!confirm('¿Seguro que deseas eliminar este veterinario?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/veterinarios/${email}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setMensaje('Veterinario eliminado correctamente');
        cargarVeterinarios();
      } else {
        setError('Error al eliminar veterinario');
      }
    } catch (err) {
      setError('Error de red o servidor');
    }
  };

  const handleModificar = (vet: Veterinario) => {
    setForm({ email: vet.email, nombre: vet.nombre, especialidad: vet.especialidad, estado: vet.estado, password: '' });
    setEditando(vet.email);
    setMensaje('');
    setError('');
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Administrar Veterinarios</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editando ? 'Modificar veterinario' : 'Crear veterinario'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!!editando}
                  required={!editando}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Especialidad"
                  value={form.especialidad}
                  onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editando}
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-success w-100">
                  {editando ? 'Guardar' : 'Crear'}
                </button>
                {editando && (
                  <button
                    type="button"
                    className="btn btn-secondary w-100 mt-1"
                    onClick={() => {
                      setEditando(null);
                      setForm({ email: '', nombre: '', especialidad: '', estado: 'activo', password: '' });
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {veterinarios.map((vet) => (
              <tr key={vet.email}>
                <td>{vet.email}</td>
                <td>{vet.nombre}</td>
                <td>{vet.especialidad || '-'}</td>
                <td>
                  <span className={`badge ${vet.estado === 'activo' ? 'bg-success' : 'bg-secondary'}`}>
                    {vet.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleModificar(vet)}>
                    Modificar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(vet.email)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
