import app from './app.js';
import prisma from './config/prisma.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

// Handle Uncaught Exceptions
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down server...', error);
  process.exit(1);
});

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.success('Database connection established successfully via Prisma.');

    const server = app.listen(PORT, () => {
      logger.success(`Server is running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! Shutting down server...', err);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(1);
      });
    });

    // Graceful Shutdown
    const shutDownSignals = ['SIGTERM', 'SIGINT'];
    shutDownSignals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}. Shutting down gracefully...`);
        server.close(async () => {
          await prisma.$disconnect();
          logger.success('Server and database connections closed.');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    logger.error('Failed to start server due to database connection error:', error);
    process.exit(1);
  }
};

startServer();