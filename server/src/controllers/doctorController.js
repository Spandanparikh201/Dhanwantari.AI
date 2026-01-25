const DatabaseService = require('../services/DatabaseService');

/**
 * Doctor Controller - Manages doctor-specific tasks
 */

exports.getStats = async (req, res) => {
    try {
        const doctorId = req.user.id;
        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        // Get total unique patients treated by this doctor
        const [patientRows] = await pool.execute(
            'SELECT COUNT(DISTINCT patient_id) as count FROM consultations WHERE doctor_id = ?',
            [doctorId]
        );

        // Get pending consultations
        const [pendingRows] = await pool.execute(
            'SELECT COUNT(*) as count FROM consultations WHERE doctor_id = ? AND status = "in_progress"',
            [doctorId]
        );

        // Get total earnings (sum of payment_amount for completed consultations)
        const [earningRows] = await pool.execute(
            'SELECT SUM(payment_amount) as total FROM consultations WHERE doctor_id = ? AND payment_status = "paid"',
            [doctorId]
        );

        res.json({
            patients: patientRows[0].count,
            consultations: pendingRows[0].count, // Used as 'pending' count in dashboard
            earnings: `₹${earningRows[0].total || 0}`
        });

    } catch (error) {
        console.error('Doctor Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch doctor stats' });
    }
};

exports.getConsultations = async (req, res) => {
    try {
        const doctorId = req.user.id;
        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        // Get consultations with patient details
        const [rows] = await pool.execute(`
            SELECT 
                c.*,
                p.full_name as patient_name,
                p.gender,
                p.date_of_birth
            FROM consultations c
            JOIN users u ON c.patient_id = u.id
            JOIN patient_profiles p ON u.id = p.user_id
            WHERE c.doctor_id = ?
            ORDER BY c.created_at DESC
        `, [doctorId]);

        // Parse JSON fields
        const consultations = rows.map(row => ({
            ...row,
            symptoms: typeof row.symptoms === 'string' ? JSON.parse(row.symptoms || '{}') : row.symptoms,
            prescription: typeof row.prescription === 'string' ? JSON.parse(row.prescription || 'null') : row.prescription
        }));

        res.json(consultations);

    } catch (error) {
        console.error('Doctor Consultations Error:', error);
        res.status(500).json({ error: 'Failed to fetch consultations' });
    }
};

exports.getPatientProfile = async (req, res) => {
    try {
        const { patientId } = req.params;
        // Verify this patient has a consultation with this doctor (privacy check)
        // For hackathon, might skip strict check, but good practice

        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        const [rows] = await pool.execute(
            'SELECT * FROM patient_profiles WHERE user_id = ?',
            [patientId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Patient profile not found' });
        }

        const profile = rows[0];
        // Parse JSON fields
        ['allergies', 'chronic_conditions', 'current_medications', 'lifestyle'].forEach(field => {
            if (profile[field] && typeof profile[field] === 'string') {
                profile[field] = JSON.parse(profile[field]);
            }
        });

        res.json(profile);

    } catch (error) {
        console.error('Get Patient Profile Error:', error);
        res.status(500).json({ error: 'Failed to fetch patient profile' });
    }
};

exports.getPendingReviews = async (req, res) => {
    try {
        const doctorId = req.user.id;
        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        // Get consultations pending review (completed but not reviewed)
        const [rows] = await pool.execute(`
            SELECT 
                c.*,
                p.full_name as patient_name,
                p.gender,
                p.date_of_birth,
                u.email as patient_email
            FROM consultations c
            JOIN users u ON c.patient_id = u.id
            JOIN patient_profiles p ON u.id = p.user_id
            WHERE c.status = 'completed' AND c.reviewed_by_doctor IS NULL
            ORDER BY c.created_at DESC
        `);

        // Parse JSON fields
        const consultations = rows.map(row => ({
            ...row,
            symptoms: typeof row.symptoms === 'string' ? JSON.parse(row.symptoms || '{}') : row.symptoms,
            prescription: typeof row.prescription === 'string' ? JSON.parse(row.prescription || 'null') : row.prescription
        }));

        res.json(consultations);

    } catch (error) {
        console.error('Get Pending Reviews Error:', error);
        res.status(500).json({ error: 'Failed to fetch pending reviews' });
    }
};

exports.reviewConsultation = async (req, res) => {
    try {
        const { consultationId } = req.params;
        const { status, notes, modifiedPrescription } = req.body;
        const doctorId = req.user.id;

        if (!['approved', 'rejected', 'modified'].includes(status)) {
            return res.status(400).json({ error: 'Invalid review status' });
        }

        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        // Get consultation to verify it exists
        const [consultations] = await pool.execute(
            'SELECT * FROM consultations WHERE id = ?',
            [consultationId]
        );

        if (consultations.length === 0) {
            return res.status(404).json({ error: 'Consultation not found' });
        }

        const consultation = consultations[0];

        // Prepare update data
        let prescriptionData = consultation.prescription;
        if (modifiedPrescription && status === 'modified') {
            prescriptionData = JSON.stringify(modifiedPrescription);
        }

        // Update consultation with review
        await pool.execute(`
            UPDATE consultations 
            SET 
                reviewed_by_doctor = ?,
                doctor_review_status = ?,
                doctor_notes = ?,
                prescription = ?,
                reviewed_at = NOW()
            WHERE id = ?
        `, [doctorId, status, notes || null, prescriptionData, consultationId]);

        res.json({
            message: 'Consultation reviewed successfully',
            status,
            consultationId
        });

    } catch (error) {
        console.error('Review Consultation Error:', error);
        res.status(500).json({ error: 'Failed to review consultation' });
    }
};
