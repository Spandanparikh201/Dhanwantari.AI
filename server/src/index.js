const express = require('express');
// Restart trigger
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

// Fail Secure: Validate critical environment variables
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET is not defined in environment variables.');
    process.exit(1);
}
if (!process.env.DB_HOST) {
    console.error('FATAL: DB_HOST is not defined in environment variables.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Import rate limiters
const { apiLimiter, aiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());

// Apply general rate limiter to all API routes
app.use('/api/', apiLimiter);

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Dhanwantari AI',
        timestamp: new Date().toISOString()
    });
});

// Readiness check endpoint (checks dependencies)
app.get('/api/ready', (req, res) => {
    // Check if critical services are available
    const isGeminiConfigured = !!process.env.GEMINI_API_KEY;
    const isDbConfigured = !!process.env.DB_HOST;

    const ready = isGeminiConfigured; // Minimum requirement

    res.status(ready ? 200 : 503).json({
        status: ready ? 'ready' : 'not_ready',
        checks: {
            gemini: isGeminiConfigured,
            database: isDbConfigured
        },
        timestamp: new Date().toISOString()
    });
});

// Import Routes
const chatRoutes = require('./routes/chatRoutes');
const historyRoutes = require('./routes/historyRoutes');
const authRoutes = require('./routes/authRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const patientRoutes = require('./routes/patientRoutes');

// Apply specific rate limiters
app.use('/api/chat', aiLimiter, chatRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/prescription', prescriptionRoutes);

// Global error handler (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Mode: ${process.env.AI_PROVIDER || 'GEMINI'}`);
});
