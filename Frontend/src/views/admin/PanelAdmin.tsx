import { Link, useNavigate } from 'react-router-dom';

export default function PanelAdmin() {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/menu-principal');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="text-white py-4 shadow-sm" style={{ backgroundColor: '#7b2cbf' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0 fw-bold">Sistema de Administración - Veterinaria Laumar</h1>
          <button onClick={handleCerrarSesion} className="btn btn-outline-light">
            <span className="bi bi-box-arrow-right me-2"></span>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Panel de administración */}
      <div className="container py-5">
        <h2 className="mb-4">Módulos de Administración</h2>
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-people" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Veterinarios</h5>
                <p className="card-text text-muted">Gestionar veterinarios del sistema</p>
                <Link to="/admin/veterinarios" className="btn btn-primary">Administrar</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-person-badge" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Clientes</h5>
                <p className="card-text text-muted">Gestionar clientes registrados</p>
                <Link to="/admin/clientes" className="btn btn-primary">Administrar</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-heart" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Mascotas</h5>
                <p className="card-text text-muted">Gestionar mascotas registradas</p>
                <Link to="/admin/mascotas" className="btn btn-primary">Administrar</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-calendar-check" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Agendar Citas</h5>
                <p className="card-text text-muted">Agendar citas para clientes</p>
                <Link to="/admin/agendar-citas" className="btn btn-primary">Agendar</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-capsule" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Tratamientos</h5>
                <p className="card-text text-muted">Registrar tratamientos médicos</p>
                <Link to="/admin/tratamientos" className="btn btn-primary">Administrar</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-file-earmark-text" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Reportes</h5>
                <p className="card-text text-muted">Generar informes y listados</p>
                <Link to="/admin/reportes" className="btn btn-primary">Ver</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-receipt" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Boletas</h5>
                <p className="card-text text-muted">Generar boletas digitales</p>
                <Link to="/admin/boletas" className="btn btn-primary">Administrar</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-people-fill" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Usuarios</h5>
                <p className="card-text text-muted">Gestionar cuentas de usuario</p>
                <Link to="/admin/usuarios" className="btn btn-primary">Administrar</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
