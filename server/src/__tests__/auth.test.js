/**
 * Authentication Tests
 * Tests for validation schemas and auth logic
 */

const { z } = require('zod');

// Validation schemas (same as in authController)
const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['patient', 'doctor']).optional()
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

describe('Auth Validation Schemas', () => {
    describe('Register Schema', () => {
        it('should accept valid patient registration', () => {
            const validData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should accept valid doctor registration', () => {
            const validData = {
                name: 'Dr. Jane Smith',
                email: 'jane@hospital.com',
                password: 'securepass',
                role: 'doctor'
            };

            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject short names', () => {
            const invalidData = {
                name: 'J',
                email: 'john@example.com',
                password: 'password123'
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject invalid emails', () => {
            const invalidData = {
                name: 'John Doe',
                email: 'not-an-email',
                password: 'password123'
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject short passwords', () => {
            const invalidData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: '12345'
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject invalid roles', () => {
            const invalidData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'admin' // Invalid role for registration
            };

            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('Login Schema', () => {
        it('should accept valid login', () => {
            const validData = {
                email: 'john@example.com',
                password: 'password123'
            };

            const result = loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidData = {
                email: 'not-valid',
                password: 'password123'
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject empty password', () => {
            const invalidData = {
                email: 'john@example.com',
                password: ''
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject missing fields', () => {
            const invalidData = {
                email: 'john@example.com'
            };

            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});

describe('JWT Token', () => {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = 'test-secret-key';

    it('should generate valid token', () => {
        const payload = { id: '123', email: 'test@test.com', role: 'patient' };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });

    it('should verify valid token', () => {
        const payload = { id: '123', email: 'test@test.com', role: 'patient' };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        const decoded = jwt.verify(token, JWT_SECRET);

        expect(decoded.id).toBe(payload.id);
        expect(decoded.email).toBe(payload.email);
        expect(decoded.role).toBe(payload.role);
    });

    it('should reject invalid token', () => {
        expect(() => {
            jwt.verify('invalid-token', JWT_SECRET);
        }).toThrow();
    });

    it('should reject token with wrong secret', () => {
        const token = jwt.sign({ id: '123' }, 'different-secret');

        expect(() => {
            jwt.verify(token, JWT_SECRET);
        }).toThrow();
    });
});
