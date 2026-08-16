import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { Cargando } from '../componentes/Estados';
import { useAuth } from '../contexto/AuthContext';
import { FavoritosPantalla } from '../pantallas/FavoritosPantalla';
import { HeroeDetallePantalla } from '../pantallas/HeroeDetallePantalla';
import { HeroesPantalla } from '../pantallas/HeroesPantalla';
import { InicioPantalla } from '../pantallas/InicioPantalla';
import { LoginPantalla } from '../pantallas/LoginPantalla';
import { MisionesPantalla } from '../pantallas/MisionesPantalla';
import { tema } from '../tema';
import type { RootStackParamList, TabsParamList } from '../tipos';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

// Tema oscuro para que las cabeceras combinen con las pantallas.
const temaNavegacion = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: tema.rojo,
    background: tema.fondo,
    card: tema.superficie,
    text: tema.texto,
    border: tema.borde,
  },
};

const iconos: Record<keyof TabsParamList, string> = {
  Inicio: '⌂',
  Heroes: '⚡',
  Favoritos: '★',
  Misiones: '◎',
};

function TabsNavegacion() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: tema.rojo,
        tabBarInactiveTintColor: tema.textoTenue,
        tabBarStyle: { backgroundColor: tema.superficie, borderTopColor: tema.borde },
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 18 }}>{iconos[route.name]}</Text>
        ),
      })}
    >
      <Tabs.Screen name="Inicio" component={InicioPantalla} options={{ title: 'Inicio' }} />
      <Tabs.Screen name="Heroes" component={HeroesPantalla} options={{ title: 'Superheroes' }} />
      <Tabs.Screen name="Favoritos" component={FavoritosPantalla} options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="Misiones" component={MisionesPantalla} options={{ title: 'Misiones' }} />
    </Tabs.Navigator>
  );
}

export function Navegacion() {
  const { usuario, cargandoSesion } = useAuth();

  // Mientras se recupera el token guardado no se decide que pantalla mostrar.
  if (cargandoSesion) return <Cargando texto="Iniciando..." />;

  return (
    <NavigationContainer theme={temaNavegacion}>
      {/* Renderizado condicional: sin sesion solo existe la pantalla de Login. */}
      {!usuario ? (
        <LoginPantalla />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Tabs" component={TabsNavegacion} options={{ headerShown: false }} />
          <Stack.Screen
            name="HeroeDetalle"
            component={HeroeDetallePantalla}
            options={({ route }) => ({ title: route.params.nombre })}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
