import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes, servicioMisiones, type DatosMision } from '../api/servicios';
import { Cargando } from '../componentes/Estados';
import type { Superheroe } from '../tipos';

const FORMULARIO_VACIO: DatosMision = {
  titulo: '',
  descripcion: '',
  ubicacion: '',
  fecha: '',
  nivel_peligro: 'BAJO',
  estado: 'PENDIENTE',
  superheroe_id: 0,
};

export function MisionFormulario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const editando = Boolean(id);

  const [datos, setDatos] = useState<DatosMision>(FORMULARIO_VACIO);
  const [heroes, setHeroes] = useState<Superheroe[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Se cargan los heroes para el select y, si se esta editando, la mision.
  useEffect(() => {
    const cargar = async () => {
      try {
        const listaHeroes = await servicioHeroes.listar();
        setHeroes(listaHeroes);

        if (editando) {
          const mision = await servicioMisiones.obtener(Number(id));
          setDatos({
            titulo: mision.titulo,
            descripcion: mision.descripcion,
            ubicacion: mision.ubicacion,
            fecha: mision.fecha.slice(0, 10), // el input date necesita YYYY-MM-DD
            nivel_peligro: mision.nivel_peligro,
            estado: mision.estado,
            superheroe_id: mision.superheroe_id,
          });
        } else if (listaHeroes.length > 0) {
          setDatos((actuales) => ({ ...actuales, superheroe_id: listaHeroes[0].id }));
        }
      } catch (error) {
        setError(mensajeDeError(error));
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id, editando]);

  const cambiar = (campo: keyof DatosMision, valor: string | number) =>
    setDatos((actuales) => ({ ...actuales, [campo]: valor }));

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setError('');
    setGuardando(true);
    try {
      if (editando) await servicioMisiones.actualizar(Number(id), datos);
      else await servicioMisiones.crear(datos);
      navegar('/misiones');
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando texto="Cargando formulario..." />;

  return (
    <section>
      <h2>{editando ? 'Editar mision' : 'Nueva mision'}</h2>

      {error && <div className="alerta alerta--error">{error}</div>}

      {heroes.length === 0 ? (
        <div className="alerta alerta--error">
          No hay superheroes registrados. Debe crear al menos uno antes de registrar una mision.
        </div>
      ) : (
        <form className="formulario" onSubmit={enviar}>
          <label className="campo campo--ancho">
            <span>Titulo *</span>
            <input
              value={datos.titulo}
              onChange={(evento) => cambiar('titulo', evento.target.value)}
              placeholder="Defensa de Nueva York"
              required
              minLength={3}
            />
          </label>

          <label className="campo campo--ancho">
            <span>Descripcion *</span>
            <textarea
              value={datos.descripcion}
              onChange={(evento) => cambiar('descripcion', evento.target.value)}
              rows={3}
              required
              minLength={5}
            />
          </label>

          <label className="campo">
            <span>Ubicacion *</span>
            <input
              value={datos.ubicacion}
              onChange={(evento) => cambiar('ubicacion', evento.target.value)}
              placeholder="Nueva York, EE. UU."
              required
              minLength={2}
            />
          </label>

          <label className="campo">
            <span>Fecha *</span>
            <input
              type="date"
              value={datos.fecha}
              onChange={(evento) => cambiar('fecha', evento.target.value)}
              required
            />
          </label>

          <label className="campo">
            <span>Nivel de peligro *</span>
            <select
              value={datos.nivel_peligro}
              onChange={(evento) => cambiar('nivel_peligro', evento.target.value)}
            >
              <option value="BAJO">BAJO</option>
              <option value="MEDIO">MEDIO</option>
              <option value="ALTO">ALTO</option>
            </select>
          </label>

          <label className="campo">
            <span>Estado *</span>
            <select value={datos.estado} onChange={(evento) => cambiar('estado', evento.target.value)}>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="EN_PROGRESO">EN_PROGRESO</option>
              <option value="COMPLETADA">COMPLETADA</option>
            </select>
          </label>

          <label className="campo campo--ancho">
            <span>Superheroe asignado *</span>
            <select
              value={datos.superheroe_id}
              onChange={(evento) => cambiar('superheroe_id', Number(evento.target.value))}
              required
            >
              {heroes.map((heroe) => (
                <option key={heroe.id} value={heroe.id}>
                  {heroe.nombre} ({heroe.nombre_real})
                </option>
              ))}
            </select>
          </label>

          <div className="formulario__acciones">
            <button type="button" className="boton boton--secundario" onClick={() => navegar('/misiones')}>
              Cancelar
            </button>
            <button type="submit" className="boton boton--primario" disabled={guardando}>
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear mision'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
