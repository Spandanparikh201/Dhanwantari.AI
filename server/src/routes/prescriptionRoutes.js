const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

router.post('/generate', prescriptionController.generatePrescription);

module.exports = router;
