import path from 'path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { appRoutes } from './router';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

/* =========BACK-END====== */
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api', appRoutes);

/* =========FRONT-END====== */
app.use(express.static(path.join(__dirname, '..', '..', 'front-end', 'build')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'front-end', 'build', 'index.html'));
});
