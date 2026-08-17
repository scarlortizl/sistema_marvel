import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Navbar } from './componentes/Navbar';
import { RutaAdmin, RutaProtegida } from './componentes/RutaProtegida';
import { SystemLoader } from './componentes/SystemLoader';
import { AuthProvider } from './contexto/AuthContext';
import { HeroeDetalle } from './paginas/HeroeDetalle';
import { HeroeFormulario } from './paginas/HeroeFormulario';
import { Heroes } from './paginas/Heroes';
import { Login } from './paginas/Login';
import { MisionFormulario } from './paginas/MisionFormulario';
import { Misiones } from './paginas/Misiones';

function Layout() {
  return (
    <div className="app">
      <div className="app__ambient app__ambient--red" />
      <div className="app__ambient app__ambient--cyan" />
      <Navbar />
      <main className="contenido page-enter">
        <Outlet />
      </main>
    </div>
  );
}

function NoEncontrada() {
  return (
    <div className="estado estado--panel">
      <span className="estado__code">404</span>
      <h2>SECTOR NO LOCALIZADO</h2>
      <p>La ruta solicitada no existe dentro del sistema.</p>
    </div>
  );
}

export default function App() {
  const [mostrarLoader, setMostrarLoader] = useState(() => sessionStorage.getItem('stark-loader-seen') !== '1');

  useEffect(() => {
    if (!mostrarLoader) return;
    const temporizador = setTimeout(() => {
      sessionStorage.setItem('stark-loader-seen', '1');
      setMostrarLoader(false);
    }, 2100);
    return () => clearTimeout(temporizador);
  }, [mostrarLoader]);

  return (
    <BrowserRouter>
      <AuthProvider>
        {mostrarLoader && <SystemLoader />}
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<RutaProtegida />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/heroes" replace />} />

              <Route path="/heroes" element={<Heroes />} />
              <Route path="/heroes/:id" element={<HeroeDetalle />} />
              <Route path="/misiones" element={<Misiones />} />

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
