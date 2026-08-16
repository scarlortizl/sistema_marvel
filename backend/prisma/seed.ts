import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const IMG = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg';

async function main() {
  console.log('Cargando datos iniciales...');

  // Se limpia la base para que el seed se pueda ejecutar las veces que haga falta.
  await prisma.mision.deleteMany();
  await prisma.superheroe.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.tokenRevocado.deleteMany();

  // ---------------------------------------------------------------- usuarios
  await prisma.usuario.createMany({
    data: [
      {
        nombre: 'Nick Fury',
        email: 'admin@marvel.com',
        password: await hash('Admin1234', 10),
        rol: 'ADMIN',
      },
      {
        nombre: 'Phil Coulson',
        email: 'consulta@marvel.com',
        password: await hash('Consulta1234', 10),
        rol: 'CONSULTA',
      },
    ],
  });

  // ------------------------------------------------------------- superheroes
  const heroes = [
    {
      nombre: 'Iron Man',
      nombre_real: 'Tony Stark',
      poder_principal: 'Armadura tecnologica de combate',
      nivel_poder: 88,
      imagen_url: `${IMG}/346-iron-man.jpg`,
      estado: 'ACTIVO',
    },
    {
      nombre: 'Captain America',
      nombre_real: 'Steve Rogers',
      poder_principal: 'Fuerza y agilidad sobrehumanas',
      nivel_poder: 82,
      imagen_url: `${IMG}/149-captain-america.jpg`,
      estado: 'ACTIVO',
    },
    {
      nombre: 'Thor',
      nombre_real: 'Thor Odinson',
      poder_principal: 'Control del trueno y la tormenta',
      nivel_poder: 97,
      imagen_url: `${IMG}/659-thor.jpg`,
      estado: 'ACTIVO',
    },
    {
      nombre: 'Hulk',
      nombre_real: 'Bruce Banner',
      poder_principal: 'Fuerza ilimitada y regeneracion',
      nivel_poder: 95,
      imagen_url: `${IMG}/332-hulk.jpg`,
      estado: 'ACTIVO',
    },
    {
      nombre: 'Black Widow',
      nombre_real: 'Natasha Romanoff',
      poder_principal: 'Espionaje y combate cuerpo a cuerpo',
      nivel_poder: 64,
      imagen_url: `${IMG}/107-black-widow.jpg`,
      estado: 'ACTIVO',
    },
    {
      nombre: 'Spider-Man',
      nombre_real: 'Peter Parker',
      poder_principal: 'Sentido aracnido y adherencia',
      nivel_poder: 79,
      imagen_url: `${IMG}/620-spider-man.jpg`,
      estado: 'ACTIVO',
    },
    {
      nombre: 'Doctor Strange',
      nombre_real: 'Stephen Strange',
      poder_principal: 'Magia y manipulacion del tiempo',
      nivel_poder: 92,
      imagen_url: `${IMG}/226-doctor-strange.jpg`,
      estado: 'ACTIVO',
    },
    {
      nombre: 'Black Panther',
      nombre_real: "T'Challa",
      poder_principal: 'Traje de vibranium y fuerza mejorada',
      nivel_poder: 81,
      imagen_url: `${IMG}/106-black-panther.jpg`,
      estado: 'INACTIVO',
    },
  ];

  for (const heroe of heroes) {
    await prisma.superheroe.create({ data: heroe });
  }

  // Se busca cada heroe por nombre para no depender de ids autoincrementales.
  const idDe = async (nombre: string) =>
    (await prisma.superheroe.findUniqueOrThrow({ where: { nombre } })).id;

  // ---------------------------------------------------------------- misiones
  const misiones = [
    {
      titulo: 'Defensa de Nueva York',
      descripcion: 'Contener la invasion Chitauri sobre Manhattan y cerrar el portal.',
      ubicacion: 'Nueva York, EE. UU.',
      fecha: new Date('2026-03-12'),
      nivel_peligro: 'ALTO',
      estado: 'COMPLETADA',
      superheroe_id: await idDe('Iron Man'),
    },
    {
      titulo: 'Recuperar el suero perdido',
      descripcion: 'Interceptar el cargamento de suero del supersoldado robado por Hydra.',
      ubicacion: 'Berlin, Alemania',
      fecha: new Date('2026-05-04'),
      nivel_peligro: 'MEDIO',
      estado: 'EN_PROGRESO',
      superheroe_id: await idDe('Captain America'),
    },
    {
      titulo: 'Vigilancia del Bifrost',
      descripcion: 'Custodiar el puente entre Asgard y la Tierra ante posibles intrusiones.',
      ubicacion: 'Asgard',
      fecha: new Date('2026-06-21'),
      nivel_peligro: 'ALTO',
      estado: 'PENDIENTE',
      superheroe_id: await idDe('Thor'),
    },
    {
      titulo: 'Contencion de radiacion gamma',
      descripcion: 'Neutralizar una fuga de radiacion gamma en un laboratorio abandonado.',
      ubicacion: 'Dayton, Ohio',
      fecha: new Date('2026-04-18'),
      nivel_peligro: 'MEDIO',
      estado: 'COMPLETADA',
      superheroe_id: await idDe('Hulk'),
    },
    {
      titulo: 'Infiltracion en la Sala Roja',
      descripcion: 'Obtener la lista de agentes encubiertos del programa Sala Roja.',
      ubicacion: 'Moscu, Rusia',
      fecha: new Date('2026-07-09'),
      nivel_peligro: 'ALTO',
      estado: 'EN_PROGRESO',
      superheroe_id: await idDe('Black Widow'),
    },
    {
      titulo: 'Patrullaje en Queens',
      descripcion: 'Vigilancia nocturna del barrio y apoyo a la policia local.',
      ubicacion: 'Queens, Nueva York',
      fecha: new Date('2026-08-02'),
      nivel_peligro: 'BAJO',
      estado: 'PENDIENTE',
      superheroe_id: await idDe('Spider-Man'),
    },
  ];

  for (const mision of misiones) {
    await prisma.mision.create({ data: mision });
  }

  console.log(`OK: ${await prisma.usuario.count()} usuarios, ${await prisma.superheroe.count()} superheroes, ${await prisma.mision.count()} misiones`);
  console.log('  ADMIN    -> admin@marvel.com / Admin1234');
  console.log('  CONSULTA -> consulta@marvel.com / Consulta1234');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
