const AIProviderFactory = require('../services/ai/AIProviderFactory');
const DatabaseService = require('../services/DatabaseService');
const crypto = require('crypto');

/**
 * Chat Controller - Handles AI consultation interactions
 * NOW USING ACTUAL GEMINI AI
 */

// System prompt for homeopathy consultation
const HOMEOPATHY_SYSTEM_PROMPT = `You are Dhanwantari, an AI Homeopathy Assistant based on classical homeopathic principles.

Your role is to:
1. Gather detailed symptom information from the patient
2. Ask clarifying questions about modalities (what makes symptoms better/worse)
3. Consider the patient's constitution and mental/emotional state
4. Suggest appropriate homeopathic remedies with potency and dosage

Guidelines:
- Always ask about: location, sensation type, modalities, onset, and associated symptoms
- Reference classical materia medica (Kent, Boericke) when suggesting remedies
- Provide remedies in format: **Remedy Name** (e.g., Belladonna 30C)
- Include dosage instructions (e.g., "3 pellets every 4 hours")
- Always add a disclaimer about consulting a qualified homeopath

IMPORTANT SAFETY RULES:
- Never diagnose serious conditions
- Always recommend professional consultation for: chest pain, breathing difficulty, high fever, severe pain, or any emergency
- Do not prescribe for children under 2 without professional guidance
- Limit to common acute conditions

Format your responses in clear markdown with proper sections.`;

// AI Provider singleton
let aiProvider = null;
let aiInitialized = false;

const initializeAI = async () => {
    if (!aiInitialized) {
        try {
            aiProvider = AIProviderFactory.createProvider();
            await aiProvider.initialize();
            aiInitialized = true;
            console.log('AI Provider initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AI Provider:', error.message);
            // Don't throw - allow fallback to mock responses
            aiProvider = null;
        }
    }
    return aiProvider;
};

exports.chat = async (req, res) => {
    try {
        const { history } = req.body;
        const userId = req.user ? req.user.id : null;
        let consultationId = null;

        console.log("Chat Request Received:", JSON.stringify(history));

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'History must be an array of messages'
            });
        }

        // Extract original message for archiving
        const lastMsgObj = history[history.length - 1];
        let originalMessage = "";

        if (lastMsgObj.content) {
            originalMessage = lastMsgObj.content;
        } else if (lastMsgObj.parts && lastMsgObj.parts[0] && lastMsgObj.parts[0].text) {
            originalMessage = lastMsgObj.parts[0].text;
        }

        let responseText = "";

        // Try to use Gemini AI
        try {
            const provider = await initializeAI();

            if (provider) {
                // Use actual Gemini AI
                console.log('Using Gemini AI for response...');
                responseText = await provider.generateResponse(history, HOMEOPATHY_SYSTEM_PROMPT);
            } else {
                // Fallback to enhanced mock responses if AI unavailable
                responseText = generateFallbackResponse(originalMessage);
            }
        } catch (aiError) {
            console.error('AI Generation Error:', aiError);

            // Handle quota exceeded
            if (aiError.status === 429) {
                return res.status(429).json({
                    error: 'Rate Limited',
                    message: 'AI service is temporarily unavailable. Please try again later.'
                });
            }

            // Fallback for other errors
            responseText = generateFallbackResponse(originalMessage);
        }

        // --- ARCHIVE TO DATABASE ---
        if (userId) {
            try {
                await DatabaseService.initPromise;
                const pool = DatabaseService.pool;

                const [rows] = await pool.execute(
                    "SELECT id FROM consultations WHERE patient_id = ? AND status = 'in_progress' AND type = 'ai_only' ORDER BY created_at DESC LIMIT 1",
                    [userId]
                );

                // consultationId declared above

                if (rows.length > 0) {
                    consultationId = rows[0].id;
                } else {
                    consultationId = crypto.randomUUID();
                    await pool.execute(
                        "INSERT INTO consultations (id, patient_id, type, status) VALUES (?, ?, 'ai_only', 'in_progress')",
                        [consultationId, userId]
                    );
                }

                await pool.execute(
                    "INSERT INTO messages (consultation_id, sender_type, sender_id, message_type, content) VALUES (?, 'patient', ?, 'text', ?)",
                    [consultationId, userId, originalMessage]
                );

                await pool.execute(
                    "INSERT INTO messages (consultation_id, sender_type, message_type, content) VALUES (?, 'ai', 'text', ?)",
                    [consultationId, responseText]
                );

                console.log(`Archived chat messages to Consultation ID: ${consultationId}`);

            } catch (dbError) {
                console.error("Failed to archive chat to database:", dbError);
            }
        }

        res.json({
            role: 'assistant',
            content: responseText,
            prescription: null,
            consultationId: consultationId
        });

    } catch (error) {
        console.error('Chat Controller Error:', error);
        res.status(500).json({
            error: 'AI Error',
            message: 'Failed to generate response'
        });
    }
};

