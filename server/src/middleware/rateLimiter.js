const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests from this IP, please try again later.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for AI endpoints (prevent token abuse)
const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 AI requests per minute
    message: {
        success: false,
        error: {
            code: 'AI_RATE_LIMIT_EXCEEDED',
            message: 'Too many AI requests. Please wait before sending another message.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth endpoints limiter (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per 15 minutes
    message: {
        success: false,
        error: {
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts. Please try again later.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    aiLimiter,
    authLimiter
};
