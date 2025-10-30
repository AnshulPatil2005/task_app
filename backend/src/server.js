import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import User from './models/User.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const seedUsers = async () => {
  const adminEmail = 'admin@demo.com';
  const userEmail = 'user@demo.com';

  const [adminExists, userExists] = await Promise.all([
    User.findOne({ email: adminEmail }),
    User.findOne({ email: userEmail }),
  ]);

  if (!adminExists) {
    await User.create({
      name: 'Admin User',
      email: adminEmail,
      password: 'Admin@123',
      role: 'admin',
    });
    logger.info('Seeded default admin user');
  }

  if (!userExists) {
    await User.create({
      name: 'Demo User',
      email: userEmail,
      password: 'User@123',
      role: 'user',
    });
    logger.info('Seeded default demo user');
  }
};

const startServer = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL is not set');
    }

    await connectDB(process.env.MONGO_URL);

    if (NODE_ENV !== 'production') {
      await seedUsers();
    }

    const server = app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });

    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Closing server...`);
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start server', { message: error.message });
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason });
});
