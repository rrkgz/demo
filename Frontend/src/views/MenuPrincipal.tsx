import { Link } from 'react-router-dom';

export default function MenuPrincipal() {
  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* TopBar morada */}
      <div className="text-white py-3 shadow-sm" style={{ backgroundColor: '#7b2cbf' }}>
        <div className="container d-flex align-items-center justify-content-between">
          <h1 className="h4 mb-0 fw-bold">Veterinaria Laumar</h1>
          <a href="#contacto" className="btn btn-outline-light btn-sm">Contacto</a>
        </div>
      </div>

      {/* Hero principal */}
      <div className="container py-5">
        <div className="row align-items-center gy-4">
          <div className="col-lg-7">
            <h2 className="display-5 fw-bold lh-1 mb-3" style={{ maxWidth: 800 }}>
              El bienestar de tu mascota, más sano y feliz,  <span style={{ color: '#7b2cbf' }}> con nuestros servicios pensados para ellos.</span>
            </h2>
            <p className="lead text-muted" style={{ maxWidth: 720 }}>
              ¡Agenda una cita en nuestra veterinaria!
            </p>
            <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
              <Link to="/agendar-citas" className="btn btn-primary btn-lg" style={{ backgroundColor: '#3b5bdb', borderColor: '#3b5bdb' }}>
                Agendar cita
              </Link>
            </div>
            <ul className="list-unstyled mt-4 text-muted">
              <li className="mb-2"><span className="bi bi-check-circle-fill text-success me-2"></span>Veterinarios de calidad</li>
              <li className="mb-2"><span className="bi bi-check-circle-fill text-success me-2"></span>Ubicados en Villa Alemana</li>
              <li className="mb-2"><span className="bi bi-check-circle-fill text-success me-2"></span>De lunes a domingo</li>
            </ul>
          </div>
          <div className="col-lg-5">
            <div className="ratio ratio-4x3 rounded-4 shadow-sm" style={{ backgroundImage: `url('https://images..com/photo-1559440167-1148eecee05e?q=80&w=1200&auto=format&fi=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          </div>
        </div>
      </div>

      {/* Accesos rápidos orientados al cliente */}
      <div className="container pb-5">
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
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
            <div className="card h-100 shadow-sm border-0">
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
            <div className="card h-100 shadow-sm border-0">
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
            <div className="card h-100 shadow-sm border-0">
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
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span className="bi bi-person-circle" style={{ fontSize: 48, color: '#7b2cbf' }}></span>
                </div>
                <h5 className="card-title fw-bold">Mi Cuenta</h5>
                <p className="card-text text-muted">Actualiza tus datos y contraseña</p>
                <Link to="/cuenta" className="btn btn-outline-primary">Ir</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer de contacto */}
      <footer id="contacto" className="text-white mt-auto" style={{ backgroundColor: '#5f3dc4' }}>
        <div className="container py-5">
          <div className="row g-5 align-items-start">
            <div className="col-md-6">
              <h3 className="fw-bold mb-0">Veterinaria Laumar</h3>
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <h5 className="fw-bold">¿Necesitas ayuda?</h5>
                <p className="mb-1">WhatsApp: <a className="link-light" href="https://wa.me/56937144441" target="_blank" rel="noopener noreferrer">+56 9 3714 4441</a></p>
                <p className="mb-0">Correo: <a className="link-light" href="mailto:laumar.veterinaria@gmail.com">laumar.veterinaria@gmail.com</a></p>
              </div>
              <div>
                <h5 className="fw-bold">Ubicados en:</h5>
                <p className="mb-0">Freire 256, Valparaíso</p>
                <p className="mb-0">Villa Alemana</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
