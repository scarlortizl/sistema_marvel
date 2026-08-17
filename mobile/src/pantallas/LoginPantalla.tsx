import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
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

const logo = require('../assets/marvel-logo.png');

export function LoginPantalla() {
  const { iniciarSesion } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entrar = async () => {
    if (!email.trim() || password.length < 8) {
      setError('Ingrese un email válido y una contraseña de al menos 8 caracteres');
      return;
    }

    setError('');
    setEnviando(true);

    try {
      await iniciarSesion(email.trim(), password);
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  const completarAdmin = () => {
    setEmail('admin@marvel.com');
    setPassword('Admin1234');
  };

  const completarConsulta = () => {
    setEmail('consulta@marvel.com');
    setPassword('Consulta1234');
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.glow1} />
      <View style={s.glow2} />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.brand}>
          <Image source={logo} style={s.logo} resizeMode="contain" />
          <Text style={s.system}>HERO CONTROL SYSTEM</Text>
        </View>

        <Text style={s.kicker}>MARVEL CONTROL NETWORK</Text>
        <Text style={s.title}>Control central de héroes y operaciones.</Text>
        <Text style={s.copy}>
          Accede al sistema táctico para consultar superhéroes, favoritos y misiones.
        </Text>

        <View style={s.panel}>
          <View style={s.panelLine} />

          {error !== '' && <Text style={s.error}>{error}</Text>}

          <Text style={s.label}>IDENTIFICADOR</Text>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            placeholder="admin@marvel.com"
            placeholderTextColor="#686269"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={s.label}>CLAVE DE ACCESO</Text>
          <TextInput
            style={s.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#686269"
            secureTextEntry
          />

          <TouchableOpacity style={s.button} onPress={entrar} disabled={enviando} activeOpacity={0.85}>
            {enviando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.buttonText}>INGRESAR AL SISTEMA</Text>
            )}
          </TouchableOpacity>

          <View style={s.demoSection}>
            <View style={s.demoDivider} />
            <Text style={s.demoTitle}>ACCESOS DE DEMOSTRACIÓN</Text>

            <TouchableOpacity style={s.demoItem} onPress={completarAdmin} activeOpacity={0.85}>
              <Text style={s.demoRole}>ADMIN</Text>
              <Text style={s.demoEmail}>admin@marvel.com</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.demoItem} onPress={completarConsulta} activeOpacity={0.85}>
              <Text style={s.demoRole}>CONSULTA</Text>
              <Text style={s.demoEmail}>consulta@marvel.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.telemetry}>
          <View>
            <Text style={s.telemetryValue}>ONLINE</Text>
            <Text style={s.telemetryLabel}>NETWORK</Text>
          </View>
          <View>
            <Text style={s.telemetryValue}>SECURE</Text>
            <Text style={s.telemetryLabel}>ACCESS</Text>
          </View>
          <View>
            <Text style={s.telemetryValue}>24/7</Text>
            <Text style={s.telemetryLabel}>CONTROL</Text>
          </View>
        </View>

        <Text style={s.api}>API {API_URL}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tema.fondo,
    overflow: 'hidden',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 46,
  },
  glow1: {
    position: 'absolute',
    width: 330,
    height: 330,
    borderRadius: 200,
    backgroundColor: 'rgba(127,29,45,.22)',
    top: -130,
    right: -120,
  },
  glow2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: 'rgba(230,36,41,.08)',
    bottom: -100,
    left: -120,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 154,
    height: 58,
  },
  system: {
    color: '#bdb8ba',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 5,
  },
  kicker: {
    color: tema.vinoClaro,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginBottom: 10,
  },
  title: {
    color: tema.texto,
    fontSize: 31,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: -1.2,
    maxWidth: 340,
  },
  copy: {
    color: tema.textoTenue,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 25,
    maxWidth: 330,
  },
  panel: {
    backgroundColor: 'rgba(18,18,23,.94)',
    borderWidth: 1,
    borderColor: tema.borde,
    padding: 18,
    borderRadius: 18,
  },
  panelLine: {
    height: 2,
    width: 74,
    backgroundColor: tema.rojo,
    marginBottom: 18,
  },
  label: {
    color: '#b7b0b4',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 7,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#3a2a31',
    backgroundColor: '#0d0d11',
    borderRadius: 10,
    color: tema.texto,
    paddingHorizontal: 14,
    marginBottom: 15,
    fontSize: 14,
  },
  button: {
    height: 52,
    backgroundColor: tema.rojo,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  error: {
    color: '#ff9da1',
    backgroundColor: '#2b1015',
    borderWidth: 1,
    borderColor: '#6c2631',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 12,
  },
  demoSection: {
    marginTop: 20,
  },
  demoDivider: {
    height: 1,
    backgroundColor: '#2b2430',
    marginBottom: 16,
  },
  demoTitle: {
    color: '#a59ca1',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 14,
  },
  demoItem: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: '#302833',
    backgroundColor: '#111118',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  demoRole: {
    color: tema.vinoClaro,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  demoEmail: {
    color: '#b5b0b3',
    fontSize: 12,
    fontWeight: '600',
  },
  telemetry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 25,
  },
  telemetryValue: {
    color: tema.texto,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  telemetryLabel: {
    color: '#6f696d',
    fontSize: 8,
    letterSpacing: 1.3,
    textAlign: 'center',
    marginTop: 3,
  },
  api: {
    color: '#504b4e',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 18,
  },
});
