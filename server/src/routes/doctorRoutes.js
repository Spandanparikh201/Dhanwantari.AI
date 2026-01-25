const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/auth');

// Middleware to check if user is doctor
const isDoctor = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Doctors only.' });
    }
};

// All routes require auth and doctor role
router.use(authenticateToken, isDoctor);

router.get('/stats', doctorController.getStats);
router.get('/consultations', doctorController.getConsultations);
router.get('/patients/:patientId', doctorController.getPatientProfile);
router.get('/pending-reviews', doctorController.getPendingReviews);
router.post('/review/:consultationId', doctorController.reviewConsultation);

module.exports = router;
