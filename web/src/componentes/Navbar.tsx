import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';
import marvelLogo from '../assets/marvel-logo.png';

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 15h6v4h-6z" />
    </svg>
  );
}

export function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();

  const salir = async () => {
    await cerrarSesion();
    navegar('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar__beam" />
      <div className="navbar__marca navbar__marca--logo">
        <img src={marvelLogo} alt="Marvel" className="navbar__logo-image" />
        <div>
          <span className="navbar__sub navbar__sub--full">HERO CONTROL SYSTEM</span>
        </div>
      </div>

      <nav className="navbar__links" aria-label="Navegación principal">
        <NavLink to="/heroes" className={({ isActive }) => (isActive ? 'activo' : '')}>
          <span>01</span>
          Superhéroes
        </NavLink>
        <NavLink to="/misiones" className={({ isActive }) => (isActive ? 'activo' : '')}>
          <span>02</span>
          Misiones
        </NavLink>
      </nav>

      <div className="navbar__usuario">
        <div className="navbar__status">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>
        <div className="navbar__datos">
          <small>OPERADOR</small>
          <strong>{usuario?.nombre}</strong>
          <span className={`etiqueta etiqueta--${usuario?.rol === 'ADMIN' ? 'admin' : 'consulta'}`}>
            SECURITY: {usuario?.rol}
          </span>
        </div>
        <button className="icon-button icon-button--logout" onClick={salir} title="Cerrar sesión" aria-label="Cerrar sesión">
          <GridIcon />
        </button>
      </div>
    </header>
  );
}
