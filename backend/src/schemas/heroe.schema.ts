import { z } from 'zod';

export const ESTADOS_HEROE = ['ACTIVO', 'INACTIVO'] as const;

export const crearHeroeSchema = z.object({
  nombre: z.string({ error: 'El nombre es obligatorio' }).trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  nombre_real: z
    .string({ error: 'El nombre real es obligatorio' })
    .trim()
    .min(2, 'El nombre real debe tener al menos 2 caracteres'),
  poder_principal: z
    .string({ error: 'El poder principal es obligatorio' })
    .trim()
    .min(2, 'El poder principal debe tener al menos 2 caracteres'),
  nivel_poder: z.coerce
    .number({ error: 'El nivel de poder debe ser numerico' })
    .int('El nivel de poder debe ser un numero entero')
    .min(1, 'El nivel de poder debe estar entre 1 y 100')
    .max(100, 'El nivel de poder debe estar entre 1 y 100'),
  imagen_url: z.url({ error: 'La imagen debe ser una URL valida' }).trim(),
  estado: z
    .enum(ESTADOS_HEROE, { error: 'El estado solo puede ser ACTIVO o INACTIVO' })
    .default('ACTIVO'),
});

// En PUT se permite enviar solo los campos que cambian, pero al menos uno.
export const actualizarHeroeSchema = crearHeroeSchema
  .partial()
  .refine((datos) => Object.keys(datos).length > 0, {
    error: 'Debe enviar al menos un campo para actualizar',
  });

export type DatosCrearHeroe = z.infer<typeof crearHeroeSchema>;
