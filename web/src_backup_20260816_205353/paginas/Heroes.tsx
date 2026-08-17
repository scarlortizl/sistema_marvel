import { useCallback, useEffect, useState, type CSSProperties } from 'react';
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

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg className={direction === 'left' ? 'is-left' : ''} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
  const [activo, setActivo] = useState(0);

  const cargar = useCallback(async (nombre: string) => {
    setCargando(true);
    setError('');
    try {
      const datos = await servicioHeroes.listar(nombre.trim() || undefined);
      setHeroes(datos);
      setActivo(0);
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
      setActivo((actual) => Math.max(0, Math.min(actual, heroes.length - 2)));
    } catch (error) {
      setError(mensajeDeError(error));
      setAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  const mover = (direccion: number) => {
    if (heroes.length === 0) return;
    setActivo((actual) => (actual + direccion + heroes.length) % heroes.length);
  };

  const posicionRelativa = (indice: number) => {
    const total = heroes.length;
    let diferencia = indice - activo;

    if (diferencia > total / 2) diferencia -= total;
    if (diferencia < -total / 2) diferencia += total;

    return diferencia;
  };

  const heroeActivo = heroes[activo];

  useEffect(() => {
    const manejar = (evento: KeyboardEvent) => {
      if (evento.key === 'ArrowLeft') mover(-1);
      if (evento.key === 'ArrowRight') mover(1);
    };
    window.addEventListener('keydown', manejar);
    return () => window.removeEventListener('keydown', manejar);
  }, [heroes.length]);

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
              {cargando
                ? 'Consultando la API...'
                : `${heroes.length} ${heroes.length === 1 ? 'unidad registrada' : 'unidades registradas'}`}
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
        <div className="hero-carousel">
          <div className="hero-carousel__stars" aria-hidden="true" />
          <div className="hero-carousel__floor" aria-hidden="true" />

          <button className="hero-carousel__nav hero-carousel__nav--left" onClick={() => mover(-1)} aria-label="Héroe anterior">
            <Arrow direction="left" />
          </button>

          <div className="hero-carousel__viewport">
            <div className="hero-carousel__track">
              {heroes.map((heroe, indice) => {
                const posicion = posicionRelativa(indice);
                const visible = Math.abs(posicion) <= 3;

                return (
                  <div
                    key={heroe.id}
                    className={`hero-carousel__slide ${visible ? 'is-visible' : ''}`}
                    style={{ '--position': posicion } as CSSProperties}
                  >
                    <TarjetaHeroe
                      heroe={heroe}
                      esAdmin={esAdmin}
                      activo={indice === activo}
                      posicion={posicion}
                      onSeleccionar={() => setActivo(indice)}
                      onEliminar={setAEliminar}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <button className="hero-carousel__nav hero-carousel__nav--right" onClick={() => mover(1)} aria-label="Héroe siguiente">
            <Arrow direction="right" />
          </button>

          <div className="hero-carousel__caption">
            <span>{String(activo + 1).padStart(2, '0')} / {String(heroes.length).padStart(2, '0')}</span>
            <h2>{heroeActivo?.nombre}</h2>
            <p>{heroeActivo?.nombre_real}</p>

            <div className="hero-carousel__dots">
              {heroes.map((heroe, indice) => (
                <button
                  key={heroe.id}
                  className={indice === activo ? 'is-active' : ''}
                  onClick={() => setActivo(indice)}
                  aria-label={`Mostrar ${heroe.nombre}`}
                />
              ))}
            </div>
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
