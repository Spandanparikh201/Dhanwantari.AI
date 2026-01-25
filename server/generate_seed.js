const bcrypt = require('bcryptjs');
const fs = require('fs');

const doctors = [
    { id: 'doc_001', name: 'Dr. Anisha Sharma', email: 'anisha.sharma@dhanwantari.com', spec: 'Cardiac Homeopathy', reg: 'REG_A001', qual: 'BHMS, MD (Hom)', exp: 12, fee: 1200 },
    { id: 'doc_002', name: 'Dr. Vikram Singh', email: 'vikram.singh@dhanwantari.com', spec: 'Orthopedic Homeopathy', reg: 'REG_V002', qual: 'BHMS, MD (Hom)', exp: 15, fee: 1500 },
    { id: 'doc_003', name: 'Dr. Priya Patel', email: 'priya.patel@dhanwantari.com', spec: 'Pediatric Homeopathy', reg: 'REG_P003', qual: 'BHMS, MD (Hom)', exp: 8, fee: 800 },
    { id: 'doc_004', name: 'Dr. Arjun Mehta', email: 'arjun.mehta@dhanwantari.com', spec: 'Dental Homeopathy', reg: 'REG_A004', qual: 'BHMS', exp: 5, fee: 500 },
    { id: 'doc_005', name: 'Dr. Sneha Gupta', email: 'sneha.gupta@dhanwantari.com', spec: 'Skin & Hair Homeopathy', reg: 'REG_S005', qual: 'BHMS, MD (Hom)', exp: 10, fee: 1000 },
    { id: 'doc_006', name: 'Dr. Rahul Verma', email: 'rahul.verma@dhanwantari.com', spec: 'General Homeopathy', reg: 'REG_R006', qual: 'BHMS, MD (Hom)', exp: 20, fee: 600 },
    { id: 'doc_007', name: 'Dr. Kavita Reddy', email: 'kavita.reddy@dhanwantari.com', spec: 'Women Health Homeopathy', reg: 'REG_K007', qual: 'BHMS, MD (Hom)', exp: 14, fee: 1100 },
    { id: 'doc_008', name: 'Dr. Suresh Nair', email: 'suresh.nair@dhanwantari.com', spec: 'Neurological Homeopathy', reg: 'REG_S008', qual: 'BHMS, MD (Hom)', exp: 18, fee: 2000 },
    { id: 'doc_009', name: 'Dr. Neha Josh', email: 'neha.josh@dhanwantari.com', spec: 'Mental Health Homeopathy', reg: 'REG_N009', qual: 'BHMS, MD (Hom)', exp: 9, fee: 1500 },
    { id: 'doc_010', name: 'Dr. Amit Kumar', email: 'amit.kumar@dhanwantari.com', spec: 'ENT Homeopathy', reg: 'REG_A010', qual: 'BHMS', exp: 7, fee: 700 }
];

const patients = [
    { id: 'pat_001', name: 'Rohit Sharma', email: 'rohit.sharma@gmail.com', dob: '1987-04-30', gender: 'Male', blood: 'O+', h: 170, w: 72, all: [], chron: ['Hypertension'] },
    { id: 'pat_002', name: 'Sara Ali Khan', email: 'sara.ali@gmail.com', dob: '1995-08-12', gender: 'Female', blood: 'A+', h: 165, w: 55, all: ['Peanuts'], chron: [] },
    { id: 'pat_003', name: 'Manish Tewari', email: 'manish.tewari@gmail.com', dob: '1980-01-15', gender: 'Male', blood: 'B-', h: 175, w: 80, all: [], chron: ['Diabetes Type 2'] },
    { id: 'pat_004', name: 'Zoya Khan', email: 'zoya.khan@gmail.com', dob: '1992-11-20', gender: 'Female', blood: 'AB+', h: 160, w: 60, all: [], chron: [] },
    { id: 'pat_005', name: 'Karan Johar', email: 'karan.johar@gmail.com', dob: '1972-05-25', gender: 'Male', blood: 'O-', h: 172, w: 78, all: ['Dust'], chron: ['Asthma'] },
    { id: 'pat_006', name: 'Deepika Padukone', email: 'deepika.p@gmail.com', dob: '1986-01-05', gender: 'Female', blood: 'B+', h: 174, w: 58, all: [], chron: ['Migraine'] },
    { id: 'pat_007', name: 'Ranveer Singh', email: 'ranveer.s@gmail.com', dob: '1985-07-06', gender: 'Male', blood: 'A-', h: 178, w: 75, all: [], chron: [] },
    { id: 'pat_008', name: 'Alia Bhatt', email: 'alia.b@gmail.com', dob: '1993-03-15', gender: 'Female', blood: 'O+', h: 160, w: 50, all: ['Lactose'], chron: [] },
    { id: 'pat_009', name: 'Ranbir Kapoor', email: 'ranbir.k@gmail.com', dob: '1982-09-28', gender: 'Male', blood: 'AB-', h: 180, w: 76, all: [], chron: ['Back Pain'] },
    { id: 'pat_010', name: 'Katrina Kaif', email: 'katrina.k@gmail.com', dob: '1983-07-16', gender: 'Female', blood: 'A+', h: 170, w: 56, all: [], chron: [] },
    { id: 'pat_011', name: 'Vicky Kaushal', email: 'vicky.k@gmail.com', dob: '1988-05-16', gender: 'Male', blood: 'B+', h: 183, w: 80, all: [], chron: [] },
    { id: 'pat_012', name: 'Kiara Advani', email: 'kiara.a@gmail.com', dob: '1992-07-31', gender: 'Female', blood: 'O+', h: 165, w: 52, all: [], chron: [] },
    { id: 'pat_013', name: 'Siddharth Malhotra', email: 'siddharth.m@gmail.com', dob: '1985-01-16', gender: 'Male', blood: 'A+', h: 185, w: 82, all: ['Pollen'], chron: [] },
    { id: 'pat_014', name: 'Kriti Sanon', email: 'kriti.s@gmail.com', dob: '1990-07-27', gender: 'Female', blood: 'B-', h: 176, w: 59, all: [], chron: [] },
    { id: 'pat_015', name: 'Varun Dhawan', email: 'varun.d@gmail.com', dob: '1987-04-24', gender: 'Male', blood: 'O-', h: 175, w: 74, all: [], chron: ['Thyroid'] },
    { id: 'pat_016', name: 'Shraddha Kapoor', email: 'shraddha.k@gmail.com', dob: '1987-03-03', gender: 'Female', blood: 'A+', h: 162, w: 54, all: [], chron: [] },
    { id: 'pat_017', name: 'Rajkummar Rao', email: 'rajkummar.r@gmail.com', dob: '1984-08-31', gender: 'Male', blood: 'AB+', h: 170, w: 68, all: [], chron: [] },
    { id: 'pat_018', name: 'Ayushmann Khurrana', email: 'ayushmann.k@gmail.com', dob: '1984-09-14', gender: 'Male', blood: 'B+', h: 174, w: 70, all: [], chron: ['Insomnia'] },
    { id: 'pat_019', name: 'Bhumi Pednekar', email: 'bhumi.p@gmail.com', dob: '1989-07-18', gender: 'Female', blood: 'O+', h: 163, w: 60, all: [], chron: [] },
    { id: 'pat_020', name: 'Pankaj Tripathi', email: 'pankaj.t@gmail.com', dob: '1976-09-05', gender: 'Male', blood: 'A-', h: 172, w: 76, all: [], chron: ['High Cholesterol'] }
];