/**
 * Fallback response generator when Gemini is unavailable
 */
function generateFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
        return `Hello! I am **Dhanwantari**, your AI Homeopathy Assistant.

I'm here to help you find suitable homeopathic remedies based on your symptoms. To provide the best recommendations, please describe your symptoms in detail:

1. **Location** - Where exactly is the problem?
2. **Sensation** - What does it feel like? (throbbing, burning, aching, etc.)
3. **Modalities** - What makes it better or worse? (heat, cold, motion, rest, time of day)
4. **Onset** - When did it start? Suddenly or gradually?

What symptoms are you experiencing today?`;
    }

    if (lowerMessage.includes('headache')) {
        return `I understand you're experiencing a **headache**. To suggest the most appropriate remedy, I need more details:

**Please tell me:**
- Is the pain **throbbing**, **pressing**, **piercing**, or **dull**?
- Is it on the **left side**, **right side**, **forehead**, or **back of head**?
- Does **light** or **noise** make it worse?
- Does **pressure** or **rest** help?
- Did it come on **suddenly** or **gradually**?

Common homeopathic remedies for headaches include:
- **Belladonna** - Throbbing, sudden onset, worse from light/noise
- **Bryonia** - Bursting pain, worse from motion
- **Gelsemium** - Band-like pressure, starts at back of head

*Please provide more details for a personalized recommendation.*`;
    }

    if (lowerMessage.includes('fever')) {
        return `For **fever**, the specific symptoms help determine the best remedy:

**Please tell me:**
- Is the fever **high and sudden** or **gradual**?
- Are you experiencing **chills** or **sweating**?
- Are you **thirsty** or **thirstless**?
- Do you feel **restless** or want to stay **still**?

Common fever remedies:
- **Aconitum** - Sudden high fever, restlessness, after cold exposure
- **Belladonna** - High fever, red face, throbbing
- **Gelsemium** - Flu-like, weak, drowsy, thirstless

*Please share more details for a specific recommendation.*`;
    }

    if (lowerMessage.includes('anxiety') || lowerMessage.includes('stress') || lowerMessage.includes('worried')) {
        return `I understand you're experiencing **anxiety or stress**. Homeopathy considers the mental-emotional picture very important.

**Please describe:**
- Is the anxiety about **health**, **future**, or **specific situations**?
- Do you feel **restless** or **paralyzed**?
- Is it worse at **specific times** (night, morning)?
- Any **physical symptoms** accompanying it? (palpitations, stomach upset)

Common anxiety remedies:
- **Arsenicum Album** - Health anxiety, restlessness, worse at midnight
- **Argentum Nitricum** - Anticipatory anxiety, fear of crowds
- **Gelsemium** - Stage fright, examination fear, weakness

*Please share more for a personalized suggestion.*`;
    }

    // Default response
    return `Thank you for sharing your symptoms. Based on classical homeopathic analysis:

**General Assessment:**
Your symptoms suggest a need for constitutional treatment. While I analyze your case, here are some initial observations.

**Recommended Approach:**
1. Keep note of what makes symptoms **better or worse**
2. Observe patterns related to **time of day** or **weather**
3. Note any **emotional changes** accompanying physical symptoms

**Suggested Remedy: Arnica Montana 30C**

**Indication:** Useful for general soreness, trauma, and as a starting point.

**Dosage:** Take 3 pellets, 3 times daily for 3 days. Stop when improvement begins.

---
*⚠️ Disclaimer: This is AI-assisted guidance based on classical homeopathy. For chronic conditions, persistent symptoms, or serious health concerns, please consult a qualified homeopathic practitioner.*`;
}
