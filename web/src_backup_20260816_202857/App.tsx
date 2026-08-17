import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Navbar } from './componentes/Navbar';
import { RutaAdmin, RutaProtegida } from './componentes/RutaProtegida';
import { AuthProvider } from './contexto/AuthContext';
import { HeroeDetalle } from './paginas/HeroeDetalle';
import { HeroeFormulario } from './paginas/HeroeFormulario';
import { Heroes } from './paginas/Heroes';
import { Login } from './paginas/Login';
import { MisionFormulario } from './paginas/MisionFormulario';
import { Misiones } from './paginas/Misiones';

/** Estructura comun de las pantallas privadas: barra superior + contenido. */
function Layout() {
  return (
    <div className="app">
      <Navbar />
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}

function NoEncontrada() {
  return (
    <div className="estado">
      <h2>404</h2>
      <p>La pagina que busca no existe.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta publica */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas: exigen sesion iniciada */}
          <Route element={<RutaProtegida />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/heroes" replace />} />

              <Route path="/heroes" element={<Heroes />} />
              <Route path="/heroes/:id" element={<HeroeDetalle />} />
              <Route path="/misiones" element={<Misiones />} />

              {/* Rutas de escritura: solo ADMIN */}
              <Route element={<RutaAdmin />}>
                <Route path="/heroes/nuevo" element={<HeroeFormulario />} />
                <Route path="/heroes/:id/editar" element={<HeroeFormulario />} />
                <Route path="/misiones/nueva" element={<MisionFormulario />} />
                <Route path="/misiones/:id/editar" element={<MisionFormulario />} />
              </Route>

              <Route path="*" element={<NoEncontrada />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
