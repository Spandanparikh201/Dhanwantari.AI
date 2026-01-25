const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
    console.log('🚀 Starting database setup...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        // Read and clean the schema (remove stored procedures)
        console.log('📋 Step 1: Creating database schema...');
        let schema = await fs.readFile(path.join(__dirname, 'migrations', '003_security_hardened_schema.sql'), 'utf8');

        // Remove stored procedure sections (they cause issues with mysql2)
        const delimiterStart = schema.indexOf('-- ============================================\r\n-- 16. Security-Related Stored Procedures');
        const delimiterEnd = schema.indexOf('-- ============================================\r\n-- 17. Create Database Users');

        if (delimiterStart > 0 && delimiterEnd > 0) {
            schema = schema.substring(0, delimiterStart) + schema.substring(delimiterEnd);
        }

        // Execute schema
        await connection.query(schema);
        console.log('✅ Schema created successfully\n');

        // Create test users with proper password hashing
        console.log('👤 Step 2: Creating test users...');

        const adminHash = await bcrypt.hash('Admin@123', 12);
        const doctorHash = await bcrypt.hash('Doctor@123', 12);
        const patientHash = await bcrypt.hash('Patient@123', 12);

        await connection.query(`USE dhanwantari`);

        // Insert admin
        await connection.query(`
            INSERT INTO users (id, email, password_hash, role, status, email_verified)
            VALUES ('admin_001', 'admin@dhanwantari.com', ?, 'admin', 'active', TRUE)
            ON DUPLICATE KEY UPDATE id=id
        `, [adminHash]);
        console.log('  ✅ Admin user created');

        // Insert doctor
        await connection.query(`
            INSERT INTO users (id, email, password_hash, role, status, email_verified)
            VALUES ('doctor_001', 'doctor@dhanwantari.com', ?, 'doctor', 'active', TRUE)
            ON DUPLICATE KEY UPDATE id=id
        `, [doctorHash]);

        await connection.query(`
            INSERT INTO doctor_profiles (user_id, full_name, registration_number, qualification, specialization, experience_years, verified, bio)
            VALUES ('doctor_001', 'Dr. Rajesh Kumar', 'BHMS-2024-001', 'BHMS, MD (Homeopathy)', 'Classical Homeopathy', 10, TRUE, 'Experienced homeopathic practitioner')
            ON DUPLICATE KEY UPDATE user_id=user_id
        `);
        console.log('  ✅ Doctor user created');

        // Insert patient
        await connection.query(`
            INSERT INTO users (id, email, password_hash, role, status, email_verified)
            VALUES ('patient_001', 'patient@dhanwantari.com', ?, 'patient', 'active', TRUE)
            ON DUPLICATE KEY UPDATE id=id
        `, [patientHash]);

        await connection.query(`
            INSERT INTO patient_profiles (user_id, full_name, date_of_birth, gender, blood_group)
            VALUES ('patient_001', 'John Doe', '1990-01-15', 'male', 'O+')
            ON DUPLICATE KEY UPDATE user_id=user_id
        `);
        console.log('  ✅ Patient user created\n');

        // Verify setup
        console.log('🔍 Verifying setup...');
        const [users] = await connection.query('SELECT id, email, role, status FROM users');
        console.log('\n📊 Users in database:');
        console.table(users);

        console.log('\n✨ Database setup complete!');
        console.log('\n🔐 Test Accounts:');
        console.log('   Admin:   admin@dhanwantari.com / Admin@123');
        console.log('   Doctor:  doctor@dhanwantari.com / Doctor@123');
        console.log('   Patient: patient@dhanwantari.com / Patient@123');

    } catch (error) {
        console.error('❌ Error during setup:', error.message);
        console.error('Full error:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

setupDatabase()
    .then(() => {
        console.log('\n✅ Setup completed successfully!');
        console.log('\n🎯 Next step: Try logging in at http://localhost:5173/login');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    });
