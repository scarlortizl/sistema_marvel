import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { servicioHeroes, type DatosHeroe } from '../api/servicios';
import { Cargando } from '../componentes/Estados';

const FORMULARIO_VACIO: DatosHeroe = {
  nombre: '',
  nombre_real: '',
  poder_principal: '',
  nivel_poder: 50,
  imagen_url: '',
  estado: 'ACTIVO',
};

export function HeroeFormulario() {
  const { id } = useParams();
  const navegar = useNavigate();
  const editando = Boolean(id);

  const [datos, setDatos] = useState<DatosHeroe>(FORMULARIO_VACIO);
  const [cargando, setCargando] = useState(editando);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editando) return;
    servicioHeroes
      .obtener(Number(id))
      .then((heroe) =>
        setDatos({
          nombre: heroe.nombre,
          nombre_real: heroe.nombre_real,
          poder_principal: heroe.poder_principal,
          nivel_poder: heroe.nivel_poder,
          imagen_url: heroe.imagen_url,
          estado: heroe.estado,
        }),
      )
      .catch((error) => setError(mensajeDeError(error)))
      .finally(() => setCargando(false));
  }, [id, editando]);

  const cambiar = (campo: keyof DatosHeroe, valor: string | number) =>
    setDatos((actuales) => ({ ...actuales, [campo]: valor }));

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setError('');
    setGuardando(true);
    try {
      if (editando) await servicioHeroes.actualizar(Number(id), datos);
      else await servicioHeroes.crear(datos);
      navegar('/heroes');
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando texto="Cargando datos del superhéroe..." />;

  return (
    <section className="screen">
      <div className="screen__hud-line">
        <span>{editando ? 'PROFILE EDITOR' : 'NEW IDENTITY REGISTRATION'}</span>
        <span>ADMIN ACCESS</span>
      </div>

      <div className="form-header">
        <p className="micro-label">IDENTITY MANAGEMENT</p>
        <h1>{editando ? 'EDITAR SUPERHÉROE' : 'REGISTRAR SUPERHÉROE'}</h1>
        <p>Complete la información que será enviada a la API.</p>
      </div>

      {error && <div className="alerta alerta--error">{error}</div>}

      <form className="formulario" onSubmit={enviar}>
        <div className="formulario__section-title">
          <span>01</span>
          <div><strong>Identidad</strong><p>Información principal del perfil.</p></div>
        </div>

        <label className="campo">
          <span>NOMBRE DE HÉROE *</span>
          <input value={datos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} placeholder="Iron Man" required minLength={2} />
        </label>

        <label className="campo">
          <span>IDENTIDAD REAL *</span>
          <input value={datos.nombre_real} onChange={(e) => cambiar('nombre_real', e.target.value)} placeholder="Tony Stark" required minLength={2} />
        </label>

        <label className="campo campo--ancho">
          <span>HABILIDAD PRINCIPAL *</span>
          <input value={datos.poder_principal} onChange={(e) => cambiar('poder_principal', e.target.value)} placeholder="Armadura tecnológica" required minLength={2} />
        </label>

        <div className="formulario__section-title">
          <span>02</span>
          <div><strong>Parámetros de combate</strong><p>Nivel de poder y estado operativo.</p></div>
        </div>

        <label className="campo">
          <span>POWER LEVEL *</span>
          <div className="range-control">
            <input type="range" min={1} max={100} value={datos.nivel_poder} onChange={(e) => cambiar('nivel_poder', Number(e.target.value))} />
            <strong>{datos.nivel_poder}</strong>
          </div>
        </label>

        <label className="campo">
          <span>ESTADO *</span>
          <select value={datos.estado} onChange={(e) => cambiar('estado', e.target.value)}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </label>

        <label className="campo campo--ancho">
          <span>URL DE IMAGEN *</span>
          <input type="url" value={datos.imagen_url} onChange={(e) => cambiar('imagen_url', e.target.value)} placeholder="https://..." required />
        </label>

        {datos.imagen_url && (
          <div className="preview-panel campo--ancho">
            <div>
              <span className="micro-label">IMAGE PREVIEW</span>
              <p>Previsualización del recurso remoto.</p>
            </div>
            <img
              className="previa"
              src={datos.imagen_url}
              alt="Vista previa"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
            />
          </div>
        )}

        <div className="formulario__acciones">
          <button type="button" className="button button--secondary" onClick={() => navegar('/heroes')}>Cancelar</button>
          <button type="submit" className="button button--primary" disabled={guardando}>
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear superhéroe'}
          </button>
        </div>
      </form>
    </section>
  );
}
