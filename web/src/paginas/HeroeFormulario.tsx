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

  // Al editar se traen los datos actuales del heroe desde la API.
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

  // Un solo manejador para todos los inputs controlados del formulario.
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

  if (cargando) return <Cargando texto="Cargando datos del superheroe..." />;

  return (
    <section>
      <h2>{editando ? 'Editar superheroe' : 'Nuevo superheroe'}</h2>

      {error && <div className="alerta alerta--error">{error}</div>}

      <form className="formulario" onSubmit={enviar}>
        <label className="campo">
          <span>Nombre *</span>
          <input
            value={datos.nombre}
            onChange={(evento) => cambiar('nombre', evento.target.value)}
            placeholder="Iron Man"
            required
            minLength={2}
          />
        </label>

        <label className="campo">
          <span>Nombre real *</span>
          <input
            value={datos.nombre_real}
            onChange={(evento) => cambiar('nombre_real', evento.target.value)}
            placeholder="Tony Stark"
            required
            minLength={2}
          />
        </label>

        <label className="campo">
          <span>Poder principal *</span>
          <input
            value={datos.poder_principal}
            onChange={(evento) => cambiar('poder_principal', evento.target.value)}
            placeholder="Armadura tecnologica"
            required
            minLength={2}
          />
        </label>

        <label className="campo">
          <span>Nivel de poder (1 a 100) *</span>
          <input
            type="number"
            min={1}
            max={100}
            value={datos.nivel_poder}
            onChange={(evento) => cambiar('nivel_poder', Number(evento.target.value))}
            required
          />
        </label>

        <label className="campo campo--ancho">
          <span>URL de la imagen *</span>
          <input
            type="url"
            value={datos.imagen_url}
            onChange={(evento) => cambiar('imagen_url', evento.target.value)}
            placeholder="https://..."
            required
          />
        </label>

        <label className="campo">
          <span>Estado *</span>
          <select value={datos.estado} onChange={(evento) => cambiar('estado', evento.target.value)}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </label>

        {/* Vista previa: ayuda a comprobar que la URL de la imagen es correcta. */}
        {datos.imagen_url && (
          <div className="campo campo--ancho">
            <span>Vista previa</span>
            <img
              className="previa"
              src={datos.imagen_url}
              alt="Vista previa"
              onError={(evento) => {
                evento.currentTarget.style.display = 'none';
              }}
              onLoad={(evento) => {
                evento.currentTarget.style.display = 'block';
              }}
            />
          </div>
        )}

        <div className="formulario__acciones">
          <button type="button" className="boton boton--secundario" onClick={() => navegar('/heroes')}>
            Cancelar
          </button>
          <button type="submit" className="boton boton--primario" disabled={guardando}>
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear superheroe'}
          </button>
        </div>
      </form>
    </section>
  );
}
