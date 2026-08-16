-- =============================================================
-- Plataforma Marvel - estructura y datos iniciales
-- Motor: SQLite  |  Generado con: npm run sql
--
-- Usuarios de prueba:
--   ADMIN    -> admin@marvel.com    / Admin1234
--   CONSULTA -> consulta@marvel.com / Consulta1234
-- Las passwords se guardan con hash bcrypt.
-- =============================================================

-- ------------------------- ESTRUCTURA -------------------------
-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'CONSULTA',
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "superheroes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "nombre_real" TEXT NOT NULL,
    "poder_principal" TEXT NOT NULL,
    "nivel_poder" INTEGER NOT NULL,
    "imagen_url" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "misiones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "nivel_peligro" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "superheroe_id" INTEGER NOT NULL,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "misiones_superheroe_id_fkey" FOREIGN KEY ("superheroe_id") REFERENCES "superheroes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tokens_revocados" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jti" TEXT NOT NULL,
    "expira_en" DATETIME NOT NULL,
    "revocado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "superheroes_nombre_key" ON "superheroes"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_revocados_jti_key" ON "tokens_revocados"("jti");

-- ---------------------- DATOS INICIALES -----------------------
INSERT INTO "usuarios" ("id", "nombre", "email", "password", "rol", "creado_en") VALUES
  (4, 'Nick Fury', 'admin@marvel.com', '$2b$10$opTSNSyL78.Fw7O9QPRJmeuSCwD.uT4AwQKeFWRoabvVbiEaM90C6', 'ADMIN', '2026-08-16T23:07:44.164Z'),
  (5, 'Phil Coulson', 'consulta@marvel.com', '$2b$10$I15PNpOuKuSB0wpEDq3SPOKW.rgYHdxPPBJ6jjUxRGuVuQaa2eLGO', 'CONSULTA', '2026-08-16T23:07:44.164Z');

INSERT INTO "superheroes" ("id", "nombre", "nombre_real", "poder_principal", "nivel_poder", "imagen_url", "estado", "creado_en") VALUES
  (14, 'Iron Man', 'Tony Stark', 'Armadura tecnologica de combate', 88, 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/346-iron-man.jpg', 'ACTIVO', '2026-08-16T23:07:44.185Z'),
  (15, 'Captain America', 'Steve Rogers', 'Fuerza y agilidad sobrehumanas', 82, 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/149-captain-america.jpg', 'ACTIVO', '2026-08-16T23:07:44.195Z'),
  (16, 'Thor', 'Thor Odinson', 'Control del trueno y la tormenta', 97, 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/659-thor.jpg', 'ACTIVO', '2026-08-16T23:07:44.202Z'),
  (17, 'Hulk', 'Bruce Banner', 'Fuerza ilimitada y regeneracion', 95, 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/332-hulk.jpg', 'ACTIVO', '2026-08-16T23:07:44.213Z'),
  (18, 'Black Widow', 'Natasha Romanoff', 'Espionaje y combate cuerpo a cuerpo', 64, 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/107-black-widow.jpg', 'ACTIVO', '2026-08-16T23:07:44.222Z'),
  (19, 'Spider-Man', 'Peter Parker', 'Sentido aracnido y adherencia', 79, 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg', 'ACTIVO', '2026-08-16T23:07:44.231Z'),
  (20, 'Doctor Strange', 'Stephen Strange', 'Magia y manipulacion del tiempo', 92, 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/226-doctor-strange.jpg', 'ACTIVO', '2026-08-16T23:07:44.239Z'),
  (21, 'Black Panther', 'T''Challa', 'Traje de vibranium y fuerza mejorada', 81, 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/106-black-panther.jpg', 'INACTIVO', '2026-08-16T23:07:44.248Z');

INSERT INTO "misiones" ("id", "titulo", "descripcion", "ubicacion", "fecha", "nivel_peligro", "estado", "superheroe_id", "creado_en") VALUES
  (13, 'Defensa de Nueva York', 'Contener la invasion Chitauri sobre Manhattan y cerrar el portal.', 'Nueva York, EE. UU.', '2026-03-12T00:00:00.000Z', 'ALTO', 'COMPLETADA', 14, '2026-08-16T23:07:44.273Z'),
  (14, 'Recuperar el suero perdido', 'Interceptar el cargamento de suero del supersoldado robado por Hydra.', 'Berlin, Alemania', '2026-05-04T00:00:00.000Z', 'MEDIO', 'EN_PROGRESO', 15, '2026-08-16T23:07:44.283Z'),
  (15, 'Vigilancia del Bifrost', 'Custodiar el puente entre Asgard y la Tierra ante posibles intrusiones.', 'Asgard', '2026-06-21T00:00:00.000Z', 'ALTO', 'PENDIENTE', 16, '2026-08-16T23:07:44.293Z'),
  (16, 'Contencion de radiacion gamma', 'Neutralizar una fuga de radiacion gamma en un laboratorio abandonado.', 'Dayton, Ohio', '2026-04-18T00:00:00.000Z', 'MEDIO', 'COMPLETADA', 17, '2026-08-16T23:07:44.301Z'),
  (17, 'Infiltracion en la Sala Roja', 'Obtener la lista de agentes encubiertos del programa Sala Roja.', 'Moscu, Rusia', '2026-07-09T00:00:00.000Z', 'ALTO', 'EN_PROGRESO', 18, '2026-08-16T23:07:44.309Z'),
  (18, 'Patrullaje en Queens', 'Vigilancia nocturna del barrio y apoyo a la policia local.', 'Queens, Nueva York', '2026-08-02T00:00:00.000Z', 'BAJO', 'PENDIENTE', 19, '2026-08-16T23:07:44.317Z');
