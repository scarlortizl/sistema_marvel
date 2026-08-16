import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexto/AuthContext';
import { FavoritosProvider } from './src/contexto/FavoritosContext';
import { Navegacion } from './src/navegacion/Navegacion';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritosProvider>
          <StatusBar style="light" />
          <Navegacion />
        </FavoritosProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
