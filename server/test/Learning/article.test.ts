import request from 'supertest';

import { connectDB, disconnectDB } from '../../src/config/db';

import app from '../../src/app';

describe('Test /article', () => {
  test('Missing Query Params', async () => {
    const res = await request(app).get('/article');

    const expected = {
      type: 'MissingQueryParams',
      message: 'The request params requires articleSlug',
    };
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Blank articleSlug', async () => {
    const res = await request(app).get('/article').query({ articleSlug: null });

    const expected = {
      type: 'MissingSlug',
      message: 'articleSlug must be an alphanumeric string with "-" for spaces',
    };
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Invalid articleSlug', async () => {
    const res = await request(app)
      .get('/article')
      .query({ articleSlug: '(test1)' });

    const expected = {
      type: 'InvalidSlug',
      message: 'articleSlug must be an alphanumeric string with "-" for spaces',
    };
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Article Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/article')
      .query({ articleSlug: 'pyramid-schemes' });
    await disconnectDB();

    const expected = {
      slug: 'pyramid-schemes',
      createdAt: '2023-06-08T22:08:18.818Z',
      updatedAt: '2023-06-08T22:08:18.818Z',
      image:
        'https://cdn.pixabay.com/photo/2017/09/07/08/54/money-2724241_1280.jpg',
      author: 'Rahul Sharma',
      contentType: 'article',
      articleText:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec\ncondimentum quam arcu, eu tempus tortor molestie at. Vestibulum\npretium condimentum dignissim. Vestibulum ultrices vitae nisi sed\nimperdiet. Mauris quis erat consequat, commodo massa quis, feugiat\nsapien. Suspendisse placerat vulputate posuere. Curabitur neque\ntortor, mattis nec lacus non, placerat congue elit.',
      name: 'Pyramid Schemes',
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  test('Article Does Not Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/article')
      .query({ articleSlug: 'test-0001' });
    await disconnectDB();

    const expected = {
      type: 'ArticleDoesNotExist',
      message: 'Failed to find Article with slug: test-0001',
    };

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(expected);
  });

  test('Internal Server Error', async () => {
    const res = await request(app)
      .get('/article')
      .query({ articleSlug: 'pyramid-schemes' });

    const expected = {
      type: 'InternalServerError',
      message: 'Failed to retrieve Article',
    };

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expected);
  });
});
