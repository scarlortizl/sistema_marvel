interface Props {
  titulo: string;
  mensaje: string;
  procesando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** Ventana de confirmacion usada antes de eliminar un registro. */
export function DialogoConfirmacion({ titulo, mensaje, procesando, onConfirmar, onCancelar }: Props) {
  return (
    <div className="modal__fondo" onClick={onCancelar}>
      <div className="modal" onClick={(evento) => evento.stopPropagation()}>
        <h3>{titulo}</h3>
        <p>{mensaje}</p>
        <div className="modal__acciones">
          <button className="boton boton--secundario" onClick={onCancelar} disabled={procesando}>
            Cancelar
          </button>
          <button className="boton boton--peligro" onClick={onConfirmar} disabled={procesando}>
            {procesando ? 'Eliminando...' : 'Si, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
