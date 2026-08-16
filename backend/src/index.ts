import 'dotenv/config';
import os from 'node:os';
import { app } from './app';

const PORT = Number(process.env.PORT ?? 4000);

// Se escucha en 0.0.0.0 para que el celular con Expo Go pueda alcanzar la API
// por la IP de la red local (localhost desde el telefono apunta al telefono).
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\nMarvel API escuchando en el puerto ${PORT}`);
  console.log(`  Local:  http://localhost:${PORT}/api`);
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const net of interfaces ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`  Red:    http://${net.address}:${PORT}/api   <- usar esta en la app movil`);
      }
    }
  }
  console.log('');
});
