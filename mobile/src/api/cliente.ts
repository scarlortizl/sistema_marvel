import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL, CLAVE_TOKEN } from '../config';

export const api = axios.create({ baseURL: API_URL, timeout: 15000 });

// Antes de cada peticion se lee el token guardado en AsyncStorage.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(CLAVE_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Traduce el error de axios a un mensaje entendible en pantalla. */
export function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: string; detalles?: { campo: string; mensaje: string }[] }
      | undefined;

    if (data?.detalles?.length) return data.detalles.map((d) => d.mensaje).join('\n');
    if (data?.error) return data.error;
    if (error.code === 'ECONNABORTED') return 'La API tardo demasiado en responder.';
    if (error.code === 'ERR_NETWORK') {
      return `No se pudo conectar con la API (${API_URL}).\n\nVerifique que el backend este encendido y que el celular este en la misma red WiFi que el computador.`;
    }
  }
  return 'Ocurrio un error inesperado';
}
