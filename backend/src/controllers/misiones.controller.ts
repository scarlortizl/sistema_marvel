import { Request, Response } from 'express';
import { noEncontrado } from '../lib/errores';
import { prisma } from '../lib/prisma';
import { obtenerId } from '../middlewares/validar';
import { DatosCrearMision } from '../schemas/mision.schema';

// Datos del heroe que acompanan a cada mision para poder mostrarlos en los listados.
const conHeroe = {
  superheroe: { select: { id: true, nombre: true, imagen_url: true, estado: true } },
};

/**
 * GET /api/misiones
 * Filtros opcionales: ?estado=PENDIENTE&nivel_peligro=ALTO&superheroe_id=3
 */
export async function listar(req: Request, res: Response) {
  const { estado, nivel_peligro, superheroe_id } = req.query as Record<string, string | undefined>;

  const misiones = await prisma.mision.findMany({
    where: {
      ...(estado ? { estado } : {}),
      ...(nivel_peligro ? { nivel_peligro } : {}),
      ...(superheroe_id ? { superheroe_id: Number(superheroe_id) } : {}),
    },
    include: conHeroe,
    orderBy: { fecha: 'desc' },
  });

  res.json({ total: misiones.length, datos: misiones });
}

/** GET /api/misiones/:id */
export async function obtener(req: Request, res: Response) {
  const id = obtenerId(req);

  const mision = await prisma.mision.findUnique({ where: { id }, include: conHeroe });
  if (!mision) throw noEncontrado('la mision', id);

  res.json(mision);
}

/** POST /api/misiones - solo ADMIN. */
export async function crear(req: Request, res: Response) {
  const datos = req.body as DatosCrearMision;

  // Regla de negocio: la mision debe asociarse a un superheroe existente.
  const heroe = await prisma.superheroe.findUnique({ where: { id: datos.superheroe_id } });
  if (!heroe) throw noEncontrado('el superheroe', datos.superheroe_id);

  const mision = await prisma.mision.create({ data: datos, include: conHeroe });
  res.status(201).json(mision);
}

/** PUT /api/misiones/:id - solo ADMIN. */
export async function actualizar(req: Request, res: Response) {
  const id = obtenerId(req);
  const datos = req.body as Partial<DatosCrearMision>;

  const mision = await prisma.mision.findUnique({ where: { id } });
  if (!mision) throw noEncontrado('la mision', id);

  if (datos.superheroe_id && datos.superheroe_id !== mision.superheroe_id) {
    const heroe = await prisma.superheroe.findUnique({ where: { id: datos.superheroe_id } });
    if (!heroe) throw noEncontrado('el superheroe', datos.superheroe_id);
  }

  const actualizada = await prisma.mision.update({ where: { id }, data: datos, include: conHeroe });
  res.json(actualizada);
}

/** DELETE /api/misiones/:id - solo ADMIN. */
export async function eliminar(req: Request, res: Response) {
  const id = obtenerId(req);

  const mision = await prisma.mision.findUnique({ where: { id } });
  if (!mision) throw noEncontrado('la mision', id);

  await prisma.mision.delete({ where: { id } });
  res.json({ mensaje: `Mision "${mision.titulo}" eliminada correctamente`, id });
}
