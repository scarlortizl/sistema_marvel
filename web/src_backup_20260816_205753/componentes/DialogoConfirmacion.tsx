import { useEffect } from 'react';

interface Props {
  titulo: string;
  mensaje: string;
  procesando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function DialogoConfirmacion({ titulo, mensaje, procesando, onConfirmar, onCancelar }: Props) {
  useEffect(() => {
    const cerrar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape' && !procesando) onCancelar();
    };
    window.addEventListener('keydown', cerrar);
    return () => window.removeEventListener('keydown', cerrar);
  }, [onCancelar, procesando]);

  return (
    <div className="modal__fondo" onClick={() => !procesando && onCancelar()}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(evento) => evento.stopPropagation()}>
        <div className="modal__indicator">
          <span />
          CONFIRM ACTION
        </div>
        <h3>{titulo}</h3>
        <p>{mensaje}</p>
        <div className="modal__warning">Esta acción modifica información almacenada en la API.</div>
        <div className="modal__acciones">
          <button className="button button--secondary" onClick={onCancelar} disabled={procesando}>
            Cancelar
          </button>
          <button className="button button--danger" onClick={onConfirmar} disabled={procesando}>
            {procesando ? 'Procesando...' : 'Confirmar eliminación'}
          </button>
        </div>
      </div>
    </div>
  );
}
