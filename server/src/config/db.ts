import { connect } from 'mongoose';
import { load } from 'ts-dotenv';

/**
 * Initiates the connection to MongoDB Atlas
 *
 * @param {string} MONGO_URI - URI of Cluster
 */
export const connectDB = async () => {
  const { MONGO_URI } = load({ MONGO_URI: String });
  try {
    await connect(MONGO_URI);
    console.info('MongoDB is connected 🟢');
  } catch (err) {
    console.error('MongoDB is not connected 🔴 \n', err);
  }
};
