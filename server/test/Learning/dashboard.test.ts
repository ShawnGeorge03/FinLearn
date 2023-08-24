import request from 'supertest';

import { connectDB, disconnectDB } from '../../src/config/db';

import app from '../../src/app';

describe('Test /learningProgress', () => {
  test('Missing Query Params', async () => {
    const res = await request(app).get('/learningProgress');

    const expected = {
      type: 'MissingQueryParams',
      message: 'The request params requires userID="user_ + alphanumeric"',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Blank userID', async () => {
    const res = await request(app)
      .get('/learningProgress')
      .query({ userID: null });

    const expected = {
      type: 'MissingUserID',
      message: 'userID must be "user_ + alphanumeric"',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Invalid userID', async () => {
    const res = await request(app)
      .get('/learningProgress')
      .query({ userID: 'test-0001' });

    const expected = {
      type: 'InvalidUserID',
      message: 'userID must be "user_ + alphanumeric"',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('User Does Not Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/learningProgress')
      .query({ userID: 'user_test0001' });
    await disconnectDB();

    const expected = {
      type: 'UserDoesNotExist',
      message: 'User with ID: user_test0001 does not exist',
    };

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(expected);
  });

  test('User Progress Does Not Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/learningProgress')
      .query({ userID: 'user_2R9mRk6EfnUJ9qFyPCnvsJX2U71' });
    await disconnectDB();

    const expected = {
      type: 'UserProgressDoesNotExist',
      message:
        'No Learning Progress found for User with ID: user_2R9mRk6EfnUJ9qFyPCnvsJX2U71',
    };

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(expected);
  });

  test('User Progress Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/learningProgress')
      .query({ userID: 'user_2TAOKyOIynmI5QfZKZ7saOEnXO4' });
    await disconnectDB();

    const expected = {
      courses: [
        {
          courseID: {
            name: 'Money 101',
            slug: 'money-101',
            icon: 'https://cdn-icons-png.flaticon.com/512/4305/4305512.png',
            units: ['648251863fd1687e8aa34db1'],
          },
          progress: 2,
          _id: '64c2efcdecc930964a3b3ca9',
        },
      ],
      units: [
        {
          unitID: {
            name: 'Blue chip Stocks',
            slug: 'blue-chip-stocks',
            createdAt: '2023-06-08T22:08:18.823Z',
            updatedAt: '2023-06-08T22:08:18.823Z',
            content: [
              '648251863fd1687e8aa34dad',
              '648251863fd1687e8aa34daf',
              '64b9511ecee0cd1028b6d2ab',
            ],
          },
          progress: 2,
          _id: '64c2efcdecc930964a3b3caa',
        },
      ],
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
    await disconnectDB();
  });

  test('Internal Server Error', async () => {
    const res = await request(app)
      .get('/learningProgress')
      .query({ userID: 'user_2TAOKyOIynmI5QfZKZ7saOEnXO4' });

    const expected = {
      type: 'InternalServerError',
      message: 'Failed to retrieve User Progress',
    };

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expected);
  });
});
