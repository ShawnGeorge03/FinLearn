import request from 'supertest';

import { connectDB, disconnectDB } from '../../src/config/db';

import app from '../../src/app';

describe('Test /search', () => {
  test('Missing Query Params', async () => {
    const res = await request(app).get('/search');

    const expected = {
      type: 'MissingQueryParams',
      message: 'The request params requires searchText',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Blank Search Query', async () => {
    const res = await request(app).get('/search').query({ searchText: null });

    const expected = {
      type: 'MissingSlug',
      message: 'searchText must be an alphanumeric string',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Invalid Search Query', async () => {
    const res = await request(app)
      .get('/search')
      .query({ searchText: '@test' });

    const expected = {
      type: 'InvalidSlug',
      message: 'searchText must be an alphanumeric string',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Valid Search Query', async () => {
    await connectDB();
    const res = await request(app).get('/search').query({ searchText: 'fin' });
    await disconnectDB();

    const expected = [
      {
        name: 'Finance 101',
        slug: 'finance-101',
        icon: 'https://cdn-icons-png.flaticon.com/512/4305/4305512.png',
      },
      {
        name: 'Money 101',
        slug: 'money-101',
        icon: 'https://cdn-icons-png.flaticon.com/512/4305/4305512.png',
      },
    ];

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  test('Internal Server Error', async () => {
    const res = await request(app).get('/search').query({ searchText: 'fin' });

    const expected = {
      type: 'InternalServerError',
      message: 'Failed to retrieve Search Results',
    };

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expected);
  });
});

describe('Test /searchAutoComplete', () => {
  test('Missing Query Params', async () => {
    const res = await request(app).get('/searchAutoComplete');

    const expected = {
      type: 'MissingQueryParams',
      message: 'The request params requires searchText',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Blank Search Query', async () => {
    const res = await request(app)
      .get('/searchAutoComplete')
      .query({ searchText: null });

    const expected = {
      type: 'MissingSlug',
      message: 'searchText must be an alphanumeric string',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Invalid Search Query', async () => {
    const res = await request(app)
      .get('/searchAutoComplete')
      .query({ searchText: '(test)' });

    const expected = {
      type: 'InvalidSlug',
      message: 'searchText must be an alphanumeric string',
    };

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(expected);
  });

  test('Valid Course Search Query', async () => {
    await connectDB();
    const res = await request(app)
      .get('/searchAutoComplete')
      .query({ searchText: 'fin' });
    await disconnectDB();

    const expected = [
      {
        name: 'Finance 101',
        source: 'course',
        href: '/learning/finance-101',
      },
    ];

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  test('Valid Unit Search Query', async () => {
    await connectDB();
    const res = await request(app)
      .get('/searchAutoComplete')
      .query({ searchText: 'blue' });
    await disconnectDB();

    const expected = [
      {
        name: 'Blue chip Stocks',
        source: 'unit',
        href: '/learning/money-101/unit/blue-chip-stocks',
      },
    ];

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expected);
  });

  test('Internal Server Error', async () => {
    const res = await request(app)
      .get('/searchAutoComplete')
      .query({ searchText: 'fin' });

    const expected = {
      type: 'InternalServerError',
      message: 'Failed to retrieve Autocomplete Results',
    };

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual(expected);
  });
});