async function generateSQL() {
    let sql = `-- Mass Seed Data with Unique Passwords\n\n`;

    // Process Doctors
    sql += `-- =================================================================\n`;
    sql += `-- 1. DOCTORS (10 Users)\n`;
    sql += `-- =================================================================\n\n`;

    sql += `INSERT INTO users (id, email, password_hash, role, status, email_verified) VALUES\n`;

    const docValues = [];
    for (const doc of doctors) {
        // Password: FirstName@123 (e.g. Anisha@123)
        const firstName = doc.name.split(' ')[1]; // Dr. [FirstName] [LastName]
        const password = `${firstName}@123`;
        const hash = await bcrypt.hash(password, 10);
        docValues.push(`('${doc.id}', '${doc.email}', '${hash}', 'doctor', 'active', TRUE)`);

        // Add comment for readability
        // sql += `-- ${doc.name} Password: ${password}\n`;
    }
    sql += docValues.join(',\n') + '\nON DUPLICATE KEY UPDATE status=\'active\';\n\n';

    sql += `INSERT INTO doctor_profiles (user_id, full_name, registration_number, qualification, specialization, experience_years, consultation_fee, verified) VALUES\n`;
    const docProfiles = doctors.map(d =>
        `('${d.id}', '${d.name}', '${d.reg}', '${d.qual}', '${d.spec}', ${d.exp}, ${d.fee}, TRUE)`
    );
    sql += docProfiles.join(',\n') + '\nON DUPLICATE KEY UPDATE verified=TRUE;\n\n';

    // Process Patients
    sql += `-- =================================================================\n`;
    sql += `-- 2. PATIENTS (20 Users)\n`;
    sql += `-- =================================================================\n\n`;

    sql += `INSERT INTO users (id, email, password_hash, role, status, email_verified) VALUES\n`;

    const patValues = [];
    for (const pat of patients) {
        // Password: FirstName@123 (e.g. Rohit@123)
        const firstName = pat.name.split(' ')[0];
        const password = `${firstName}@123`;
        const hash = await bcrypt.hash(password, 10);
        patValues.push(`('${pat.id}', '${pat.email}', '${hash}', 'patient', 'active', TRUE)`);
    }
    sql += patValues.join(',\n') + '\nON DUPLICATE KEY UPDATE status=\'active\';\n\n';

    sql += `INSERT INTO patient_profiles (user_id, full_name, date_of_birth, gender, blood_group, height_cm, weight_kg, allergies, chronic_conditions) VALUES\n`;
    const patProfiles = patients.map(p =>
        `('${p.id}', '${p.name}', '${p.dob}', '${p.gender}', '${p.blood}', ${p.h}, ${p.w}, '${JSON.stringify(p.all)}', '${JSON.stringify(p.chron)}')`
    );
    sql += patProfiles.join(',\n') + '\nON DUPLICATE KEY UPDATE full_name=VALUES(full_name);';

    // Print SQL to stdout
    console.log(sql);
}

generateSQL();
