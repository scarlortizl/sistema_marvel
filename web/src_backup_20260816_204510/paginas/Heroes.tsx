import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes } from '../api/servicios';
import { DialogoConfirmacion } from '../componentes/DialogoConfirmacion';
import { Cargando, MensajeError, SinDatos } from '../componentes/Estados';
import { TarjetaHeroe } from '../componentes/TarjetaHeroe';
import { useAuth } from '../contexto/AuthContext';
import type { Superheroe } from '../tipos';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.5 15.5 4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Heroes() {
  const { esAdmin } = useAuth();

  const [heroes, setHeroes] = useState<Superheroe[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [aEliminar, setAEliminar] = useState<Superheroe | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [aviso, setAviso] = useState('');

  const cargar = useCallback(async (nombre: string) => {
    setCargando(true);
    setError('');
    try {
      setHeroes(await servicioHeroes.listar(nombre.trim() || undefined));
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const temporizador = setTimeout(() => cargar(busqueda), 350);
    return () => clearTimeout(temporizador);
  }, [busqueda, cargar]);

  const confirmarEliminacion = async () => {
    if (!aEliminar) return;
    setEliminando(true);
    setError('');
    try {
      await servicioHeroes.eliminar(aEliminar.id);
      setHeroes((actuales) => actuales.filter((heroe) => heroe.id !== aEliminar.id));
      setAviso(`${aEliminar.nombre} fue eliminado correctamente`);
      setAEliminar(null);
    } catch (error) {
      setError(mensajeDeError(error));
      setAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <section className="screen">
      <div className="screen__hud-line">
        <span>AVENGERS DATABASE</span>
        <span>LIVE API FEED</span>
      </div>

      <div className="encabezado encabezado--hero">
        <div className="title-reveal">
          <p className="micro-label">HERO MONITORING DATABASE</p>
          <h1>SUPERHÉROES</h1>
          <div className="encabezado__meta">
            <span className="status-chip"><i className="status-dot" /> SYSTEM ONLINE</span>
            <span>
              {cargando ? 'Consultando la API...' : `${heroes.length} ${heroes.length === 1 ? 'unidad registrada' : 'unidades registradas'}`}
            </span>
          </div>
        </div>

        {esAdmin && (
          <Link className="button button--primary button--create" to="/heroes/nuevo">
            <span>+</span> Registrar superhéroe
          </Link>
        )}
      </div>

      <div className="search-panel">
        <SearchIcon />
        <input
          className="buscador"
          type="search"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar superhéroe por nombre..."
        />
        <span className="search-panel__hint">API / NAME QUERY</span>
      </div>

      {aviso && <div className="alerta alerta--ok">{aviso}</div>}
      {error && heroes.length > 0 && <div className="alerta alerta--error">{error}</div>}

      {cargando ? (
        <Cargando texto="Recuperando perfiles de superhéroes..." />
      ) : error && heroes.length === 0 ? (
        <MensajeError mensaje={error} onReintentar={() => cargar(busqueda)} />
      ) : heroes.length === 0 ? (
        <SinDatos
          mensaje={
            busqueda
              ? `No se encontraron superhéroes que coincidan con "${busqueda}"`
              : 'Todavía no hay superhéroes registrados'
          }
        />
      ) : (
        <div className="hero-showcase-zone">
          <div className="hero-showcase-floor" aria-hidden="true" />
          <div className="hero-showcase-grid">
          {heroes.map((heroe, indice) => (
            <TarjetaHeroe
              key={heroe.id}
              heroe={heroe}
              indice={indice}
              esAdmin={esAdmin}
              onEliminar={setAEliminar}
            />
          ))}
          </div>
        </div>
      )}

      {aEliminar && (
        <DialogoConfirmacion
          titulo={`Eliminar ${aEliminar.nombre}`}
          mensaje={`¿Está seguro de eliminar a ${aEliminar.nombre}? Esta acción no se puede deshacer.`}
          procesando={eliminando}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setAEliminar(null)}
        />
      )}
    </section>
  );
}
