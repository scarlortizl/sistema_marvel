import cors from 'cors';
import express from 'express';
import { manejadorErrores, rutaNoEncontrada } from './middlewares/errores';
import { authRouter } from './routes/auth.routes';
import { heroesRouter } from './routes/heroes.routes';
import { misionesRouter } from './routes/misiones.routes';

export const app = express();

// La app React y la app React Native consumen esta API desde otro origen.
app.use(cors());
app.use(express.json());

// Endpoint de cortesia para comprobar rapidamente que el servidor responde.
app.get('/api/health', (_req, res) => {
  res.json({ estado: 'ok', servicio: 'Marvel API', hora: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/heroes', heroesRouter);
app.use('/api/misiones', misionesRouter);

app.use(rutaNoEncontrada);
app.use(manejadorErrores);
