import { api } from './cliente';
import type { Mision, Superheroe, Usuario } from '../tipos';

interface Lista<T> {
  total: number;
  datos: T[];
}

export const servicioAuth = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<{ usuario: Usuario; token: string }>('/auth/login', {
      email,
      password,
    });
    return data;
  },
  perfil: async () => {
    const { data } = await api.get<{ usuario: Usuario }>('/auth/me');
    return data.usuario;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
};

export const servicioHeroes = {
  listar: async (nombre?: string) => {
    const { data } = await api.get<Lista<Superheroe>>('/heroes', {
      params: nombre ? { nombre } : undefined,
    });
    return data.datos;
  },
  obtener: async (id: number) => {
    const { data } = await api.get<Superheroe>(`/heroes/${id}`);
    return data;
  },
};

export const servicioMisiones = {
  listar: async () => {
    const { data } = await api.get<Lista<Mision>>('/misiones');
    return data.datos;
  },
};
