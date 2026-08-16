// Componentes pequenos y reutilizables para los tres estados de una pantalla
// que consume datos: cargando, error y sin resultados.

export function Cargando({ texto = 'Cargando...' }: { texto?: string }) {
  return (
    <div className="estado">
      <div className="spinner" />
      <p>{texto}</p>
    </div>
  );
}

export function MensajeError({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void }) {
  return (
    <div className="estado estado--error">
      <p>{mensaje}</p>
      {onReintentar && (
        <button className="boton boton--secundario" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function SinDatos({ mensaje }: { mensaje: string }) {
  return (
    <div className="estado">
      <p>{mensaje}</p>
    </div>
  );
}
