import request from 'supertest';

import { connectDB, disconnectDB } from '../../src/config/db';

import app from '../../src/app';

describe('Test /units', () => {
  test('Missing Query Params', async () => {
    const res = await request(app).get('/units');

    const expected = {
      type: 'MissingQueryParams',
      message: 'The request params requires courseSlug',
    };
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Blank courseSlug', async () => {
    const res = await request(app).get('/units').query({ courseSlug: null });

    const expected = {
      type: 'MissingSlug',
      message: 'courseSlug must be an alphanumeric string with "-" for spaces',
    };
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Invalid courseSlug', async () => {
    const res = await request(app)
      .get('/units')
      .query({ courseSlug: '(test1)' });

    const expected = {
      type: 'InvalidSlug',
      message: 'courseSlug must be an alphanumeric string with "-" for spaces',
    };
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Course Does Not Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/units')
      .query({ courseSlug: 'test-0001' });
    await disconnectDB();

    const expected = {
      type: 'CourseDoesNotExist',
      message: 'Failed to find Course with slug: test-0001',
    };

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(expected);
  });

  test('Course Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/units')
      .query({ courseSlug: 'finance-101' });
    await disconnectDB();

    const expected = {
      name: 'Finance 101',
      units: [
        {
          name: 'S&P 500 Investments',
          slug: 'S&P-500-Investments',
          contents: [
            {
              slug: 'money-video',
              contentType: 'video',
              name: 'Everything You Need to Know About Finance and Investing',
            },
          ],
        },
      ],
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  test('Internal Server Error', async () => {
    const res = await request(app)
      .get('/units')
      .query({ courseSlug: 'finance-101' });

    const expected = {
      type: 'InternalServerError',
      message: 'Failed to retrieve content for Course',
    };

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expected);
  });
});

describe('Test /unitsProgress', () => {
  test('Missing Query Params', async () => {
    const res = await request(app).get('/unitsProgress');

    const expected = {
      type: 'MissingQueryParams',
      message: 'The request params requires userID="user_ + alphanumeric"',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Blank userID', async () => {
    const res = await request(app)
      .get('/unitsProgress')
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
      .get('/unitsProgress')
      .query({ userID: '(test1)' });

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
      .get('/unitsProgress')
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
      .get('/unitsProgress')
      .query({ userID: 'user_2R9mRk6EfnUJ9qFyPCnvsJX2U71' });
    await disconnectDB();

    const expected = {
      type: 'UserProgressDoesNotExist',
      message:
        'No Unit Progress found for User with ID: user_2R9mRk6EfnUJ9qFyPCnvsJX2U71',
    };

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(expected);
  });

  test('User Progress Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/unitsProgress')
      .query({ userID: 'user_2TAOKyOIynmI5QfZKZ7saOEnXO4' });
    await disconnectDB();

    const expected = [
      {
        slug: 'blue-chip-stocks',
        progress: 2,
      },
    ];

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  test('Internal Server Error', async () => {
    const res = await request(app)
      .get('/unitsProgress')
      .query({ userID: 'user_2TAOKyOIynmI5QfZKZ7saOEnXO4' });

    const expected = {
      type: 'InternalServerError',
      message: 'Failed to retrieve User Progress',
    };

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expected);
  });
});
