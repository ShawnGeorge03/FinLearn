import cors from 'cors';
import express, { Application } from 'express';
import { load } from 'ts-dotenv';

import { connectDB } from './config/db';
import router from './routes/router';

const env = load({
  PORT: Number,
  MONGO_URI: String,
});

const app: Application = express();

app.use(cors());
app.use(express.json());

app.listen(env.PORT, () => {
  connectDB(env.MONGO_URI);
  console.info(`Connected on PORT: ${env.PORT}`);
});

app.use('/', router);
