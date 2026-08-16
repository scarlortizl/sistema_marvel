import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes } from '../api/servicios';
import { Cargando, MensajeError } from '../componentes/Estados';
import { useFavoritos } from '../contexto/FavoritosContext';
import { colorEtiqueta, tema } from '../tema';
import type { RootStackParamList, Superheroe } from '../tipos';

type Props = NativeStackScreenProps<RootStackParamList, 'HeroeDetalle'>;

export function HeroeDetallePantalla({ route }: Props) {
  const { id } = route.params;
  const { esFavorito, alternarFavorito } = useFavoritos();

  const [heroe, setHeroe] = useState<Superheroe | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      setHeroe(await servicioHeroes.obtener(id));
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [id]);

  if (cargando) return <Cargando texto="Cargando superheroe..." />;
  if (error) return <MensajeError mensaje={error} onReintentar={cargar} />;
  if (!heroe) return null;

  const favorito = esFavorito(heroe.id);

  return (
    <ScrollView style={estilos.contenedor} contentContainerStyle={estilos.contenido}>
      <Image source={{ uri: heroe.imagen_url }} style={estilos.imagen} />

      <View style={estilos.cabecera}>
        <Text style={estilos.nombre}>{heroe.nombre}</Text>
        <Text style={[estilos.estado, { color: colorEtiqueta[heroe.estado] }]}>{heroe.estado}</Text>
      </View>

      <TouchableOpacity
        style={[estilos.botonFavorito, favorito && estilos.botonFavoritoActivo]}
        onPress={() => alternarFavorito(heroe.id)}
      >
        <Text style={[estilos.botonFavoritoTexto, favorito && estilos.botonFavoritoTextoActivo]}>
          {favorito ? '★  Quitar de favoritos' : '☆  Agregar a favoritos'}
        </Text>
      </TouchableOpacity>

      <View style={estilos.bloque}>
        <Text style={estilos.etiqueta}>NOMBRE REAL</Text>
        <Text style={estilos.valor}>{heroe.nombre_real}</Text>
      </View>

      <View style={estilos.bloque}>
        <Text style={estilos.etiqueta}>PODER PRINCIPAL</Text>
        <Text style={estilos.valor}>{heroe.poder_principal}</Text>
      </View>

      <View style={estilos.bloque}>
        <Text style={estilos.etiqueta}>NIVEL DE PODER</Text>
        <View style={estilos.barra}>
          <View style={[estilos.relleno, { width: `${heroe.nivel_poder}%` }]} />
        </View>
        <Text style={estilos.valor}>{heroe.nivel_poder}/100</Text>
      </View>

      <Text style={estilos.subtitulo}>Misiones asignadas</Text>
      {heroe.misiones && heroe.misiones.length > 0 ? (
        heroe.misiones.map((mision) => (
          <View key={mision.id} style={estilos.mision}>
            <Text style={estilos.misionTitulo}>{mision.titulo}</Text>
            <Text style={estilos.misionSub}>
              {mision.ubicacion} · {new Date(mision.fecha).toLocaleDateString('es-EC')}
            </Text>
            <View style={estilos.misionEtiquetas}>
              <Text style={[estilos.etiquetaChica, { color: colorEtiqueta[mision.nivel_peligro] }]}>
                {mision.nivel_peligro}
              </Text>
              <Text style={[estilos.etiquetaChica, { color: colorEtiqueta[mision.estado] }]}>
                {mision.estado}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={estilos.sinMisiones}>Este superheroe no tiene misiones asignadas.</Text>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.fondo,
  },
  contenido: {
    padding: 16,
    paddingBottom: 32,
  },
  imagen: {
    width: '100%',
    height: 380,
    borderRadius: 16,
    backgroundColor: '#000',
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  nombre: {
    color: tema.texto,
    fontSize: 24,
    fontWeight: '800',
    flex: 1,
  },
  estado: {
    fontSize: 12,
    fontWeight: '700',
  },
  botonFavorito: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: tema.borde,
    backgroundColor: tema.superficie,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonFavoritoActivo: {
    borderColor: '#6b5320',
    backgroundColor: '#2a2314',
  },
  botonFavoritoTexto: {
    color: tema.textoTenue,
    fontWeight: '700',
  },
  botonFavoritoTextoActivo: {
    color: '#ffd479',
  },
  bloque: {
    marginTop: 18,
  },
  etiqueta: {
    color: tema.textoTenue,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 4,
  },
  valor: {
    color: tema.texto,
    fontSize: 16,
  },
  barra: {
    height: 8,
    backgroundColor: tema.superficie2,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 6,
  },
  relleno: {
    height: '100%',
    backgroundColor: tema.rojo,
  },
  subtitulo: {
    color: tema.texto,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 26,
    marginBottom: 10,
  },
  mision: {
    backgroundColor: tema.superficie,
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  misionTitulo: {
    color: tema.texto,
    fontWeight: '700',
  },
  misionSub: {
    color: tema.textoTenue,
    fontSize: 12,
    marginTop: 2,
  },
  misionEtiquetas: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  etiquetaChica: {
    fontSize: 10,
    fontWeight: '700',
  },
  sinMisiones: {
    color: tema.textoTenue,
    fontSize: 13,
  },
});
