const DatabaseService = require('../services/DatabaseService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            // Create empty patient profile
            await DatabaseService.createPatientProfile(user.id, {});
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

        const isMatch = await bcrypt.compare(password, user.password);
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
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                verified: profileData?.verified || false
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
