import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import api from './routes/api';
import webhook from './routes/webhook';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/', api);
app.use('/webhook', webhook);

app.use('/', (req: Request, res: Response): void => {
  res.json({ message: 'Catch All Route' });
});

export default app;
