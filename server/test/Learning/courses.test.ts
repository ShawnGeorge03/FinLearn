import request from 'supertest';

import { connectDB, disconnectDB } from '../../src/config/db';

import app from '../../src/app';

describe('Test /courses', () => {
  test('Get All Courses', async () => {
    await connectDB();
    const res = await request(app).get('/courses');
    await disconnectDB();

    const expected = [
      {
        name: 'Money 101',
        slug: 'money-101',
        icon: 'https://cdn-icons-png.flaticon.com/512/4305/4305512.png',
      },
      {
        name: 'Finance 101',
        slug: 'finance-101',
        icon: 'https://cdn-icons-png.flaticon.com/512/4305/4305512.png',
      },
    ];

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining(expected));
  });

  test('Internal Server Error', async () => {
    const res = await request(app).get('/courses');
    const expected = {
      type: 'InternalServerError',
      message: 'Failed to retrieve Courses',
    };

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expected);
  });
});
