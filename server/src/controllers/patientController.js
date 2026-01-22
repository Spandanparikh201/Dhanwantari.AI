const DatabaseService = require('../services/DatabaseService');

/**
 * Get current user's patient profile
 */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await DatabaseService.getPatientProfile(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Patient profile not found'
                }
            });
        }

        res.json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get Patient Profile Error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch patient profile'
            }
        });
    }
};

/**
 * Update current user's patient profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = req.body;

        // Basic validation
        if (profileData.weight && isNaN(profileData.weight)) {
            return res.status(400).json({ error: 'Weight must be a number' });
        }
        if (profileData.height && isNaN(profileData.height)) {
            return res.status(400).json({ error: 'Height must be a number' });
        }

        await DatabaseService.updatePatientProfile(userId, profileData);

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update Patient Profile Error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to update patient profile'
            }
        });
    }
};

/**
 * Get patient's consultation history
 */
exports.getConsultations = async (req, res) => {
    try {
        const userId = req.user.id;
        // This would interact with a more specific query in DatabaseService
        // For now, we'll use a placeholder or filter the main history
        const history = await DatabaseService.getHistory();
        const userConsultations = history.filter(c => c.patient_id === userId);

        res.json({
            success: true,
            data: userConsultations
        });
    } catch (error) {
        console.error('Get Patient Consultations Error:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to fetch consultations'
            }
        });
    }
};
