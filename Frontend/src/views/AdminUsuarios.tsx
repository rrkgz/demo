
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No autenticado. Inicia sesión.');
      return;
    }
    const fetchUsuarios = async () => {
      try {
        const res = await fetch(`${API_URL}/usuarios`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Error al obtener usuarios');
          return;
        }
        setUsuarios(data);
      } catch (err) {
        setError('Error de red o servidor');
      }
    };
    fetchUsuarios();
  }, [token]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ minWidth: 350, maxWidth: 500 }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4" style={{ fontWeight: 700, letterSpacing: 1 }}>Administrar Usuarios</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u: any) => (
                  <tr key={u.email}>
                    <td>{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
