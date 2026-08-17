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
    <section className="screen mission-editorial">
      <div className="screen__hud-line">
        <span>GLOBAL OPERATIONS GRID</span>
        <span>MISSION CONTROL / LIVE</span>
      </div>

      <header className="mission-editorial__hero">
        <div className="mission-editorial__display title-reveal">
          <span className="mission-editorial__eyebrow">STARK OPERATIONS NETWORK</span>
          <h1>
            <span>MISSION</span>
            <span>CONTROL</span>
          </h1>
        </div>

        <div className="mission-editorial__intro">
          <p>
            Supervisa operaciones activas, niveles de amenaza y unidades asignadas
            desde un único centro táctico.
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

          <div className="mission-editorial__toolbar">
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
        <div className="mission-gallery">
          {misiones.map((mision, indice) => (
            <article
              className={`mission-case mission-case--${mision.nivel_peligro.toLowerCase()}`}
              key={mision.id}
              style={{ '--delay': `${indice * 85}ms` } as CSSProperties}
              onMouseMove={moverGlow}
            >
              <div className="mission-case__cursor" aria-hidden="true" />

              <div className="mission-case__visual">
                {mision.superheroe ? (
                  <img
                    src={mision.superheroe.imagen_url}
                    alt={mision.superheroe.nombre}
                    loading="lazy"
                  />
                ) : (
                  <div className="mission-case__placeholder" />
                )}

                <div className="mission-case__overlay" />
                <div className="mission-case__sweep" aria-hidden="true" />

                <div className="mission-case__visual-top">
                  <span>MISSION / {String(mision.id).padStart(3, '0')}</span>
                  <span className={`etiqueta etiqueta--${mision.estado.toLowerCase()}`}>
                    {mision.estado}
                  </span>
                </div>

                <div className="mission-case__visual-title">
                  <span className="mission-case__kicker">TACTICAL OPERATION</span>
                  <h2>{mision.titulo}</h2>
                </div>
              </div>

              <div className="mission-case__body">
                <p className="mission-case__description">{mision.descripcion}</p>

                <div className="mission-case__stats">
                  <div>
                    <span>LOCATION</span>
                    <strong>{mision.ubicacion}</strong>
                  </div>
                  <div>
                    <span>DATE</span>
                    <strong>{new Date(mision.fecha).toLocaleDateString('es-EC')}</strong>
                  </div>
                  <div>
                    <span>THREAT</span>
                    <strong className={`mission-threat mission-threat--${mision.nivel_peligro.toLowerCase()}`}>
                      {mision.nivel_peligro}
                    </strong>
                  </div>
                </div>

                <div className="mission-case__risk">
                  <div className="mission-case__risk-head">
                    <span>THREAT ANALYSIS</span>
                    <strong>{mision.nivel_peligro}</strong>
                  </div>
                  <div className="mission-case__risk-track">
                    <div className={`mission-case__risk-fill mission-case__risk-fill--${mision.nivel_peligro.toLowerCase()}`} />
                  </div>
                </div>

                {mision.superheroe && (
                  <div className="mission-case__assigned">
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
                  <footer className="mission-case__actions">
                    <Link className="mission-case__action mission-case__action--edit" to={`/misiones/${mision.id}/editar`}>
                      <EditIcon />
                      Editar
                    </Link>

                    <button
                      type="button"
                      className="mission-case__action mission-case__action--delete"
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
