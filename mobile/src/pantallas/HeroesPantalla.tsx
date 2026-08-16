import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes } from '../api/servicios';
import { Cargando, MensajeError, SinDatos } from '../componentes/Estados';
import { TarjetaHeroe } from '../componentes/TarjetaHeroe';
import { useFavoritos } from '../contexto/FavoritosContext';
import { tema } from '../tema';
import type { RootStackParamList, Superheroe, TabsParamList } from '../tipos';

// La pantalla vive en las tabs pero navega a una pantalla del stack principal.
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Heroes'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function HeroesPantalla({ navigation }: Props) {
  const { esFavorito, alternarFavorito } = useFavoritos();

  const [heroes, setHeroes] = useState<Superheroe[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const cargar = useCallback(async (nombre: string) => {
    setError('');
    try {
      setHeroes(await servicioHeroes.listar(nombre.trim() || undefined));
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setCargando(false);
    }
  }, []);

  // Se espera un momento tras escribir para consultar la API una sola vez.
  useEffect(() => {
    const temporizador = setTimeout(() => cargar(busqueda), 350);
    return () => clearTimeout(temporizador);
  }, [busqueda, cargar]);

  const refrescar = async () => {
    setRefrescando(true);
    await cargar(busqueda);
    setRefrescando(false);
  };

  if (cargando) return <Cargando texto="Cargando superheroes..." />;
  if (error && heroes.length === 0) {
    return <MensajeError mensaje={error} onReintentar={() => cargar(busqueda)} />;
  }

  return (
    <View style={estilos.contenedor}>
      <TextInput
        style={estilos.buscador}
        value={busqueda}
        onChangeText={setBusqueda}
        placeholder="Buscar por nombre..."
        placeholderTextColor={tema.textoTenue}
        autoCapitalize="none"
      />

      <FlatList
        data={heroes}
        keyExtractor={(heroe) => String(heroe.id)}
        contentContainerStyle={estilos.lista}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={refrescar} tintColor={tema.rojo} />
        }
        ListHeaderComponent={<Text style={estilos.total}>{heroes.length} superheroe(s)</Text>}
        ListEmptyComponent={
          <SinDatos
            mensaje={
              busqueda
                ? `No se encontraron superheroes con "${busqueda}"`
                : 'No hay superheroes registrados'
            }
          />
        }
        renderItem={({ item }) => (
          <TarjetaHeroe
            heroe={item}
            esFavorito={esFavorito(item.id)}
            onAbrir={() => navigation.navigate('HeroeDetalle', { id: item.id, nombre: item.nombre })}
            onFavorito={() => alternarFavorito(item.id)}
          />
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.fondo,
  },
  buscador: {
    backgroundColor: tema.superficie,
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 10,
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: tema.texto,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  total: {
    color: tema.textoTenue,
    fontSize: 12,
    marginBottom: 10,
  },
});
