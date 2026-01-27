const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/chat - Chat with AI
router.post('/', authenticateToken, chatController.chat);

// POST /api/chat/end - End active session
router.post('/end', authenticateToken, chatController.endConsultation);

module.exports = router;
