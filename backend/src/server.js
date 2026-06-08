require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { verifyMailConnection } = require('./config/mail');

const PORT = process.env.PORT || 5000;

// ─── Start Server ─────────────────────────────────────────────────
const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    // 2. Verify mail connection (non-blocking — warns if not configured)
    await verifyMailConnection();

    // 3. Start Express server
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════╗');
      console.log('║        🛒  TechVault API Server          ║');
      console.log('╠══════════════════════════════════════════╣');
      console.log(`║  🌐 URL    : http://localhost:${PORT}        ║`);
      console.log(`║  🔧 Mode   : ${(process.env.NODE_ENV || 'development').padEnd(28)}║`);
      console.log(`║  📦 DB     : MongoDB Atlas (techvault)  ║`);
      console.log('╠══════════════════════════════════════════╣');
      console.log('║  📋 Routes:                              ║');
      console.log('║    POST  /api/auth/register              ║');
      console.log('║    POST  /api/auth/login                 ║');
      console.log('║    GET   /api/products                   ║');
      console.log('║    POST  /api/orders                     ║');
      console.log('║    POST  /api/payments/create-order      ║');
      console.log('║    GET   /api/admin/dashboard            ║');
      console.log('╚══════════════════════════════════════════╝');
      console.log('');
    });

    // 4. Graceful shutdown handlers
    const shutdown = (signal) => {
      console.log(`\n⚡ ${signal} received. Shutting down gracefully...`);
      server.close(() => {
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
          console.log('✅ MongoDB connection closed.');
          console.log('✅ HTTP server closed.');
          process.exit(0);
        });
      });

      // Force exit after 10s if graceful shutdown fails
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // 5. Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      console.error(`❌ Uncaught Exception: ${err.message}`);
      process.exit(1);
    });

  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
