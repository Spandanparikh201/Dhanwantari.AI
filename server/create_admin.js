const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
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

        // Test connection
        await pool.query('SELECT 1');
        console.log('✅ Database connected.');

        const email = 'admin@dhanwantari.com';
        const rawPassword = 'Admin@123';
        const role = 'admin';

        console.log(`🔑 Hashing password for ${email}...`);
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        console.log('👤 Creating/Updating admin user...');

        // Upsert admin user
        await pool.execute(`
            INSERT INTO users (id, email, password_hash, role, status, email_verified)
            VALUES (?, ?, ?, ?, 'active', TRUE)
            ON DUPLICATE KEY UPDATE 
                password_hash = VALUES(password_hash),
                role = VALUES(role),
                status = 'active'
        `, ['admin_001', email, hashedPassword, role]);

        console.log(`
✅ Admin user created successfully!
-----------------------------------
Email:    ${email}
Password: ${rawPassword}
-----------------------------------
You can now login at http://localhost:5173/login
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
