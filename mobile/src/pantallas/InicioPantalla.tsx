import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes, servicioMisiones } from '../api/servicios';
import { useAuth } from '../contexto/AuthContext';
import { useFavoritos } from '../contexto/FavoritosContext';
import { tema } from '../tema';
import type { TabsParamList } from '../tipos';

type Props = BottomTabScreenProps<TabsParamList, 'Inicio'>;

export function InicioPantalla({ navigation }: Props) {
  const { usuario, cerrarSesion } = useAuth();
  const { favoritos } = useFavoritos();

  const [totales, setTotales] = useState({ heroes: 0, misiones: 0 });
  const [error, setError] = useState('');

  // Resumen rapido con datos traidos de la API.
  useEffect(() => {
    const cargar = async () => {
      try {
        const [heroes, misiones] = await Promise.all([
          servicioHeroes.listar(),
          servicioMisiones.listar(),
        ]);
        setTotales({ heroes: heroes.length, misiones: misiones.length });
      } catch (error) {
        setError(mensajeDeError(error));
      }
    };

    cargar();
  }, []);

  const accesos: { titulo: string; descripcion: string; destino: keyof TabsParamList }[] = [
    { titulo: 'Superheroes', descripcion: `${totales.heroes} registrados en la API`, destino: 'Heroes' },
    { titulo: 'Misiones', descripcion: `${totales.misiones} misiones registradas`, destino: 'Misiones' },
    { titulo: 'Favoritos', descripcion: `${favoritos.length} guardados en este dispositivo`, destino: 'Favoritos' },
  ];

  return (
    <ScrollView style={estilos.contenedor} contentContainerStyle={estilos.contenido}>
      <Text style={estilos.saludo}>Hola,</Text>
      <Text style={estilos.nombre}>{usuario?.nombre}</Text>
      <View style={estilos.filaRol}>
        <Text style={estilos.rol}>{usuario?.rol}</Text>
        <Text style={estilos.email}>{usuario?.email}</Text>
      </View>

      {error !== '' && <Text style={estilos.error}>{error}</Text>}

      {accesos.map((acceso) => (
        <TouchableOpacity
          key={acceso.destino}
          style={estilos.acceso}
          onPress={() => navigation.navigate(acceso.destino)}
        >
          <View style={estilos.accesoTexto}>
            <Text style={estilos.accesoTitulo}>{acceso.titulo}</Text>
            <Text style={estilos.accesoDescripcion}>{acceso.descripcion}</Text>
          </View>
          <Text style={estilos.flecha}>›</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={estilos.salir} onPress={cerrarSesion}>
        <Text style={estilos.salirTexto}>Cerrar sesion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.fondo,
  },
  contenido: {
    padding: 20,
  },
  saludo: {
    color: tema.textoTenue,
    fontSize: 16,
  },
  nombre: {
    color: tema.texto,
    fontSize: 26,
    fontWeight: '800',
  },
  filaRol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    marginBottom: 24,
  },
  rol: {
    color: '#fff',
    backgroundColor: tema.rojo,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
  },
  email: {
    color: tema.textoTenue,
    fontSize: 12,
  },
  acceso: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tema.superficie,
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  accesoTexto: {
    gap: 3,
  },
  accesoTitulo: {
    color: tema.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  accesoDescripcion: {
    color: tema.textoTenue,
    fontSize: 12,
  },
  flecha: {
    color: tema.rojo,
    fontSize: 26,
    fontWeight: '700',
  },
  salir: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#7a2b2b',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  salirTexto: {
    color: '#ff6b6b',
    fontWeight: '700',
  },
  error: {
    color: '#ff9a9a',
    marginBottom: 16,
    fontSize: 13,
  },
});
