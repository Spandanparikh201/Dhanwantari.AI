const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIProvider = require("./AIProvider");

class GeminiProvider extends AIProvider {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey ? apiKey.trim() : null;
        if (!this.apiKey) {
            throw new Error("Gemini API Key is missing.");
        }
        this.client = new GoogleGenerativeAI(this.apiKey);
        this.model = null;
    }

    async initialize() {
        // Using gemini-2.0-flash as confirmed by API capability check
        this.model = this.client.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("Gemini Provider Initialized (Model: gemini-2.0-flash)");
    }

    async generateResponse(history, systemInstruction) {
        try {
            // Map standard history to Gemini format
            // role: 'user' -> 'user'
            // role: 'assistant' -> 'model'
            const formattedHistory = history.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            // The last message is the new prompt
            const lastMessage = formattedHistory.pop();
            const prompt = lastMessage.parts[0].text;

            // Gemini REQUIRES history to start with 'user'.
            while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
                formattedHistory.shift();
            }

            // Initialize chat with systemInstruction if supported, or prepending
            const chatConfig = {
                history: formattedHistory,
                generationConfig: {
                    maxOutputTokens: 1000,
                }
            };

            // Use systemInstruction if available in the SDK (v0.9.0+)
            if (systemInstruction) {
                chatConfig.systemInstruction = {
                    role: "system",
                    parts: [{ text: systemInstruction }]
                };
            }

            const chat = this.model.startChat(chatConfig);

            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Gemini API Error:", error);

            // Re-throw specific errors for controller handling
            if (error.status === 429 || error.message?.includes('429')) {
                throw { status: 429, message: "Quota exceeded" };
            }
            throw error;
        }
    }
}

module.exports = GeminiProvider;
