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
            fecha: mision.fecha.slice(0, 10),
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

  if (cargando) return <Cargando texto="Cargando formulario de misión..." />;

  return (
    <section className="screen">
      <div className="screen__hud-line">
        <span>{editando ? 'MISSION EDITOR' : 'NEW OPERATION PROTOCOL'}</span>
        <span>ADMIN ACCESS</span>
      </div>

      <div className="form-header">
        <p className="micro-label">MISSION CONTROL</p>
        <h1>{editando ? 'EDITAR MISIÓN' : 'REGISTRAR MISIÓN'}</h1>
        <p>Configure los parámetros de la operación y la unidad asignada.</p>
      </div>

      {error && <div className="alerta alerta--error">{error}</div>}

      {heroes.length === 0 ? (
        <div className="alerta alerta--error">
          No hay superhéroes registrados. Debe crear al menos uno antes de registrar una misión.
        </div>
      ) : (
        <form className="formulario" onSubmit={enviar}>
          <div className="formulario__section-title">
            <span>01</span>
            <div><strong>Información de operación</strong><p>Datos principales de la misión.</p></div>
          </div>

          <label className="campo campo--ancho">
            <span>TÍTULO *</span>
            <input value={datos.titulo} onChange={(e) => cambiar('titulo', e.target.value)} placeholder="Defensa de Nueva York" required minLength={3} />
          </label>

          <label className="campo campo--ancho">
            <span>DESCRIPCIÓN *</span>
            <textarea value={datos.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} rows={4} required minLength={5} />
          </label>

          <label className="campo">
            <span>UBICACIÓN *</span>
            <input value={datos.ubicacion} onChange={(e) => cambiar('ubicacion', e.target.value)} placeholder="Nueva York, EE. UU." required minLength={2} />
          </label>

          <label className="campo">
            <span>FECHA *</span>
            <input type="date" value={datos.fecha} onChange={(e) => cambiar('fecha', e.target.value)} required />
          </label>

          <div className="formulario__section-title">
            <span>02</span>
            <div><strong>Parámetros tácticos</strong><p>Riesgo, estado y unidad asignada.</p></div>
          </div>

          <label className="campo">
            <span>NIVEL DE PELIGRO *</span>
            <select value={datos.nivel_peligro} onChange={(e) => cambiar('nivel_peligro', e.target.value)}>
              <option value="BAJO">BAJO</option>
              <option value="MEDIO">MEDIO</option>
              <option value="ALTO">ALTO</option>
            </select>
          </label>

          <label className="campo">
            <span>ESTADO *</span>
            <select value={datos.estado} onChange={(e) => cambiar('estado', e.target.value)}>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="EN_PROGRESO">EN_PROGRESO</option>
              <option value="COMPLETADA">COMPLETADA</option>
            </select>
          </label>

          <label className="campo campo--ancho">
            <span>SUPERHÉROE ASIGNADO *</span>
            <select value={datos.superheroe_id} onChange={(e) => cambiar('superheroe_id', Number(e.target.value))} required>
              {heroes.map((heroe) => (
                <option key={heroe.id} value={heroe.id}>
                  {heroe.nombre} ({heroe.nombre_real})
                </option>
              ))}
            </select>
          </label>

          <div className="formulario__acciones">
            <button type="button" className="button button--secondary" onClick={() => navegar('/misiones')}>Cancelar</button>
            <button type="submit" className="button button--primary" disabled={guardando}>
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear misión'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
