/**
 * Genera sql/marvel.sql: un script SQL con la estructura de las tablas y los
 * datos iniciales, por si se prefiere revisar/cargar la base sin usar Prisma.
 *
 *   npm run sql
 */
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

const RAIZ = path.join(__dirname, '..');
const CARPETA_MIGRACIONES = path.join(RAIZ, 'prisma', 'migrations');
const SALIDA = path.join(RAIZ, 'sql', 'marvel.sql');

/** Escapa un valor de JavaScript para insertarlo en el script SQL. */
function valorSql(valor: unknown): string {
  if (valor === null || valor === undefined) return 'NULL';
  if (typeof valor === 'number') return String(valor);
  if (valor instanceof Date) return `'${valor.toISOString()}'`;
  return `'${String(valor).replace(/'/g, "''")}'`;
}

function insertar(tabla: string, filas: Record<string, unknown>[]): string {
  if (filas.length === 0) return `-- (sin registros en ${tabla})\n`;

  const columnas = Object.keys(filas[0]);
  const valores = filas
    .map((fila) => `  (${columnas.map((columna) => valorSql(fila[columna])).join(', ')})`)
    .join(',\n');

  return `INSERT INTO "${tabla}" (${columnas.map((c) => `"${c}"`).join(', ')}) VALUES\n${valores};\n`;
}

async function main() {
  // La estructura se toma de las migraciones ya generadas por Prisma.
  const estructura = fs
    .readdirSync(CARPETA_MIGRACIONES)
    .filter((carpeta) => fs.existsSync(path.join(CARPETA_MIGRACIONES, carpeta, 'migration.sql')))
    .sort()
    .map((carpeta) => fs.readFileSync(path.join(CARPETA_MIGRACIONES, carpeta, 'migration.sql'), 'utf8'))
    .join('\n');

  const [usuarios, superheroes, misiones] = await Promise.all([
    prisma.usuario.findMany({ orderBy: { id: 'asc' } }),
    prisma.superheroe.findMany({ orderBy: { id: 'asc' } }),
    prisma.mision.findMany({ orderBy: { id: 'asc' } }),
  ]);

  const contenido = `-- =============================================================
-- Plataforma Marvel - estructura y datos iniciales
-- Motor: SQLite  |  Generado con: npm run sql
--
-- Usuarios de prueba:
--   ADMIN    -> admin@marvel.com    / Admin1234
--   CONSULTA -> consulta@marvel.com / Consulta1234
-- Las passwords se guardan con hash bcrypt.
-- =============================================================

-- ------------------------- ESTRUCTURA -------------------------
${estructura}
-- ---------------------- DATOS INICIALES -----------------------
${insertar('usuarios', usuarios)}
${insertar('superheroes', superheroes)}
${insertar('misiones', misiones)}`;

  fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
  fs.writeFileSync(SALIDA, contenido, 'utf8');

  console.log(`Script SQL generado en ${SALIDA}`);
  console.log(`  ${usuarios.length} usuarios, ${superheroes.length} superheroes, ${misiones.length} misiones`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
