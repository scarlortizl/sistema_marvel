import { Router } from 'express';
import * as heroes from '../controllers/heroes.controller';
import { autenticar, soloAdmin } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/errores';
import { validarBody } from '../middlewares/validar';
import { actualizarHeroeSchema, crearHeroeSchema } from '../schemas/heroe.schema';

export const heroesRouter = Router();

// Todas las rutas de heroes requieren un token valido.
heroesRouter.use(autenticar);

// Lectura: ADMIN y CONSULTA.
heroesRouter.get('/', asyncHandler(heroes.listar));
heroesRouter.get('/:id', asyncHandler(heroes.obtener));

// Escritura: solo ADMIN (CONSULTA recibe 403).
heroesRouter.post('/', soloAdmin, validarBody(crearHeroeSchema), asyncHandler(heroes.crear));
heroesRouter.put('/:id', soloAdmin, validarBody(actualizarHeroeSchema), asyncHandler(heroes.actualizar));
heroesRouter.delete('/:id', soloAdmin, asyncHandler(heroes.eliminar));
