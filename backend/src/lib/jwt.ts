import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'secreto-por-defecto';
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '8h') as jwt.SignOptions['expiresIn'];

export interface PayloadToken {
  sub: number; // id del usuario
  email: string;
  rol: string;
  jti: string; // identificador del token, usado para revocarlo en el logout
  iat?: number; // emitido en (lo agrega jsonwebtoken)
  exp?: number; // expira en (lo agrega jsonwebtoken)
}

export function firmarToken(usuario: { id: number; email: string; rol: string }) {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ sub: usuario.id, email: usuario.email, rol: usuario.rol, jti }, SECRET, {
    expiresIn: EXPIRES_IN,
  });
  return { token, jti };
}

export function verificarToken(token: string): PayloadToken {
  return jwt.verify(token, SECRET) as unknown as PayloadToken;
}
