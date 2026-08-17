import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { servicioMisiones } from '../api/servicios';
import { DialogoConfirmacion } from '../componentes/DialogoConfirmacion';
import { Cargando, MensajeError, SinDatos } from '../componentes/Estados';
import { useAuth } from '../contexto/AuthContext';
import type { Mision } from '../tipos';

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

  useEffect(() => { cargar(); }, []);

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

  return (
    <section className="screen">
      <div className="screen__hud-line">
        <span>GLOBAL OPERATIONS GRID</span>
        <span>MISSION CONTROL / LIVE</span>
      </div>

      <div className="encabezado">
        <div className="title-reveal">
          <p className="micro-label">TACTICAL OPERATIONS DATABASE</p>
          <h1>MISIONES</h1>
          <div className="encabezado__meta">
            <span className="status-chip"><i className="status-dot" /> COMMAND LINK ACTIVE</span>
            <span>{cargando ? 'Sincronizando...' : `${misiones.length} operaciones registradas`}</span>
          </div>
        </div>
        {esAdmin && (
          <Link className="button button--primary button--create" to="/misiones/nueva">
            <span>+</span> Nueva misión
          </Link>
        )}
      </div>

      {error && <div className="alerta alerta--error">{error}</div>}

      {cargando ? (
        <Cargando texto="Sincronizando operaciones..." />
      ) : error && misiones.length === 0 ? (
        <MensajeError mensaje={error} onReintentar={cargar} />
      ) : misiones.length === 0 ? (
        <SinDatos mensaje="Todavía no hay misiones registradas" />
      ) : (
        <div className="missions-grid">
          {misiones.map((mision, indice) => (
            <article className="mission-card" key={mision.id} style={{ animationDelay: `${indice * 70}ms` }}>
              <div className="mission-card__top">
                <span>MISSION / {String(mision.id).padStart(3, '0')}</span>
                <span className={`etiqueta etiqueta--${mision.estado.toLowerCase()}`}>{mision.estado}</span>
              </div>

              <div className="mission-card__title">
                <h3>{mision.titulo}</h3>
                <p>{mision.descripcion}</p>
              </div>

              <div className="mission-card__grid">
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
                  <strong className={`threat threat--${mision.nivel_peligro.toLowerCase()}`}>{mision.nivel_peligro}</strong>
                </div>
              </div>

              {mision.superheroe && (
                <div className="mission-card__hero">
                  <img src={mision.superheroe.imagen_url} alt={mision.superheroe.nombre} />
                  <div>
                    <span>ASSIGNED UNIT</span>
                    <strong>{mision.superheroe.nombre}</strong>
                  </div>
                </div>
              )}

              {esAdmin && (
                <div className="mission-card__actions">
                  <Link className="button button--secondary" to={`/misiones/${mision.id}/editar`}>Editar</Link>
                  <button className="button button--danger-ghost" onClick={() => setAEliminar(mision)}>Eliminar</button>
                </div>
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
