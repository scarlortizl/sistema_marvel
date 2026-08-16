import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, type CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes } from '../api/servicios';
import { Cargando, MensajeError, SinDatos } from '../componentes/Estados';
import { TarjetaHeroe } from '../componentes/TarjetaHeroe';
import { useFavoritos } from '../contexto/FavoritosContext';
import { tema } from '../tema';
import type { RootStackParamList, Superheroe, TabsParamList } from '../tipos';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Favoritos'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function FavoritosPantalla({ navigation }: Props) {
  const { favoritos, esFavorito, alternarFavorito } = useFavoritos();

  const [heroes, setHeroes] = useState<Superheroe[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Los ids favoritos vienen de AsyncStorage, pero los datos siempre de la API.
  const cargar = useCallback(async () => {
    setError('');
    try {
      const todos = await servicioHeroes.listar();
      setHeroes(todos.filter((heroe) => favoritos.includes(heroe.id)));
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setCargando(false);
    }
  }, [favoritos]);

  // Se recarga cada vez que la pantalla vuelve a estar visible.
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  if (cargando) return <Cargando texto="Cargando favoritos..." />;
  if (error && heroes.length === 0) return <MensajeError mensaje={error} onReintentar={cargar} />;

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={heroes}
        keyExtractor={(heroe) => String(heroe.id)}
        contentContainerStyle={estilos.lista}
        ListHeaderComponent={
          heroes.length > 0 ? <Text style={estilos.total}>{heroes.length} favorito(s)</Text> : null
        }
        ListEmptyComponent={
          <SinDatos mensaje={'Todavia no tiene favoritos.\n\nMarque la estrella de un superheroe para guardarlo aqui.'} />
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
  lista: {
    padding: 16,
    flexGrow: 1,
  },
  total: {
    color: tema.textoTenue,
    fontSize: 12,
    marginBottom: 10,
  },
});
