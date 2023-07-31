import request from 'supertest';

import app from '../src/app';

describe('Test /symbolSearch', () => {
  test('Valid Search Query', async () => {
    const res = await request(app).get('/symbolSearch').query({
      searchText: 'fin',
    });

    const expected = [
      {
        symbol: 'FIND',
        name: 'Findex.com Inc',
      },
      {
        symbol: 'FIN.TRV',
        name: 'European Energy Metals Corp.',
      },
      {
        symbol: 'FINA.LON',
        name: 'Fintech Asia Ltd',
      },
      {
        symbol: 'FIND.TRV',
        name: 'Baselode Energy Corp',
      },
      {
        symbol: 'FINCABLES.BSE',
        name: 'FINOLEX CABLES LTD.',
      },
    ];

    expect(res.body).toEqual(expected);
  });

  test('Nonexistent Symbol', async () => {
    const res = await request(app).get('/symbolSearch').query({
      searchText: 'testA',
    });

    expect(res.body).toEqual([]);
  });
});
