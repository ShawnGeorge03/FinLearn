import request from 'supertest';

import { connectDB, disconnectDB } from '../src/config/db';

import app from '../src/app';

describe('Test /status', () => {
  test('Verify Server Status with No DB', async () => {
    const res = await request(app).get('/status');

    expect(res.body).toEqual({ message: 'DOWN' });
  });

  test('Verify Server Status with DB', async () => {
    await connectDB();
    const res = await request(app).get('/status');
    await disconnectDB();

    expect(res.body).toEqual({ message: 'UP' });
  });
});
