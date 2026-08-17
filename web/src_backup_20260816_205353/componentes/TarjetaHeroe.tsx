import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Superheroe } from '../tipos';

interface Props {
  heroe: Superheroe;
  esAdmin: boolean;
  onEliminar: (heroe: Superheroe) => void;
  activo?: boolean;
  posicion?: number;
  onSeleccionar?: () => void;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

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

export function TarjetaHeroe({
  heroe,
  esAdmin,
  onEliminar,
  activo = false,
  posicion = 0,
  onSeleccionar,
}: Props) {
  const estilo = {
    '--slide-pos': posicion,
    '--power': `${heroe.nivel_poder}%`,
  } as CSSProperties;

  return (
    <article
      className={`hero-carousel-card ${activo ? 'hero-carousel-card--active' : ''}`}
      style={estilo}
      onClick={onSeleccionar}
      aria-current={activo ? 'true' : undefined}
    >
      <div className="hero-carousel-card__panel">
        <div className="hero-carousel-card__corners" aria-hidden="true" />

        <div className="hero-carousel-card__image">
          <img
            src={heroe.imagen_url}
            alt={heroe.nombre}
            draggable={false}
            onError={(evento) => {
              evento.currentTarget.src =
                'https://placehold.co/500x720/07090d/e62429?text=' + encodeURIComponent(heroe.nombre);
            }}
          />
          <div className="hero-carousel-card__overlay" />
          <div className="hero-carousel-card__scan" aria-hidden="true" />

          <span className="hero-carousel-card__unit">
            UNIT / {String(heroe.id).padStart(3, '0')}
          </span>

          <span className={`etiqueta etiqueta--${heroe.estado.toLowerCase()} hero-carousel-card__status`}>
            <i className="status-dot" />
            {heroe.estado}
          </span>
        </div>

        <div className="hero-carousel-card__compact">
          <span className="micro-label">IDENTITY PROFILE</span>
          <strong>{heroe.nombre}</strong>
        </div>

        <div className="hero-carousel-card__details">
          <p className="hero-carousel-card__real">{heroe.nombre_real}</p>

          <div className="hero-carousel-card__ability">
            <span>PRIMARY ABILITY</span>
            <p>{heroe.poder_principal}</p>
          </div>

          <div className="power hero-carousel-card__power">
            <div className="power__header">
              <span>POWER LEVEL</span>
              <strong>{heroe.nivel_poder}<small>/100</small></strong>
            </div>
            <div className="power__track">
              <div className="power__fill" style={{ '--power': `${heroe.nivel_poder}%` } as CSSProperties} />
            </div>
          </div>

          <div className="hero-carousel-card__actions" onClick={(e) => e.stopPropagation()}>
            <Link className="button button--primary button--profile" to={`/heroes/${heroe.id}`}>
              Ver perfil <ArrowIcon />
            </Link>

            {esAdmin && (
              <div className="hero-carousel-card__tools">
                <Link
                  className="icon-button icon-button--edit"
                  to={`/heroes/${heroe.id}/editar`}
                  aria-label={`Editar ${heroe.nombre}`}
                >
                  <EditIcon />
                </Link>
                <button
                  className="icon-button icon-button--danger"
                  onClick={() => onEliminar(heroe)}
                  aria-label={`Eliminar ${heroe.nombre}`}
                >
                  <TrashIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hero-carousel-card__reflection" aria-hidden="true">
        <img src={heroe.imagen_url} alt="" draggable={false} />
        <div className="hero-carousel-card__reflection-fade" />
      </div>
    </article>
  );
}
