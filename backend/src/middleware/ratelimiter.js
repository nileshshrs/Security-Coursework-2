import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError.js";
import { TOO_MANY_REQUESTS } from "../utils/constants/http.js";

// General limiter
export const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError(
      TOO_MANY_REQUESTS,
      "Too many requests from this IP, please try again in 5 minutes.",
      "RATE_LIMIT_GENERAL"
    ));
  },
});

// Auth limiter
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError(
      TOO_MANY_REQUESTS,
      "Too many login attempts, please try again in 5 minutes.",
      "RATE_LIMIT_AUTH"
    ));
  },
});

// Upload limiter
export const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError(
      TOO_MANY_REQUESTS,
      "Too many file uploads, please try again later.",
      "RATE_LIMIT_UPLOAD"
    ));
  },
});
