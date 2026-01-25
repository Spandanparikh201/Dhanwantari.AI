const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const createDoctor = async () => {
    try {
        console.log('🔌 Connecting to database...');
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'dhanwantari',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const id = 'doctor_001';
        const email = 'doctor@dhanwantari.com';
        const rawPassword = 'Doctor@123';
        const name = 'Dr. AI Specialist';

        // 1. Create User
        console.log(`🔑 Hashing password for ${email}...`);
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        console.log('👤 Creating doctor user...');
        await pool.execute(`
            INSERT INTO users (id, email, password_hash, role, status, email_verified)
            VALUES (?, ?, ?, 'doctor', 'active', TRUE)
            ON DUPLICATE KEY UPDATE 
                password_hash = VALUES(password_hash),
                role = 'doctor',
                status = 'active'
        `, [id, email, hashedPassword]);

        // 2. Create Profile
        console.log('👨‍⚕️ Creating doctor profile...');
        await pool.execute(`
            INSERT INTO doctor_profiles 
            (user_id, full_name, registration_number, qualification, specialization, experience_years, consultation_fee, verified)
            VALUES (?, ?, 'REG123456', 'MBBS, MD', 'General Physician', 10, 500, TRUE)
            ON DUPLICATE KEY UPDATE
                full_name = VALUES(full_name),
                verified = TRUE
        `, [id, name]);

        console.log(`
✅ Doctor user created successfully!
-----------------------------------
Email:    ${email}
Password: ${rawPassword}
-----------------------------------
You can now login at http://localhost:5173/login
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating doctor user:', error);
        process.exit(1);
    }
};

createDoctor();
