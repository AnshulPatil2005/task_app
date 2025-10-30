import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async (uri) => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error', { message: error.message });
    throw error;
  }
};

export default connectDB;
