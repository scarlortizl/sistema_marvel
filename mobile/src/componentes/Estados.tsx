import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { tema } from '../tema';

/** Indicador de carga usado mientras se consulta la API. */
export function Cargando({ texto = 'Cargando...' }: { texto?: string }) {
  return (
    <View style={estilos.centro}>
      <ActivityIndicator size="large" color={tema.rojo} />
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}

/** Mensaje de error con boton para volver a intentar la peticion. */
export function MensajeError({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void }) {
  return (
    <View style={estilos.centro}>
      <Text style={estilos.iconoError}>!</Text>
      <Text style={[estilos.texto, estilos.textoError]}>{mensaje}</Text>
      {onReintentar && (
        <TouchableOpacity style={estilos.boton} onPress={onReintentar}>
          <Text style={estilos.botonTexto}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/** Pantalla vacia: no hubo error, simplemente no hay registros. */
export function SinDatos({ mensaje }: { mensaje: string }) {
  return (
    <View style={estilos.centro}>
      <Text style={estilos.texto}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  texto: {
    color: tema.textoTenue,
    textAlign: 'center',
    fontSize: 15,
  },
  textoError: {
    color: '#ff9a9a',
  },
  iconoError: {
    width: 44,
    height: 44,
    lineHeight: 42,
    textAlign: 'center',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ff9a9a',
    color: '#ff9a9a',
    fontSize: 24,
    fontWeight: '700',
  },
  boton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: tema.superficie2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: tema.borde,
  },
  botonTexto: {
    color: tema.texto,
    fontWeight: '600',
  },
});
