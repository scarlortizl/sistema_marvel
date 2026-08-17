import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CLAVE_TOKEN, CLAVE_USUARIO } from '../api/cliente';
import { servicioAuth } from '../api/servicios';
import type { Usuario } from '../tipos';

interface ValorAuth {
  usuario: Usuario | null;
  esAdmin: boolean;
  cargandoSesion: boolean;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<ValorAuth | null>(null);

/**
 * Guarda la sesion (token + usuario) y la comparte con toda la aplicacion.
 * El token se conserva en localStorage para no perder la sesion al recargar.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // Al arrancar la app se verifica contra la API que el token guardado siga siendo valido.
  useEffect(() => {
    const token = localStorage.getItem(CLAVE_TOKEN);
    if (!token) {
      setCargandoSesion(false);
      return;
    }

    servicioAuth
      .perfil()
      .then((perfil) => {
        setUsuario(perfil);
        localStorage.setItem(CLAVE_USUARIO, JSON.stringify(perfil));
      })
      .catch(() => {
        localStorage.removeItem(CLAVE_TOKEN);
        localStorage.removeItem(CLAVE_USUARIO);
        setUsuario(null);
      })
      .finally(() => setCargandoSesion(false));
  }, []);

  const iniciarSesion = async (email: string, password: string) => {
    const { usuario: datosUsuario, token } = await servicioAuth.login(email, password);
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  };

  const cerrarSesion = async () => {
    try {
      // Se avisa al backend para que invalide el token (lista negra).
      await servicioAuth.logout();
    } catch {
      // Aunque falle la llamada, la sesion local siempre se limpia.
    }
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, esAdmin: usuario?.rol === 'ADMIN', cargandoSesion, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return contexto;
}
