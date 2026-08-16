import { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errores';

/** Ruta inexistente. */
export function rutaNoEncontrada(req: Request, res: Response) {
  res.status(404).json({ error: `La ruta ${req.method} ${req.originalUrl} no existe` });
}

/** Manejador global: toda la API responde errores con el mismo formato JSON. */
export function manejadorErrores(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.detalles ? { detalles: err.detalles } : {}),
    });
  }

  console.error('[ERROR NO CONTROLADO]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

/** Envuelve controladores async para que sus errores lleguen al manejador global. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
