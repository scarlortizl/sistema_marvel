import { z } from 'zod';

export const NIVELES_PELIGRO = ['BAJO', 'MEDIO', 'ALTO'] as const;
export const ESTADOS_MISION = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'] as const;

export const crearMisionSchema = z.object({
  titulo: z.string({ error: 'El titulo es obligatorio' }).trim().min(3, 'El titulo debe tener al menos 3 caracteres'),
  descripcion: z
    .string({ error: 'La descripcion es obligatoria' })
    .trim()
    .min(5, 'La descripcion debe tener al menos 5 caracteres'),
  ubicacion: z
    .string({ error: 'La ubicacion es obligatoria' })
    .trim()
    .min(2, 'La ubicacion debe tener al menos 2 caracteres'),
  fecha: z.coerce.date({ error: 'La fecha es obligatoria y debe tener el formato YYYY-MM-DD' }),
  nivel_peligro: z.enum(NIVELES_PELIGRO, {
    error: 'El nivel de peligro solo puede ser BAJO, MEDIO o ALTO',
  }),
  estado: z
    .enum(ESTADOS_MISION, { error: 'El estado solo puede ser PENDIENTE, EN_PROGRESO o COMPLETADA' })
    .default('PENDIENTE'),
  superheroe_id: z.coerce
    .number({ error: 'Debe indicar el superheroe de la mision' })
    .int('El id del superheroe debe ser un numero entero')
    .positive('El id del superheroe debe ser un numero positivo'),
});

export const actualizarMisionSchema = crearMisionSchema
  .partial()
  .refine((datos) => Object.keys(datos).length > 0, {
    error: 'Debe enviar al menos un campo para actualizar',
  });

export type DatosCrearMision = z.infer<typeof crearMisionSchema>;
