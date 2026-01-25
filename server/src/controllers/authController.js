const DatabaseService = require('../services/DatabaseService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;

const { z } = require('zod');

// Validation Schemas
const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['patient', 'doctor']).optional(),
    doctorProfile: z.object({
        registrationNumber: z.string().min(1, 'Registration number is required')
    }).optional()
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

exports.register = async (req, res) => {
    try {
        // Validate input using Zod
        const validationResult = registerSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.errors.map(e => e.message)
            });
        }

        const { name, email, password, role, doctorProfile } = validationResult.data;

        // Valid roles are handled by enum in Zod schema
        const userRole = role || 'patient';

        // Additional doctor validation logic
        if (userRole === 'doctor' && (!doctorProfile || !doctorProfile.registrationNumber)) {
            return res.status(400).json({ error: 'Registration number is required for doctors' });
        }

        const existingUser = await DatabaseService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Set status: doctors start as 'pending' until verified
        const status = userRole === 'doctor' ? 'pending' : 'active';

        const user = await DatabaseService.createUser({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            status
        });

        // Create role-specific profile
        if (userRole === 'doctor') {
            await DatabaseService.createDoctorProfile(user.id, {
                fullName: name,
                registrationNumber: doctorProfile.registrationNumber,
                qualification: doctorProfile.qualification,
                specialization: doctorProfile.specialization,
                experienceYears: doctorProfile.experienceYears,
                clinicAddress: doctorProfile.clinicAddress,
                consultationFee: doctorProfile.consultationFee,
                bio: doctorProfile.bio,
                verificationDocuments: doctorProfile.verificationDocuments || []
            });
        } else {
            // Create patient profile with name from registration
            await DatabaseService.createPatientProfile(user.id, {
                fullName: name
            });
        }

        // Generate token with role
        const token = jwt.sign(
            { id: user.id, email: user.email, role: userRole },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: userRole === 'doctor'
                ? 'Doctor registration successful. Awaiting verification.'
                : 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: userRole,
                status
            }
        });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const validationResult = loginSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.errors.map(e => e.message)
            });
        }

        const { email, password } = validationResult.data;


        const user = await DatabaseService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if account is active
        if (user.status === 'inactive') {
            return res.status(403).json({ error: 'Account is inactive. Please contact support.' });
        }

        // Get role-specific profile data
        let profileData = null;
        if (user.role === 'doctor') {
            profileData = await DatabaseService.getDoctorProfile(user.id);
        } else if (user.role === 'patient') {
            profileData = await DatabaseService.getPatientProfile(user.id);
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                verified: profileData?.verified || false
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: profileData?.full_name || user.email.split('@')[0], // Use profile name or email prefix
                email: user.email,
                role: user.role,
                status: user.status,
                verified: profileData?.verified || false,
                profile: profileData
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await DatabaseService.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get role-specific profile
        let profile = null;
        if (user.role === 'doctor') {
            profile = await DatabaseService.getDoctorProfile(user.id);
        } else if (user.role === 'patient') {
            profile = await DatabaseService.getPatientProfile(user.id);
        }

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                verified: profile?.verified || false
            },
            profile
        });
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
};

exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await DatabaseService.findUserByEmail(email);

        if (!user) {
            // Don't reveal if email exists for security
            return res.json({ message: 'If the email exists, a reset link has been sent' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        // Store reset token in database
        await pool.execute(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [resetTokenHash, resetTokenExpiry, user.id]
        );

        // TODO: Send email with reset link
        // For now, log the reset token (in production, send via email)
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        console.log('Password Reset URL:', resetUrl);
        console.log('Reset Token:', resetToken);

        res.json({
            message: 'If the email exists, a reset link has been sent',
            // Remove this in production:
            resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
        });

    } catch (error) {
        console.error('Request Password Reset Error:', error);
        res.status(500).json({ error: 'Failed to process password reset request' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Hash the provided token
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        // Find user with valid reset token
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [resetTokenHash]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const user = users[0];

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await pool.execute(
            'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.json({ message: 'Password reset successful. You can now log in with your new password.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};
