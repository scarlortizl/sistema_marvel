import { z } from 'zod';

export const registroSchema = z.object({
  nombre: z.string({ error: 'El nombre es obligatorio' }).trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.email({ error: 'Debe proporcionar un email valido' }).trim().toLowerCase(),
  password: z
    .string({ error: 'La password es obligatoria' })
    .min(8, 'La password debe tener al menos 8 caracteres'),
  rol: z.enum(['ADMIN', 'CONSULTA'], { error: 'El rol solo puede ser ADMIN o CONSULTA' }).default('CONSULTA'),
});

export const loginSchema = z.object({
  email: z.email({ error: 'Debe proporcionar un email valido' }).trim().toLowerCase(),
  password: z.string({ error: 'La password es obligatoria' }).min(1, 'La password es obligatoria'),
});

export type DatosRegistro = z.infer<typeof registroSchema>;
export type DatosLogin = z.infer<typeof loginSchema>;
