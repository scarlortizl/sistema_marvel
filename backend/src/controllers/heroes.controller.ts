import { Request, Response } from 'express';
import { AppError, noEncontrado } from '../lib/errores';
import { prisma } from '../lib/prisma';
import { obtenerId } from '../middlewares/validar';
import { DatosCrearHeroe } from '../schemas/heroe.schema';

/**
 * GET /api/heroes
 * Filtros opcionales por query string: ?nombre=iron&estado=ACTIVO
 */
export async function listar(req: Request, res: Response) {
  const { nombre, estado } = req.query as { nombre?: string; estado?: string };

  const heroes = await prisma.superheroe.findMany({
    where: {
      // En SQLite el operador LIKE de 'contains' ya ignora mayusculas para ASCII.
      ...(nombre ? { nombre: { contains: nombre } } : {}),
      ...(estado ? { estado } : {}),
    },
    orderBy: { nombre: 'asc' },
  });

  res.json({ total: heroes.length, datos: heroes });
}

/** GET /api/heroes/:id - incluye las misiones del heroe para la pantalla de detalle. */
export async function obtener(req: Request, res: Response) {
  const id = obtenerId(req);

  const heroe = await prisma.superheroe.findUnique({
    where: { id },
    include: { misiones: { orderBy: { fecha: 'desc' } } },
  });
  if (!heroe) throw noEncontrado('el superheroe', id);

  res.json(heroe);
}

/** POST /api/heroes - solo ADMIN. */
export async function crear(req: Request, res: Response) {
  const datos = req.body as DatosCrearHeroe;

  // Regla de negocio: no se permiten superheroes con el mismo nombre.
  const existente = await prisma.superheroe.findUnique({ where: { nombre: datos.nombre } });
  if (existente) throw new AppError(409, `Ya existe un superheroe con el nombre ${datos.nombre}`);

  const heroe = await prisma.superheroe.create({ data: datos });
  res.status(201).json(heroe);
}

/** PUT /api/heroes/:id - solo ADMIN. */
export async function actualizar(req: Request, res: Response) {
  const id = obtenerId(req);
  const datos = req.body as Partial<DatosCrearHeroe>;

  const heroe = await prisma.superheroe.findUnique({ where: { id } });
  if (!heroe) throw noEncontrado('el superheroe', id);

  if (datos.nombre && datos.nombre !== heroe.nombre) {
    const repetido = await prisma.superheroe.findUnique({ where: { nombre: datos.nombre } });
    if (repetido) throw new AppError(409, `Ya existe un superheroe con el nombre ${datos.nombre}`);
  }

  const actualizado = await prisma.superheroe.update({ where: { id }, data: datos });
  res.json(actualizado);
}

/** DELETE /api/heroes/:id - solo ADMIN. */
export async function eliminar(req: Request, res: Response) {
  const id = obtenerId(req);

  const heroe = await prisma.superheroe.findUnique({
    where: { id },
    include: { _count: { select: { misiones: true } } },
  });
  if (!heroe) throw noEncontrado('el superheroe', id);

  // Regla de negocio: toda mision debe apuntar a un superheroe existente, por eso
  // no se puede borrar un heroe que todavia tiene misiones asignadas.
  if (heroe._count.misiones > 0) {
    throw new AppError(
      409,
      `No se puede eliminar a ${heroe.nombre} porque tiene ${heroe._count.misiones} mision(es) asociada(s). Elimine o reasigne primero esas misiones`,
    );
  }

  await prisma.superheroe.delete({ where: { id } });
  res.json({ mensaje: `Superheroe ${heroe.nombre} eliminado correctamente`, id });
}
