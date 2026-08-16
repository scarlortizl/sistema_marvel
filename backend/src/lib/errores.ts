/**
 * Error de negocio con codigo HTTP. Se lanza desde cualquier controlador y el
 * manejador global de errores lo convierte en una respuesta JSON.
 */
export class AppError extends Error {
  status: number;
  detalles?: unknown;

  constructor(status: number, mensaje: string, detalles?: unknown) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

export const noEncontrado = (recurso: string, id: number | string) =>
  new AppError(404, `No existe ${recurso} con id ${id}`);
