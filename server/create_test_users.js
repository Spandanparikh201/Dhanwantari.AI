
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/auth';

const doctor = {
    name: 'Dr. Test User',
    email: 'doctor@example.com',
    password: 'password123',
    role: 'doctor',
    doctorProfile: {
        registrationNumber: 'REG123456',
        qualification: 'MD (Hom)',
        specialization: 'General Practice',
        experienceYears: 10,
        clinicAddress: '123 Health St',
        consultationFee: 500
    }
};

const patient = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'patient' // Register as patient first, then promote via DB script
};

async function registerUser(user) {
    try {
        console.log(`Registering ${user.email}...`);
        const response = await axios.post(`${API_URL}/register`, user);
        console.log(`Success: ${user.email} registered. Check console for details.`);
    } catch (error) {
        if (error.response) {
            console.log(`Failed: ${user.email}`);
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(`Error: ${error.message}`);
        }
    }
}

async function main() {
    await registerUser(doctor);
    await registerUser(patient);
}

main();
