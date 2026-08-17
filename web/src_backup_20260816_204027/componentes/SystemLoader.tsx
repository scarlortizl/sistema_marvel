import { useEffect, useState } from 'react';

export function SystemLoader() {
  const [progreso, setProgreso] = useState(0);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const inicio = performance.now();
    const duracion = 1250;
    let frame = 0;

    const animar = (ahora: number) => {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const suavizado = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgreso(Math.round(suavizado * 100));

      if (t < 1) {
        frame = requestAnimationFrame(animar);
      } else {
        setTimeout(() => setSaliendo(true), 120);
      }
    };

    frame = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`system-loader ${saliendo ? 'system-loader--exit' : ''}`} aria-hidden="true">
      <div className="system-loader__scan" />
      <div className="system-loader__core">
        <div className="system-loader__mark">
          <span className="system-loader__arc" />
          <span className="system-loader__arc system-loader__arc--2" />
          <span className="system-loader__dot" />
        </div>
        <p className="system-loader__brand">MARVEL</p>
        <p className="system-loader__title">HERO CONTROL SYSTEM</p>
        <p className="system-loader__status">Inicializando protocolo de monitoreo</p>
        <div className="system-loader__progress">
          <span style={{ width: `${progreso}%` }} />
        </div>
        <div className="system-loader__meta">
          <span>STARK UI / ONLINE</span>
          <strong>{String(progreso).padStart(3, '0')}</strong>
        </div>
      </div>
    </div>
  );
}
