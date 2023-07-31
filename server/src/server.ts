import { load } from 'ts-dotenv';

import { connectDB } from './config/db';

import app from './app';

const { PORT } = load({ PORT: Number });

app.listen(PORT, () => {
  connectDB();
  console.info(`Connected on PORT: ${PORT}`);
});
