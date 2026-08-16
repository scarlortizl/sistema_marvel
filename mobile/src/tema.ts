// Paleta y medidas compartidas por todas las pantallas.
export const tema = {
  rojo: '#e62429',
  fondo: '#0f1115',
  superficie: '#181b22',
  superficie2: '#21252e',
  borde: '#2c313c',
  texto: '#f2f3f5',
  textoTenue: '#9aa1ad',
  verde: '#2ea44f',
  amarillo: '#d29922',
};

// Color de cada etiqueta segun el estado o el nivel de peligro.
export const colorEtiqueta: Record<string, string> = {
  ACTIVO: '#7ee2a8',
  INACTIVO: '#ff8f8f',
  BAJO: '#7ee2a8',
  MEDIO: '#ffd479',
  ALTO: '#ff9a9a',
  PENDIENTE: '#ffd479',
  EN_PROGRESO: '#79c0ff',
  COMPLETADA: '#7ee2a8',
};
