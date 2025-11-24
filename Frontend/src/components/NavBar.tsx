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
              <NavLink to="/arriendos-activos" className={({ isActive }) => `nav-link px-3 rounded-3 fw-semibold ${isActive ? 'bg-white text-primary shadow-sm' : 'text-white'}`}>
                <span className="bi bi-lightning-charge me-1"></span>
                Arriendos Activos
              </NavLink>
            </li>
        </ul>
        </div>
      </div>
    </nav>
  );
}