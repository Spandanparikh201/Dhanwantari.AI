const bcrypt = require('bcryptjs');

async function generate() {
    console.log('Admin:', await bcrypt.hash('Admin@123', 12));
    console.log('Doctor:', await bcrypt.hash('Doctor@123', 12));
    console.log('Patient:', await bcrypt.hash('Patient@123', 12));
}

generate();
