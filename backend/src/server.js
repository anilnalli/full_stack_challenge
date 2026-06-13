import dotenv from 'dotenv';
import app from './app.js';
import { getPrisma, disconnectPrisma } from './config/database.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

let server;

/**
 * Start Server
 */
async function startServer() {
  try {
    // Initialize database connection
    const prisma = getPrisma();

    // Verify database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connected');

    // Start Express server
    server = app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

/**
 * Graceful Shutdown
 */
async function gracefulShutdown(signal) {
  console.log(`\n✓ ${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log('✓ HTTP server closed');
      await disconnectPrisma();
      console.log('✓ Database disconnected');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('✗ Forced shutdown');
      process.exit(1);
    }, 10000);
  }
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();
