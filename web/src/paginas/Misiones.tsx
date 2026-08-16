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

  return (
    <section>
      <div className="encabezado">
        <div>
          <h2>Misiones</h2>
          <p className="encabezado__sub">
            {cargando ? 'Consultando la API...' : `${misiones.length} mision(es) registradas`}
          </p>
        </div>
        {esAdmin && (
          <Link className="boton boton--primario" to="/misiones/nueva">
            + Nueva mision
          </Link>
        )}
      </div>

      {error && <div className="alerta alerta--error">{error}</div>}

      {cargando ? (
        <Cargando texto="Cargando misiones..." />
      ) : error && misiones.length === 0 ? (
        <MensajeError mensaje={error} onReintentar={cargar} />
      ) : misiones.length === 0 ? (
        <SinDatos mensaje="Todavia no hay misiones registradas" />
      ) : (
        <div className="tabla__contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Mision</th>
                <th>Superheroe</th>
                <th>Ubicacion</th>
                <th>Fecha</th>
                <th>Peligro</th>
                <th>Estado</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {misiones.map((mision) => (
                <tr key={mision.id}>
                  <td>
                    <strong>{mision.titulo}</strong>
                    <p className="fila__sub">{mision.descripcion}</p>
                  </td>
                  <td>
                    {mision.superheroe && (
                      <div className="celda__heroe">
                        <img src={mision.superheroe.imagen_url} alt={mision.superheroe.nombre} />
                        <span>{mision.superheroe.nombre}</span>
                      </div>
                    )}
                  </td>
                  <td>{mision.ubicacion}</td>
                  <td>{new Date(mision.fecha).toLocaleDateString('es-EC')}</td>
                  <td>
                    <span className={`etiqueta etiqueta--${mision.nivel_peligro.toLowerCase()}`}>
                      {mision.nivel_peligro}
                    </span>
                  </td>
                  <td>
                    <span className={`etiqueta etiqueta--${mision.estado.toLowerCase()}`}>{mision.estado}</span>
                  </td>
                  {esAdmin && (
                    <td>
                      <div className="celda__acciones">
                        <Link className="boton boton--secundario" to={`/misiones/${mision.id}/editar`}>
                          Editar
                        </Link>
                        <button className="boton boton--peligro" onClick={() => setAEliminar(mision)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aEliminar && (
        <DialogoConfirmacion
          titulo="Eliminar mision"
          mensaje={`Esta seguro de eliminar la mision "${aEliminar.titulo}"?`}
          procesando={eliminando}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setAEliminar(null)}
        />
      )}
    </section>
  );
}
