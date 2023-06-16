import express, { Application } from 'express';
import { load } from 'ts-dotenv';
import cors from 'cors';

import { connectDB } from './config/db';
import router from './routes/router';

const env = load({
  PORT: Number,
  MONGO_URI: String,
});

connectDB(env.MONGO_URI);

const app: Application = express();

app.use(cors());
app.use(express.json());

app.listen(env.PORT, () => {
  console.log(`Connected on PORT: ${env.PORT}`);
});

app.use('/', router);
