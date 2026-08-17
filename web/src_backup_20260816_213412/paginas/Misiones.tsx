import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
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
      <path d="M4 20h4l11-11-4-4L4 16v4Zm9-13 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function nivelAncho(nivel: Mision['nivel_peligro']) {
  if (nivel === 'BAJO') return '34%';
  if (nivel === 'MEDIO') return '67%';
  return '100%';
}

export function Misiones() {
  const { esAdmin } = useAuth();
  const rootRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const actualizar = () => {
      rootRef.current?.style.setProperty('--mission-scroll', `${window.scrollY}px`);
    };
    actualizar();
    window.addEventListener('scroll', actualizar, { passive: true });
    return () => window.removeEventListener('scroll', actualizar);
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
    <section className="screen mission-editorial mission-editorial--v8" ref={rootRef}>
      <div className="mission-particle-field mission-particle-field--far" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, index) => (
          <span
            key={`far-${index}`}
            style={
              {
                '--left': `${(index * 17) % 100}%`,
                '--top': `${(index * 29) % 120}%`,
                '--size': `${2 + (index % 3)}px`,
                '--delay': `${index * 0.25}s`,
                '--drift': `${18 + (index % 7) * 8}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="mission-particle-field mission-particle-field--near" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={`near-${index}`}
            style={
              {
                '--left': `${(index * 23) % 100}%`,
                '--top': `${(index * 19) % 120}%`,
                '--size': `${4 + (index % 4)}px`,
                '--delay': `${index * 0.35}s`,
                '--drift': `${24 + (index % 5) * 10}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="screen__hud-line">
        <span>GLOBAL OPERATIONS GRID</span>
        <span>MISSION CONTROL / LIVE</span>
      </div>

      <header className="mission-editorial__hero mission-editorial__hero--v8">
        <div className="mission-editorial__display title-reveal">
          <span className="mission-editorial__eyebrow">STARK OPERATIONS NETWORK</span>
          <h1>
            <span>MISSION</span>
            <span>CONTROL</span>
          </h1>
        </div>

        <div className="mission-editorial__intro">
          <p>
            Supervisa operaciones activas, niveles de amenaza y unidades asignadas desde un único centro táctico.
          </p>

          <div className="mission-editorial__intro-actions">
            <span className="status-chip">
              <i className="status-dot" />
              COMMAND LINK ACTIVE
            </span>

            {esAdmin && (
              <Link className="button button--primary mission-editorial__new" to="/misiones/nueva">
                Nueva misión
                <ArrowIcon />
              </Link>
            )}
          </div>
        </div>
      </header>

      {!cargando && misiones.length > 0 && (
        <>
          <div className="mission-editorial__divider" />

          <div className="mission-editorial__toolbar mission-editorial__toolbar--v8">
            <div className="mission-editorial__chips">
              <span>TOTAL {String(misiones.length).padStart(2, '0')}</span>
              <span>ACTIVAS {String(resumen.activas).padStart(2, '0')}</span>
              <span>ALTO RIESGO {String(resumen.altoRiesgo).padStart(2, '0')}</span>
            </div>

            <div className="mission-editorial__status-copy">
              <span>OPERATIONS OVERVIEW</span>
              <strong>
                {resumen.completadas} completadas · {resumen.pendientes} pendientes
              </strong>
            </div>
          </div>
        </>
      )}

      {error && <div className="alerta alerta--error">{error}</div>}

      {cargando ? (
        <Cargando texto="Sincronizando operaciones..." />
      ) : error && misiones.length === 0 ? (
        <MensajeError mensaje={error} onReintentar={cargar} />
      ) : misiones.length === 0 ? (
        <SinDatos mensaje="Todavía no hay misiones registradas" />
      ) : (
        <div className="mission-stream">
          {misiones.map((mision, indice) => (
            <article
              className={`mission-stream__card mission-stream__card--${mision.nivel_peligro.toLowerCase()}`}
              key={mision.id}
              style={{ '--delay': `${indice * 70}ms` } as CSSProperties}
              onMouseMove={moverGlow}
            >
              <div className="mission-stream__glow" aria-hidden="true" />

              <div className="mission-stream__visual">
                {mision.superheroe ? (
                  <img src={mision.superheroe.imagen_url} alt={mision.superheroe.nombre} loading="lazy" />
                ) : (
                  <div className="mission-stream__placeholder" />
                )}
                <div className="mission-stream__overlay" />
                <div className="mission-stream__visual-top">
                  <span>MISSION / {String(mision.id).padStart(3, '0')}</span>
                  <span className={`etiqueta etiqueta--${mision.estado.toLowerCase()}`}>{mision.estado}</span>
                </div>
              </div>

              <div className="mission-stream__body">
                <span className="mission-stream__kicker">TACTICAL OPERATION</span>
                <h2>{mision.titulo}</h2>
                <p className="mission-stream__description">{mision.descripcion}</p>

                <div className="mission-stream__meta">
                  <span><strong>Location</strong><em>{mision.ubicacion}</em></span>
                  <span><strong>Date</strong><em>{new Date(mision.fecha).toLocaleDateString('es-EC')}</em></span>
                  <span><strong>Threat</strong><em className={`mission-threat mission-threat--${mision.nivel_peligro.toLowerCase()}`}>{mision.nivel_peligro}</em></span>
                </div>

                <div className="mission-stream__risk">
                  <div className="mission-stream__risk-head">
                    <span>THREAT ANALYSIS</span>
                    <strong>{mision.nivel_peligro}</strong>
                  </div>
                  <div className="mission-stream__risk-track">
                    <div
                      className={`mission-stream__risk-fill mission-stream__risk-fill--${mision.nivel_peligro.toLowerCase()}`}
                      style={{ width: nivelAncho(mision.nivel_peligro) }}
                    />
                  </div>
                </div>

                {mision.superheroe && (
                  <div className="mission-stream__unit">
                    <img src={mision.superheroe.imagen_url} alt="" />
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
                  <footer className="mission-stream__actions">
                    <Link className="mission-stream__action mission-stream__action--edit" to={`/misiones/${mision.id}/editar`}>
                      <EditIcon />
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="mission-stream__action mission-stream__action--delete"
                      onClick={() => setAEliminar(mision)}
                    >
                      <TrashIcon />
                      Eliminar
                    </button>
                  </footer>
                )}
              </div>
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
