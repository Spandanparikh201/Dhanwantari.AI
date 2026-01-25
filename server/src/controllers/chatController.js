const AIProviderFactory = require('../services/ai/AIProviderFactory');
const DatabaseService = require('../services/DatabaseService');
const crypto = require('crypto');

/**
 * Chat Controller - Handles AI consultation interactions
 * CURRENTLY IN MOCK MODE FOR DEMONSTRATION
 */

exports.chat = async (req, res) => {
    try {
        const { history } = req.body;
        // Check if user is authenticated (req.user exists)
        const userId = req.user ? req.user.id : null;

        console.log("Chat Request Received:", JSON.stringify(history));

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'History must be an array of messages'
            });
        }

        // Simulating AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        let responseText = "";

        // Handle both simple content and Gemini parts structure
        const lastMsgObj = history[history.length - 1];
        let originalMessage = "";

        if (lastMsgObj.content) {
            originalMessage = lastMsgObj.content;
        } else if (lastMsgObj.parts && lastMsgObj.parts[0] && lastMsgObj.parts[0].text) {
            originalMessage = lastMsgObj.parts[0].text;
        }

        const lowerMessage = originalMessage.toLowerCase();

        if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            responseText = "Hello! I am Dhanwantari, your AI Homeopathy assistant. Please describe your main symptoms in detail. Be sure to mention:\n1. Location of the symptom\n2. Type of sensation\n3. What makes it better or worse (modalities)";
        } else if (lowerMessage.includes('headache')) {
            responseText = "I understand you are having a headache. \n\nCould you please specify:\n- Is it throbbing, dull, or piercing?\n- Is it on the left side, right side, or all over?\n- Does light or noise make it worse?";
        } else if (lowerMessage.includes('fever')) {
            responseText = "For the fever, are you experiencing any chills or sweating? Are you thirsty or not thirsty at all?";
        } else {
            responseText = "Thank you for describing your symptoms. \n\nBased on classical homeopathic principles, I have analyzed your case. \n\n**Suggested Remedy: Arnica Montana 30C**\n\n**Indication:** Best suited for soreness, bruised sensation, and trauma-like pain.\n\n**Dosage:** Take 3 pellets every 4 hours until improvement is felt.\n\n*Disclaimer: This is an AI consultation. Please consult a qualified homeopath for chronic or severe conditions.*";
        }

        // --- ARCHIVE TO DATABASE ---
        if (userId) {
            try {
                await DatabaseService.initPromise;
                const pool = DatabaseService.pool;

                // 1. Find or Create Consultation
                // Check for active AI consultation for this user
                const [rows] = await pool.execute(
                    "SELECT id FROM consultations WHERE patient_id = ? AND status = 'in_progress' AND type = 'ai_only' ORDER BY created_at DESC LIMIT 1",
                    [userId]
                );

                let consultationId;

                if (rows.length > 0) {
                    consultationId = rows[0].id;
                } else {
                    consultationId = crypto.randomUUID();
                    await pool.execute(
                        "INSERT INTO consultations (id, patient_id, type, status) VALUES (?, ?, 'ai_only', 'in_progress')",
                        [consultationId, userId]
                    );
                }

                // 2. Save User Message
                await pool.execute(
                    "INSERT INTO messages (consultation_id, sender_type, sender_id, message_type, content) VALUES (?, 'patient', ?, 'text', ?)",
                    [consultationId, userId, originalMessage]
                );

                // 3. Save AI Response
                await pool.execute(
                    "INSERT INTO messages (consultation_id, sender_type, message_type, content) VALUES (?, 'ai', 'text', ?)",
                    [consultationId, responseText]
                );

                console.log(`Archived chat messages to Consultation ID: ${consultationId}`);

            } catch (dbError) {
                console.error("Failed to archive chat to database:", dbError);
                // Non-blocking error
            }
        }
        // ---------------------------

        res.json({
            role: 'assistant',
            content: responseText,
            prescription: null
        });

    } catch (error) {
        console.error('Chat Controller Error:', error);
        res.status(500).json({
            error: 'AI Error',
            message: 'Failed to generate response'
        });
    }
};
