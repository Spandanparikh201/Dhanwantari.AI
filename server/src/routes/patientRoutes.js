const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// All patient routes require authentication and 'patient' role
router.use(authenticateToken);
router.use(requireRole(['patient']));

router.get('/profile', patientController.getProfile);
router.put('/profile', patientController.updateProfile);
router.get('/consultations', patientController.getConsultations);

module.exports = router;
