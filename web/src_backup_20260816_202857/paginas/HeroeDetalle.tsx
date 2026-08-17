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
    let activo = true; // evita actualizar el estado si el componente ya se desmonto

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
    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) return <Cargando texto="Cargando superheroe..." />;
  if (error) return <MensajeError mensaje={error} />;
  if (!heroe) return null;

  return (
    <section>
      <Link className="volver" to="/heroes">
        &larr; Volver al listado
      </Link>

      <div className="detalle">
        <img
          className="detalle__imagen"
          src={heroe.imagen_url}
          alt={heroe.nombre}
          onError={(evento) => {
            evento.currentTarget.src =
              'https://placehold.co/400x520/1a1a1a/e62429?text=' + encodeURIComponent(heroe.nombre);
          }}
        />

        <div className="detalle__datos">
          <h2>{heroe.nombre}</h2>
          <span className={`etiqueta etiqueta--${heroe.estado.toLowerCase()}`}>{heroe.estado}</span>

          <dl>
            <div>
              <dt>Nombre real</dt>
              <dd>{heroe.nombre_real}</dd>
            </div>
            <div>
              <dt>Poder principal</dt>
              <dd>{heroe.poder_principal}</dd>
            </div>
            <div>
              <dt>Nivel de poder</dt>
              <dd>
                <div className="nivel">
                  <div className="nivel__barra">
                    <div className="nivel__relleno" style={{ width: `${heroe.nivel_poder}%` }} />
                  </div>
                  <span className="nivel__texto">{heroe.nivel_poder}/100</span>
                </div>
              </dd>
            </div>
          </dl>

          {esAdmin && (
            <Link className="boton boton--primario" to={`/heroes/${heroe.id}/editar`}>
              Editar superheroe
            </Link>
          )}
        </div>
      </div>

      <h3 className="subtitulo">Misiones asignadas</h3>
      {heroe.misiones && heroe.misiones.length > 0 ? (
        <div className="lista">
          {heroe.misiones.map((mision) => (
            <div className="fila" key={mision.id}>
              <div>
                <strong>{mision.titulo}</strong>
                <p className="fila__sub">
                  {mision.ubicacion} &middot; {new Date(mision.fecha).toLocaleDateString('es-EC')}
                </p>
              </div>
              <div className="fila__etiquetas">
                <span className={`etiqueta etiqueta--${mision.nivel_peligro.toLowerCase()}`}>
                  {mision.nivel_peligro}
                </span>
                <span className={`etiqueta etiqueta--${mision.estado.toLowerCase()}`}>{mision.estado}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="texto-tenue">Este superheroe no tiene misiones asignadas.</p>
      )}
    </section>
  );
}
