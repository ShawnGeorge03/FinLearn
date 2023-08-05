import { exit } from 'node:process';

import { connectDB } from './db';

import { clearLearningDB, seedLearningDB } from './seed/learning';
import { clearTradingDB, seedTradingDB } from './seed/trading';

const model = process.argv.at(-1);

connectDB()
  .then(async () => {
    console.info('\n--- Clearing Database --- ');
    switch (model) {
      case 'learning':
        await clearLearningDB()
          .then(() =>
            console.info(
              '--- Database Cleared! ✅ --- \n\n --- Seeding Learning ---',
            ),
          )
          .catch((err) => {
            console.error(err);
            exit(1);
          });

        await seedLearningDB();
        break;
      case 'trading':
        await clearTradingDB()
          .then(() =>
            console.info(
              '--- Database Cleared! ✅ --- \n\n --- Seeding Trading ---',
            ),
          )
          .catch((err) => {
            console.error(err);
            exit(1);
          });

        await seedTradingDB();
        break;
      default:
        console.error(`Unsupported Model Seeding ${model}`);
        break;
    }
  })
  .then(() => {
    console.info('--- Completed Seeding ! 🎉 ---');
    exit(0);
  })
  .catch((err) => {
    console.error(err);
    exit(1);
  });
