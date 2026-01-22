
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function promoteToAdmin(email) {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 1
        });

        console.log(`Promoting ${email} to admin...`);

        // Check if user exists
        const [users] = await pool.execute('SELECT id, role FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            console.log('User not found.');
            await pool.end();
            return;
        }

        // Update role
        await pool.execute('UPDATE users SET role = ? WHERE email = ?', ['admin', email]);
        console.log(`Success: ${email} is now an admin.`);

        await pool.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

promoteToAdmin('admin@example.com');
