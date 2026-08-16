// Tipos que devuelve la API REST y rutas de navegacion.

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'CONSULTA';
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

// Rutas del stack principal (tipado de React Navigation).
export type RootStackParamList = {
  Tabs: undefined;
  HeroeDetalle: { id: number; nombre: string };
};

export type TabsParamList = {
  Inicio: undefined;
  Heroes: undefined;
  Favoritos: undefined;
  Misiones: undefined;
};
