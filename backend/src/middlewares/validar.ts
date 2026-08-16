import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';
import { AppError } from '../lib/errores';

/**
 * Valida req.body con un esquema de Zod y reemplaza el body por los datos ya
 * convertidos. Si falla, responde 422 con la lista de campos con error.
 */
export const validarBody =
  (esquema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const resultado = esquema.safeParse(req.body);
    if (!resultado.success) {
      const detalles = resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.') || '(body)',
        mensaje: issue.message,
      }));
      return next(new AppError(422, 'Error de validacion en los datos enviados', detalles));
    }
    req.body = resultado.data;
    next();
  };

/**
 * Convierte el parametro :id a numero y rechaza valores no numericos.
 */
export function obtenerId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `El identificador '${req.params.id}' no es valido`);
  }
  return id;
}
