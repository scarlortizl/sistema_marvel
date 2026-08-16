import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { servicioAuth } from '../api/servicios';
import { CLAVE_TOKEN, CLAVE_USUARIO } from '../config';
import type { Usuario } from '../tipos';

interface ValorAuth {
  usuario: Usuario | null;
  cargandoSesion: boolean;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<ValorAuth | null>(null);

/** Maneja la sesion del usuario y guarda el JWT en AsyncStorage. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // Al abrir la app se recupera la sesion guardada en el dispositivo.
  useEffect(() => {
    const restaurar = async () => {
      try {
        const token = await AsyncStorage.getItem(CLAVE_TOKEN);
        if (!token) return;

        // Se muestra de inmediato el usuario guardado y luego se valida con la API.
        const guardado = await AsyncStorage.getItem(CLAVE_USUARIO);
        if (guardado) setUsuario(JSON.parse(guardado));

        const perfil = await servicioAuth.perfil();
        setUsuario(perfil);
        await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(perfil));
      } catch {
        // Token vencido o revocado: se limpia la sesion local.
        await AsyncStorage.multiRemove([CLAVE_TOKEN, CLAVE_USUARIO]);
        setUsuario(null);
      } finally {
        setCargandoSesion(false);
      }
    };

    restaurar();
  }, []);

  const iniciarSesion = async (email: string, password: string) => {
    const { usuario: datos, token } = await servicioAuth.login(email, password);
    await AsyncStorage.setItem(CLAVE_TOKEN, token);
    await AsyncStorage.setItem(CLAVE_USUARIO, JSON.stringify(datos));
    setUsuario(datos);
  };

  const cerrarSesion = async () => {
    try {
      await servicioAuth.logout();
    } catch {
      // Si la API no responde igual se cierra la sesion en el dispositivo.
    }
    await AsyncStorage.multiRemove([CLAVE_TOKEN, CLAVE_USUARIO]);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargandoSesion, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return contexto;
}
