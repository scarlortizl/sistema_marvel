import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { mensajeDeError } from '../api/cliente';
import { servicioMisiones } from '../api/servicios';
import { Cargando, MensajeError, SinDatos } from '../componentes/Estados';
import { colorEtiqueta, tema } from '../tema';
import type { Mision } from '../tipos';

export function MisionesPantalla() {
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState('');

  const cargar = async () => {
    setError('');
    try {
      setMisiones(await servicioMisiones.listar());
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const refrescar = async () => {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  };

  if (cargando) return <Cargando texto="Cargando misiones..." />;
  if (error && misiones.length === 0) return <MensajeError mensaje={error} onReintentar={cargar} />;

  return (
    <FlatList
      style={estilos.contenedor}
      data={misiones}
      keyExtractor={(mision) => String(mision.id)}
      contentContainerStyle={estilos.lista}
      refreshControl={
        <RefreshControl refreshing={refrescando} onRefresh={refrescar} tintColor={tema.rojo} />
      }
      ListHeaderComponent={<Text style={estilos.total}>{misiones.length} mision(es)</Text>}
      ListEmptyComponent={<SinDatos mensaje="No hay misiones registradas" />}
      renderItem={({ item }) => (
        <View style={estilos.tarjeta}>
          <View style={estilos.cabecera}>
            {item.superheroe && (
              <Image source={{ uri: item.superheroe.imagen_url }} style={estilos.avatar} />
            )}
            <View style={estilos.cabeceraTexto}>
              <Text style={estilos.titulo}>{item.titulo}</Text>
              <Text style={estilos.heroe}>{item.superheroe?.nombre ?? 'Sin superheroe'}</Text>
            </View>
          </View>

          <Text style={estilos.descripcion}>{item.descripcion}</Text>

          <View style={estilos.pie}>
            <Text style={estilos.dato}>
              {item.ubicacion} · {new Date(item.fecha).toLocaleDateString('es-EC')}
            </Text>
          </View>

          <View style={estilos.etiquetas}>
            <Text style={[estilos.etiqueta, { color: colorEtiqueta[item.nivel_peligro] }]}>
              PELIGRO {item.nivel_peligro}
            </Text>
            <Text style={[estilos.etiqueta, { color: colorEtiqueta[item.estado] }]}>{item.estado}</Text>
          </View>
        </View>
      )}
    />
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
  tarjeta: {
    backgroundColor: tema.superficie,
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#000',
  },
  cabeceraTexto: {
    flex: 1,
  },
  titulo: {
    color: tema.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  heroe: {
    color: tema.rojo,
    fontSize: 12,
    fontWeight: '600',
  },
  descripcion: {
    color: tema.textoTenue,
    fontSize: 13,
    marginTop: 10,
  },
  pie: {
    marginTop: 10,
  },
  dato: {
    color: tema.textoTenue,
    fontSize: 12,
  },
  etiquetas: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: tema.borde,
    paddingTop: 10,
  },
  etiqueta: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
