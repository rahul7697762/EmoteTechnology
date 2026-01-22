import rateLimit from "express-rate-limit";

/**
 * Base rate limiter factory
 */
const createRateLimiter = ({
  windowMs,
  max,
  message,
//   store: add redis store when use multiple server 
}) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    statusCode: 429,
    message: {
      success: false,
      message
    }
  });

  
/**
 * 🌍 Global Rate Limiter
 * Applied to ALL routes
 */
export const globalRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: "Too many requests. Please slow down."
});


/**
 * 🔐 Strict Rate Limiter
 * Applied to sensitive routes
 */
export const strictRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: "Too many attempts. Please try again shortly."
});
