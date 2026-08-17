import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexto/AuthContext';
import { Cargando } from './Estados';

/**
 * Envuelve las rutas privadas: sin sesion activa redirige al login y recuerda
 * a donde queria entrar el usuario.
 */
export function RutaProtegida() {
  const { usuario, cargandoSesion } = useAuth();
  const ubicacion = useLocation();

  if (cargandoSesion) return <Cargando texto="Verificando sesion..." />;
  if (!usuario) return <Navigate to="/login" state={{ desde: ubicacion.pathname }} replace />;

  return <Outlet />;
}

/** Rutas que solo puede abrir un ADMIN (crear y editar). */
export function RutaAdmin() {
  const { esAdmin } = useAuth();
  if (!esAdmin) return <Navigate to="/heroes" replace />;
  return <Outlet />;
}
