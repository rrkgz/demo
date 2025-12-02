import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function InicioSesionAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/iniciar-sesion-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token de admin en localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', email);
        navigate('/panel-admin');
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <span className="bi bi-shield-lock" style={{ fontSize: 64, color: '#7b2cbf' }}></span>
                  </div>
                  <h2 className="fw-bold">Acceso Administrador</h2>
                  <p className="text-muted">Ingresa tus credenciales de administrador</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@example.com"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-lg w-100 text-white"
                    style={{ backgroundColor: '#7b2cbf' }}
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <Link to="/menu-principal" className="text-decoration-none text-muted">
                    <span className="bi bi-arrow-left me-2"></span>
                    Volver al menú principal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
