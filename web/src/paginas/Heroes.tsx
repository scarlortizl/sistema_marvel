import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes } from '../api/servicios';
import { DialogoConfirmacion } from '../componentes/DialogoConfirmacion';
import { Cargando, MensajeError, SinDatos } from '../componentes/Estados';
import { TarjetaHeroe } from '../componentes/TarjetaHeroe';
import { useAuth } from '../contexto/AuthContext';
import type { Superheroe } from '../tipos';

export function Heroes() {
  const { esAdmin } = useAuth();

  const [heroes, setHeroes] = useState<Superheroe[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [aEliminar, setAEliminar] = useState<Superheroe | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [aviso, setAviso] = useState('');

  const cargar = useCallback(async (nombre: string) => {
    setCargando(true);
    setError('');
    try {
      setHeroes(await servicioHeroes.listar(nombre.trim() || undefined));
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setCargando(false);
    }
  }, []);

  // La busqueda se envia a la API con un pequeno retraso para no disparar
  // una peticion por cada tecla presionada.
  useEffect(() => {
    const temporizador = setTimeout(() => cargar(busqueda), 350);
    return () => clearTimeout(temporizador);
  }, [busqueda, cargar]);

  const confirmarEliminacion = async () => {
    if (!aEliminar) return;
    setEliminando(true);
    setError('');
    try {
      await servicioHeroes.eliminar(aEliminar.id);
      setHeroes((actuales) => actuales.filter((heroe) => heroe.id !== aEliminar.id));
      setAviso(`${aEliminar.nombre} fue eliminado correctamente`);
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
          <h2>Superheroes</h2>
          <p className="encabezado__sub">
            {cargando
  ? 'Consultando la API...'
  : `${heroes.length} ${heroes.length === 1 ? 'heroe encontrado' : 'heroes encontrados'}`}
          </p>
        </div>
        {esAdmin && (
          <Link className="boton boton--primario" to="/heroes/nuevo">
            + Nuevo superheroe
          </Link>
        )}
      </div>

      <input
  className="buscador"
  type="search"
  value={busqueda}
  onChange={(evento) => setBusqueda(evento.target.value)}
  placeholder="Buscar superheroe por nombre..."
/>

      {aviso && <div className="alerta alerta--ok">{aviso}</div>}
      {error && <div className="alerta alerta--error">{error}</div>}

      {/* Los tres estados de la pantalla: cargando, error y sin resultados. */}
      {cargando ? (
        <Cargando texto="Cargando superheroes..." />
      ) : error && heroes.length === 0 ? (
        <MensajeError mensaje={error} onReintentar={() => cargar(busqueda)} />
      ) : heroes.length === 0 ? (
        <SinDatos
          mensaje={
            busqueda
              ? `No se encontraron superheroes que coincidan con "${busqueda}"`
              : 'Todavia no hay superheroes registrados'
          }
        />
      ) : (
        <div className="grilla">
          {heroes.map((heroe) => (
            <TarjetaHeroe key={heroe.id} heroe={heroe} esAdmin={esAdmin} onEliminar={setAEliminar} />
          ))}
        </div>
      )}

      {aEliminar && (
        <DialogoConfirmacion
          titulo="Eliminar superheroe"
          mensaje={`Esta seguro de eliminar a ${aEliminar.nombre}? Esta accion no se puede deshacer.`}
          procesando={eliminando}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setAEliminar(null)}
        />
      )}
    </section>
  );
}
