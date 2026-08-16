import { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errores';
import { PayloadToken, verificarToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';

// Datos del usuario autenticado que se adjuntan al request.
export interface UsuarioAutenticado {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
      jti?: string;
      tokenExp?: number;
    }
  }
}

/**
 * Exige un JWT valido. Se aplica a todos los endpoints menos register y login.
 */
export async function autenticar(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError(401, 'Token no proporcionado. Envie el header Authorization: Bearer <token>');
    }

    let payload: PayloadToken;
    try {
      payload = verificarToken(header.slice(7).trim());
    } catch {
      throw new AppError(401, 'Token invalido o expirado');
    }

    // El token pudo haberse cerrado sesion antes de expirar.
    const revocado = await prisma.tokenRevocado.findUnique({ where: { jti: payload.jti } });
    if (revocado) throw new AppError(401, 'La sesion fue cerrada. Inicie sesion nuevamente');

    // Se consulta el usuario real para reflejar cambios de rol o eliminaciones.
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(payload.sub) } });
    if (!usuario) throw new AppError(401, 'El usuario del token ya no existe');

    req.usuario = { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
    req.jti = payload.jti;
    req.tokenExp = payload.exp;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Solo el rol ADMIN puede crear, editar o eliminar. El rol CONSULTA recibe 403.
 */
export function soloAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.usuario?.rol !== 'ADMIN') {
    return next(new AppError(403, 'Acceso denegado: se requiere rol ADMIN para esta operacion'));
  }
  next();
}
