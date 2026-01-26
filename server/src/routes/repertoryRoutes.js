
const express = require('express');
const { searchSymptoms, analyzeRemedies, getAllSymptoms, getAllRemedies } = require('../controllers/repertoryController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/search', authenticateToken, searchSymptoms);
router.post('/analyze', authenticateToken, analyzeRemedies);
router.get('/symptoms', authenticateToken, getAllSymptoms);
router.get('/remedies', authenticateToken, getAllRemedies);

module.exports = router;

