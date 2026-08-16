import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colorEtiqueta, tema } from '../tema';
import type { Superheroe } from '../tipos';

interface Props {
  heroe: Superheroe;
  esFavorito: boolean;
  onAbrir: () => void;
  onFavorito: () => void;
}

/** Fila del FlatList de superheroes. Recibe todo por props. */
export function TarjetaHeroe({ heroe, esFavorito, onAbrir, onFavorito }: Props) {
  return (
    <TouchableOpacity style={estilos.tarjeta} onPress={onAbrir} activeOpacity={0.75}>
      <Image source={{ uri: heroe.imagen_url }} style={estilos.imagen} />

      <View style={estilos.datos}>
        <Text style={estilos.nombre}>{heroe.nombre}</Text>
        <Text style={estilos.real}>{heroe.nombre_real}</Text>
        <Text style={estilos.poder} numberOfLines={1}>
          {heroe.poder_principal}
        </Text>

        <View style={estilos.barra}>
          <View style={[estilos.relleno, { width: `${heroe.nivel_poder}%` }]} />
        </View>

        <View style={estilos.pie}>
          <Text style={estilos.nivel}>Nivel {heroe.nivel_poder}/100</Text>
          <Text style={[estilos.etiqueta, { color: colorEtiqueta[heroe.estado] }]}>{heroe.estado}</Text>
        </View>
      </View>

      <TouchableOpacity style={estilos.favorito} onPress={onFavorito} hitSlop={10}>
        <Text style={[estilos.estrella, esFavorito && estilos.estrellaActiva]}>
          {esFavorito ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: tema.superficie,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: tema.borde,
    marginBottom: 12,
    overflow: 'hidden',
  },
  imagen: {
    width: 92,
    height: 120,
    backgroundColor: '#000',
  },
  datos: {
    flex: 1,
    padding: 12,
    gap: 2,
  },
  nombre: {
    color: tema.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  real: {
    color: tema.textoTenue,
    fontSize: 12,
  },
  poder: {
    color: tema.texto,
    fontSize: 13,
    marginTop: 4,
  },
  barra: {
    height: 6,
    backgroundColor: tema.superficie2,
    borderRadius: 999,
    marginTop: 8,
    overflow: 'hidden',
  },
  relleno: {
    height: '100%',
    backgroundColor: tema.rojo,
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  nivel: {
    color: tema.textoTenue,
    fontSize: 11,
  },
  etiqueta: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  favorito: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  estrella: {
    fontSize: 22,
    color: tema.textoTenue,
  },
  estrellaActiva: {
    color: '#ffd479',
  },
});
