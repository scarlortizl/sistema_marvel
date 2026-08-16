import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { mensajeDeError } from '../api/cliente';
import { API_URL } from '../config';
import { useAuth } from '../contexto/AuthContext';
import { tema } from '../tema';

export function LoginPantalla() {
  const { iniciarSesion } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entrar = async () => {
    // Validacion basica antes de gastar una peticion.
    if (!email.trim() || password.length < 8) {
      setError('Ingrese un email valido y una password de al menos 8 caracteres');
      return;
    }

    setError('');
    setEnviando(true);
    try {
      await iniciarSesion(email.trim(), password);
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setEnviando(false);
    }
  };

  const usarCuenta = (correo: string, clave: string) => {
    setEmail(correo);
    setPassword(clave);
  };

  return (
    <KeyboardAvoidingView style={estilos.contenedor} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        <Text style={estilos.titulo}>MARVEL</Text>
        <Text style={estilos.subtitulo}>Heroes y misiones</Text>

        {error !== '' && <Text style={estilos.error}>{error}</Text>}

        <Text style={estilos.etiqueta}>Email</Text>
        <TextInput
          style={estilos.input}
          value={email}
          onChangeText={setEmail}
          placeholder="admin@marvel.com"
          placeholderTextColor={tema.textoTenue}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={estilos.etiqueta}>Password</Text>
        <TextInput
          style={estilos.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Minimo 8 caracteres"
          placeholderTextColor={tema.textoTenue}
          secureTextEntry
        />

        <TouchableOpacity style={estilos.boton} onPress={entrar} disabled={enviando}>
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={estilos.botonTexto}>Iniciar sesion</Text>
          )}
        </TouchableOpacity>

        <View style={estilos.ayuda}>
          <Text style={estilos.ayudaTitulo}>Usuarios de prueba</Text>
          <TouchableOpacity onPress={() => usarCuenta('admin@marvel.com', 'Admin1234')}>
            <Text style={estilos.ayudaTexto}>ADMIN: admin@marvel.com / Admin1234</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => usarCuenta('consulta@marvel.com', 'Consulta1234')}>
            <Text style={estilos.ayudaTexto}>CONSULTA: consulta@marvel.com / Consulta1234</Text>
          </TouchableOpacity>
          <Text style={estilos.api}>API: {API_URL}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: tema.fondo,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    color: tema.rojo,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 6,
    textAlign: 'center',
  },
  subtitulo: {
    color: tema.textoTenue,
    textAlign: 'center',
    marginBottom: 28,
  },
  etiqueta: {
    color: tema.textoTenue,
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: tema.superficie,
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: tema.texto,
    marginBottom: 16,
  },
  boton: {
    backgroundColor: tema.rojo,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  error: {
    backgroundColor: '#2a1414',
    borderWidth: 1,
    borderColor: '#7a2b2b',
    color: '#ff9a9a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 13,
  },
  ayuda: {
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: tema.borde,
    paddingTop: 16,
    gap: 8,
  },
  ayudaTitulo: {
    color: tema.textoTenue,
    fontSize: 12,
    fontWeight: '700',
  },
  ayudaTexto: {
    color: tema.textoTenue,
    fontSize: 12,
    backgroundColor: tema.superficie2,
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 8,
    padding: 8,
  },
  api: {
    color: tema.textoTenue,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});
