const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

class DatabaseService {
    constructor() {
        this.pool = null;
        this.initPromise = this.initialize();
    }

    async initialize() {
        try {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });

            // Test connection
            const connection = await this.pool.getConnection();
            console.log("MySQL Database Connected Successfully");
            connection.release();
        } catch (error) {
            console.error("MySQL Connection Error:", error);
        }
    }

    async saveConsultation(consultation) {
        await this.initPromise;
        const id = Date.now().toString();
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

        try {
            const [result] = await this.pool.execute(
                'INSERT INTO consultations (id, summary, messages, remedy, timestamp) VALUES (?, ?, ?, ?, ?)',
                [id, consultation.summary, JSON.stringify(consultation.messages), consultation.remedy, timestamp]
            );
            return { id, ...consultation, timestamp };
        } catch (error) {
            console.error("Save Consultation Error:", error);
            throw error;
        }
    }

    async getHistory() {
        await this.initPromise;
        try {
            const [rows] = await this.pool.execute('SELECT * FROM consultations ORDER BY timestamp DESC');
            return rows.map(row => ({
                ...row,
                messages: typeof row.messages === 'string' ? JSON.parse(row.messages) : row.messages
            }));
        } catch (error) {
            console.error("Get History Error:", error);
            throw error;
        }
    }

    // ============================================
    // User Management (Multi-Role)
    // ============================================

    async createUser(user) {
        await this.initPromise;
        const id = Date.now().toString();

        try {
            const [result] = await this.pool.execute(
                'INSERT INTO users (id, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
                [id, user.email, user.password, user.role || 'patient', user.status || 'active']
            );
            return { id, name: user.name, ...user };
        } catch (error) {
            console.error("Create User Error:", error);
            throw error;
        }
    }

    async findUserByEmail(email) {
        await this.initPromise;
        try {
            const [rows] = await this.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0] || null;
        } catch (error) {
            console.error("Find User Error:", error);
            throw error;
        }
    }

    async findUserById(id) {
        await this.initPromise;
        try {
            const [rows] = await this.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            console.error("Find User By ID Error:", error);
            throw error;
        }
    }

    async updateUserStatus(userId, status) {
        await this.initPromise;
        try {
            await this.pool.execute('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
        } catch (error) {
            console.error("Update User Status Error:", error);
            throw error;
        }
    }

    // ============================================
    // Patient Profile Management
    // ============================================

    async createPatientProfile(userId, profileData) {
        await this.initPromise;
        try {
            // Name should come from registration data (profileData) or be passed explicitly
            const fullName = profileData.fullName || profileData.name || 'Unknown';

            const [result] = await this.pool.execute(
                `INSERT INTO patient_profiles 
                (user_id, full_name, date_of_birth, gender, blood_group, height_cm, weight_kg, allergies, 
                chronic_conditions, current_medications, emergency_contact_name, emergency_contact_phone) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    fullName,
                    profileData.dateOfBirth || null,
                    profileData.gender || null,
                    profileData.bloodGroup || null,
                    profileData.height || null,
                    profileData.weight || null,
                    profileData.allergies ? JSON.stringify(profileData.allergies) : null,
                    profileData.chronicConditions ? JSON.stringify(profileData.chronicConditions) : null,
                    profileData.currentMedications ? JSON.stringify(profileData.currentMedications) : null,
                    profileData.emergencyContactName || null,
                    profileData.emergencyContactPhone || null
                ]
            );
            return result;
        } catch (error) {
            console.error("Create Patient Profile Error:", error);
            throw error;
        }
    }

    async getPatientProfile(userId) {
        await this.initPromise;
        try {
            const [rows] = await this.pool.execute(
                'SELECT * FROM patient_profiles WHERE user_id = ?',
                [userId]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Get Patient Profile Error:", error);
            throw error;
        }
    }

    async updatePatientProfile(userId, profileData) {
        await this.initPromise;
        try {
            // Get current profile to fill in missing fields
            const current = await this.getPatientProfile(userId) || {};

            await this.pool.execute(
                `UPDATE patient_profiles SET 
                date_of_birth = ?, gender = ?, blood_group = ?, height = ?, weight = ?,
                allergies = ?, chronic_conditions = ?, current_medications = ?,
                emergency_contact_name = ?, emergency_contact_phone = ?
                WHERE user_id = ?`,
                [
                    profileData.dateOfBirth !== undefined ? profileData.dateOfBirth : current.date_of_birth,
                    profileData.gender !== undefined ? profileData.gender : current.gender,
                    profileData.bloodGroup !== undefined ? profileData.bloodGroup : current.blood_group,
                    profileData.height !== undefined ? profileData.height : current.height,
                    profileData.weight !== undefined ? profileData.weight : current.weight,
                    profileData.allergies !== undefined ? profileData.allergies : current.allergies,
                    profileData.chronicConditions !== undefined ? profileData.chronicConditions : current.chronic_conditions,
                    profileData.currentMedications !== undefined ? profileData.currentMedications : current.current_medications,
                    profileData.emergencyContactName !== undefined ? profileData.emergencyContactName : current.emergency_contact_name,
                    profileData.emergencyContactPhone !== undefined ? profileData.emergencyContactPhone : current.emergency_contact_phone,
                    userId
                ]
            );
        } catch (error) {
            console.error("Update Patient Profile Error:", error);
            throw error;
        }
    }

    // ============================================
    // Doctor Profile Management
    // ============================================

    async createDoctorProfile(userId, profileData) {
        await this.initPromise;
        try {
            // Name should come from registration data (profileData) or be passed explicitly
            const fullName = profileData.fullName || profileData.name || 'Unknown Doctor';

            const [result] = await this.pool.execute(
                `INSERT INTO doctor_profiles 
                (user_id, full_name, registration_number, qualification, specialization, experience_years, 
                clinic_address, consultation_fee, bio, verification_documents) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    fullName,
                    profileData.registrationNumber,
                    profileData.qualification || null,
                    profileData.specialization || null,
                    profileData.experienceYears || null,
                    profileData.clinicAddress || null,
                    profileData.consultationFee || null,
                    profileData.bio || null,
                    JSON.stringify(profileData.verificationDocuments || [])
                ]
            );
            return result;
        } catch (error) {
            console.error("Create Doctor Profile Error:", error);
            throw error;
        }
    }

    async getDoctorProfile(userId) {
        await this.initPromise;
        try {
            const [rows] = await this.pool.execute(
                'SELECT * FROM doctor_profiles WHERE user_id = ?',
                [userId]
            );
            if (rows[0]) {
                rows[0].verification_documents = JSON.parse(rows[0].verification_documents || '[]');
            }
            return rows[0] || null;
        } catch (error) {
            console.error("Get Doctor Profile Error:", error);
            throw error;
        }
    }

    async verifyDoctor(userId, verified = true) {
        await this.initPromise;
        try {
            await this.pool.execute(
                'UPDATE doctor_profiles SET verified = ? WHERE user_id = ?',
                [verified, userId]
            );
        } catch (error) {
            console.error("Verify Doctor Error:", error);
            throw error;
        }
    }

    async getVerifiedDoctors() {
        await this.initPromise;
        try {
            const [rows] = await this.pool.execute(
                `SELECT u.id, u.name, u.email, d.* 
                FROM users u 
                JOIN doctor_profiles d ON u.id = d.user_id 
                WHERE u.role = 'doctor' AND d.verified = TRUE AND u.status = 'active'`
            );
            return rows;
        } catch (error) {
            console.error("Get Verified Doctors Error:", error);
            throw error;
        }
    }

    // ============================================
    // Admin Functions
    // ============================================

    async getAllUsers(filters = {}) {
        await this.initPromise;
        try {
            let query = 'SELECT id, name, email, role, status, created_at FROM users WHERE 1=1';
            const params = [];

            if (filters.role) {
                query += ' AND role = ?';
                params.push(filters.role);
            }

            if (filters.status) {
                query += ' AND status = ?';
                params.push(filters.status);
            }

            query += ' ORDER BY created_at DESC';

            const [rows] = await this.pool.execute(query, params);
            return rows;
        } catch (error) {
            console.error("Get All Users Error:", error);
            throw error;
        }
    }

    async logAdminAction(adminId, action, targetUserId = null, details = null, ipAddress = null) {
        await this.initPromise;
        try {
            await this.pool.execute(
                'INSERT INTO admin_logs (admin_id, action, target_user_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
                [adminId, action, targetUserId, details, ipAddress]
            );
        } catch (error) {
            console.error("Log Admin Action Error:", error);
            throw error;
        }
    }
}

module.exports = new DatabaseService();
