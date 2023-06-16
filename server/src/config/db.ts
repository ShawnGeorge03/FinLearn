import { connect } from 'mongoose';

export const connectDB = async (MONGO_URI: string) => {
  try {
    await connect(MONGO_URI);
    console.log('MongoDB is connected 🟢');
  } catch (err) {
    console.log('MongoDB is not connected 🔴');
    console.error(err);
    process.exit(1);
  }
};
