import cors from 'cors';
import express, { Application } from 'express';
import { load } from 'ts-dotenv';

import { connectDB } from './config/db';

import api from './routes/api';
import webhook from './routes/webhook';

const { PORT } = load({ PORT: Number });

const app: Application = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  connectDB();
  console.info(`Connected on PORT: ${PORT}`);
});

app.use('/', api);
app.use('/webhook', webhook);
