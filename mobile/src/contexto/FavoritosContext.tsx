import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CLAVE_FAVORITOS } from '../config';

interface ValorFavoritos {
  favoritos: number[];
  cargando: boolean;
  esFavorito: (id: number) => boolean;
  alternarFavorito: (id: number) => Promise<void>;
}

const FavoritosContext = createContext<ValorFavoritos | null>(null);

/**
 * Guarda los ids de los heroes marcados como favoritos en AsyncStorage,
 * de modo que se conservan aunque se cierre la aplicacion.
 */
export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_FAVORITOS)
      .then((guardados) => {
        if (guardados) setFavoritos(JSON.parse(guardados));
      })
      .catch(() => setFavoritos([]))
      .finally(() => setCargando(false));
  }, []);

  const alternarFavorito = async (id: number) => {
    const nuevos = favoritos.includes(id)
      ? favoritos.filter((favorito) => favorito !== id)
      : [...favoritos, id];

    setFavoritos(nuevos);
    await AsyncStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(nuevos));
  };

  const esFavorito = (id: number) => favoritos.includes(id);

  return (
    <FavoritosContext.Provider value={{ favoritos, cargando, esFavorito, alternarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext);
  if (!contexto) throw new Error('useFavoritos debe usarse dentro de <FavoritosProvider>');
  return contexto;
}
