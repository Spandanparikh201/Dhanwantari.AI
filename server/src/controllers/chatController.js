const AIProviderFactory = require('../services/ai/AIProviderFactory');
const DatabaseService = require('../services/DatabaseService');
const crypto = require('crypto');

/**
 * Chat Controller - Handles AI consultation interactions
 * NOW USING ACTUAL GEMINI AI
 */

// System prompt for homeopathy consultation
const HOMEOPATHY_SYSTEM_PROMPT = `You are **Dr. Dhanwantari**, an expert AI Homeopathy Consultant. Your goal is to provide accurate, safe, and classical homeopathic analysis.

### CORE PROTOCOLS:

### CORE PROTOCOLS:

1.  **PHASE 1: CASE TAKING (The Inquiry)**:
    - **NEVER prescribe in the first turn.**
    - **Ask targeted follow-up questions.** If a user says "I have a headache", you MUST ask 2-3 specific questions.
    - **SILENCE ON REMEDIES**: During Phase 1 & 2, you are **FORBIDDEN** from mentioning any remedy names, including "Common remedies". Do not say "Belladonna is good for this". Limit output to Questions only.
    - **CRITICAL STEP**: After gathering details for one symptom, **ALWAYS ASK**: *"Is there anything else you are experiencing?"* or *"Do you have any other symptoms?"*

2.  **PHASE 2: CONFIRMATION**:
    - Continue digging until the user explicitly says **"No", "Nothing else", or "That's all"**.
    - Only proceed to analysis once the user has confirmed they have no more symptoms to report.
    - **STILL NO REMEDIES**: Do not hint at a diagnosis yet.

3.  **PHASE 3: ANALYSIS & PRESCRIPTION**:
    - **Only triggered after Phase 2 is complete.**
    - Base analysis on the *Totality of Symptoms* gathered from all previous turns.
    - Suggest a remedy when you have at least **3 strong characteristic symptoms**.
    - **Format**:
        - **Remedy**: [Name] [Potency] (e.g., *Bryonia Alba 30C*)
        - **Key Indication**: Why this remedy matches the user's specific symptoms.
        - **Dosage**: Standard acute dosage (e.g., "3 pellets every 4 hours for 2 days").

4.  **ANTI-HALLUCINATION & ACCURACY**:
    - **Strict Source Grounding**: Base all analysis ONLY on verified Materia Medica (Kent, Boericke, Allen). Do NOT invent symptoms or remedies.
    - **Unsure? Ask.** If the user's input is ambiguous, ask for clarification instead of guessing.

### SAFETY & ETHICS (NON-NEGOTIABLE):
- **Red Flags**: If the user reports Chest Pain, Difficulty Breathing, High Fever (>103°F), Severe Trauma, or Suicidal Thoughts, **STOP** and direct them to Emergency Care immediately.
- **No Serious Diagnoses**: Do not claim to cure Cancer, Heart Disease, or structural pathologies.
- **Children/Pregnancy**: Advise professional supervision.

### FORMAT**:
Use Markdown. Be professional, warm, and clinical.`;

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

exports.endConsultation = async (req, res) => {
    try {
        const userId = req.user.id;

        await DatabaseService.initPromise;
        const pool = DatabaseService.pool;

        // Find active consultation
        const [rows] = await pool.execute(
            "SELECT id FROM consultations WHERE patient_id = ? AND status = 'in_progress' ORDER BY created_at DESC LIMIT 1",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No active consultation found' });
        }

        const consultationId = rows[0].id;

        // Update status to completed
        await pool.execute(
            "UPDATE consultations SET status = 'completed' WHERE id = ?",
            [consultationId]
        );

        res.json({ message: 'Consultation ended successfully', consultationId });

    } catch (error) {
        console.error('End Consultation Error:', error);
        res.status(500).json({ error: 'Failed to end consultation' });
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

*Please provide more details for a personalized recommendation.*`;
    }

    if (lowerMessage.includes('fever')) {
        return `For **fever**, the specific symptoms help determine the best remedy:

**Please tell me:**
- Is the fever **high and sudden** or **gradual**?
- Are you experiencing **chills** or **sweating**?
- Are you **thirsty** or **thirstless**?
- Do you feel **restless** or **want to stay still**?

*Please share more details so I can distinguish the remedy.*`;
    }

    if (lowerMessage.includes('anxiety') || lowerMessage.includes('stress') || lowerMessage.includes('worried')) {
        return `I understand you're experiencing **anxiety or stress**. Homeopathy considers the mental-emotional picture very important.

**Please describe:**
- Is the anxiety about **health**, **future**, or **specific situations**?
- Do you feel **restless** or **paralyzed**?
- Is it worse at **specific times** (night, morning)?
- Any **physical symptoms** accompanying it? (palpitations, stomach upset)

*Please share more so I can understand the full picture.*`;
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
