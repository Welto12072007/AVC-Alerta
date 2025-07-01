const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: max || parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
      success: false,
      message: message || 'Muitas tentativas. Tente novamente mais tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Rate limiter para autenticação (mais restritivo)
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  5, // 5 tentativas
  'Muitas tentativas de login. Tente novamente em 15 minutos.'
);

// Rate limiter geral
const generalLimiter = createRateLimiter();

module.exports = {
  authLimiter,
  generalLimiter,
  createRateLimiter
};