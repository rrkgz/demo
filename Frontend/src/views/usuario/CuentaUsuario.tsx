import { Link } from 'react-router-dom';

export default function CuentaUsuario() {
  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Mi Cuenta</h2>
      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">Cambiar Contraseña</h5>
              <p className="card-text text-muted">Actualiza tu contraseña de acceso</p>
              <Link to="/cambiar-pass" className="btn btn-outline-primary">Ir</Link>
            </div>
          </div>
        </div>
        {/* Se pueden agregar más opciones de perfil aquí */}
      </div>
    </div>
  );
}
