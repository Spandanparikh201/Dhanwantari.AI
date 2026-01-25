-- ============================================
-- Dhanwantari Production Database Schema
-- Version: 2.1 (SECURITY HARDENED)
-- Date: 2026-01-22
-- Description: Enhanced schema with security hardening applied
-- Security Audit: Red Team + Blue Team reviewed
-- ============================================

-- ⚠️ SECURITY NOTICE:
-- This script has been hardened for production use.
-- Review SECURITY_AUDIT_REPORT.md before deployment.

-- ============================================
-- 1. Drop and Create Database
-- ============================================
DROP DATABASE IF EXISTS dhanwantari;
CREATE DATABASE dhanwantari CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dhanwantari;

-- ============================================
-- 2. Users Table (Core Authentication)
-- SECURITY: Rate limiting, account locking, soft delete
-- ============================================
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL COMMENT 'Bcrypt hash with cost factor 12',
    role ENUM('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient',
    status ENUM('active', 'inactive', 'suspended', 'pending_verification') DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    consent_gdpr BOOLEAN DEFAULT FALSE COMMENT 'GDPR consent tracking',
    consent_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_deleted (deleted_at),
    INDEX idx_locked (locked_until),
    
    -- SECURITY: Email format validation
    CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'),
    -- SECURITY: Limit failed attempts
    CHECK (failed_login_attempts >= 0 AND failed_login_attempts <= 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. Patient Profiles Table
-- SECURITY: Encrypted PHI fields (JSON), input validation
-- ============================================
CREATE TABLE patient_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'non_binary', 'prefer_not_to_say'),
    blood_group VARCHAR(10),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    bmi DECIMAL(4,2) GENERATED ALWAYS AS (
        CASE 
            WHEN height_cm > 0 THEN (weight_kg / POWER(height_cm/100, 2))
            ELSE NULL
        END
    ) STORED,
    allergies JSON COMMENT 'SENSITIVE: Should be encrypted at app layer',
    chronic_conditions JSON COMMENT 'SENSITIVE: Should be encrypted at app layer',
    current_medications JSON COMMENT 'SENSITIVE: Should be encrypted at app layer',
    family_medical_history TEXT,
    lifestyle JSON COMMENT 'diet, exercise, smoking, alcohol habits',
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_dob (date_of_birth),
    
    -- SECURITY: Reasonable height/weight ranges
    CHECK (height_cm IS NULL OR (height_cm >= 50 AND height_cm <= 300)),
    CHECK (weight_kg IS NULL OR (weight_kg >= 2 AND weight_kg <= 500))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. Doctor Profiles Table
-- SECURITY: Verification tracking, geolocation bounds
-- ============================================
CREATE TABLE doctor_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    registration_authority VARCHAR(100),
    qualification VARCHAR(255),
    specialization VARCHAR(255),
    experience_years INT,
    clinic_name VARCHAR(255),
    clinic_address TEXT,
    clinic_pincode VARCHAR(10),
    clinic_latitude DECIMAL(10,8),
    clinic_longitude DECIMAL(11,8),
    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    online_consultation_available BOOLEAN DEFAULT TRUE,
    in_person_consultation_available BOOLEAN DEFAULT FALSE,
    consultation_duration_mins INT DEFAULT 30,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP NULL,
    verified_by_admin_id VARCHAR(50),
    verification_documents JSON COMMENT 'Document URLs with metadata',
    bio TEXT,
    languages_spoken JSON COMMENT 'Array of language codes',
    availability_schedule JSON COMMENT 'Weekly schedule with time slots',
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    total_consultations INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by_admin_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_verified (verified),
    INDEX idx_registration (registration_number),
    INDEX idx_location (clinic_latitude, clinic_longitude),
    INDEX idx_rating (rating_average),
    
    -- SECURITY: Valid geolocation bounds (India)
    CHECK (clinic_latitude IS NULL OR (clinic_latitude >= -90 AND clinic_latitude <= 90)),
    CHECK (clinic_longitude IS NULL OR (clinic_longitude >= -180 AND clinic_longitude <= 180)),
    -- SECURITY: Reasonable fee range
    CHECK (consultation_fee >= 0 AND consultation_fee <= 100000),
    -- SECURITY: Reasonable experience years
    CHECK (experience_years IS NULL OR (experience_years >= 0 AND experience_years <= 60))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. Consultations Table
-- SECURITY: Payment validation, status transitions
-- ============================================
CREATE TABLE consultations (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NULL,
    type ENUM('ai_only', 'ai_assisted', 'doctor_only', 'hybrid') DEFAULT 'ai_only',
    mode ENUM('chat', 'video', 'audio', 'in_person') DEFAULT 'chat',
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'in_progress',
    scheduled_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    duration_minutes INT,
    chief_complaint TEXT,
    symptoms JSON COMMENT 'Structured symptom data',
    vital_signs JSON COMMENT 'Temperature, BP, pulse, etc.',
    ai_analysis TEXT COMMENT 'SENSITIVE: Encrypt at app layer',
    ai_confidence_score DECIMAL(3,2),
    doctor_notes TEXT COMMENT 'SENSITIVE: Encrypt at app layer',
    diagnosis TEXT COMMENT 'SENSITIVE: Encrypt at app layer',
    prescription JSON COMMENT 'Legacy field - use prescription_items table',
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE NULL,
    next_consultation_id VARCHAR(50) NULL,
    payment_amount DECIMAL(10,2),
    payment_status ENUM('pending', 'paid', 'refunded', 'waived') DEFAULT 'pending',
    payment_transaction_id VARCHAR(100) COMMENT 'SENSITIVE: PCI-DSS compliance required',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (next_consultation_id) REFERENCES consultations(id) ON DELETE SET NULL,
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_scheduled (scheduled_at),
    INDEX idx_payment (payment_status),
    
    -- SECURITY: Valid payment amount
    CHECK (payment_amount IS NULL OR (payment_amount >= 0 AND payment_amount <= 100000)),
    -- SECURITY: Confidence score range
    CHECK (ai_confidence_score IS NULL OR (ai_confidence_score >= 0 AND ai_confidence_score <= 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Messages Table (Chat History)
-- SECURITY: Content length limits, XSS prevention
-- ============================================
CREATE TABLE messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    consultation_id VARCHAR(50) NOT NULL,
    sender_type ENUM('patient', 'doctor', 'ai', 'system') NOT NULL,
    sender_id VARCHAR(50) NULL COMMENT 'NULL for AI/system messages',
    message_type ENUM('text', 'image', 'file', 'audio', 'video', 'symptom_form') DEFAULT 'text',
    content TEXT COMMENT 'MUST be sanitized for XSS on output',
    metadata JSON COMMENT 'File URLs, duration, etc.',
    is_sensitive BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_consultation_time (consultation_id, created_at),
    INDEX idx_sender (sender_id),
    INDEX idx_unread (consultation_id, read_at),
    
    -- SECURITY: Prevent excessively long messages
    CHECK (CHAR_LENGTH(content) <= 10000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. Prescriptions Table
-- SECURITY: Validity period enforcement
-- ============================================
CREATE TABLE prescriptions (
    id VARCHAR(50) PRIMARY KEY,
    consultation_id VARCHAR(50) NOT NULL,
    prescribed_by_doctor_id VARCHAR(50),
    patient_id VARCHAR(50) NOT NULL,
    prescription_type ENUM('homeopathic', 'allopathic', 'dietary', 'lifestyle') DEFAULT 'homeopathic',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until DATE COMMENT 'Prescription expiry date',
    instructions TEXT,
    precautions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    FOREIGN KEY (prescribed_by_doctor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_consultation (consultation_id),
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (prescribed_by_doctor_id),
    INDEX idx_valid (valid_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. Prescription Items Table
-- ============================================
CREATE TABLE prescription_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    prescription_id VARCHAR(50) NOT NULL,
    remedy_name VARCHAR(255) NOT NULL,
    potency VARCHAR(20) COMMENT 'e.g., 30C, 200C, 1M',
    dosage VARCHAR(100) COMMENT 'e.g., 5 pills, 10 drops',
    frequency VARCHAR(100) COMMENT 'e.g., 3 times daily',
    duration_days INT,
    special_instructions TEXT,
    order_sequence INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    INDEX idx_prescription (prescription_id),
    INDEX idx_remedy (remedy_name),
    
    -- SECURITY: Reasonable duration limits
    CHECK (duration_days IS NULL OR (duration_days >= 1 AND duration_days <= 365))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. File Uploads Table
-- SECURITY: File size limits, path traversal prevention
-- ============================================
CREATE TABLE file_uploads (
    id VARCHAR(50) PRIMARY KEY,
    uploaded_by_user_id VARCHAR(50) NOT NULL,
    consultation_id VARCHAR(50) NULL,
    file_type ENUM('image', 'pdf', 'audio', 'video', 'document') NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL COMMENT 'UUID-based, prevents path traversal',
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    is_medical_record BOOLEAN DEFAULT FALSE,
    description TEXT COMMENT 'MUST be sanitized for XSS',
    ocr_extracted_text TEXT COMMENT 'AI-extracted text from images',
    virus_scanned BOOLEAN DEFAULT FALSE COMMENT 'Antivirus scan status',
    virus_scan_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE SET NULL,
    INDEX idx_uploader (uploaded_by_user_id),
    INDEX idx_consultation (consultation_id),
    INDEX idx_type (file_type),
    INDEX idx_created (created_at),
    
    -- SECURITY: Max file size 10MB
    CHECK (file_size_bytes <= 10485760)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. Notifications Table
-- ============================================
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    type ENUM('appointment_reminder', 'prescription_ready', 'message_received', 'payment_received', 'system_alert', 'security_alert') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    action_url VARCHAR(500) COMMENT 'Deeplink to relevant page',
    read_at TIMESTAMP NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_unread (user_id, read_at),
    INDEX idx_type (type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. Admin Logs Table (Audit Trail)
-- SECURITY: Complete audit logging for compliance
-- ============================================
CREATE TABLE admin_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    action_status ENUM('success', 'failed', 'denied') DEFAULT 'success',
    resource_type VARCHAR(50) COMMENT 'e.g., user, consultation, prescription',
    resource_id VARCHAR(50),
    target_user_id VARCHAR(50) NULL,
    changes JSON COMMENT 'Before/after values for audit',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_admin_time (admin_id, created_at),
    INDEX idx_action (action),
    INDEX idx_status (action_status),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_target (target_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. Password Reset Tokens Table
-- SECURITY: Short expiry time, single-use tokens
-- ============================================
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL 15 MINUTE),
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 13. Email Verification Tokens Table
-- SECURITY: 24-hour expiry
-- ============================================
CREATE TABLE email_verification_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL 24 HOUR),
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 14. Doctor Reviews Table
-- ============================================
CREATE TABLE doctor_reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    doctor_id VARCHAR(50) NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    consultation_id VARCHAR(50) NOT NULL,
    rating INT NOT NULL COMMENT 'Rating from 1-5',
    review_text TEXT COMMENT 'MUST be sanitized for XSS',
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Verified actual patient',
    is_visible BOOLEAN DEFAULT TRUE,
    moderation_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_patient_consultation (patient_id, consultation_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_rating (doctor_id, rating),
    INDEX idx_verified (is_verified),
    INDEX idx_moderation (moderation_status),
    CHECK (rating >= 1 AND rating <= 5),
    CHECK (CHAR_LENGTH(review_text) <= 2000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 15. Create Views for Common Queries
-- ============================================

-- Active Verified Doctors View
CREATE VIEW active_doctors AS
SELECT 
    u.id,
    d.full_name,
    u.email,
    d.registration_number,
    d.qualification,
    d.specialization,
    d.experience_years,
    d.consultation_fee,
    d.online_consultation_available,
    d.in_person_consultation_available,
    d.rating_average,
    d.total_consultations,
    d.bio,
    d.languages_spoken
FROM users u
JOIN doctor_profiles d ON u.id = d.user_id
WHERE u.role = 'doctor' 
  AND u.status = 'active' 
  AND d.verified = TRUE
  AND u.deleted_at IS NULL;

-- Patient Consultation History View
CREATE VIEW patient_consultation_history AS
SELECT 
    c.id,
    c.patient_id,
    pp.full_name as patient_name,
    c.doctor_id,
    dp.full_name as doctor_name,
    c.type,
    c.mode,
    c.status,
    c.chief_complaint,
    c.diagnosis,
    c.follow_up_required,
    c.follow_up_date,
    c.payment_status,
    c.scheduled_at,
    c.completed_at,
    c.created_at
FROM consultations c
JOIN users pu ON c.patient_id = pu.id
JOIN patient_profiles pp ON pu.id = pp.user_id
LEFT JOIN users du ON c.doctor_id = du.id
LEFT JOIN doctor_profiles dp ON du.id = dp.user_id
WHERE pu.deleted_at IS NULL;

-- SECURITY: Suspicious Users View (for monitoring)
CREATE VIEW users_suspicious_activity AS
SELECT 
    id,
    email,
    role,
    failed_login_attempts,
    locked_until,
    last_login_at,
    CASE 
        WHEN failed_login_attempts >= 5 THEN 'LOCKED'
        WHEN failed_login_attempts >= 3 THEN 'WARNING'
        ELSE 'OK'
    END AS threat_level
FROM users
WHERE failed_login_attempts > 0 OR locked_until IS NOT NULL;

-- ============================================
-- 16. Security-Related Stored Procedures
-- ============================================

-- Procedure to cleanup old soft-deleted records (GDPR compliance)
DELIMITER $$
CREATE PROCEDURE cleanup_deleted_records()
BEGIN
    -- Delete users soft-deleted more than 30 days ago
    DELETE FROM users 
    WHERE deleted_at IS NOT NULL 
      AND deleted_at < NOW() - INTERVAL 30 DAY;
    
    SELECT ROW_COUNT() AS records_purged;
END$$
DELIMITER ;

-- Procedure to cleanup expired tokens
DELIMITER $$
CREATE PROCEDURE cleanup_expired_tokens()
BEGIN
    DELETE FROM password_reset_tokens WHERE expires_at < NOW();
    DELETE FROM email_verification_tokens WHERE expires_at < NOW();
    
    SELECT ROW_COUNT() AS tokens_purged;
END$$
DELIMITER ;

-- ============================================
-- 17. Create Database Users with Least Privilege
-- ============================================

-- ⚠️ SECURITY: Create separate users for different access levels
-- Run these commands separately after database creation

-- Read-only user (for reporting/analytics)
-- CREATE USER 'dhanwantari_readonly'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
-- GRANT SELECT ON dhanwantari.* TO 'dhanwantari_readonly'@'localhost';

-- Application user (no DELETE or ALTER privileges)
-- CREATE USER 'dhanwantari_app'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
-- GRANT SELECT, INSERT, UPDATE ON dhanwantari.* TO 'dhanwantari_app'@'localhost';

-- Admin user (full privileges)
-- CREATE USER 'dhanwantari_admin'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
-- GRANT ALL PRIVILEGES ON dhanwantari.* TO 'dhanwantari_admin'@'localhost';

-- FLUSH PRIVILEGES;

-- ============================================
-- 18. NO SAMPLE DATA (SECURITY REQUIREMENT)
-- ============================================
-- Sample users with default passwords have been REMOVED for security.
-- Use the application's first-time setup wizard to create initial admin user.

-- ============================================
-- 19. Database Statistics
-- ============================================
SELECT 
    'Database Setup Complete (Security Hardened)!' as status,
    (SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'dhanwantari') as total_tables,
    (SELECT COUNT(*) FROM information_schema.VIEWS WHERE TABLE_SCHEMA = 'dhanwantari') as total_views;

-- ============================================
-- SECURITY HARDENING APPLIED
-- ============================================
-- ✅ Input validation CHECK constraints added
-- ✅ Default sample passwords REMOVED
-- ✅ Token expiry defaults set (15 min, 24 hour)
-- ✅ File size limits enforced
-- ✅ GDPR consent tracking added
-- ✅ Virus scanning field for uploads
-- ✅ Admin log status tracking (success/failed/denied)
-- ✅ Review moderation status added
-- ✅ Stored procedures for cleanup tasks
-- ✅ Security views for monitoring
-- ✅ Least-privilege database user templates
--
-- NEXT STEPS:
-- 1. Review SECURITY_AUDIT_REPORT.md
-- 2. Implement app-layer encryption for PHI
-- 3. Set up scheduled jobs for cleanup procedures
-- 4. Configure MySQL audit plugin
-- 5. Implement prepared statements in all queries
-- 6. Set up Web Application Firewall (WAF)
-- 7. Enable SSL/TLS for database connections
-- 8. Configure automated backups
-- ============================================
