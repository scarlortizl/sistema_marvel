import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes } from '../api/servicios';
import { Cargando, MensajeError } from '../componentes/Estados';
import { useAuth } from '../contexto/AuthContext';
import type { Superheroe } from '../tipos';

export function HeroeDetalle() {
  const { id } = useParams();
  const { esAdmin } = useAuth();

  const [heroe, setHeroe] = useState<Superheroe | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      setCargando(true);
      setError('');
      try {
        const datos = await servicioHeroes.obtener(Number(id));
        if (activo) setHeroe(datos);
      } catch (error) {
        if (activo) setError(mensajeDeError(error));
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargar();
    return () => { activo = false; };
  }, [id]);

  if (cargando) return <Cargando texto="Analizando perfil del superhéroe..." />;
  if (error) return <MensajeError mensaje={error} />;
  if (!heroe) return null;

  return (
    <section className="screen">
      <div className="screen__hud-line">
        <span>IDENTITY PROFILE / {String(heroe.id).padStart(3, '0')}</span>
        <span>SECURE ACCESS</span>
      </div>

      <Link className="volver" to="/heroes">← Regresar a la base de héroes</Link>

      <div className="identity">
        <div className="identity__visual">
          <img
            className="identity__image"
            src={heroe.imagen_url}
            alt={heroe.nombre}
            onError={(evento) => {
              evento.currentTarget.src =
                'https://placehold.co/600x800/0b0f15/e62429?text=' + encodeURIComponent(heroe.nombre);
            }}
          />
          <div className="identity__scan" />
          <span className="identity__coordinate">SUBJECT LOCKED / {heroe.estado}</span>
        </div>

        <div className="identity__data">
          <p className="micro-label">IDENTITY PROFILE</p>
          <div className="identity__title">
            <div>
              <h1>{heroe.nombre}</h1>
              <p>{heroe.nombre_real}</p>
            </div>
            <span className={`etiqueta etiqueta--${heroe.estado.toLowerCase()}`}>
              <i className="status-dot" /> {heroe.estado}
            </span>
          </div>

          <div className="identity__metrics">
            <article>
              <span>PRIMARY ABILITY</span>
              <strong>{heroe.poder_principal}</strong>
            </article>
            <article>
              <span>STATUS</span>
              <strong>{heroe.estado}</strong>
            </article>
          </div>

          <div className="power power--detail">
            <div className="power__header">
              <span>POWER ANALYSIS</span>
              <strong>{heroe.nivel_poder}<small>/100</small></strong>
            </div>
            <div className="power__track power__track--large">
              <div className="power__fill" style={{ '--power': `${heroe.nivel_poder}%` } as CSSProperties} />
            </div>
          </div>

          {esAdmin && (
            <Link className="button button--primary" to={`/heroes/${heroe.id}/editar`}>
              Editar perfil
            </Link>
          )}
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="micro-label">ACTIVE OPERATIONS</p>
          <h2>Misiones asignadas</h2>
        </div>
        <span>{heroe.misiones?.length ?? 0} registros</span>
      </div>

      {heroe.misiones && heroe.misiones.length > 0 ? (
        <div className="mission-stack">
          {heroe.misiones.map((mision, indice) => (
            <article className="mission-row" key={mision.id} style={{ animationDelay: `${indice * 70}ms` }}>
              <span className="mission-row__index">0{indice + 1}</span>
              <div className="mission-row__main">
                <strong>{mision.titulo}</strong>
                <p>{mision.ubicacion} · {new Date(mision.fecha).toLocaleDateString('es-EC')}</p>
              </div>
              <div className="mission-row__badges">
                <span className={`etiqueta etiqueta--${mision.nivel_peligro.toLowerCase()}`}>{mision.nivel_peligro}</span>
                <span className={`etiqueta etiqueta--${mision.estado.toLowerCase()}`}>{mision.estado}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="texto-tenue empty-inline">Este superhéroe no tiene misiones asignadas.</p>
      )}
    </section>
  );
}
