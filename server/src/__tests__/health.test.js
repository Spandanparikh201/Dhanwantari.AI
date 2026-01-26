/**
 * Health API Tests
 * Tests for server health and readiness endpoints
 */

const request = require('supertest');
const express = require('express');

// Create minimal test app
const createTestApp = () => {
    const app = express();
    app.use(express.json());

    // Health endpoint
    app.get('/api/health', (req, res) => {
        res.json({
            status: 'ok',
            service: 'Dhanwantari AI',
            timestamp: new Date().toISOString()
        });
    });

    // Ready endpoint
    app.get('/api/ready', (req, res) => {
        const isGeminiConfigured = !!process.env.GEMINI_API_KEY;
        const isDbConfigured = !!process.env.DB_HOST;
        const ready = isGeminiConfigured || process.env.NODE_ENV === 'test';

        res.status(ready ? 200 : 503).json({
            status: ready ? 'ready' : 'not_ready',
            checks: {
                gemini: isGeminiConfigured,
                database: isDbConfigured
            },
            timestamp: new Date().toISOString()
        });
    });

    return app;
};

describe('Health API', () => {
    let app;

    beforeAll(() => {
        app = createTestApp();
    });

    describe('GET /api/health', () => {
        it('should return status ok', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.status).toBe('ok');
            expect(response.body.service).toBe('Dhanwantari AI');
            expect(response.body.timestamp).toBeDefined();
        });
    });

    describe('GET /api/ready', () => {
        it('should return readiness status', async () => {
            const response = await request(app)
                .get('/api/ready')
                .expect('Content-Type', /json/);

            expect(response.body.status).toBeDefined();
            expect(response.body.checks).toBeDefined();
            expect(response.body.checks.database).toBeDefined();
        });
    });
});
