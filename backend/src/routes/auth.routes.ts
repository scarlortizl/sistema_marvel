import { Router } from 'express';
import * as auth from '../controllers/auth.controller';
import { autenticar } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/errores';
import { validarBody } from '../middlewares/validar';
import { loginSchema, registroSchema } from '../schemas/auth.schema';

export const authRouter = Router();

// Rutas publicas: son las unicas que no exigen token.
authRouter.post('/register', validarBody(registroSchema), asyncHandler(auth.registrar));
authRouter.post('/login', validarBody(loginSchema), asyncHandler(auth.login));

// Rutas protegidas.
authRouter.get('/me', autenticar, asyncHandler(auth.perfil));
authRouter.post('/logout', autenticar, asyncHandler(auth.logout));
