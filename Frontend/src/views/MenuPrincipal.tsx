import { Link } from 'react-router-dom';

export default function MenuPrincipal() {
  return (
    <div className="min-vh-100 bg-light">
      {/* TopBar morada */}
      <div className="bg-purple text-white py-3 shadow-sm" style={{ backgroundColor: '#7b2cbf' }}>
        <div className="container-fluid">
          <h1 className="h3 mb-0 fw-bold text-center">Veterinaria Laumar</h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 hover-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-calendar-check" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Agendar Cita</h5>
                <p className="card-text text-muted">Reserva una hora para tu mascota</p>
                <Link to="/agendar-citas" className="btn btn-outline-primary">Ir</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 hover-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-clock-history" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Mis Citas</h5>
                <p className="card-text text-muted">Revisa y gestiona tus citas</p>
                <Link to="/mis-citas" className="btn btn-outline-primary">Ir</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 hover-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-file-medical" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Historial Médico</h5>
                <p className="card-text text-muted">Consulta el historial de tus mascotas</p>
                <Link to="/historial" className="btn btn-outline-primary">Ir</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 hover-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-bag" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Catálogo</h5>
                <p className="card-text text-muted">Explora nuestros productos</p>
                <Link to="/catalogo" className="btn btn-outline-primary">Ir</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 hover-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-whatsapp" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Contacto</h5>
                <p className="card-text text-muted">Comunícate con nosotros</p>
                <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success">WhatsApp</a>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 hover-shadow">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-person-circle" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Mi Cuenta</h5>
                <p className="card-text text-muted">Gestiona tu perfil</p>
                <Link to="/cambiar-pass" className="btn btn-outline-primary">Ir</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
