import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Superheroe } from '../tipos';

interface Props {
  heroe: Superheroe;
  esAdmin: boolean;
  onEliminar: (heroe: Superheroe) => void;
  indice?: number;
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

export function TarjetaHeroe({ heroe, esAdmin, onEliminar, indice = 0 }: Props) {
  return (
    <article className="hero-card" style={{ animationDelay: `${Math.min(indice, 8) * 80}ms` }}>
      <div className="hero-card__corners" aria-hidden="true" />
      <div className="hero-card__image">
        <img
          src={heroe.imagen_url}
          alt={heroe.nombre}
          loading="lazy"
          onError={(evento) => {
            evento.currentTarget.src =
              'https://placehold.co/500x650/0b0f15/e62429?text=' + encodeURIComponent(heroe.nombre);
          }}
        />
        <div className="hero-card__image-overlay" />
        <span className="hero-card__id">UNIT / {String(heroe.id).padStart(3, '0')}</span>
        <span className={`etiqueta etiqueta--${heroe.estado.toLowerCase()} hero-card__status`}>
          <i className="status-dot" />
          {heroe.estado}
        </span>
      </div>

      <div className="hero-card__body">
        <div className="hero-card__heading">
          <div>
            <p className="micro-label">IDENTITY PROFILE</p>
            <h3>{heroe.nombre}</h3>
            <p className="hero-card__real">{heroe.nombre_real}</p>
          </div>
          <span className="hero-card__signal" aria-hidden="true">⌁</span>
        </div>

        <div className="hero-card__ability">
          <span>PRIMARY ABILITY</span>
          <p>{heroe.poder_principal}</p>
        </div>

        <div className="power">
          <div className="power__header">
            <span>POWER LEVEL</span>
            <strong>{heroe.nivel_poder}<small>/100</small></strong>
          </div>
          <div className="power__track">
            <div className="power__fill" style={{ '--power': `${heroe.nivel_poder}%` } as CSSProperties} />
          </div>
          <div className="power__ticks" aria-hidden="true">
            <i /><i /><i /><i /><i />
          </div>
        </div>
      </div>

      <div className="hero-card__actions">
        <Link className="button button--primary button--profile" to={`/heroes/${heroe.id}`}>
          Ver perfil <ArrowIcon />
        </Link>

        {esAdmin && (
          <div className="hero-card__tools">
            <Link className="icon-button icon-button--edit" to={`/heroes/${heroe.id}/editar`} title="Editar">
              <EditIcon />
            </Link>
            <button className="icon-button icon-button--danger" onClick={() => onEliminar(heroe)} title="Eliminar">
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
