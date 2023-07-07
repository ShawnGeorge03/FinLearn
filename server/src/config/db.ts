import { connect } from 'mongoose';

/**
 * Initiates the connection to MongoDB Atlas
 *
 * @param {string} MONGO_URI - URI of Cluster
 */
export const connectDB = async (MONGO_URI: string) => {
  try {
    await connect(MONGO_URI);
    console.info('MongoDB is connected 🟢');
  } catch (err) {
    console.error('MongoDB is not connected 🔴 \n', err);
  }
};
