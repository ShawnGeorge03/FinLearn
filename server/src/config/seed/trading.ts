import { exit } from 'process';

import modelUser from '../../models/Account/user';
import modelAccount from '../../models/Trading/account';
import modelPortfolio from '../../models/Trading/portfolio';

/**
 * Clears Database and deletes these collections
 *  - modelPortfolio
 *  - modelAccount
 */
export const clearTradingDB = async () => {
  await modelAccount
    .deleteMany({})
    .then(() => console.info('Account Collection Erased! ❌'));
  await modelPortfolio
    .deleteMany({})
    .then(() => console.info('Portfolio Collection Erased! ❌'));
};

/**
 * Seeds the database for these collections
 *  - modelPortfolio
 *  - modelAccount
 */
export const seedTradingDB = async () => {
  const users = await modelUser.find().select('_id');

  console.info('Seeding Trading...');

  const portfolios = users.flatMap((user) => {
    const MSFTQuantity = Math.floor(Math.random() * 9) + 1;
    const AAPLQuantity = Math.floor(Math.random() * 9) + 1;

    return {
      userID: user._id,
      holdings: {
        equity: {
          MSFT: [
            {
              quantity: MSFTQuantity,
              price: 326.66,
            },
          ],
          AAPL: [
            {
              quantity: AAPLQuantity,
              price: 191.38,
            },
          ],
        },
      },
      history: {
        equity: [
          {
            action: 'buy',
            order: 'market',
            symbol: 'MSFT',
            quantity: MSFTQuantity,
            price: 326.66,
          },
          {
            action: 'buy',
            order: 'market',
            symbol: 'AAPL',
            quantity: AAPLQuantity,
            price: 191.38,
          },
        ],
      },
    };
  });

  await modelPortfolio
    .insertMany(portfolios)
    .then(() => {
      console.info('Portfolios Seeded! ✅');
    })
    .catch((err) => {
      console.error(err);
      exit(1);
    });

  const accounts = portfolios.flatMap(({ userID, holdings }) => {
    const currAAPLPrice = Math.random() * (192.37 - 190.69) + 190.69;
    const currMSFTPrice = Math.random() * (329.88 - 325.95) + 325.95;

    const { price: AAPLPrice, quantity: AAPLQuantity } =
      holdings.equity.AAPL[0];
    const { price: MSFTPrice, quantity: MSFTQuantity } =
      holdings.equity.MSFT[0];

    const cash = 100000 - AAPLPrice * AAPLQuantity + MSFTPrice * MSFTQuantity;

    const value =
      cash +
      (currAAPLPrice - AAPLPrice) * AAPLQuantity +
      (currMSFTPrice - MSFTPrice) * MSFTQuantity;

    return {
      userID,
      cash,
      value,
    };
  });

  await modelAccount
    .insertMany(accounts)
    .then(() => {
      console.info('Accounts Seeded! ✅');
    })
    .catch((err) => {
      console.error(err);
      exit(1);
    });
};
