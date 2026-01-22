const axios = require('axios');
const AIProvider = require("./AIProvider");

class OllamaProvider extends AIProvider {
    constructor(baseUrl = 'http://localhost:11434', model = 'Dhanwantari_Trained_gemma') {
        super();
        this.baseUrl = baseUrl;
        this.model = model;
    }

    async initialize() {
        // Check connection
        try {
            await axios.get(`${this.baseUrl}/api/tags`);
            console.log(`Ollama Connected at ${this.baseUrl} using model ${this.model}`);
        } catch (error) {
            console.warn("Ollama connection failed. Ensure Ollama is running.", error.message);
        }
    }

    async generateResponse(history, systemInstruction) {
        // Map history to Ollama format API
        const messages = [];

        if (systemInstruction) {
            messages.push({ role: 'system', content: systemInstruction });
        }

        history.forEach(msg => {
            messages.push({ role: msg.role, content: msg.content });
        });

        try {
            const response = await axios.post(`${this.baseUrl}/api/chat`, {
                model: this.model,
                messages: messages,
                stream: false
            });

            return response.data.message.content;
        } catch (error) {
            console.error("Ollama Generation Error:", error.message);
            throw new Error("Failed to generate response from Local LLM.");
        }
    }
}

module.exports = OllamaProvider;
