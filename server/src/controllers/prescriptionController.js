const path = require('path');
const PrescriptionService = require('../services/PrescriptionService');
const DatabaseService = require('../services/DatabaseService');

/**
 * Prescription Controller - Handles prescription generation and retrieval
 */

exports.generatePrescription = async (req, res) => {
    try {
        const { consultationId } = req.body;
        const userId = req.user.id;

        if (!consultationId) {
            return res.status(400).json({ error: 'Consultation ID is required' });
        }

        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        // Get consultation details
        const [consultations] = await pool.execute(`
            SELECT 
                c.*,
                p.full_name as patient_name,
                p.date_of_birth,
                p.gender,
                u.email
            FROM consultations c
            JOIN users u ON c.patient_id = u.id
            JOIN patient_profiles p ON u.id = p.user_id
            WHERE c.id = ? AND c.patient_id = ?
        `, [consultationId, userId]);

        if (consultations.length === 0) {
            return res.status(404).json({ error: 'Consultation not found' });
        }

        const consultation = consultations[0];

        // Parse JSON fields
        const symptoms = typeof consultation.symptoms === 'string'
            ? JSON.parse(consultation.symptoms || '{}')
            : consultation.symptoms;

        const prescription = typeof consultation.prescription === 'string'
            ? JSON.parse(consultation.prescription || 'null')
            : consultation.prescription;

        if (!prescription) {
            return res.status(400).json({ error: 'No prescription available for this consultation' });
        }

        // Calculate age
        const age = consultation.date_of_birth
            ? new Date().getFullYear() - new Date(consultation.date_of_birth).getFullYear()
            : 'N/A';

        // Prepare prescription data
        const prescriptionData = {
            consultationId: consultation.id,
            patientName: consultation.patient_name,
            patientAge: age,
            patientGender: consultation.gender || 'Not specified',
            doctorName: null, // Will be populated if reviewed by doctor
            chiefComplaint: symptoms.chief_complaint || 'Not specified',
            symptoms: symptoms.additional_symptoms || [],
            remedy: prescription.remedy || 'Not specified',
            potency: prescription.potency || 'Not specified',
            dosage: prescription.dosage || 'As directed',
            reasoning: prescription.reasoning || 'Based on homeopathic principles and symptom analysis.',
            date: consultation.created_at
        };

        // Generate PDF
        const pdfPath = await PrescriptionService.generatePDF(prescriptionData);
        const filename = path.basename(pdfPath);

        // Update consultation with prescription filename
        await pool.execute(
            'UPDATE consultations SET prescription_pdf = ? WHERE id = ?',
            [filename, consultationId]
        );

        res.json({
            message: 'Prescription generated successfully',
            filename,
            downloadUrl: `/api/prescriptions/download/${filename}`
        });

    } catch (error) {
        console.error('Generate Prescription Error:', error);
        res.status(500).json({ error: 'Failed to generate prescription' });
    }
};

exports.downloadPrescription = async (req, res) => {
    try {
        const { filename } = req.params;
        const userId = req.user.id;

        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        // Verify user owns this prescription
        const [consultations] = await pool.execute(
            'SELECT id FROM consultations WHERE prescription_pdf = ? AND patient_id = ?',
            [filename, userId]
        );

        if (consultations.length === 0) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        const filepath = PrescriptionService.getPrescriptionPath(filename);

        if (!require('fs').existsSync(filepath)) {
            return res.status(404).json({ error: 'Prescription file not found' });
        }

        res.download(filepath, filename, (err) => {
            if (err) {
                console.error('Download Error:', err);
                res.status(500).json({ error: 'Failed to download prescription' });
            }
        });

    } catch (error) {
        console.error('Download Prescription Error:', error);
        res.status(500).json({ error: 'Failed to download prescription' });
    }
};

exports.getPrescriptionHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        const [prescriptions] = await pool.execute(`
            SELECT 
                c.id,
                c.created_at,
                c.prescription_pdf,
                c.status
            FROM consultations c
            WHERE c.patient_id = ? AND c.prescription_pdf IS NOT NULL
            ORDER BY c.created_at DESC
        `, [userId]);

        res.json(prescriptions);

    } catch (error) {
        console.error('Get Prescription History Error:', error);
        res.status(500).json({ error: 'Failed to fetch prescription history' });
    }
};
