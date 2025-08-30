import path from 'path';
import express from 'express';
import cors from 'cors';
import { appRoutes } from './router';

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
