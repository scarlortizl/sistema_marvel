import { compare, hash } from 'bcryptjs';
import { Request, Response } from 'express';
import { AppError } from '../lib/errores';
import { firmarToken } from '../lib/jwt';
import { prisma } from '../lib/prisma';
import { DatosLogin, DatosRegistro } from '../schemas/auth.schema';

// Nunca se devuelve el hash de la password al cliente.
const usuarioPublico = { id: true, nombre: true, email: true, rol: true, creado_en: true };

/** POST /api/auth/register */
export async function registrar(req: Request, res: Response) {
  const { nombre, email, password, rol } = req.body as DatosRegistro;

  // Regla de negocio: no se permiten dos usuarios con el mismo email.
  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) throw new AppError(409, `Ya existe un usuario registrado con el email ${email}`);

  const usuario = await prisma.usuario.create({
    data: { nombre, email, password: await hash(password, 10), rol },
    select: usuarioPublico,
  });

  const { token } = firmarToken(usuario);
  res.status(201).json({ usuario, token });
}

/** POST /api/auth/login */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body as DatosLogin;

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  // Mismo mensaje para email inexistente y password incorrecta: no se revela cual falla.
  if (!usuario || !(await compare(password, usuario.password))) {
    throw new AppError(401, 'Email o password incorrectos');
  }

  const { token } = firmarToken(usuario);
  res.json({
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      creado_en: usuario.creado_en,
    },
    token,
  });
}

/** GET /api/auth/me */
export async function perfil(req: Request, res: Response) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: req.usuario!.id },
    select: usuarioPublico,
  });
  res.json({ usuario });
}

/** POST /api/auth/logout - invalida el token actual guardandolo en la lista negra. */
export async function logout(req: Request, res: Response) {
  const expiraEn = req.tokenExp ? new Date(req.tokenExp * 1000) : new Date();

  await prisma.tokenRevocado.upsert({
    where: { jti: req.jti! },
    update: {},
    create: { jti: req.jti!, expira_en: expiraEn },
  });

  // Limpieza de tokens que ya expiraron: la lista negra no crece indefinidamente.
  await prisma.tokenRevocado.deleteMany({ where: { expira_en: { lt: new Date() } } });

  res.json({ mensaje: 'Sesion cerrada correctamente' });
}
