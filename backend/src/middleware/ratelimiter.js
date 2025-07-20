// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// General limiter: already defined
export const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again in 5 minutes.',
});

// Auth limiter: already defined
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again in 5 minutes.',
});

// Upload limiter: 10 uploads per 5 min
export const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many file uploads, please try again later.',
});

