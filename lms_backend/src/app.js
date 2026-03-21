// ==========================================================================
// ACADENO LMS — Main Express Application
// ==========================================================================

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { pool } = require('./db/index');
const redis = require('./utils/redis');
const authRoutes = require('./routes/auth');

const app = express();

// ---- Middleware ----
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// ---- Routes ----
// Mount auth routes at /api/auth
app.use('/api/auth', authRoutes);

// ---- Health Check ----
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redis.ping();
    res.json({
      status: 'ok',
      db: 'connected',
      redis: 'connected',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// ---- Global Error Handler ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
  });
});

module.exports = app;
