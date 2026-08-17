import type { CSSProperties } from 'react';
import type { Superheroe } from '../tipos';

interface Props {
  heroe: Superheroe;
  activo?: boolean;
  posicion?: number;
  onSeleccionar?: () => void;
}

export function TarjetaHeroe({
  heroe,
  activo = false,
  posicion = 0,
  onSeleccionar,
}: Props) {
  const estilo = {
    '--slide-pos': posicion,
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

          <div className="hero-carousel-card__compact">
            <span className="micro-label">IDENTITY PROFILE</span>
            <strong>{heroe.nombre}</strong>
            <p>{heroe.nombre_real}</p>
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
