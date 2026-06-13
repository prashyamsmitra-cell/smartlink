const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const urlRoutes = require('./routes/urlRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
function normalizeOrigin(origin) {
  return origin ? origin.replace(/\/+$/, '') : origin;
}

function escapeRegExp(value) {
  return value.replace(/[|\\{}()[\]^$+?.*]/g, '\\$&');
}

const allowedOriginRules = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean)
  .map((origin) => {
    if (!origin.includes('*')) return { type: 'exact', value: origin };
    return {
      type: 'pattern',
      value: new RegExp(`^${escapeRegExp(origin).replace(/\\\*/g, '[^.]+')}$`),
    };
  });

function isOriginAllowed(origin) {
  const normalizedOrigin = normalizeOrigin(origin);

  return allowedOriginRules.some((rule) => {
    if (rule.type === 'exact') return rule.value === normalizedOrigin;
    return rule.value.test(normalizedOrigin);
  });
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOriginRules.length === 0 || isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── HTTP request logging ──────────────────────────────────────────────────────
app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// ── Global rate limiter ───────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// ── Tighter limiter for write operations ──────────────────────────────────────
const shortenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many shorten requests, slow down.' },
  keyGenerator: (req) => req.ip,
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/shorten', shortenLimiter);
app.use('/api', urlRoutes);
app.use('/', urlRoutes); // redirect route lives at root

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Centralised error handler ─────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
