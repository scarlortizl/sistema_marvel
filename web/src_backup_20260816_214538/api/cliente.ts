import axios from 'axios';

export const CLAVE_TOKEN = 'marvel_token';
export const CLAVE_USUARIO = 'marvel_usuario';

// Instancia unica de axios: centraliza la URL base y el envio del token.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
});

// Interceptor de peticion: adjunta el JWT guardado en localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de respuesta: si el token expiro o fue revocado, cierra la sesion.
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const esLogin = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !esLogin) {
      localStorage.removeItem(CLAVE_TOKEN);
      localStorage.removeItem(CLAVE_USUARIO);
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

/**
 * Convierte cualquier error de axios en un mensaje legible para el usuario,
 * incluyendo los detalles de validacion que devuelve el backend.
 */
export function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: string; detalles?: { campo: string; mensaje: string }[] }
      | undefined;

    if (data?.detalles?.length) {
      return data.detalles.map((d) => `${d.campo}: ${d.mensaje}`).join(' | ');
    }
    if (data?.error) return data.error;
    if (error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con la API. Verifique que el backend este ejecutandose en el puerto 4000.';
    }
  }
  return 'Ocurrio un error inesperado';
}
