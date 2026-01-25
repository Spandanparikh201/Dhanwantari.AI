const DatabaseService = require('../services/DatabaseService');

/**
 * Admin Controller - Manages administrative tasks
 */

exports.getStats = async (req, res) => {
    try {
        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        const [userRows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "patient"');
        const [doctorRows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "doctor"');
        const [pendingRows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "doctor" AND status = "pending"');
        const [consultRows] = await pool.execute('SELECT COUNT(*) as count FROM consultations');

        res.json({
            users: userRows[0].count,
            doctors: doctorRows[0].count,
            pendingDoctors: pendingRows[0].count,
            consultations: consultRows[0].count
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;
        if (!pool) throw new Error('Database not initialized');

        // Get all patients with their profile info
        const [rows] = await pool.execute(`
            SELECT 
                u.id, u.email, u.status, u.created_at,
                p.full_name, p.gender, p.blood_group
            FROM users u
            LEFT JOIN patient_profiles p ON u.id = p.user_id
            WHERE u.role = 'patient'
            ORDER BY u.created_at DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;
        if (!pool) throw new Error('Database not initialized');

        // Query to get all doctors with their verification status
        // We join with users to get email
        const [rows] = await pool.execute(`
            SELECT 
                d.*,
                u.email,
                u.status as user_status
            FROM doctor_profiles d
            JOIN users u ON d.user_id = u.id
            ORDER BY d.created_at DESC
        `);

        // Parse JSON fields
        const doctors = rows.map(doc => ({
            ...doc,
            verification_documents: typeof doc.verification_documents === 'string'
                ? JSON.parse(doc.verification_documents || '[]')
                : doc.verification_documents
        }));

        res.json(doctors);
    } catch (error) {
        console.error('Get All Doctors Error:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
};

exports.verifyDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;
        if (!pool) throw new Error('Database not initialized');

        // Update verify status
        const isVerified = status === 'approved';
        const adminId = req.user.id;

        // Update doctor profile
        await pool.execute(
            'UPDATE doctor_profiles SET verified = ?, verified_by_admin_id = ?, verified_at = NOW() WHERE id = ?',
            [isVerified, adminId, doctorId]
        );

        // Also update user status if approved
        if (isVerified) {
            // Get user_id from doctor profile
            const [rows] = await pool.execute('SELECT user_id FROM doctor_profiles WHERE id = ?', [doctorId]);
            if (rows.length > 0) {
                await pool.execute('UPDATE users SET status = ? WHERE id = ?', ['active', rows[0].user_id]);
            }
        }

        res.json({ message: `Doctor ${status} successfully` });

    } catch (error) {
        console.error('Verify Doctor Error:', error);
        res.status(500).json({ error: 'Failed to update doctor verification' });
    }
};
