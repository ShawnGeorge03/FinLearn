import request from 'supertest';

import { connectDB, disconnectDB } from '../../src/config/db';

import app from '../../src/app';

describe('Test /video', () => {
  test('Missing Query Params', async () => {
    const res = await request(app).get('/video');

    const expected = {
      type: 'MissingQueryParams',
      message: 'The request params requires videoSlug',
    };
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Blank videoSlug', async () => {
    const res = await request(app).get('/video').query({ videoSlug: null });

    const expected = {
      type: 'MissingSlug',
      message: 'videoSlug must be an alphanumeric string with "-" for spaces',
    };
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Invalid videoSlug', async () => {
    const res = await request(app)
      .get('/video')
      .query({ videoSlug: '(test1)' });

    const expected = {
      type: 'InvalidSlug',
      message: 'videoSlug must be an alphanumeric string with "-" for spaces',
    };
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Video Does Not Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/video')
      .query({ videoSlug: 'test-0001' });
    await disconnectDB();

    const expected = {
      type: 'VideoDoesNotExist',
      message: 'Failed to find Video with slug: test-0001',
    };

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual(expected);
  });

  test('Video Exist', async () => {
    await connectDB();
    const res = await request(app)
      .get('/video')
      .query({ videoSlug: 'money-video' });
    await disconnectDB();

    const expected = {
      createdAt: '2023-06-08T22:08:18.821Z',
      updatedAt: '2023-06-08T22:08:18.821Z',
      author: 'William Ackman',
      description:
        'Bill Ackman is one of the top investors in the world, and he\'s said that he\'s aiming to have "one of the greatest investment track records of all time."  As the CEO of Pershing Square Capital Management, the hedge fund he founded, he oversees $19 billion in assets.\n\nBut before he became one of the elite, he learned the basics of investing in his early 20s.\n\nThis Big Think video is aimed at young professionals just starting out, as well as those who are more experienced but lack a financial background.\n\nAckman takes viewers through the founding of a lemonade stand to teach the basics, explaining how investors pay for equity, a word interchangeable with "stock." In the example, the owner starts with $750, with $250 of that coming from a loan. ',
      videoId: 'WEDIj9JBTC8',
      name: 'Everything You Need to Know About Finance and Investing',
    };

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  test('Internal Server Error', async () => {
    const res = await request(app)
      .get('/video')
      .query({ videoSlug: 'money-video' });

    const expected = {
      type: 'InternalServerError',
      message: 'Failed to Retrieve Video',
    };

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expected);
  });
});
