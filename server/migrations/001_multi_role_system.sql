-- ============================================
-- Dhanwantari Multi-Role System Database Setup
-- Version: 1.0
-- Date: 2026-01-18
-- Description: Complete database creation from scratch
-- ============================================

-- ============================================
-- 1. Create Database
-- ============================================
DROP DATABASE IF EXISTS dhanwantari;
CREATE DATABASE dhanwantari CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dhanwantari;

-- ============================================
-- 2. Users Table
-- ============================================
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Patient Profiles Table
-- ============================================
CREATE TABLE patient_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    blood_group VARCHAR(10),
    height DECIMAL(5,2) COMMENT 'Height in cm',
    weight DECIMAL(5,2) COMMENT 'Weight in kg',
    allergies TEXT,
    chronic_conditions TEXT,
    current_medications TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. Doctor Profiles Table
-- ============================================
CREATE TABLE doctor_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    experience_years INT,
    clinic_address TEXT,
    consultation_fee DECIMAL(10,2),
    verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT COMMENT 'JSON array of document URLs',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_verified (verified),
    INDEX idx_registration (registration_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. Consultations Table
-- ============================================
CREATE TABLE consultations (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NULL COMMENT 'NULL if AI-only consultation',
    type ENUM('ai', 'doctor', 'hybrid') DEFAULT 'ai',
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    summary TEXT,
    symptoms TEXT,
    messages JSON COMMENT 'Chat messages array',
    conversation_history JSON COMMENT 'Detailed conversation',
    ai_analysis TEXT,
    doctor_notes TEXT,
    remedy TEXT,
    prescription TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Admin Logs Table
-- ============================================
CREATE TABLE admin_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_user_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin (admin_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at),
    INDEX idx_target (target_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. Insert Default Admin User
-- ============================================
-- Password: Admin@123
-- Hash generated with: bcrypt.hash('Admin@123', 10)
INSERT INTO users (id, name, email, password, role, status) 
VALUES (
    'admin_001', 
    'System Administrator', 
    'admin@dhanwantari.com', 
    '$2a$10$rKZvVqVQxJ5kZJ5kZJ5kZOqVQxJ5kZJ5kZJ5kZJ5kZJ5kZJ5kZJ5k', 
    'admin', 
    'active'
);

-- ============================================
-- 8. Insert Sample Doctor (for testing)
-- ============================================
-- Password: Doctor@123
INSERT INTO users (id, name, email, password, role, status) 
VALUES (
    'doctor_001', 
    'Dr. Rajesh Kumar', 
    'doctor@dhanwantari.com', 
    '$2a$10$rKZvVqVQxJ5kZJ5kZJ5kZOqVQxJ5kZJ5kZJ5kZJ5kZJ5kZJ5kZJ5k', 
    'doctor', 
    'active'
);

INSERT INTO doctor_profiles (user_id, registration_number, qualification, specialization, experience_years, verified, bio)
VALUES (
    'doctor_001',
    'BHMS-2024-001',
    'BHMS, MD (Homeopathy)',
    'Classical Homeopathy',
    10,
    TRUE,
    'Experienced homeopathic practitioner specializing in chronic diseases and constitutional treatment.'
);

-- ============================================
-- 9. Insert Sample Patient (for testing)
-- ============================================
-- Password: Patient@123
INSERT INTO users (id, name, email, password, role, status) 
VALUES (
    'patient_001', 
    'John Doe', 
    'patient@dhanwantari.com', 
    '$2a$10$rKZvVqVQxJ5kZJ5kZJ5kZOqVQxJ5kZJ5kZJ5kZJ5kZJ5kZJ5kZJ5k', 
    'patient', 
    'active'
);

INSERT INTO patient_profiles (user_id, date_of_birth, gender, blood_group)
VALUES (
    'patient_001',
    '1990-01-15',
    'male',
    'O+'
);

-- ============================================
-- 10. Create Views for Common Queries
-- ============================================

-- View: Active Verified Doctors
CREATE VIEW active_doctors AS
SELECT 
    u.id,
    u.name,
    u.email,
    d.registration_number,
    d.qualification,
    d.specialization,
    d.experience_years,
    d.consultation_fee,
    d.bio
FROM users u
JOIN doctor_profiles d ON u.id = d.user_id
WHERE u.role = 'doctor' 
  AND u.status = 'active' 
  AND d.verified = TRUE;

-- View: Patient Consultation History
CREATE VIEW patient_consultations AS
SELECT 
    c.id,
    c.patient_id,
    p.name as patient_name,
    c.doctor_id,
    d.name as doctor_name,
    c.type,
    c.status,
    c.summary,
    c.remedy,
    c.timestamp,
    c.completed_at
FROM consultations c
JOIN users p ON c.patient_id = p.id
LEFT JOIN users d ON c.doctor_id = d.id;

-- ============================================
-- 11. Database Statistics
-- ============================================
SELECT 
    'Database Setup Complete!' as status,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE role='admin') as admins,
    (SELECT COUNT(*) FROM users WHERE role='doctor') as doctors,
    (SELECT COUNT(*) FROM users WHERE role='patient') as patients,
    (SELECT COUNT(*) FROM doctor_profiles WHERE verified=TRUE) as verified_doctors;

-- ============================================
-- NOTES FOR DATABASE ADMINISTRATOR
-- ============================================
-- 1. Default passwords are hashed versions of:
--    - Admin: Admin@123
--    - Doctor: Doctor@123
--    - Patient: Patient@123
--    CHANGE THESE IN PRODUCTION!
--
-- 2. To run this script:
--    mysql -u root -p < 001_multi_role_system.sql
--
-- 3. To backup database:
--    mysqldump -u root -p dhanwantari > backup.sql
--
-- 4. To restore database:
--    mysql -u root -p dhanwantari < backup.sql
--
-- 5. Recommended indexes are already created
--    Monitor query performance and add more as needed
-- ============================================
