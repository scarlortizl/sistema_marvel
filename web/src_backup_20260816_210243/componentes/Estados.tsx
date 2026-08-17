export function Cargando({ texto = 'Cargando...' }: { texto?: string }) {
  return (
    <div className="estado estado--scanner">
      <div className="scanner">
        <span />
      </div>
      <p className="micro-label">SCANNING DATABASE</p>
      <strong>{texto}</strong>
    </div>
  );
}

export function MensajeError({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void }) {
  return (
    <div className="estado estado--error estado--panel">
      <span className="estado__icon">!</span>
      <p className="micro-label">SYSTEM ERROR</p>
      <strong>No fue posible completar la operación.</strong>
      <p>{mensaje}</p>
      {onReintentar && (
        <button className="button button--secondary" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function SinDatos({ mensaje }: { mensaje: string }) {
  return (
    <div className="estado estado--panel">
      <span className="estado__radar" />
      <p className="micro-label">NO MATCH FOUND</p>
      <strong>Sin registros para mostrar</strong>
      <p>{mensaje}</p>
    </div>
  );
}
