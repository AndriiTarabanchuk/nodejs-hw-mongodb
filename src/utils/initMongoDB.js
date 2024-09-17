import mongoose from 'mongoose';
import { env } from './env.js';
import { MONGODB_VARS } from '../constants/index.js';

export const initMongoDB = async () => {
  try {
    const user = env(MONGODB_VARS.MONGODB_USER);
    const password = env(MONGODB_VARS.MONGODB_PASSWORD);
    const url = env(MONGODB_VARS.MONGODB_URL);
    const db = env(MONGODB_VARS.MONGODB_DB);
    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    console.log('MongoDB connection successful.');
  } catch (error) {
    console.log('Error while  connection to MongoDB', error);
    throw error;
  }
};
