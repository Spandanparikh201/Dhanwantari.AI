const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function fixHashes() {
    console.log('--- Fixing Test Account Hashes ---');

    const adminHash = '$2b$10$CKYdBPRGCkhXz0tWcUtiKulnGgH4m9LqUcHxH/a/6JDkWW3O.GF4O';
    const doctorHash = '$2b$10$bMc6PRiPRb0Zxi5SeWtM8.zBM9eOzMhlsZxRgJSlQ3CVvicQUPHXG';
    const patientHash = '$2b$10$C5hZdSfCOf5sDtEsQPcfzenSMnxR4gX4cZOPpnhKusb/FH/McrphW';

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'dhanwantari'
        });

        console.log('✅ Connected to database');

        await connection.execute('UPDATE users SET password = ? WHERE id = ?', [adminHash, 'admin_001']);
        console.log('✅ Updated Admin password');

        await connection.execute('UPDATE users SET password = ? WHERE id = ?', [doctorHash, 'doctor_001']);
        console.log('✅ Updated Doctor password');

        await connection.execute('UPDATE users SET password = ? WHERE id = ?', [patientHash, 'patient_001']);
        console.log('✅ Updated Patient password');

        await connection.end();
        console.log('✨ All hashes fixed!');
    } catch (error) {
        console.error('❌ Update failed:', error.message);
    }
}

fixHashes();
