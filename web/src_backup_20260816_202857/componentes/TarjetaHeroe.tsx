import { Link } from 'react-router-dom';
import type { Superheroe } from '../tipos';

interface Props {
  heroe: Superheroe;
  esAdmin: boolean;
  onEliminar: (heroe: Superheroe) => void;
}

// Componente funcional que recibe el heroe por props y solo se encarga de mostrarlo.
export function TarjetaHeroe({ heroe, esAdmin, onEliminar }: Props) {
  return (
    <article className="tarjeta">
      <div className="tarjeta__imagen">
        <img
          src={heroe.imagen_url}
          alt={heroe.nombre}
          loading="lazy"
          onError={(evento) => {
            evento.currentTarget.src =
              'https://placehold.co/400x520/1a1a1a/e62429?text=' + encodeURIComponent(heroe.nombre);
          }}
        />
        <span className={`etiqueta etiqueta--${heroe.estado.toLowerCase()}`}>{heroe.estado}</span>
      </div>

      <div className="tarjeta__cuerpo">
        <h3>{heroe.nombre}</h3>
        <p className="tarjeta__real">{heroe.nombre_real}</p>
        <p className="tarjeta__poder">{heroe.poder_principal}</p>

        <div className="nivel">
          <div className="nivel__barra">
            <div className="nivel__relleno" style={{ width: `${heroe.nivel_poder}%` }} />
          </div>
          <span className="nivel__texto">{heroe.nivel_poder}/100</span>
        </div>
      </div>

      <div className="tarjeta__acciones">
        <Link className="boton boton--secundario" to={`/heroes/${heroe.id}`}>
          Ver detalle
        </Link>
        {/* Renderizado condicional: las acciones de escritura solo existen para ADMIN. */}
        {esAdmin && (
          <>
            <Link className="boton boton--secundario" to={`/heroes/${heroe.id}/editar`}>
              Editar
            </Link>
            <button className="boton boton--peligro" onClick={() => onEliminar(heroe)}>
              Eliminar
            </button>
          </>
        )}
      </div>
    </article>
  );
}
