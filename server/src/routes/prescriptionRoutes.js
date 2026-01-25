const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticateToken } = require('../middleware/auth');

// All prescription routes require authentication
router.use(authenticateToken);

router.post('/generate', prescriptionController.generatePrescription);
router.get('/download/:filename', prescriptionController.downloadPrescription);
router.get('/history', prescriptionController.getPrescriptionHistory);

module.exports = router;
