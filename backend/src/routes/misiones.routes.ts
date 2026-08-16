import { Router } from 'express';
import * as misiones from '../controllers/misiones.controller';
import { autenticar, soloAdmin } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/errores';
import { validarBody } from '../middlewares/validar';
import { actualizarMisionSchema, crearMisionSchema } from '../schemas/mision.schema';

export const misionesRouter = Router();

misionesRouter.use(autenticar);

// Lectura: ADMIN y CONSULTA.
misionesRouter.get('/', asyncHandler(misiones.listar));
misionesRouter.get('/:id', asyncHandler(misiones.obtener));

// Escritura: solo ADMIN.
misionesRouter.post('/', soloAdmin, validarBody(crearMisionSchema), asyncHandler(misiones.crear));
misionesRouter.put('/:id', soloAdmin, validarBody(actualizarMisionSchema), asyncHandler(misiones.actualizar));
misionesRouter.delete('/:id', soloAdmin, asyncHandler(misiones.eliminar));
