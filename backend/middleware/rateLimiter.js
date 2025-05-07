import rateLimit from 'express-rate-limit';

export function rateLimiter(maxRequests, windowMinutes) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    message: {
      success: false,
      message: `Too many requests, please try again after ${windowMinutes} minutes`
    },
    standardHeaders: true,
    legacyHeaders: false
  });
}