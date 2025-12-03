import { NavLink } from 'react-router-dom';

export default function NavBar() {

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2" style={{ fontSize: 24, letterSpacing: 1 }}>
          <span className="bi bi-gem" style={{ fontSize: 28 }}></span>
          Proyecto TSI
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <NavLink to="/menu-principal" className={({ isActive }) => `nav-link px-3 rounded-3 fw-semibold ${isActive ? 'bg-white text-primary shadow-sm' : 'text-white'}`}>
                <span className="bi bi-house me-1"></span>
                Menú Principal
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/catalogo" className={({ isActive }) => `nav-link px-3 rounded-3 fw-semibold ${isActive ? 'bg-white text-primary shadow-sm' : 'text-white'}`}>
                <span className="bi bi-bag me-1"></span>
                Catálogo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cuenta" className={({ isActive }) => `nav-link px-3 rounded-3 fw-semibold ${isActive ? 'bg-white text-primary shadow-sm' : 'text-white'}`}>
                <span className="bi bi-person me-1"></span>
                Mi Cuenta
              </NavLink>
            </li>
        </ul>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/iniciar-sesion'; }} className="btn btn-outline-light btn-sm">
              <span className="bi bi-box-arrow-right me-1"></span>
              Cerrar Sesión
            </button>
          </li>
        </ul>
        </div>
      </div>
    </nav>
  );
}