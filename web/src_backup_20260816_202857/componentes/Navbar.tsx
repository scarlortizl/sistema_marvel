import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';

export function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();

  const salir = async () => {
    await cerrarSesion();
    navegar('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar__marca">
        <span className="navbar__logo">MARVEL</span>
        <span className="navbar__sub">Gestion de heroes y misiones</span>
      </div>

      <nav className="navbar__links">
        <NavLink to="/heroes" className={({ isActive }) => (isActive ? 'activo' : '')}>
          Superheroes
        </NavLink>
        <NavLink to="/misiones" className={({ isActive }) => (isActive ? 'activo' : '')}>
          Misiones
        </NavLink>
      </nav>

      <div className="navbar__usuario">
        <div className="navbar__datos">
          <strong>{usuario?.nombre}</strong>
          <span className={`etiqueta etiqueta--${usuario?.rol === 'ADMIN' ? 'admin' : 'consulta'}`}>
            {usuario?.rol}
          </span>
        </div>
        <button className="boton boton--secundario" onClick={salir}>
          Cerrar sesion
        </button>
      </div>
    </header>
  );
}
