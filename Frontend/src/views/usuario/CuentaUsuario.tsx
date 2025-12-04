import { Link } from 'react-router-dom';

export default function CuentaUsuario() {
  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Mi Cuenta</h2>
      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="mb-3">
                <span className="bi bi-heart-fill" style={{ fontSize: 40, color: '#e63946' }}></span>
              </div>
              <h5 className="card-title fw-bold">Mis Mascotas</h5>
              <p className="card-text text-muted">Administra los datos de tus mascotas</p>
              <Link to="/mis-mascotas" className="btn btn-outline-danger">Ver Mascotas</Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="mb-3">
                <span className="bi bi-key-fill" style={{ fontSize: 40, color: '#7b2cbf' }}></span>
              </div>
              <h5 className="card-title fw-bold">Cambiar Contraseña</h5>
              <p className="card-text text-muted">Actualiza tu contraseña de acceso</p>
              <Link to="/cambiar-pass" className="btn btn-outline-primary">Ir</Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0 border-warning" style={{ borderWidth: '2px' }}>
            <div className="card-body">
              <div className="mb-3">
                <span className="bi bi-shield-lock-fill" style={{ fontSize: 40, color: '#f59e0b' }}></span>
              </div>
              <h5 className="card-title fw-bold">Acceso Administrador</h5>
              <p className="card-text text-muted">Panel de administración veterinaria</p>
              <Link to="/iniciar-sesion-admin" className="btn btn-warning">Ingresar</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
