import { api } from './cliente';
import type { Mision, RespuestaLista, Superheroe, Usuario } from '../tipos';

// ------------------------------------------------------------------- sesion
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

// --------------------------------------------------------------- superheroes
export type DatosHeroe = Omit<Superheroe, 'id' | 'misiones'>;

export const servicioHeroes = {
  listar: async (nombre?: string) => {
    const { data } = await api.get<RespuestaLista<Superheroe>>('/heroes', {
      params: nombre ? { nombre } : undefined,
    });
    return data.datos;
  },
  obtener: async (id: number) => {
    const { data } = await api.get<Superheroe>(`/heroes/${id}`);
    return data;
  },
  crear: async (heroe: DatosHeroe) => {
    const { data } = await api.post<Superheroe>('/heroes', heroe);
    return data;
  },
  actualizar: async (id: number, heroe: Partial<DatosHeroe>) => {
    const { data } = await api.put<Superheroe>(`/heroes/${id}`, heroe);
    return data;
  },
  eliminar: async (id: number) => {
    await api.delete(`/heroes/${id}`);
  },
};

// ------------------------------------------------------------------ misiones
export type DatosMision = Omit<Mision, 'id' | 'superheroe'>;

export const servicioMisiones = {
  listar: async () => {
    const { data } = await api.get<RespuestaLista<Mision>>('/misiones');
    return data.datos;
  },
  obtener: async (id: number) => {
    const { data } = await api.get<Mision>(`/misiones/${id}`);
    return data;
  },
  crear: async (mision: DatosMision) => {
    const { data } = await api.post<Mision>('/misiones', mision);
    return data;
  },
  actualizar: async (id: number, mision: Partial<DatosMision>) => {
    const { data } = await api.put<Mision>(`/misiones/${id}`, mision);
    return data;
  },
  eliminar: async (id: number) => {
    await api.delete(`/misiones/${id}`);
  },
};
