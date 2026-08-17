// Tipos que devuelve la API REST del backend.

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'CONSULTA';
  creado_en?: string;
}

export interface Superheroe {
  id: number;
  nombre: string;
  nombre_real: string;
  poder_principal: string;
  nivel_poder: number;
  imagen_url: string;
  estado: 'ACTIVO' | 'INACTIVO';
  misiones?: Mision[];
}

export interface Mision {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  fecha: string;
  nivel_peligro: 'BAJO' | 'MEDIO' | 'ALTO';
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
  superheroe_id: number;
  superheroe?: Pick<Superheroe, 'id' | 'nombre' | 'imagen_url' | 'estado'>;
}

export interface RespuestaLista<T> {
  total: number;
  datos: T[];
}
