import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { servicioMisiones } from '../api/servicios';
import { DialogoConfirmacion } from '../componentes/DialogoConfirmacion';
import { Cargando, MensajeError, SinDatos } from '../componentes/Estados';
import { useAuth } from '../contexto/AuthContext';
import type { Mision } from '../tipos';

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l11-11-4-4L4 16v4Zm9-13 4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CrosshairIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Misiones() {
  const { esAdmin } = useAuth();

  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aEliminar, setAEliminar] = useState<Mision | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      setMisiones(await servicioMisiones.listar());
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const confirmarEliminacion = async () => {
    if (!aEliminar) return;
    setEliminando(true);
    try {
      await servicioMisiones.eliminar(aEliminar.id);
      setMisiones((actuales) => actuales.filter((mision) => mision.id !== aEliminar.id));
      setAEliminar(null);
    } catch (error) {
      setError(mensajeDeError(error));
      setAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  const moverGlow = (evento: MouseEvent<HTMLElement>) => {
    const rect = evento.currentTarget.getBoundingClientRect();
    evento.currentTarget.style.setProperty('--mouse-x', `${evento.clientX - rect.left}px`);
    evento.currentTarget.style.setProperty('--mouse-y', `${evento.clientY - rect.top}px`);
  };

  const resumen = {
    activas: misiones.filter((m) => m.estado === 'EN_PROGRESO').length,
    pendientes: misiones.filter((m) => m.estado === 'PENDIENTE').length,
    completadas: misiones.filter((m) => m.estado === 'COMPLETADA').length,
    altoRiesgo: misiones.filter((m) => m.nivel_peligro === 'ALTO').length,
  };

  return (
    <section className="screen mission-screen">
      <div className="screen__hud-line">
        <span>GLOBAL OPERATIONS GRID</span>
        <span>MISSION CONTROL / LIVE</span>
      </div>

      <div className="mission-hero">
        <div className="mission-hero__copy title-reveal">
          <p className="micro-label">TACTICAL OPERATIONS DATABASE</p>
          <h1>MISIONES</h1>
          <p className="mission-hero__lead">
            Monitoreo de operaciones, nivel de riesgo, estado táctico y unidad asignada.
          </p>
        </div>

        <div className="mission-hero__actions">
          <span className="status-chip">
            <i className="status-dot" />
            COMMAND LINK ACTIVE
          </span>

          {esAdmin && (
            <Link className="button button--primary button--create" to="/misiones/nueva">
              <span>+</span> Nueva misión
            </Link>
          )}
        </div>
      </div>

      {!cargando && misiones.length > 0 && (
        <div className="mission-overview">
          <article>
            <span>OPERATIONS</span>
            <strong>{String(misiones.length).padStart(2, '0')}</strong>
            <small>Total registradas</small>
          </article>
          <article>
            <span>ACTIVE</span>
            <strong>{String(resumen.activas).padStart(2, '0')}</strong>
            <small>En progreso</small>
          </article>
          <article>
            <span>PENDING</span>
            <strong>{String(resumen.pendientes).padStart(2, '0')}</strong>
            <small>Por iniciar</small>
          </article>
          <article>
            <span>HIGH RISK</span>
            <strong>{String(resumen.altoRiesgo).padStart(2, '0')}</strong>
            <small>Amenaza alta</small>
          </article>
        </div>
      )}

      {error && <div className="alerta alerta--error">{error}</div>}

      {cargando ? (
        <Cargando texto="Sincronizando operaciones..." />
      ) : error && misiones.length === 0 ? (
        <MensajeError mensaje={error} onReintentar={cargar} />
      ) : misiones.length === 0 ? (
        <SinDatos mensaje="Todavía no hay misiones registradas" />
      ) : (
        <div className="mission-board">
          {misiones.map((mision, indice) => (
            <article
              className={`mission-panel mission-panel--${mision.nivel_peligro.toLowerCase()}`}
              key={mision.id}
              style={{ '--delay': `${indice * 75}ms` } as CSSProperties}
              onMouseMove={moverGlow}
            >
              <div className="mission-panel__cursor-glow" aria-hidden="true" />
              <div className="mission-panel__scanline" aria-hidden="true" />

              <header className="mission-panel__top">
                <div className="mission-panel__code">
                  <CrosshairIcon />
                  <span>MISSION / {String(mision.id).padStart(3, '0')}</span>
                </div>

                <span className={`etiqueta etiqueta--${mision.estado.toLowerCase()}`}>
                  {mision.estado}
                </span>
              </header>

              <div className="mission-panel__title">
                <h2>{mision.titulo}</h2>
                <p>{mision.descripcion}</p>
              </div>

              <div className="mission-panel__meta">
                <div>
                  <span>LOCATION</span>
                  <strong>{mision.ubicacion}</strong>
                </div>

                <div>
                  <span>DATE</span>
                  <strong>{new Date(mision.fecha).toLocaleDateString('es-EC')}</strong>
                </div>

                <div>
                  <span>THREAT LEVEL</span>
                  <strong className={`mission-threat mission-threat--${mision.nivel_peligro.toLowerCase()}`}>
                    {mision.nivel_peligro}
                  </strong>
                </div>
              </div>

              <div className="mission-panel__risk">
                <div className="mission-panel__risk-head">
                  <span>THREAT ANALYSIS</span>
                  <strong>{mision.nivel_peligro}</strong>
                </div>
                <div className="mission-panel__risk-track">
                  <div className={`mission-panel__risk-fill mission-panel__risk-fill--${mision.nivel_peligro.toLowerCase()}`} />
                </div>
              </div>

              {mision.superheroe && (
                <div className="mission-panel__hero">
                  <div className="mission-panel__hero-image">
                    <img
                      src={mision.superheroe.imagen_url}
                      alt={mision.superheroe.nombre}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span>ASSIGNED UNIT</span>
                    <strong>{mision.superheroe.nombre}</strong>
                    <small>{mision.superheroe.nombre_real}</small>
                  </div>
                  <span className={`etiqueta etiqueta--${mision.superheroe.estado.toLowerCase()}`}>
                    {mision.superheroe.estado}
                  </span>
                </div>
              )}

              {esAdmin && (
                <footer className="mission-panel__actions">
                  <Link
                    className="mission-panel__action mission-panel__action--edit"
                    to={`/misiones/${mision.id}/editar`}
                  >
                    <EditIcon />
                    <span>Editar</span>
                  </Link>

                  <button
                    type="button"
                    className="mission-panel__action mission-panel__action--delete"
                    onClick={() => setAEliminar(mision)}
                  >
                    <TrashIcon />
                    <span>Eliminar</span>
                  </button>
                </footer>
              )}
            </article>
          ))}
        </div>
      )}

      {aEliminar && (
        <DialogoConfirmacion
          titulo="Eliminar misión"
          mensaje={`¿Está seguro de eliminar la misión "${aEliminar.titulo}"?`}
          procesando={eliminando}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setAEliminar(null)}
        />
      )}
    </section>
  );
}
