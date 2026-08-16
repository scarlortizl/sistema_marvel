import { PrismaClient } from '@prisma/client';

// Instancia unica del cliente de base de datos reutilizada por toda la app.
export const prisma = new PrismaClient();
